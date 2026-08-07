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


# ===== Seed demo (datos reales de ejemplo) =====
def seed() -> None:
    conn = get_db()
    cur = conn.cursor()
    if cur.execute("SELECT COUNT(*) FROM providers").fetchone()[0] == 0:
        # Proveedores reales (Q1: ya hay operadores)
        cur.execute("INSERT INTO providers VALUES (?,?,?,?,?,?,?,?)",
                    ("p1", "Refugio Patagonia Lodge", "76.123.456-7", "reservas@refugiopatagonia.cl", "+56 9 1111 0001", 8.0, "CLP", "activo"))
        cur.execute("INSERT INTO providers VALUES (?,?,?,?,?,?,?,?)",
                    ("p2", "Guías Ingenieros en Expediciones", "77.654.321-8", "guias@raulif.cl", "+56 9 2222 0002", 12.0, "CLP", "activo"))
        cur.execute("INSERT INTO providers VALUES (?,?,?,?,?,?,?,?)",
                    ("p3", "Transporte Austral", "78.111.222-3", "ruta@transaustral.cl", "+56 9 3333 0003", 10.0, "CLP", "activo"))
        # Servicios
        cur.execute("INSERT INTO services VALUES (?,?,?,?,?,?,?,?,?,?)",
                    ("s1", "p1", "hospedaje", "Refugio 4 noches", "Alojamiento en refugio de conservación", "Coyhaique", 120000.0, "CLP", None, "aprobado"))
        cur.execute("INSERT INTO services VALUES (?,?,?,?,?,?,?,?,?,?)",
                    ("s2", "p2", "guia", "Guía Ingeniero en Expediciones (5 días)", "Guía certificado con enfoque en conservación", "Patagonia", 350000.0, "CLP", None, "aprobado"))
        cur.execute("INSERT INTO services VALUES (?,?,?,?,?,?,?,?,?,?)",
                    ("s3", "p3", "transporte", "Traslados terrestres", "Traslado aeropuerto - refugio y salidas diarias", "Patagonia", 90000.0, "CLP", None, "aprobado"))
        # Ruta: Expedición Patagonia Silvestre
        cur.execute("INSERT INTO routes VALUES (?,?,?,?,?,?,?,?,?)",
                    ("r1", "patagonia-silvestre", "Expedición Patagonia Silvestre",
                     "Fiordos y glaciares", "Expedición de conservación en la Patagonia chilena con guías ingenieros en expediciones.",
                     "fauna-silvestre", "trekking",
                     "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?q=80&w=1200&auto=format&fit=crop", "activo"))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri1", "r1", "s1", 1, 1))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri2", "r1", "s2", 1, 2))
        cur.execute("INSERT INTO route_items VALUES (?,?,?,?,?)", ("ri3", "r1", "s3", 1, 3))
        # Departures con cupos por fecha exacta (requisito Matías)
        cur.execute("INSERT INTO departures VALUES (?,?,?,?,?,?)",
                    ("d1", "r1", "2026-12-10", "2026-12-21", 20, "abierta"))
        cur.execute("INSERT INTO departures VALUES (?,?,?,?,?,?)",
                    ("d2", "r1", "2027-01-15", "2027-01-26", 15, "abierta"))
    conn.commit()
    conn.close()


init_db()
seed()


# ===== PÚBLICO: catálogo =====
@app.get("/api/raulif-mvp/catalog/routes")
def list_routes() -> List[Dict[str, Any]]:
    conn = get_db()
    rows = [dict(r) for r in conn.execute(
        "SELECT id, slug, title, subtitle, description, nicho, deporte, imagen FROM routes WHERE status='activo'"
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

