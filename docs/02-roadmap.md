# RAULIF TRAVEL — Roadmap

> **Estado:** v0.3 — MVP en producción (7-Ago-2026).
> **Filosofía:** MVP funcional → validar con proveedores reales → iterar. Nada nuevo hasta que el flujo de comisión funcione de punta a punta.

---

## Visión (2026–2030)

Del brief de Raulif: construir un **ecosistema** (YouTube, redes, web, turismo, educación ambiental, cursos) donde la web es la **casa comercial**: lugar donde la gente encuentra los viajes, arma rutas y reserva. Este roadmap cubre la parte **web de turismo + comisión**; el resto del ecosistema (contenido) es otra línea de trabajo.

---

## Fase 0 — Definición ✅ COMPLETADA

- [x] Clonar y auditar la repo actual.
- [x] Redactar brief de requisitos (`01-brief-requisitos.md`).
- [x] Roadmap (`02-roadmap.md`) y flujo web (`03-flujo-web.md`) + diagrama.
- [x] **Responder Q1–Q4 del brief** (proveedores, moneda, cobro, impacto).
- [x] Definir esquema de datos (SQLite en backend MVP).
- [x] Definir contrato de API FastAPI.

---

## Fase 1 — MVP ✅ EN PRODUCCIÓN

**Objetivo:** el flujo de comisión funcionando de punta a punta con datos de ejemplo.

### Logrado
- **Público (vitrina):** listado de 4 experiencias con itinerario completo por día y cupos por fecha.
- **Página de detalle** por experiencia (ficha completa).
- **Galería de deportes** con fotos reales de Pexels.
- **UI/UX dark premium** coherente.
- **Backend MVP** (FastAPI + SQLite): catálogo, cupos, reservas, impacto Q4.
- **Deploy** GitHub Actions → VPS, dominio `rauliftravel.codigoguerrero.dev`.

### Pendiente (Fase 1)
- [ ] **Flujo de reserva real:** botón "Reservar" crea booking y resta cupo (API ya lista).
- [ ] **Checkout / pago** (multi-moneda, modelo OTA).
- [ ] **Portal proveedor** (alta de servicios, ver ventas y comisión).
- [ ] **Panel admin** (aprobar servicios, configurar % comisión).

---

## Fase 2 — Producto (Sprint 2–3)

- [ ] Autenticación por roles (viajero / proveedor / admin).
- [ ] Panel admin completo: gestión de proveedores, liquidaciones/payouts.
- [ ] Email transaccional (confirmación, factura) — Resend/Listmonk.
- [ ] Búsqueda y filtros (ubicación, tipo, nivel físico, fechas).
- [ ] Módulo "turismo consciente / impacto" (reporte por salida).

---

## Fase 3 — Escala

- [ ] Reseñas y valoraciones.
- [ ] Mapas con rutas (Leaflet/MapLibre).
- [ ] Multi-moneda y multi-idioma (si el público es europeo).
- [ ] Payouts automáticos a proveedores.
- [ ] Integración con Listmonk para campañas de retención.

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
| No hay proveedores al lanzar | Ya hay operadores comprometidos (Q1). |
| Pago/comisión complejo | Modelo simple primero: Raulif cobra total, liquida por línea (Q3). |
| Moneda/público ambiguo | Multi-moneda (Q2). |
| CMS en localStorage no escala | No reutilizarlo como persistencia; solo como referencia de diseño. |
