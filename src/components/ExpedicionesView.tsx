import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CalendarBlank, Users, ArrowRight, Compass, Clock, CurrencyCircleDollar } from '@phosphor-icons/react';
import ExpedicionModal from './ExpedicionModal';

interface RouteData {
  id: string; slug: string; title: string; subtitle: string;
  description: string; nicho: string; imagen: string; precio: number; moneda: string; duracion: string;
}
interface Departure { id: string; start_date: string; end_date: string; total_capacity: number; available: number; }

const C = {
  bg: '#0a0f0d', bg2: '#101713', card: '#141c18',
  ink: '#eef5f1', dim: '#8ba093', emerald: '#38c98b', amber: '#e8a54a',
  border: 'rgba(255,255,255,0.07)',
};

export default function ExpedicionesView({ onNavigate, db }: { onNavigate: (p: string) => void; db?: any }) {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [departures, setDepartures] = useState<Record<string, Departure[]>>({});
  const [loading, setLoading] = useState(true);
  const [expedicionSlug, setExpedicionSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/raulif-mvp/catalog/routes')
      .then(r => r.json())
      .then(data => {
        setRoutes(data);
        data.forEach((r: RouteData) => {
          fetch(`/api/raulif-mvp/catalog/routes/${r.slug}/departures`)
            .then(r2 => r2.json())
            .then(deps => setDepartures(prev => ({ ...prev, [r.slug]: deps })));
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh', paddingTop: '96px' }}>
      <div className="mx-auto max-w-6xl px-6 pb-20 md:px-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-black md:text-4xl">Expediciones</h1>
          <p className="mt-3 max-w-2xl text-sm md:text-base" style={{ color: C.dim }}>
            Salidas con fechas exactas y cupos limitados que se liberan según las reservas.
          </p>
        </div>

        {loading ? (
          <p style={{ color: C.dim }}>Cargando expediciones...</p>
        ) : routes.length === 0 ? (
          <p style={{ color: C.dim }}>Pronto anunciaremos nuevas salidas.</p>
        ) : (
          <div className="space-y-8">
            {routes.map((r, i) => {
              const deps = departures[r.slug] || [];
              return (
                <motion.article
                  key={r.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="overflow-hidden rounded-3xl border"
                  style={{ borderColor: C.border, backgroundColor: C.card }}
                >
                  <div className="grid md:grid-cols-2">
                    {/* Imagen */}
                    <div className="relative h-60 overflow-hidden md:h-auto">
                      <motion.img src={r.imagen} alt={r.title} className="h-full w-full object-cover" whileHover={{ scale: 1.08 }} transition={{ duration: 0.7 }} />
                      <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: C.emerald, color: '#07120d' }}>{r.nicho}</span>
                    </div>
                    {/* Contenido */}
                    <div className="flex flex-col justify-center p-6 md:p-8">
                      <div className="flex items-center gap-2 text-xs" style={{ color: C.dim }}>
                        <Clock className="h-4 w-4" color={C.emerald} /> {r.duracion || '7 días'}
                      </div>
                      <h2 className="mt-2 text-2xl font-bold">{r.title}</h2>
                      <p className="mt-1 text-sm font-semibold" style={{ color: C.emerald }}>{r.subtitle}</p>
                      <p className="mt-3 text-sm leading-relaxed" style={{ color: C.dim }}>{r.description}</p>

                      {/* Precio */}
                      <div className="mt-4 flex items-center gap-2 text-sm">
                        <CurrencyCircleDollar className="h-5 w-5" color={C.emerald} weight="duotone" />
                        <span className="text-lg font-black">{r.precio?.toLocaleString('es-CL')} {r.moneda || 'CLP'}</span>
                      </div>

                      {/* Cupos por fecha */}
                      <div className="mt-4 space-y-2">
                        {deps.slice(0, 3).map((d) => (
                          <div key={d.id} className="flex items-center justify-between rounded-xl border px-4 py-2.5" style={{ borderColor: C.border }}>
                            <span className="flex items-center gap-2 text-sm"><CalendarBlank className="h-4 w-4" color={C.emerald} weight="duotone" />{d.start_date} → {d.end_date}</span>
                            <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: d.available > 3 ? C.emerald : C.amber }}>
                              <Users className="h-4 w-4" />{d.available} cupos
                            </span>
                          </div>
                        ))}
                      </div>

                      <button onClick={() => setExpedicionSlug(r.slug)} className="mt-5 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-[#07120d] transition-transform hover:-translate-y-0.5" style={{ backgroundColor: C.emerald }}>
                        Ver itinerario <ArrowRight className="h-4 w-4" weight="bold" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      <ExpedicionModal slug={expedicionSlug} onClose={() => setExpedicionSlug(null)} />
    </div>
  );
}
