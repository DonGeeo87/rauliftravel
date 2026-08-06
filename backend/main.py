"""
Raulif Travel — Backend del centro de control interno.
FastAPI + SQLite embebida. Persistencia de planificación:
checklist, decisiones Q1-Q4, revisión del mensaje, avances.

Endpoints:
  GET  /api/raulif/state          → estado completo (checklist, decisiones, mensaje, avances)
  PUT  /api/raulif/checklist/:id  → actualizar estado de un paso
  PUT  /api/raulif/decisiones     → guardar respuestas Q1-Q4
  PUT  /api/raulif/mensaje/:id    → actualizar revisión de mensaje
  POST /api/raulif/avances        → agregar avance
  DELETE /api/raulif/avances/:id  → eliminar avance
"""

import json
import os
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

DB_PATH = Path(os.environ.get("RAULIF_DB", "/data/raulif.db"))

app = FastAPI(title="Raulif Travel Backend", version="1.0.0")

# CORS: permitir el portal en dev/prod
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===== Modelos Pydantic =====
class ChecklistUpdate(BaseModel):
    status: str  # done | in_progress | todo | blocked


class DecisionesUpdate(BaseModel):
    answers: Dict[str, str]


class MensajeUpdate(BaseModel):
    estado: str  # ok | review


class AvanceCreate(BaseModel):
    texto: str
    tipo: str = "avance"  # avance | decision | bloqueo


# ===== Helpers DB =====
def get_db() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS checklist (
            id TEXT PRIMARY KEY,
            label TEXT NOT NULL,
            desc TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'todo'
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS decisiones (
            tag TEXT PRIMARY KEY,
            answer TEXT
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS mensaje (
            id TEXT PRIMARY KEY,
            pregunta TEXT NOT NULL,
            texto TEXT NOT NULL,
            estado TEXT NOT NULL DEFAULT 'review'
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS avances (
            id TEXT PRIMARY KEY,
            texto TEXT NOT NULL,
            tipo TEXT NOT NULL DEFAULT 'avance',
            created_at TEXT NOT NULL
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS roadmap (
            fase TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            periodo TEXT NOT NULL,
            estado TEXT NOT NULL DEFAULT 'todo'
        )
        """
    )
    conn.commit()
    conn.close()


# ===== Seed inicial (datos de planificación) =====
CHECKLIST_SEED = [
    {"id": "c1", "label": "Auditar la repo rauliftravel1-0", "desc": "Revisar lo que hay: vitrina de expediciones propias, CMS en localStorage.", "status": "done"},
    {"id": "c2", "label": "Redactar brief de requisitos", "desc": "Docs/01-brief-requisitos.md: roles, funcionalidades, modelo de datos, comisión.", "status": "done"},
    {"id": "c3", "label": "Definir roadmap 2026-2030", "desc": "Fases 0-4 en docs/02-roadmap.md. MVP primero, validar con proveedores.", "status": "done"},
    {"id": "c4", "label": "Mapear flujo de la web", "desc": "Rutas, pantallas, flujos de usuario en docs/03-flujo-web.md.", "status": "done"},
    {"id": "c5", "label": "Resolver Q1-Q4 del brief", "desc": "Proveedores, moneda, cobro, turismo consciente. Bloquea el MVP.", "status": "in_progress"},
    {"id": "c6", "label": "Definir esquema Supabase", "desc": "Tablas: providers, services, routes, bookings, booking_items, payouts.", "status": "todo"},
    {"id": "c7", "label": "Definir contrato de API FastAPI", "desc": "Endpoints multi-tenant + auth por roles.", "status": "todo"},
    {"id": "c8", "label": "Construir MVP (Sprint 1)", "desc": "Vitrina, constructor de rutas, booking + comisión, portal proveedor.", "status": "todo"},
]

MENSAJE_SEED = [
    {"id": "m1", "pregunta": "¿Qué resuelve?", "texto": "Arma una expedición combinando proveedores locales en una sola ruta, con transparencia de precios.", "estado": "ok"},
    {"id": "m2", "pregunta": "¿Quién lo usa?", "texto": "Viajero que quiere turismo aventura + proveedores (guías, hospedaje, transporte) + admin Raulif.", "estado": "ok"},
    {"id": "m3", "pregunta": "¿Cómo gana Raulif?", "texto": "Comisión por línea de servicio en cada booking, con % pactado por proveedor.", "estado": "ok"},
    {"id": "m4", "pregunta": "¿Diferenciador?", "texto": "Turismo consciente: cada viaje apoya conservación. \"Conocer para proteger\".", "estado": "review"},
    {"id": "m5", "pregunta": "¿Modelo de negocio claro?", "texto": "Comisión por venta intermediada. Falta validar moneda (Q2) y cobro (Q3).", "estado": "review"},
]

ROADMAP_SEED = [
    {"fase": "f0", "title": "Fase 0 · Definición", "periodo": "Esta semana", "estado": "done"},
    {"fase": "f1", "title": "Fase 1 · MVP", "periodo": "Sprint 1 · 1-2 semanas", "estado": "in_progress"},
    {"fase": "f2", "title": "Fase 2 · Producto", "periodo": "Sprint 2-3", "estado": "todo"},
    {"fase": "f3", "title": "Fase 3 · Escala", "periodo": "Después de validar", "estado": "todo"},
    {"fase": "f4", "title": "Fase 4 · Ecosistema", "periodo": "A largo plazo", "estado": "todo"},
]


def seed_if_empty() -> None:
    conn = get_db()
    cur = conn.cursor()
    count = cur.execute("SELECT COUNT(*) FROM checklist").fetchone()[0]
    if count == 0:
        for item in CHECKLIST_SEED:
            cur.execute(
                "INSERT OR IGNORE INTO checklist (id, label, desc, status) VALUES (?,?,?,?)",
                (item["id"], item["label"], item["desc"], item["status"]),
            )
    count_m = cur.execute("SELECT COUNT(*) FROM mensaje").fetchone()[0]
    if count_m == 0:
        for item in MENSAJE_SEED:
            cur.execute(
                "INSERT OR IGNORE INTO mensaje (id, pregunta, texto, estado) VALUES (?,?,?,?)",
                (item["id"], item["pregunta"], item["texto"], item["estado"]),
            )
    count_r = cur.execute("SELECT COUNT(*) FROM roadmap").fetchone()[0]
    if count_r == 0:
        for item in ROADMAP_SEED:
            cur.execute(
                "INSERT OR IGNORE INTO roadmap (fase, title, periodo, estado) VALUES (?,?,?,?)",
                (item["fase"], item["title"], item["periodo"], item["estado"]),
            )
    conn.commit()
    conn.close()


init_db()
seed_if_empty()


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ===== Endpoints: State completo =====
@app.get("/api/raulif/state")
def get_state() -> Dict[str, Any]:
    conn = get_db()
    cur = conn.cursor()

    checklist = [
        dict(row)
        for row in cur.execute("SELECT id, label, desc, status FROM checklist ORDER BY rowid").fetchall()
    ]
    decisiones = {
        row["tag"]: row["answer"] for row in cur.execute("SELECT tag, answer FROM decisiones WHERE answer IS NOT NULL").fetchall()
    }
    mensaje = [
        dict(row)
        for row in cur.execute("SELECT id, pregunta, texto, estado FROM mensaje ORDER BY rowid").fetchall()
    ]
    avances = [
        dict(row)
        for row in cur.execute("SELECT id, texto, tipo, created_at FROM avances ORDER BY created_at DESC").fetchall()
    ]
    roadmap = [
        dict(row)
        for row in cur.execute("SELECT fase, title, periodo, estado FROM roadmap ORDER BY rowid").fetchall()
    ]

    done = sum(1 for c in checklist if c["status"] == "done")
    progress = round((done / len(checklist)) * 100) if checklist else 0

    conn.close()
    return {
        "checklist": checklist,
        "decisiones": decisiones,
        "mensaje": mensaje,
        "avances": avances,
        "roadmap": roadmap,
        "progress": progress,
    }


# ===== Checklist =====
@app.put("/api/raulif/checklist/{item_id}")
def update_checklist(item_id: str, body: ChecklistUpdate) -> Dict[str, Any]:
    conn = get_db()
    cur = conn.cursor()
    if body.status not in ("done", "in_progress", "todo", "blocked"):
        conn.close()
        raise HTTPException(status_code=400, detail="Estado inválido")
    cur.execute("UPDATE checklist SET status = ? WHERE id = ?", (body.status, item_id))
    if cur.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Item no encontrado")
    conn.commit()
    conn.close()
    return {"ok": True, "id": item_id, "status": body.status}


# ===== Roadmap =====
@app.put("/api/raulif/roadmap/{fase}")
def update_roadmap(fase: str, body: ChecklistUpdate) -> Dict[str, Any]:
    conn = get_db()
    cur = conn.cursor()
    if body.status not in ("done", "in_progress", "todo", "blocked"):
        conn.close()
        raise HTTPException(status_code=400, detail="Estado inválido")
    cur.execute("UPDATE roadmap SET estado = ? WHERE fase = ?", (body.status, fase))
    if cur.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Fase no encontrada")
    conn.commit()
    conn.close()
    return {"ok": True, "fase": fase, "estado": body.status}


# ===== Decisiones Q1-Q4 =====
@app.put("/api/raulif/decisiones")
def save_decisiones(body: DecisionesUpdate) -> Dict[str, Any]:
    conn = get_db()
    cur = conn.cursor()
    for tag, answer in body.answers.items():
        cur.execute(
            "INSERT INTO decisiones (tag, answer) VALUES (?, ?) ON CONFLICT(tag) DO UPDATE SET answer = excluded.answer",
            (tag, answer),
        )
    conn.commit()
    conn.close()
    return {"ok": True, "saved": list(body.answers.keys())}


# ===== Revisión del mensaje =====
@app.put("/api/raulif/mensaje/{item_id}")
def update_mensaje(item_id: str, body: MensajeUpdate) -> Dict[str, Any]:
    conn = get_db()
    cur = conn.cursor()
    if body.estado not in ("ok", "review"):
        conn.close()
        raise HTTPException(status_code=400, detail="Estado inválido")
    cur.execute("UPDATE mensaje SET estado = ? WHERE id = ?", (body.estado, item_id))
    if cur.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Item no encontrado")
    conn.commit()
    conn.close()
    return {"ok": True, "id": item_id, "estado": body.estado}


# ===== Avances =====
@app.post("/api/raulif/avances")
def add_avance(body: AvanceCreate) -> Dict[str, Any]:
    conn = get_db()
    cur = conn.cursor()
    avance_id = uuid.uuid4().hex[:12]
    cur.execute(
        "INSERT INTO avances (id, texto, tipo, created_at) VALUES (?,?,?,?)",
        (avance_id, body.texto, body.tipo, now_iso()),
    )
    conn.commit()
    conn.close()
    return {"ok": True, "id": avance_id}


@app.delete("/api/raulif/avances/{avance_id}")
def delete_avance(avance_id: str) -> Dict[str, Any]:
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM avances WHERE id = ?", (avance_id,))
    if cur.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Avance no encontrado")
    conn.commit()
    conn.close()
    return {"ok": True, "id": avance_id}


# ===== Health =====
@app.get("/api/raulif/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}
