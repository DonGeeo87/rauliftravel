import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CalendarBlank, Users, MapPin } from '@phosphor-icons/react';

const C = {
  emerald: '#38c98b', amber: '#e8a54a', dim: '#8ba093',
  border: 'rgba(255,255,255,0.07)',
};

interface ItinerarioItem { day: number; name: string; type: string; price: number; currency: string; provider: string; }
interface Departure { id: string; start_date: string; end_date: string; total_capacity: number; available: number; }
interface RouteDetalle {
  id: string; slug: string; title: string; subtitle: string; description: string;
  nicho: string; deporte: string; imagen: string; precio: number; moneda: string; duracion: string;
  itinerario: ItinerarioItem[];
}

const TYPE_LABEL: Record<string, string> = {
  'hospedaje': 'Hospedaje', 'guia': 'Guía', 'transporte': 'Transporte',
  'actividad': 'Actividad', 'alimentacion': 'Alimentación', 'entrada': 'Entrada',
};

export default function ExpedicionModal({ slug, onClose }: { slug: string | null; onClose: () => void }) {
  const [detalle, setDetalle] = useState<RouteDetalle | null>(null);
  const [deps, setDeps] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setDetalle(null);
    setDeps([]);
    fetch(`/api/raulif-mvp/catalog/routes/${slug}`)
      .then(r => r.json())
      .then(d => { setDetalle(d); })
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

  return (
    <AnimatePresence>
      {slug && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(5,8,7,0.85)', backdropFilter: 'blur(6px)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-3xl border"
            style={{ backgroundColor: '#101713', borderColor: C.border, color: '#eef5f1' }}
            initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header con imagen */}
            <div className="relative h-56 overflow-hidden">
              {detalle?.imagen ? (
                <img src={detalle.imagen} alt={detalle.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: '#141c18' }}>Cargando...</div>
              )}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, #101713 100%)' }} />
              <button onClick={onClose} className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition-colors hover:bg-white/10" style={{ borderColor: C.border, backgroundColor: 'rgba(10,15,13,0.7)' }}>
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                {detalle && (
                  <>
                    <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: C.emerald, color: '#07120d' }}>{detalle.nicho}</span>
                    <h2 className="mt-2 text-2xl font-black leading-tight">{detalle.title}</h2>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6 px-6 py-6 md:px-8">
              {loading && !detalle && <p style={{ color: C.dim }}>Cargando itinerario...</p>}

              {/* Descripción */}
              {detalle && <p className="text-sm leading-relaxed" style={{ color: C.dim }}>{detalle.description}</p>}

              {/* Cupos por fecha */}
              {deps.length > 0 && (
                <div className="rounded-2xl border p-4" style={{ borderColor: C.border, backgroundColor: '#0c110f' }}>
                  <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: C.dim }}>Fechas y cupos</h3>
                  <div className="mt-3 space-y-2">
                    {deps.slice(0, 3).map((d) => (
                      <div key={d.id} className="flex items-center justify-between rounded-xl border px-4 py-2.5" style={{ borderColor: C.border }}>
                        <span className="flex items-center gap-2 text-sm"><CalendarBlank className="h-4 w-4" color={C.emerald} weight="duotone" />{d.start_date} → {d.end_date}</span>
                        <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: d.available > 3 ? C.emerald : C.amber }}><Users className="h-4 w-4" />{d.available} cupos</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerario por día */}
              {detalle?.itinerario && dias.length > 0 ? (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: C.dim }}>Itinerario</h3>
                  <div className="mt-4 space-y-4">
                    {dias.map((day) => (
                      <div key={day} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(56,201,139,0.12)', color: C.emerald }}>{day}</span>
                          <span className="mt-1 w-px flex-1" style={{ backgroundColor: C.border }} />
                        </div>
                        <div className="flex-1 pb-5">
                          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.dim }}>Día {day}</p>
                          <div className="mt-2 space-y-2">
                            {detalle.itinerario.filter(i => i.day === day).map((it, idx) => (
                              <div key={idx} className="flex items-start justify-between gap-3 rounded-xl border px-4 py-3" style={{ borderColor: C.border, backgroundColor: '#0c110f' }}>
                                <div>
                                  <p className="text-sm font-semibold">{it.name}</p>
                                  <p className="mt-0.5 text-xs" style={{ color: C.dim }}>{TYPE_LABEL[it.type] || it.type} · {it.provider}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                !loading && <p className="text-sm" style={{ color: C.dim }}>Itinerario por confirmar.</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
