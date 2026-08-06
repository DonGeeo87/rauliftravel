# RAULIF TRAVEL — Brief de Requisitos

> **Estado:** Borrador v0.1 — Documento vivo. Se actualiza a medida que el primo y DonGeeo87 responden las preguntas abiertas.
> **Fecha:** 2026-08-06
> **Stack objetivo:** React 19 + Vite + Tailwind · FastAPI · Supabase (Postgres) · Docker en VPS

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
- [ ] Listado de rutas/packs armables.
- [ ] Ficha de ruta con desglose transparente por proveedor.
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

## 7. ⚠️ Preguntas abiertas (necesarias antes de diseñar el 80%)

Estas 4 decisiones definen el diseño. **No las podemos inventar.**

### Q1 — Proveedores de lanzamiento
¿Ya hay operadores comprometidos (hospedajes, guías, transporte) o construimos el marketplace "en frío" y reclutamos después?
→ Define si el MVP prioriza el **portal proveedor** o solo la **vitrina + constructor**.

### Q2 — Moneda
¿Precios en **CLP** o en **€/USD**? La repo actual apunta a europeos (€). Tu ecosistema es Chile.
→ Cambia diseño de pagos, formato de precios y público objetivo.

### Q3 — Flujo de cobro
¿**Raulif cobra el total** y liquida a proveedores (modelo OTA estándar, más control) o **cada proveedor cobra aparte** y Raulif solo factura su comisión?
→ Recomendado: Raulif cobra el total. Define la pasarela y el esquema de payouts.

### Q4 — Turismo consciente
¿El MVP incluye el componente de **impacto/conservación** (reforestación por viaje, como la repo actual) o es puramente ruteo + comisión en la primera versión?
→ Define alcance de la Fase 1 vs. Fase 2.

---

## 8. Criterios de éxito (métricas)

- [ ] Un viajero puede armar una ruta multi-proveedor en < 3 min.
- [ ] Un proveedor puede publicar un servicio y ver su comisión acumulada.
- [ ] El booking queda registrado con desglose por proveedor (auditable).
- [ ] Raulif puede calcular cuánto liquidar a cada proveedor en cualquier momento.
