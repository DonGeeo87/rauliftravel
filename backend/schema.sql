-- ============================================================================
-- RAULIF TRAVEL — Esquema de datos (Supabase / PostgreSQL)
-- Decidido 6-Ago-2026 con Matías España:
--   Q1: hay proveedores comprometidos (hospedaje, guías, transporte)
--   Q2: Multi-moneda (CLP + EUR + USD)
--   Q3: Raulif cobra el TOTAL y liquida a proveedores (modelo OTA)
--   Q4: Impacto gestionado con % de la UTILIDAD (no operación propia)
-- ============================================================================

-- ===== Extensiones =====
create extension if not exists "uuid-ossp";

-- ===== Tipos enumerados =====
create type service_type as enum ('hospedaje', 'guia', 'transporte', 'actividad', 'alimentacion');
create type service_status as enum ('borrador', 'revision', 'aprobado', 'rechazado');
create type booking_status as enum ('pendiente', 'pagado', 'confirmado', 'completado', 'cancelado');
create type currency as enum ('CLP', 'EUR', 'USD');
create type provider_status as enum ('activo', 'inactivo');

-- ============================================================================
-- PROVEEDORES (operadores que venden servicios en la plataforma)
-- ============================================================================
create table providers (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  rut           text unique,              -- identificador fiscal
  contact_email text,
  contact_phone text,
  commission_pct numeric(5,2) not null default 10.0,  -- % comisión Raulif pactado
  currency      currency not null default 'CLP',      -- moneda en que cobra el proveedor
  status        provider_status not null default 'activo',
  created_at    timestamptz not null default now()
);

-- ============================================================================
-- SERVICIOS (items vendibles por cada proveedor)
-- ============================================================================
create table services (
  id            uuid primary key default uuid_generate_v4(),
  provider_id   uuid not null references providers(id) on delete cascade,
  type          service_type not null,
  name          text not null,
  description   text,
  location      text,                     -- ciudad/zona
  price         numeric(12,2) not null,   -- precio en la moneda del proveedor
  currency      currency not null default 'CLP',
  stock         int,                      -- NULL = sin límite
  available_from date,
  available_to   date,
  status        service_status not null default 'borrador',
  created_at    timestamptz not null default now()
);

-- ============================================================================
-- RUTAS / PACKS (combinación curada de servicios)
-- ============================================================================
create table routes (
  id            uuid primary key default uuid_generate_v4(),
  slug          text unique not null,
  title         text not null,
  subtitle      text,
  description   text,
  status        text not null default 'activo',   -- activo | borrador | retirado
  created_at    timestamptz not null default now()
);

-- items de la ruta: qué servicios la componen (y en qué orden/día)
create table route_items (
  id          uuid primary key default uuid_generate_v4(),
  route_id    uuid not null references routes(id) on delete cascade,
  service_id  uuid not null references services(id),
  day         int not null,               -- día de la expedición (1..n)
  sort_order  int not null default 0
);

-- ============================================================================
-- SALIDAS / DEPARTURES (cupos por fecha exacta — requisito Matías 6-Ago)
-- Ejemplo: Expedición Patagonia 10 al 21 de diciembre, 20 cupos.
-- Los cupos se van rellenando según las reservas.
-- ============================================================================
create table departures (
  id            uuid primary key default uuid_generate_v4(),
  route_id      uuid not null references routes(id) on delete cascade,
  start_date    date not null,           -- fecha exacta de inicio (ej. 2026-12-10)
  end_date      date not null,           -- fecha de fin (ej. 2026-12-21)
  total_capacity int not null default 20, -- cupos totales (ej. 20)
  status        text not null default 'abierta',  -- abierta | llena | cerrada | completada
  created_at    timestamptz not null default now()
);

-- cupos vendidos por salida = COUNT(bookings confirmadas/pagadas de esa departure)
-- El stock disponible se calcula: total_capacity - cupos_reservados

-- ============================================================================
-- BOOKINGS (cabecera de venta — Raulif cobra el total, modelo OTA)
-- ============================================================================
create table bookings (
  id              uuid primary key default uuid_generate_v4(),
  route_id        uuid references routes(id),
  departure_id    uuid references departures(id),  -- salida/fechas con cupos
  client_name     text not null,
  client_email    text,
  client_phone    text,
  status          booking_status not null default 'pendiente',
  total_amount    numeric(12,2) not null,       -- total en la moneda de venta
  currency        currency not null default 'CLP',
  -- impacto (Q4): % de la UTILIDAD que va a conservación
  impact_pct      numeric(5,2) not null default 5.0,
  impact_amount   numeric(12,2),                -- calculado al liquidar
  created_at      timestamptz not null default now()
);

-- ============================================================================
-- BOOKING ITEMS (líneas por proveedor — la comisión vive AQUÍ)
-- ============================================================================
create table booking_items (
  id            uuid primary key default uuid_generate_v4(),
  booking_id    uuid not null references bookings(id) on delete cascade,
  service_id    uuid not null references services(id),
  provider_id   uuid not null references providers(id),
  price         numeric(12,2) not null,   -- precio de la línea
  currency      currency not null,
  commission_pct numeric(5,2) not null,   -- % comisión del proveedor (congelado)
  commission_amount numeric(12,2) not null,  -- comisión Raulif de esta línea
  net_to_provider numeric(12,2) not null     -- precio - comisión = pago al proveedor
);

-- ============================================================================
-- PAYOUTS (liquidación a proveedores — modelo OTA)
-- ============================================================================
create table payouts (
  id            uuid primary key default uuid_generate_v4(),
  provider_id   uuid not null references providers(id),
  period_start  date not null,
  period_end    date not null,
  gross_amount  numeric(12,2) not null,   -- suma de precios de sus líneas
  commission_total numeric(12,2) not null, -- comisión Raulif
  net_amount    numeric(12,2) not null,   -- gross - commission = a pagar al proveedor
  status        text not null default 'pendiente',  -- pendiente | pagado
  paid_at       timestamptz
);

-- ============================================================================
-- IMPACTO (Q4 — fondo de conservación, % de utilidad)
-- ============================================================================
create table impact_funds (
  id            uuid primary key default uuid_generate_v4(),
  booking_id    uuid references bookings(id),
  amount        numeric(12,2) not null,   -- reservado de la utilidad del booking
  project       text,                     -- proyecto de conservación (reporte)
  status        text not null default 'reservado',  -- reservado | destinado
  created_at    timestamptz not null default now()
);

-- ============================================================================
-- ÍNDICES
-- ============================================================================
create index idx_services_provider on services(provider_id);
create index idx_services_type on services(type);
create index idx_route_items_route on route_items(route_id);
create index idx_booking_items_booking on booking_items(booking_id);
create index idx_booking_items_provider on booking_items(provider_id);
create index idx_bookings_status on bookings(status);
create index idx_bookings_departure on bookings(departure_id);
create index idx_departures_route on departures(route_id);
create index idx_departures_start on departures(start_date);
create index idx_payouts_provider on payouts(provider_id);

-- ============================================================================
-- VISTA: utilidad e impacto por booking (para el reporte Q4)
-- ============================================================================
create view booking_impact as
select
  b.id as booking_id,
  b.client_name,
  b.total_amount,
  b.currency,
  sum(bi.commission_amount) as raulif_commission,
  -- utilidad Raulif = comisión total - costos (modelo: asumimos comisión = utilidad base)
  sum(bi.commission_amount) as raulif_utility,
  round(sum(bi.commission_amount) * b.impact_pct / 100.0, 2) as impact_amount
from bookings b
join booking_items bi on bi.booking_id = b.id
group by b.id, b.client_name, b.total_amount, b.currency, b.impact_pct;
