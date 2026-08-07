# RAULIF TRAVEL — Brief de Requisitos

> **Estado:** v0.2 — Q1–Q4 respondidas (7-Ago-2026). MVP en producción.
> **Fecha:** 2026-08-06 (actualizado 2026-08-07)
> **Stack objetivo:** React 19 + Vite + Tailwind · FastAPI + SQLite · Docker en VPS

---

## 1. Qué estamos construyendo

Un **planificador de viajes de turismo aventura y turismo consciente** que permite al usuario **armar rutas y packs combinando servicios de varios proveedores** (hospedaje, guías, transporte, actividades, alimentación).

**Modelo de negocio:** Raulif **gana por comisión** sobre cada venta intermediada. Cada proveedor tiene su porcentaje de comisión pactado; el margen de Raulif se calcula por línea de servicio dentro de cada booking.

**Diferenciador:** no es una vitrina de expediciones propias (eso es lo que es la repo actual), sino un **marketplace multi-proveedor** con constructor de rutas.

---

## 2. Objetivos

- [ ] Explorar rutas/packs armables y armarlas el usuario mismo.
- [ ] Armar una ruta día a día eligiendo proveedor + servicio por tramo.
- [ ] Ver el desglose de precio y comisión en tiempo real.
- [ ] Reservar con checkout y dejar booking registrado por línea.
- [ ] Liquidar comisiones a cada proveedor.
- [ ] Portal para que los proveedores gestionen sus servicios y vean sus ventas.

---

## 3. Personas / Roles

| Rol | Qué hace | Necesita |
|---|---|---|
| **Viajero (público)** | Explora, arma rutas, reserva | Constructor fácil, transparencia de precio, checkout |
| **Proveedor** | Publica servicios, gestiona agenda, ve comisiones | Portal con alta de servicios + reporte de ventas |
| **Admin Raulif (DonGeeo87 + primo)** | Aprueba servicios, gestiona comisiones, liquida pagos | Panel de control, config de % por proveedor |

---

## 4. Funcionalidades (por prioridad)

### MVP — Sprint 1
- [x] Listado de rutas/packs armables (4 experiencias en producción).
- [x] Ficha de ruta con desglose transparente por proveedor (página de detalle).
- [x] Itinerario completo por día con cupos por fecha exacta.
- [x] Galería de deportes con fotos reales (Pexels).
- [ ] Constructor de ruta (día a día, elegir proveedor+servicio por tramo).
- [ ] Cálculo en vivo de precio total + comisión Raulif.
- [ ] Booking con checkout (pasarela) → registra `booking_items` por proveedor.
- [ ] Portal proveedor básico: alta de servicios, ver ventas y comisión acumulada.

### Fase 2
- [ ] Panel admin completo: aprobación de servicios, gestión de % comisión por proveedor.
- [ ] Liquidación / payouts por proveedor.
- [ ] Autenticación por roles (viajero / proveedor / admin) — Supabase Auth.
- [ ] Email transaccional (confirmación, factura) — Resend/Listmonk.

### Fase 3
- [ ] Reseñas y valoraciones de proveedores/servicios.
- [ ] Búsqueda y filtros avanzados (ubicación, tipo, nivel físico, fechas).
- [ ] Mapas con rutas (Leaflet/MapLibre).
- [ ] Módulo "turismo consciente / impacto" (reforestación, donaciones por viaje).

---

## 5. Modelo de datos (alto nivel)

```
providers          → nombre, RUT, contacto, comisión% pactada, estado
services           → por proveedor: tipo (hospedaje/guía/transporte/actividad/alimentación),
                     ubicación, precio, stock/fechas, estado (aprobado/revision)
routes / packs     → combinaciones de services + margen Raulif
bookings           → cabecera: ruta, cliente, fecha, total, estado
booking_items      → línea por service: precio + comisión de cada proveedor
payouts            → liquidación por proveedor
```

**Regla clave:** la comisión vive **a nivel de línea** (`booking_items`), no a nivel de pack. Así se liquida a cada proveedor exactamente lo suyo.

---

## 6. Lo que ya existe en la repo (reutilizable)

La repo `rauliftravel1-0-` actual **compila limpio** (TS ✓ build ✓) y tiene valor de referencia:

- **Diseño/identidad Raulif** (paleta stone/emerald, tono "conocer para proteger").
- **AdminPanel** con CRUD de expediciones, embajadores, blog, SEO, leads (estructura reutilizable).
- **SEO dinámico** por página (SEOManager).
- **Routing hash-based** simple.

**No reutilizable tal cual:** el CMS en `localStorage` (no es compartido ni multi-tenant), y el modelo de "expediciones propias en €". El marketplace necesita backend real.

---

## 7. ✅ Decisiones clave (Q1–Q4, respondidas por Matías el 6-Ago-2026)

Estas 4 decisiones definen el diseño y ya están tomadas.

### Q1 — Proveedores de lanzamiento
**Decisión:** Ya hay operadores comprometidos (hospedaje, guías, transporte).
→ El MVP prioriza el **portal proveedor + vitrina** con datos reales, no demo en frío.

### Q2 — Moneda
**Decisión:** Multi-moneda (CLP + EUR + USD).
→ El sistema maneja precios en moneda origen + campo moneda, con conversión.

### Q3 — Flujo de cobro
**Decisión:** Raulif cobra el total y liquida a proveedores (modelo OTA).
→ Raulif es la pasarela: necesita payment gateway + payouts por proveedor.

### Q4 — Turismo consciente
**Decisión:** Impacto desde el inicio, gestionado con **parte de la utilidad** (no operación propia).
→ Diferenciador: % de la utilidad de cada booking se destina a conservación. Es un cálculo automático + reporte, no logística de campo.

---

## 8. Criterios de éxito (métricas)

- [ ] Un viajero puede armar una ruta multi-proveedor en < 3 min.
- [ ] Un proveedor puede publicar un servicio y ver su comisión acumulada.
- [ ] El booking queda registrado con desglose por proveedor (auditable).
- [ ] Raulif puede calcular cuánto liquidar a cada proveedor en cualquier momento.
