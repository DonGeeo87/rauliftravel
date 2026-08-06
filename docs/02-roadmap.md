# RAULIF TRAVEL — Roadmap

> **Estado:** v0.1 — Se ajusta según las respuestas al brief (Q1–Q4).
> **Filosofía:** MVP funcional en el primer sprint → validar con proveedores reales → iterar. Nada nuevo hasta que el flujo de comisión funcione de punta a punta.

---

## Visión (2026–2030)

Del brief de Raulif: construir un **ecosistema** (YouTube, redes, web, turismo, educación ambiental, cursos) donde la web es la **casa comercial**: lugar donde la gente encuentra los viajes, arma rutas y reserva. Este roadmap cubre la parte **web de turismo + comisión**; el resto del ecosistema (contenido) es otra línea de trabajo.

---

## Fase 0 — Definición (esta semana)

**Objetivo:** dejar la arquitectura y el alcance claros antes de escribir código.

- [x] Clonar y auditar la repo actual (compila limpio, es vitrina de expediciones propias).
- [x] Redactar brief de requisitos (`01-brief-requisitos.md`).
- [x] Roadmap (`02-roadmap.md`) y flujo web (`03-flujo-web.md`) + diagrama.
- [ ] **Responder Q1–Q4 del brief** (proveedores, moneda, cobro, impacto).
- [ ] Definir esquema Supabase (tablas + relaciones).
- [ ] Definir contrato de API FastAPI.

**Entregable:** documento de arquitectura aprobado + repo de referencia documentado.

---

## Fase 1 — MVP (Sprint 1, ~1–2 semanas)

**Objetivo:** el flujo de comisión funcionando de punta a punta con datos de ejemplo.

### Alcance
- **Público (vitrina):** listado de rutas/packs + ficha con desglose por proveedor.
- **Planificador:** constructor de ruta día a día (proveedor + servicio por tramo), precio + comisión en vivo.
- **Booking + checkout:** reserva registrada con `booking_items` por proveedor.
- **Portal proveedor (básico):** alta de servicios, ver sus ventas y comisión acumulada.
- **Panel admin (mínimo):** aprobar servicios, configurar % comisión por proveedor.

### Stack
- Frontend: React 19 + Vite + Tailwind (reutilizando diseño/componentes de la repo actual).
- Backend: FastAPI (multi-tenant) en Docker.
- DB: Supabase Postgres.
- Deploy: VPS (62.146.227.146) vía Docker + Coolify o docker-compose.

### Criterios de salida
- [ ] Viajero arma ruta multi-proveedor en < 3 min.
- [ ] Booking persiste con desglose por proveedor (auditable).
- [ ] Admin puede ver comisión acumulada por proveedor.

---

## Fase 2 — Producto (Sprint 2–3)

- [ ] Autenticación por roles (viajero / proveedor / admin) — Supabase Auth.
- [ ] Panel admin completo: gestión de proveedores, liquidaciones/payouts.
- [ ] Email transaccional (confirmación, factura) — Resend/Listmonk.
- [ ] Búsqueda y filtros (ubicación, tipo, nivel físico, fechas).
- [ ] Módulo "turismo consciente / impacto" (reforestación, donaciones por viaje) — si aplica según Q4.

---

## Fase 3 — Escala

- [ ] Reseñas y valoraciones.
- [ ] Mapas con rutas (Leaflet/MapLibre).
- [ ] Multi-moneda y multi-idioma (si el público es europeo).
- [ ] Payouts automáticos a proveedores.
- [ ] Integración con Listmonk para campañas de retención (email marketing).

---

## Fase 4 — Ecosistema Raulif

- [ ] Vincular la web con el contenido (YouTube/redes → web).
- [ ] Tienda de productos.
- [ ] Cursos / educación ambiental.
- [ ] API pública para que terceros ofrezcan rutas Raulif.

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| No hay proveedores al lanzar | Arrancar con datos de ejemplo (demo) y reclutar operadores reales con el demo en mano (Q1). |
| Pago/comisión complejo | Modelo simple primero: Raulif cobra total, liquida por línea. Iterar después (Q3). |
| Moneda/público ambiguo | Resolver Q2 antes de diseñar pagos. |
| CMS en localStorage no escala | No reutilizarlo como persistencia; solo como referencia de diseño. |
