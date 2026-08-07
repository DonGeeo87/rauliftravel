import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CalendarBlank, Users, Clock, MapPin, CurrencyCircleDollar } from '@phosphor-icons/react';

const C = {
  bg: '#0a0f0d', bg2: '#101713', card: '#141c18',
  ink: '#eef5f1', dim: '#8ba093', emerald: '#38c98b', amber: '#e8a54a',
  border: 'rgba(255,255,255,0.07)',
};

interface ItinerarioItem { day: number; name: string; type: string; price: number; currency: string; provider: string; }
interface Departure { id: string; start_date: string; end_date: string; total_capacity: number; available: number; }
interface RouteDetalle {
  id: string; slug: string; title: string; subtitle: string; description: string;
  nicho: string; deporte: string; duracion: string; precio: number; moneda: string;
  imagen: string; itinerario: ItinerarioItem[];
}

const TYPE_LABEL: Record<string, string> = {
  'hospedaje': 'Hospedaje', 'guia': 'Guía', 'transporte': 'Transporte',
  'actividad': 'Actividad', 'alimentacion': 'Alimentación', 'entrada': 'Entrada',
};

export default function ExperienciaDetalle({ slug, onBack }: { slug: string; onBack: () => void }) {
  const [detalle, setDetalle] = useState<RouteDetalle | null>(null);
  const [deps, setDeps] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/raulif-mvp/catalog/routes/${slug}`)
      .then(r => r.json())
      .then(d => setDetalle(d))
      .catch(() => setDetalle(null))
      .finally(() => setLoading(false));
    fetch(`/api/raulif-mvp/catalog/routes/${slug}/departures`)
      .then(r => r.json())
      .then(d => setDeps(Array.isArray(d) ? d : []))
      .catch(() => setDeps([]));
  }, [slug]);

  const dias = detalle?.itinerario
    ? Array.from(new Set(detalle.itinerario.map(i => i.day))).sort((a, b) => a - b)
    : [];

  if (loading) {
    return (
      <div style={{ backgroundColor: C.bg, color: C.ink, minHeight: '100vh', paddingTop: '96px' }} className="px-6">
        <p style={{ color: C.dim }}>Cargando experiencia...</p>
      </div>
    );
  }

  if (!detalle) {
    return (
      <div style={{ backgroundColor: C.bg, color: C.ink, minHeight: '100vh', paddingTop: '96px' }} className="px-6">
        <button onClick={onBack} className="mb-6 flex cursor-pointer items-center gap-2 text-sm font-bold" style={{ color: C.emerald }}>
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>
        <p style={{ color: C.dim }}>Experiencia no encontrada.</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh', paddingTop: '96px' }}>

      {/* Botón volver */}
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <button onClick={onBack} className="flex cursor-pointer items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80" style={{ color: C.dim }}>
          <ArrowLeft className="h-4 w-4" /> Volver a expediciones
        </button>
      </div>

      {/* Hero */}
      <section className="relative mt-6 h-[48vh] min-h-[360px] w-full overflow-hidden">
        <img src={detalle.imagen} alt={detalle.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,15,13,0.2) 0%, rgba(10,15,13,0.95) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: C.emerald, color: '#07120d' }}>{detalle.nicho}</span>
              <span className="rounded-full border px-3 py-1 text-xs font-semibold" style={{ borderColor: C.border, color: C.dim }}>{detalle.deporte}</span>
              <span className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold" style={{ borderColor: C.border, color: C.dim }}>
                <Clock className="h-3.5 w-3.5" /> {detalle.duracion}
              </span>
            </div>
            <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight md:text-5xl">{detalle.title}</h1>
            <p className="mt-2 text-lg font-semibold" style={{ color: C.emerald }}>{detalle.subtitle}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-20 md:px-12">
        <div className="mt-8 grid gap-10 lg:grid-cols-12">

          {/* Columna principal: descripción + itinerario */}
          <div className="space-y-10 lg:col-span-8">
            <section>
              <h2 className="text-xl font-bold">Sobre esta salida</h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: C.dim }}>{detalle.description}</p>
              <div className="mt-4 flex items-center gap-2 text-sm font-bold" style={{ color: C.emerald }}>
                <CurrencyCircleDollar className="h-5 w-5" weight="duotone" />
                {detalle.precio?.toLocaleString('es-CL')} {detalle.moneda}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold">Itinerario</h2>
              <div className="mt-6 space-y-4">
                {dias.map((day) => (
                  <div key={day} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ backgroundColor: 'rgba(56,201,139,0.14)', color: C.emerald }}>{day}</span>
                      <span className="mt-1 w-px flex-1" style={{ backgroundColor: C.border }} />
                    </div>
                    <div className="flex-1 pb-5">
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.dim }}>Día {day}</p>
                      <div className="mt-2 space-y-2">
                        {detalle.itinerario.filter(i => i.day === day).map((it, idx) => (
                          <div key={idx} className="rounded-xl border px-4 py-3" style={{ borderColor: C.border, backgroundColor: C.bg2 }}>
                            <p className="text-sm font-semibold">{it.name}</p>
                            <p className="mt-0.5 text-xs" style={{ color: C.dim }}>{TYPE_LABEL[it.type] || it.type} · {it.provider}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Columna lateral: fechas, cupos, CTA */}
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-3xl border p-6" style={{ borderColor: C.border, backgroundColor: C.bg2 }}>
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: C.dim }}>Fechas y cupos</h3>
              <div className="mt-4 space-y-3">
                {deps.length === 0 ? (
                  <p className="text-sm" style={{ color: C.dim }}>Sin fechas disponibles por ahora.</p>
                ) : deps.map((d) => (
                  <div key={d.id} className="rounded-xl border px-4 py-3" style={{ borderColor: C.border }}>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm"><CalendarBlank className="h-4 w-4" color={C.emerald} weight="duotone" />{d.start_date} → {d.end_date}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: d.available > 3 ? C.emerald : C.amber }}><Users className="h-4 w-4" />{d.available} cupos</span>
                      <button className="rounded-lg px-4 py-2 text-xs font-bold text-[#07120d] transition-colors hover:opacity-90" style={{ backgroundColor: C.emerald }}>
                        Reservar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
