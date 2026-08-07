# RAULIF TRAVEL — Documentación

Documento vivo para la web app de **rutas de turismo aventura y turismo consciente** (marketplace multi-proveedor, ganancias por comisión).

## Estado actual (7-Ago-2026)

**MVP en producción:** https://rauliftravel.codigoguerrero.dev

- **4 experiencias** con itinerario completo por día y cupos por fecha exacta:
  - Expedición Patagonia Silvestre (5 días)
  - Valle del Elqui bajo las Estrellas (3 días)
  - Lagos y Volcanes de la Araucanía (4 días)
  - Desierto de Atacama en 2 Días
- **Página de detalle** por experiencia (ficha completa: descripción, itinerario por día, fechas, cupos, reservar).
- **Galería de deportes** con fotos reales de Pexels (proxy seguro, key en servidor).
- **UI/UX dark premium** coherente (forest + esmeralda), sin look de plantilla.
- **Backend MVP** (FastAPI + SQLite) en el VPS: catálogo, cupos, reservas, impacto Q4.

## Índice

| Archivo | Contenido |
|---|---|
| [`01-brief-requisitos.md`](01-brief-requisitos.md) | Qué construimos, roles, funcionalidades por fase, modelo de datos, decisiones Q1–Q4 |
| [`02-roadmap.md`](02-roadmap.md) | Fases 0–4, stack, criterios de salida, riesgos |
| [`03-flujo-web.md`](03-flujo-web.md) | Rutas (URLs), pantallas, flujos de usuario, flujo del dinero |
| [`flujo-web.html`](flujo-web.html) | **Diagrama visual** del flujo de pantallas y navegación (abrir en navegador) |

## Decisiones clave (Q1–Q4, respondidas por Matías)

| Pregunta | Decisión |
|---|---|
| Q1 · Proveedores | Ya hay operadores comprometidos (hospedaje, guías, transporte) |
| Q2 · Moneda | Multi-moneda (CLP + EUR + USD) |
| Q3 · Cobro | Raulif cobra el total y liquida a proveedores (modelo OTA) |
| Q4 · Impacto | % de la utilidad destinado a conservación (diferenciador, no operación propia) |

## Stack

- **Frontend:** React 19 + Vite + Tailwind + Motion + Phosphor Icons
- **Backend:** FastAPI + SQLite (Docker, puerto 3103)
- **Imágenes:** Pexels API (proxy en backend, key en servidor)
- **Deploy:** GitHub Actions → VPS (62.146.227.146), Nginx Proxy Manager
- **Repo:** `DonGeeo87/rauliftravel` (rama `main`)

## Cómo usar

1. Abre `flujo-web.html` en el navegador para el diagrama visual.
2. Lee `01-brief-requisitos.md` para el contexto y decisiones.
3. Sigue `02-roadmap.md` para el estado de cada fase.
