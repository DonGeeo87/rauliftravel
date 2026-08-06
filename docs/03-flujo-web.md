# RAULIF TRAVEL — Flujo de la Web

> **Estado:** v0.1. Documenta rutas, pantallas y flujos de usuario. Complementa el diagrama `flujo-web.html`.
> **Convención de roles:** Viajero (público) · Proveedor · Admin Raulif.

---

## 1. Mapa de rutas (URLs)

### Público (viajero)

| Ruta | Pantalla | Descripción |
|---|---|---|
| `/` | **Home** | Hero con propósito, destacados de rutas, cómo funciona, CTA |
| `/rutas` | **Listado de Rutas** | Grilla de rutas/packs armables, filtros |
| `/rutas/:slug` | **Ficha de Ruta** | Detalle, itinerario, proveedores, desglose de precio, CTA "Armar / Reservar" |
| `/planificador` | **Constructor de Ruta** | Armado día a día: elegir proveedor + servicio por tramo |
| `/planificador/resumen` | **Resumen de Ruta** | Itinerario armado, precio total + comisión, checkout |
| `/reservas/:id` | **Confirmación de Booking** | Detalle de la reserva, estado, pasos siguientes |
| `/impacto` | **Impacto (Fase 3)** | Proyectos de conservación / turismo consciente |
| `/blog` | **Blog** | Contenido editorial |
| `/contacto` | **Contacto** | Formulario |

### Proveedor

| Ruta | Pantalla | Descripción |
|---|---|---|
| `/proveedor/login` | **Login** | Acceso con rol proveedor |
| `/proveedor` | **Dashboard Proveedor** | Resumen: servicios, ventas, comisión acumulada |
| `/proveedor/servicios` | **Mis Servicios** | CRUD de servicios |
| `/proveedor/servicios/nuevo` | **Alta de Servicio** | Formulario: tipo, ubicación, precio, stock/fechas |
| `/proveedor/ventas` | **Mis Ventas** | Listado de bookings donde participó |

### Admin

| Ruta | Pantalla | Descripción |
|---|---|---|
| `/admin/login` | **Login Admin** | Acceso con rol admin |
| `/admin` | **Dashboard Admin** | Métricas: bookings, comisiones, proveedores |
| `/admin/proveedores` | **Proveedores** | CRUD de proveedores + % comisión pactada |
| `/admin/servicios` | **Servicios (revisión)** | Aprobar/rechazar servicios en estado `revision` |
| `/admin/rutas` | **Rutas/Packs** | Alta de packs curados |
| `/admin/liquidaciones` | **Payouts** | Calcular y marcar liquidaciones por proveedor |
| `/admin/seo` | **SEO** | Metadatos por página (reutilizar SEOManager) |

---

## 2. Flujo principal del viajero

### Flujo A — Explorar y reservar un pack curado
```
Home → /rutas → ficha /rutas/:slug → "Reservar" → checkout → confirmación
```
1. El viajero ve packs curados (armados por Raulif).
2. Entra a la ficha, ve itinerario y desglose por proveedor.
3. Reserva → checkout → booking con `booking_items` por proveedor.

### Flujo B — Armar su propia ruta (planificador) ⭐ núcleo del producto
```
Home → /rutas → "Armar tu ruta" → /planificador
  → por cada día: elegir proveedor + servicio (hospedaje/guía/transporte/actividad)
  → /planificador/resumen → checkout → confirmación
```
1. Inicia sesión (o continúa como invitado hasta el checkout).
2. Agrega días y, en cada día, **elije proveedor + servicio por tramo**.
3. Ve en vivo: **precio total** y **comisión Raulif**.
4. Aplica cupón/descuento si existe (Fase 3).
5. Checkout → paga → se registra el booking con desglose por línea.

---

## 3. Flujo del proveedor
```
/proveedor/login → dashboard → alta servicio → (estado: revision)
                                   → admin aprueba → servicio visible en catálogo
                                   → proveedor ve ventas + comisión acumulada
```

---

## 4. Flujo del admin
```
/admin/login → dashboard
  → gestiona proveedores (% comisión)
  → aprueba servicios en revision
  → arma packs curados
  → calcula liquidaciones por proveedor
```

---

## 5. Estados de un servicio y de un booking

### Servicio
`borrador → revision → aprobado | rechazado`

### Booking
`pendiente → pagado → confirmado → completado`
(con `cancelado` como rama desde pendiente/pagado)

---

## 6. Flujo del dinero (comisión)

1. Viajero paga **el total** a Raulif (modelo recomendado, Q3).
2. El booking se guarda con `booking_items` — cada línea con su proveedor, precio y **% comisión de ese proveedor**.
3. **Comisión Raulif = Σ (precio_línea × %_proveedor)** por booking.
4. Admin consulta `/admin/liquidaciones` → ve cuánto debe liquidar a cada proveedor.
5. Pago a proveedor = Σ precios_línea − comisión Raulif.

**Regla:** la comisión se calcula y congela **en el momento del booking** (no se recalcula si cambia el % después), para que la liquidación sea auditable e inmutable.

---

## 7. Pantallas clave en detalle

### Constructor de Ruta (`/planificador`)
- **Header:** progreso (días agregados), botón "Ver resumen".
- **Columna central:** timeline de días. En cada día, un tramo = selector de proveedor + selector de servicio.
- **Columna derecha (sticky):** resumen acumulado — total servicios + comisión Raulif + total a pagar.
- **Validaciones:** no dejar día vacío; cada servicio debe ser del proveedor elegido; fechas de servicio compatibles con las del viaje.

### Resumen de Ruta (`/planificador/resumen`)
- Itinerario completo por día.
- Tabla de costos: por línea (proveedor, servicio, precio) + subtotales.
- **Línea "Comisión Raulif"** y **total a pagar**.
- Botón "Confirmar y pagar" → checkout.

### Dashboard Proveedor (`/proveedor`)
- Tarjetas: N servicios activos, ventas totales, **comisión acumulada** (y por liquidar).
- Accesos rápidos a servicios y ventas.

### Dashboard Admin (`/admin`)
- Métricas: bookings totales, comisión Raulif acumulada, proveedores activos, servicios en revisión.
- Accesos a proveedores, revisión de servicios, packs y liquidaciones.
