"""
RAULIF TRAVEL — Backend MVP (catálogo con cupos + reservas + liquidación + impacto)
FastAPI + SQLite. Modelo OTA (Raulif cobra el total y liquida a proveedores).
Q1 hay proveedores · Q2 multi-moneda · Q3 cobro total OTA · Q4 impacto con % utilidad · Cupos por fecha.

Endpoints públicos:  catálogo, ficha, departures con cupos, cotización, booking
Endpoints proveedor:  mis servicios, ventas, comisión
Endpoints admin:      proveedores, aprobar servicios, confirmar booking, payouts, impacto
"""

import os
import sqlite3
import uuid
from datetime import datetime, date
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

DB_PATH = Path(os.environ.get("RAULIF_MVP_DB", "/data/raulif_mvp.db"))
PEXELS_KEY = os.environ.get("PEXELS_API_KEY", "")

app = FastAPI(title="Raulif Travel MVP API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


# ===== Modelos =====
class ServiceIn(BaseModel):
    provider_id: str
    type: str
    name: str
    description: str = ""
    location: str = ""
    price: float
    currency: str = "CLP"
    stock: Optional[int] = None


class QuotationIn(BaseModel):
    route_slug: str
    departure_id: str
    pax: int = 1


class BookingIn(BaseModel):
    route_slug: str
    departure_id: str
    client_name: str
    client_email: str = ""
    client_phone: str = ""
    pax: int = 1
    currency: str = "CLP"


# ===== Helpers DB =====
def get_db() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = get_db()
    cur = conn.cursor()
    cur.executescript(
        """
        CREATE TABLE IF NOT EXISTS providers (
            id TEXT PRIMARY KEY, name TEXT NOT NULL, rut TEXT,
            contact_email TEXT, contact_phone TEXT,
            commission_pct REAL NOT NULL DEFAULT 10.0,
            currency TEXT NOT NULL DEFAULT 'CLP',
            status TEXT NOT NULL DEFAULT 'activo'
        );
        CREATE TABLE IF NOT EXISTS services (
            id TEXT PRIMARY KEY, provider_id TEXT NOT NULL,
            type TEXT NOT NULL, name TEXT NOT NULL, description TEXT,
            location TEXT, price REAL NOT NULL, currency TEXT NOT NULL DEFAULT 'CLP',
            stock INTEGER, status TEXT NOT NULL DEFAULT 'borrador'
        );
        CREATE TABLE IF NOT EXISTS routes (
            id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL,
            subtitle TEXT, description TEXT, nicho TEXT, deporte TEXT,
            duracion TEXT, precio REAL, moneda TEXT NOT NULL DEFAULT 'CLP',
            imagen TEXT, status TEXT NOT NULL DEFAULT 'activo'
        );
        CREATE TABLE IF NOT EXISTS route_items (
            id TEXT PRIMARY KEY, route_id TEXT NOT NULL, service_id TEXT NOT NULL,
            day INTEGER NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS departures (
            id TEXT PRIMARY KEY, route_id TEXT NOT NULL,
            start_date TEXT NOT NULL, end_date TEXT NOT NULL,
            total_capacity INTEGER NOT NULL DEFAULT 20,
            status TEXT NOT NULL DEFAULT 'abierta'
        );
        CREATE TABLE IF NOT EXISTS bookings (
            id TEXT PRIMARY KEY, route_id TEXT, departure_id TEXT,
            client_name TEXT NOT NULL, client_email TEXT, client_phone TEXT,
            status TEXT NOT NULL DEFAULT 'pendiente',
            total_amount REAL NOT NULL, currency TEXT NOT NULL DEFAULT 'CLP',
            pax INTEGER NOT NULL DEFAULT 1,
            impact_pct REAL NOT NULL DEFAULT 5.0, impact_amount REAL,
            created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS booking_items (
            id TEXT PRIMARY KEY, booking_id TEXT NOT NULL, service_id TEXT,
            provider_id TEXT NOT NULL, price REAL NOT NULL, currency TEXT NOT NULL,
            commission_pct REAL NOT NULL, commission_amount REAL NOT NULL,
            net_to_provider REAL NOT NULL
        );
        CREATE TABLE IF NOT EXISTS payouts (
            id TEXT PRIMARY KEY, provider_id TEXT NOT NULL,
            period_start TEXT NOT NULL, period_end TEXT NOT NULL,
            gross_amount REAL NOT NULL, commission_total REAL NOT NULL,
            net_amount REAL NOT NULL, status TEXT NOT NULL DEFAULT 'pendiente',
            paid_at TEXT
        );
        CREATE TABLE IF NOT EXISTS impact_funds (
            id TEXT PRIMARY KEY, booking_id TEXT, amount REAL NOT NULL,
            project TEXT, status TEXT NOT NULL DEFAULT 'reservado',
            created_at TEXT NOT NULL
        );
        """
    )
    conn.commit()
    conn.close()


def now_iso() -> str:
    return datetime.utcnow().isoformat()


# ===== Seed demo (4 experiencias, itinerarios completos por día) =====
def seed() -> None:
    conn = get_db()
    cur = conn.cursor()
    if cur.execute("SELECT COUNT(*) FROM providers").fetchone()[0] == 0:
        # Proveedores reales (Q1: ya hay operadores)
        providers = [
            ("p1", "Refugio Patagonia Lodge", "76.123.456-7", "reservas@refugiopatagonia.cl", "+56 9 1111 0001", 8.0, "CLP", "activo"),
            ("p2", "Guías del Territorio Austral", "77.654.321-8", "guias@raulif.cl", "+56 9 2222 0002", 12.0, "CLP", "activo"),
            ("p3", "Transporte Austral", "78.111.222-3", "ruta@transaustral.cl", "+56 9 3333 0003", 10.0, "CLP", "activo"),
            ("p4", "Cabañas Elqui", "79.222.333-4", "elqui@raulif.cl", "+56 9 4444 0004", 9.0, "CLP", "activo"),
            ("p5", "Guías Astronómicas Elqui", "79.333.444-5", "astro@raulif.cl", "+56 9 5555 0005", 12.0, "CLP", "activo"),
            ("p6", "Aventura Andina", "80.444.555-6", "andina@raulif.cl", "+56 9 6666 0006", 11.0, "CLP", "activo"),
            ("p7", "Base Lodge Villarrica", "80.555.666-7", "villarrica@raulif.cl", "+56 9 7777 0007", 8.0, "CLP", "activo"),
            ("p8", "Expediciones Atacama", "81.666.777-8", "atacama@raulif.cl", "+56 9 8888 0008", 12.0, "CLP", "activo"),
        ]
        for p in providers:
            cur.execute("INSERT INTO providers VALUES (?,?,?,?,?,?,?,?)", p)

        # Servicios (cada servicio = un item de un día)
        services = [
            ("s1", "p1", "hospedaje", "Refugio Patagonia 4 noches", "Alojamiento en refugio de conservación", "Coyhaique", 120000.0, "CLP", None, "aprobado"),
            ("s2", "p2", "guia", "Guía del Territorio Austral (5 días)", "Guía certificado en ecología patagónica", "Patagonia", 350000.0, "CLP", None, "aprobado"),
            ("s3", "p3", "transporte", "Traslado aeropuerto - refugio", "Traslado terrestre privado", "Patagonia", 90000.0, "CLP", None, "aprobado"),
            ("s4", "p2", "actividad", "Trekking glaciar Día 2", "Caminata guiada al mirador del glaciar", "Patagonia", 0.0, "CLP", None, "aprobado"),
            ("s5", "p2", "actividad", "Avistamiento fauna Día 3", "Fauna silvestre en humedales", "Patagonia", 45000.0, "CLP", None, "aprobado"),
            ("s6", "p2", "actividad", "Interpretación ambiental Día 4", "Flora y ecosistemas del bosque nativo", "Patagonia", 35000.0, "CLP", None, "aprobado"),
            ("s7", "p3", "transporte", "Traslado de regreso Día 5", "Refugio - aeropuerto", "Patagonia", 90000.0, "CLP", None, "aprobado"),
            # Experiencia 2: Valle del Elqui (3 días)
            ("s8", "p4", "hospedaje", "Cabañas Valle del Elqui 2 noches", "Cabaña con vista al valle", "Paihuano", 80000.0, "CLP", None, "aprobado"),
            ("s9", "p5", "guia", "Guía Astronómico (3 días)", "Astroturismo certificado", "Valle del Elqui", 180000.0, "CLP", None, "aprobado"),
            ("s10", "p5", "actividad", "Observación de estrellas Día 1", "Telescopio profesional bajo cielo oscuro", "Valle del Elqui", 40000.0, "CLP", None, "aprobado"),
            ("s11", "p4", "actividad", "Ruta del pisco Día 2", "Visita a destilerías y viñedos", "Valle del Elqui", 55000.0, "CLP", None, "aprobado"),
            ("s12", "p4", "actividad", "Cocina chilena Día 3", "Taller de empanadas y cocina local", "Valle del Elqui", 50000.0, "CLP", None, "aprobado"),
            ("s13", "p3", "transporte", "Traslado La Serena - Paihuano", "Traslado privado", "Elqui", 70000.0, "CLP", None, "aprobado"),
            # Experiencia 3: Lagos y Volcanes (4 días)
            ("s14", "p7", "hospedaje", "Base Lodge Villarrica 3 noches", "Lodge frente al lago", "Pucón", 95000.0, "CLP", None, "aprobado"),
            ("s15", "p6", "guia", "Guía de Aventura Andina (4 días)", "Guía certificado en deportes de aventura", "Pucón", 300000.0, "CLP", None, "aprobado"),
            ("s16", "p6", "actividad", "Kayak lago Villarrica Día 1", "Remada guiada por el lago", "Pucón", 60000.0, "CLP", None, "aprobado"),
            ("s17", "p6", "actividad", "Trekking volcán Día 2", "Ascenso guiado al mirador", "Pucón", 75000.0, "CLP", None, "aprobado"),
            ("s18", "p6", "actividad", "Termas naturales Día 3", "Baños termales y relajo", "Pucón", 45000.0, "CLP", None, "aprobado"),
            ("s19", "p3", "transporte", "Traslados Pucón (4 días)", "Transporte local a cada actividad", "Pucón", 80000.0, "CLP", None, "aprobado"),
            # Experiencia 4: Desierto de Atacama (2 días)
            ("s20", "p8", "hospedaje", "Campamento Atacama 1 noche", "Campamento en el desierto", "San Pedro", 70000.0, "CLP", None, "aprobado"),
            ("s21", "p8", "guia", "Guía del Desierto (2 días)", "Guía local de San Pedro", "San Pedro", 120000.0, "CLP", None, "aprobado"),
            ("s22", "p8", "actividad", "Sandboard dunas Día 1", "Sandboard en dunas del desierto", "San Pedro", 55000.0, "CLP", None, "aprobado"),
            ("s23", "p8", "actividad", "Valle de la Luna Día 2", "Atardecer y geología del valle", "San Pedro", 60000.0, "CLP", None, "aprobado"),
        ]
        for s in services:
            cur.execute("INSERT INTO services VALUES (?,?,?,?,?,?,?,?,?,?)", s)

        # Rutas (con duración, precio y moneda)
        routes = [
            ("r1", "patagonia-silvestre", "Expedición Patagonia Silvestre", "Fiordos y glaciares",
             "Expedición de conservación en la Patagonia chilena, guiada por especialistas que conocen el territorio.",
             "fauna-silvestre", "trekking", "5 días", 800000.0, "CLP",
             "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?q=80&w=1200&auto=format&fit=crop", "activo"),
            ("r2", "elqui-estrellas", "Valle del Elqui bajo las Estrellas", "Astroturismo y pisco",
             "Tres días de cielo oscuro, astroturismo y sabores locales en el corazón del Valle del Elqui.",
             "cultura-local", "astroturismo", "3 días", 495000.0, "CLP",
             "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop", "activo"),
            ("r3", "lagos-y-volcanes", "Lagos y Volcanes de la Araucanía", "Aventura lacustre",
             "Kayak, trekking y termas alrededor del volcán Villarrica. Aventura guiada de 4 días.",
             "aventura", "kayak", "4 días", 655000.0, "CLP",
             "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1200&auto=format&fit=crop", "activo"),
            ("r4", "desierto-atacama", "Desierto de Atacama en 2 Días", "Dunas y valle lunar",
             "Sandboard, Valle de la Luna y geología del desierto más árido del mundo.",
             "aventura", "sandboard", "2 días", 305000.0, "CLP",
             "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop", "activo"),
        ]
        for r in routes:
            cur.execute("INSERT INTO routes VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", r)

        # route_items: (id, route_id, service_id, day, sort_order)
        # Patagonia (5 días)
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri1", "r1", "s1", 1, 1))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri2", "r1", "s2", 1, 2))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri3", "r1", "s3", 1, 3))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri4", "r1", "s4", 2, 1))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri5", "r1", "s5", 3, 1))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri6", "r1", "s6", 4, 1))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri7", "r1", "s7", 5, 1))
        # Elqui (3 días)
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri8", "r2", "s8", 1, 1))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri9", "r2", "s9", 1, 2))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri10", "r2", "s10", 1, 3))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri11", "r2", "s11", 2, 1))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri12", "r2", "s12", 3, 1))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri13", "r2", "s13", 1, 4))
        # Lagos y Volcanes (4 días)
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri14", "r3", "s14", 1, 1))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri15", "r3", "s15", 1, 2))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri16", "r3", "s16", 1, 3))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri17", "r3", "s17", 2, 1))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri18", "r3", "s18", 3, 1))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri19", "r3", "s19", 1, 4))
        # Atacama (2 días)
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri20", "r4", "s20", 1, 1))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri21", "r4", "s21", 1, 2))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri22", "r4", "s22", 1, 3))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri23", "r4", "s23", 2, 1))

        # Departures con cupos por fecha exacta (requisito Matías)
        departures = [
            ("d1", "r1", "2026-12-10", "2026-12-21", 20, "abierta"),
            ("d2", "r1", "2027-01-15", "2027-01-26", 15, "abierta"),
            ("d3", "r2", "2026-11-05", "2026-11-08", 12, "abierta"),
            ("d4", "r2", "2027-02-12", "2027-02-15", 10, "abierta"),
            ("d5", "r3", "2027-01-08", "2027-01-12", 16, "abierta"),
            ("d6", "r3", "2027-03-05", "2027-03-09", 12, "abierta"),
            ("d7", "r4", "2026-10-15", "2026-10-17", 14, "abierta"),
            ("d8", "r4", "2027-04-10", "2027-04-12", 10, "abierta"),
        ]
        for d in departures:
            cur.execute("INSERT INTO departures VALUES (?,?,?,?,?,?)", d)
    conn.commit()
    conn.close()


init_db()
seed()


# ===== PÚBLICO: catálogo =====
@app.get("/api/raulif-mvp/catalog/routes")
def list_routes() -> List[Dict[str, Any]]:
    conn = get_db()
    rows = [dict(r) for r in conn.execute(
        "SELECT id, slug, title, subtitle, description, nicho, deporte, duracion, precio, moneda, imagen FROM routes WHERE status='activo'"
    ).fetchall()]
    conn.close()
    return rows


@app.get("/api/raulif-mvp/catalog/routes/{slug}")
def get_route(slug: str) -> Dict[str, Any]:
    conn = get_db()
    route = conn.execute("SELECT * FROM routes WHERE slug=? AND status='activo'", (slug,)).fetchone()
    if not route:
        conn.close()
        raise HTTPException(404, "Experiencia no encontrada")
    # itinerario (servicios por día)
    items = conn.execute(
        """SELECT ri.day, s.name, s.type, s.price, s.currency, p.name as provider
           FROM route_items ri
           JOIN services s ON s.id = ri.service_id
           JOIN providers p ON p.id = s.provider_id
           WHERE ri.route_id = ? ORDER BY ri.day, ri.sort_order""",
        (route["id"],),
    ).fetchall()
    result = dict(route)
    result["itinerario"] = [dict(i) for i in items]
    conn.close()
    return result


@app.get("/api/raulif-mvp/catalog/routes/{slug}/departures")
def get_departures(slug: str) -> List[Dict[str, Any]]:
    conn = get_db()
    route = conn.execute("SELECT id FROM routes WHERE slug=?", (slug,)).fetchone()
    if not route:
        conn.close()
        raise HTTPException(404, "Experiencia no encontrada")
    rows = conn.execute(
        """SELECT d.id, d.start_date, d.end_date, d.total_capacity, d.status,
           (d.total_capacity - COUNT(b.id)) as available
           FROM departures d
           LEFT JOIN bookings b ON b.departure_id = d.id AND b.status IN ('pendiente','pagado','confirmado')
           WHERE d.route_id = ? GROUP BY d.id""",
        (route["id"],),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


@app.get("/api/raulif-mvp/catalog/nichos")
def get_nichos() -> List[str]:
    return ["Avistamiento de aves en humedales", "Fauna silvestre", "Interpretación medioambiental",
            "Cocina chilena auténtica", "Cosechas y frutos silvestres", "Flora sagrada y medicinal",
            "Cultura local y pueblos originarios"]


@app.get("/api/raulif-mvp/catalog/deportes")
def get_deportes() -> List[str]:
    return ["Kayak", "Rafting", "Trekking", "Escalada", "Stand Up Paddle", "Mountain Bike",
            "Snowboard", "Ski", "Surf", "Buceo", "Sandboard"]


# ===== PÚBLICO: cotización y reserva =====
@app.post("/api/raulif-mvp/booking/quotation")
def quotation(body: QuotationIn) -> Dict[str, Any]:
    conn = get_db()
    route = conn.execute("SELECT * FROM routes WHERE slug=?", (body.route_slug,)).fetchone()
    departure = conn.execute("SELECT * FROM departures WHERE id=?", (body.departure_id,)).fetchone()
    if not route or not departure:
        conn.close()
        raise HTTPException(404, "Ruta o salida no encontrada")
    # cupos disponibles
    taken = conn.execute(
        "SELECT COUNT(*) as c FROM bookings WHERE departure_id=? AND status IN ('pendiente','pagado','confirmado')",
        (body.departure_id,),
    ).fetchone()["c"]
    available = departure["total_capacity"] - taken
    if available < body.pax:
        conn.close()
        raise HTTPException(409, f"Sin cupos suficientes (quedan {max(available,0)})")

    # items de la ruta
    items = conn.execute(
        """SELECT s.price, s.currency, s.provider_id, p.commission_pct
           FROM route_items ri JOIN services s ON s.id=ri.service_id
           JOIN providers p ON p.id=s.provider_id WHERE ri.route_id=?""",
        (route["id"],),
    ).fetchall()
    items_data = []
    total = 0.0
    commission = 0.0
    for it in items:
        line_commission = round(it["price"] * it["commission_pct"] / 100.0, 2)
        total += it["price"]
        commission += line_commission
        items_data.append({
            "price": it["price"], "currency": it["currency"],
            "commission_pct": it["commission_pct"], "commission": line_commission,
            "net_to_provider": round(it["price"] - line_commission, 2),
        })
    total *= body.pax
    commission *= body.pax
    # impacto Q4: % de la utilidad (asumimos utilidad = comisión)
    impact_pct = 5.0
    impact = round(commission * impact_pct / 100.0, 2)

    conn.close()
    return {
        "route": route["title"], "departure": f"{departure['start_date']} a {departure['end_date']}",
        "pax": body.pax, "total": round(total, 2), "currency": "CLP",
        "raulif_commission": round(commission, 2), "impact_pct": impact_pct,
        "impact_amount": impact, "items": items_data, "available_cupos": available,
    }


@app.post("/api/raulif-mvp/booking")
def create_booking(body: BookingIn) -> Dict[str, Any]:
    conn = get_db()
    route = conn.execute("SELECT * FROM routes WHERE slug=?", (body.route_slug,)).fetchone()
    departure = conn.execute("SELECT * FROM departures WHERE id=?", (body.departure_id,)).fetchone()
    if not route or not departure:
        conn.close()
        raise HTTPException(404, "Ruta o salida no encontrada")
    taken = conn.execute(
        "SELECT COUNT(*) as c FROM bookings WHERE departure_id=? AND status IN ('pendiente','pagado','confirmado')",
        (body.departure_id,),
    ).fetchone()["c"]
    if (departure["total_capacity"] - taken) < body.pax:
        conn.close()
        raise HTTPException(409, "Sin cupos disponibles")

    bid = uuid.uuid4().hex[:12]
    created = now_iso()
    # total
    items = conn.execute(
        """SELECT s.price, s.currency, s.provider_id, p.commission_pct
           FROM route_items ri JOIN services s ON s.id=ri.service_id
           JOIN providers p ON p.id=s.provider_id WHERE ri.route_id=?""",
        (route["id"],),
    ).fetchall()
    total = sum(i["price"] for i in items) * body.pax
    conn.execute(
        """INSERT INTO bookings (id, route_id, departure_id, client_name, client_email, client_phone,
           status, total_amount, currency, pax, impact_pct, impact_amount, created_at)
           VALUES (?,?,?,?,?,?,'pendiente',?,'CLP',?,5.0,?,?)""",
        (bid, route["id"], departure["id"], body.client_name, body.client_email,
         body.client_phone, total, body.pax, round(total * 0.05, 2), created),
    )
    # booking_items
    for it in items:
        line_comm = round(it["price"] * it["commission_pct"] / 100.0, 2)
        conn.execute(
            """INSERT INTO booking_items (id, booking_id, service_id, provider_id, price, currency,
               commission_pct, commission_amount, net_to_provider) VALUES (?,?,?,?,?,?,?,?,?)""",
            (uuid.uuid4().hex[:12], bid, None, it["provider_id"], it["price"], it["currency"],
             it["commission_pct"], line_comm, round(it["price"] - line_comm, 2)),
        )
    conn.commit()
    conn.close()
    return {"ok": True, "booking_id": bid, "status": "pendiente", "total": total,
            "mensaje": "Cupo bloqueado. A la espera de pago y confirmación."}


# ===== ADMIN: confirmar booking (resta cupo definitivo) =====
@app.post("/api/raulif-mvp/admin/bookings/{bid}/confirm")
def confirm_booking(bid: str) -> Dict[str, Any]:
    conn = get_db()
    booking = conn.execute("SELECT * FROM bookings WHERE id=?", (bid,)).fetchone()
    if not booking:
        conn.close()
        raise HTTPException(404, "Booking no encontrado")
    conn.execute("UPDATE bookings SET status='confirmado' WHERE id=?", (bid,))
    # registrar impacto (Q4)
    conn.execute(
        """INSERT INTO impact_funds (id, booking_id, amount, project, status, created_at)
           VALUES (?,?,?,?,?,?)""",
        (uuid.uuid4().hex[:12], bid, booking["impact_amount"], "Fondo de conservación Raulif", "reservado", now_iso()),
    )
    conn.commit()
    conn.close()
    return {"ok": True, "booking_id": bid, "status": "confirmado", "impact_reservado": booking["impact_amount"]}


# ===== ADMIN: proveedores, servicios, payouts, impacto =====
@app.post("/api/raulif-mvp/admin/services/{sid}/approve")
def approve_service(sid: str, approve: bool = True) -> Dict[str, Any]:
    conn = get_db()
    status = "aprobado" if approve else "rechazado"
    cur = conn.execute("UPDATE services SET status=? WHERE id=?", (status, sid))
    if cur.rowcount == 0:
        conn.close()
        raise HTTPException(404, "Servicio no encontrado")
    conn.commit()
    conn.close()
    return {"ok": True, "id": sid, "status": status}


@app.get("/api/raulif-mvp/admin/payouts")
def get_payouts() -> List[Dict[str, Any]]:
    conn = get_db()
    rows = [dict(r) for r in conn.execute("SELECT * FROM payouts ORDER BY period_end DESC").fetchall()]
    conn.close()
    return rows


@app.get("/api/raulif-mvp/admin/impact")
def get_impact() -> Dict[str, Any]:
    conn = get_db()
    total = conn.execute("SELECT COALESCE(SUM(amount),0) as t FROM impact_funds").fetchone()["t"]
    count = conn.execute("SELECT COUNT(*) as c FROM impact_funds").fetchone()["c"]
    rows = [dict(r) for r in conn.execute("SELECT * FROM impact_funds ORDER BY created_at DESC").fetchall()]
    conn.close()
    return {"total_fondo": round(total, 2), "bookings_impacto": count, "detalle": rows}


@app.get("/api/raulif-mvp/health")
def health() -> Dict[str, str]:
    return {"status": "ok", "service": "raulif-mvp"}


@app.get("/api/raulif-mvp/images")
async def pexels_images(q: str = Query(..., description="Término de búsqueda"),
                        per_page: int = Query(6, ge=1, le=20)) -> Dict[str, Any]:
    """Proxy a la API de Pexels para poblar la web con imágenes de deportes de aventura.
    La API key queda en el servidor, no se expone al frontend."""
    if not PEXELS_KEY:
        raise HTTPException(500, "PEXELS_API_KEY no configurada")
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(
            "https://api.pexels.com/v1/search",
            params={"query": q, "per_page": per_page, "orientation": "landscape"},
            headers={"Authorization": PEXELS_KEY},
        )
    if resp.status_code != 200:
        raise HTTPException(resp.status_code, "Error consultando Pexels")
    data = resp.json()
    photos = [
        {
            "id": p["id"],
            "alt": p.get("alt") or q,
            "url": p["src"]["large2x"],
            "thumb": p["src"]["medium"],
            "photographer": p.get("photographer"),
        }
        for p in data.get("photos", [])
    ]
    return {"query": q, "total": data.get("total_results", 0), "photos": photos}

