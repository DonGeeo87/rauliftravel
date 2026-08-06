# RAULIF TRAVEL — Contrato de API (MVP)

> **Estado:** Definido 6-Ago-2026. Backend FastAPI + SQLite. Multi-tenant (viajero/proveedor/admin).
> **Decisiones aplicadas:** Q1 hay proveedores · Q2 multi-moneda · Q3 Raulif cobra total y liquida (OTA) · Q4 impacto con % de utilidad · Cupos por fecha exacta.

---

## 1. Base

- **URL:** `/api/raulif-mvp/*` (proxy nginx → `raulif-mvp-backend:3103`)
- **Auth:** JWT por rol (viajero | proveedor | admin). Endpoints públicos sin auth: catálogo, ficha, disponibilidad.
- **Moneda:** todo precio lleva `currency` (CLP/EUR/USD). Conversión multi-moneda a tasa configurable.
- **Formato:** JSON. Errores: `{"detail": "..."}` (FastAPI estándar).

---

## 2. Endpoints públicos (sin auth)

### Catálogo y experiencias
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/catalog/routes` | Lista de rutas/experiencias activas con nicho + deporte + imagen |
| GET | `/catalog/routes/:slug` | Ficha de una experiencia (descripción, itinerario, imágenes) |
| GET | `/catalog/routes/:slug/departures` | Salidas de esa experiencia con **cupos disponibles** y fechas |
| GET | `/catalog/services?type=&location=` | Servicios individuales (hospedaje, guía, transporte) |
| GET | `/catalog/nichos` | Nichos (aves, fauna, interpretación, cocina, flora sagrada, cultura) |
| GET | `/catalog/deportes` | Deportes (kayak, rafting, trekking, escalada, SUP, MTB, snowboard, ski, surf, buceo, sandboard) |

### Reserva y disponibilidad
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/catalog/departures/:id/availability` | Cupos restantes = `total_capacity - reservados` |
| POST | `/booking/quotation` | Cotiza una ruta + departure + items (devuelve total, comisión, impacto) |
| POST | `/booking` | Crea un booking pendiente (bloquea cupo temporalmente) |

---

## 3. Endpoints proveedor (auth: proveedor)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/provider/services` | Alta de servicio (tipo, ubicación, precio, moneda, fechas) |
| PUT | `/provider/services/:id` | Editar servicio |
| GET | `/provider/services` | Mis servicios |
| GET | `/provider/sales` | Mis ventas (bookings donde participé) |
| GET | `/provider/commission` | Comisión acumulada por período |
| PUT | `/provider/departures/:id/capacity` | Ajustar cupos de una salida |

---

## 4. Endpoints admin (auth: admin)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/admin/providers` | Alta de proveedor + % comisión |
| PUT | `/admin/providers/:id/commission` | Configurar % comisión |
| GET | `/admin/providers` | Listar proveedores |
| POST | `/admin/services/:id/approve` | Aprobar/rechazar servicio |
| POST | `/admin/routes` | Crear/editar pack curado |
| GET | `/admin/bookings` | Todas las reservas con estado |
| POST | `/admin/bookings/:id/confirm` | Confirmar booking (resta cupo) |
| GET | `/admin/payouts` | Liquidaciones por proveedor |
| POST | `/admin/payouts/:id/mark-paid` | Marcar payout pagado |
| GET | `/admin/impact` | Reporte de fondo de impacto (Q4: % de utilidad) |
| GET | `/admin/impact/:period` | Detalle por período |

---

## 5. Flujo de una reserva con cupos (crítico)

```
1. Viajero ve catálogo → ficha de experiencia → salidas con cupos disponibles
2. Elige una departure (ej. Patagonia 10-21 dic, 20 cupos, quedan 12)
3. POST /booking/quotation → calcula total + comisión Raulif + impacto
4. POST /booking → crea booking PENDIENTE → bloquea cupo (reserva temporal)
5. Viajero paga (Raulif cobra el total - modelo OTA)
6. Admin confirma → POST /admin/bookings/:id/confirm → booking PAGADO
7. Cupo definitivo: se resta de disponibilidad
8. Al liquidar: booking_items → comisión por proveedor → payout
9. Impacto: % de la UTILIDAD de cada booking → impact_funds
```

**Regla de cupos:** el cupo se bloquea al crear el booking (pendiente) y se libera si caduca/cancela. `disponible = total_capacity - COUNT(bookings activas de esa departure)`.

---

## 6. Modelo de datos (ya definido en `schema.sql`)

```
providers → name, commission_pct, currency
services → provider_id, type, name, price, currency, status
routes → slug, title, nicho, deporte, imagenes[]
route_items → route_id, service_id, day
departures → route_id, start_date, end_date, total_capacity  ← CUPOS POR FECHA
bookings → route_id, departure_id, client, status, total_amount, currency, impact_pct
booking_items → booking_id, service_id, provider_id, price, commission_pct, net_to_provider
payouts → provider_id, period, gross, commission_total, net
impact_funds → booking_id, amount, project, status  ← Q4
```

---

## 7. Nichos y deportes (contenido del catálogo)

**Nichos:** Avistamiento de aves en humedales · Fauna silvestre · Interpretación medioambiental · Cocina chilena auténtica · Cosechas y recolección de frutos silvestres · Flora sagrada y medicinal (pueblos originarios: Mapuche, Atacameño, Aimara) · Cultura local.

**Deportes:** Kayak · Rafting · Trekking · Escalada · Stand Up Paddle · Mountain Bike · Snowboard · Ski · Surf · Buceo · Sandboard.

**Mensaje de marca:** conservación del medio ambiente + guías son **ingenieros en expediciones** (no guías genéricos).
