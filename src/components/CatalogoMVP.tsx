/**
 * Raulif Travel MVP — Vista de Catálogo con galería WOW
 * Consume el backend real: GET /api/raulif-mvp/catalog/routes
 * Animaciones: Ken Burns (zoom lento) + parallax en el hero
 */
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  CalendarBlank, Users, ArrowRight, TreeEvergreen,
  Mountains, Bird, Compass, Waveform,
} from '@phosphor-icons/react';

// Imágenes de aventura para la galería WOW (Unsplash, alta calidad)
const GALLERY = [
  { url: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1400&auto=format&fit=crop', label: 'Trekking' },
  { url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1400&auto=format&fit=crop', label: 'Montaña' },
  { url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1400&auto=format&fit=crop', label: 'Fauna' },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1400&auto=format&fit=crop', label: 'Cordillera' },
  { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1400&auto=format&fit=crop', label: 'Glaciares' },
  { url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1400&auto=format&fit=crop', label: 'Bosque nativo' },
];

const NICHOS = [
  { icon: Bird, label: 'Avistamiento de aves' },
  { icon: Mountains, label: 'Fauna silvestre' },
  { icon: Compass, label: 'Interpretación ambiental' },
  { icon: Waveform, label: 'Cocina y cosechas' },
  { icon: TreeEvergreen, label: 'Flora sagrada y medicinal' },
  { icon: Users, label: 'Pueblos originarios' },
];

const DEPORTES = ['Kayak', 'Rafting', 'Trekking', 'Escalada', 'SUP', 'MTB', 'Snowboard', 'Ski', 'Surf', 'Buceo', 'Sandboard'];

const C = {
  bg: '#0d1110',
  card: '#141a17',
  ink: '#f2f5f2',
  dim: '#9fb0a7',
  emerald: '#3da97c',
  amber: '#f0a94a',
  border: 'rgba(255,255,255,0.08)',
};

export default function CatalogoMVP() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);
  const [departures, setDepartures] = useState<Record<string, any[]>>({});

  useEffect(() => {
    fetch('/api/raulif-mvp/catalog/routes')
      .then((r) => r.json())
      .then((data) => {
        setRoutes(data);
        // cargar departures/cupos de cada ruta
        data.forEach((route: any) => {
          fetch(`/api/raulif-mvp/catalog/routes/${route.slug}/departures`)
            .then((r) => r.json())
            .then((deps) => setDepartures((prev) => ({ ...prev, [route.slug]: deps })));
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // rotar hero con Ken Burns cada 5s
  useEffect(() => {
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % GALLERY.length), 5000);
    return () => clearInterval(t);
  }, []);

  const hero = GALLERY[heroIdx];

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh' }}>
      {/* ===== HERO GALERÍA WOW ===== */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        {/* Ken Burns: zoom lento en imagen de fondo */}
        {GALLERY.map((g, i) => (
          <motion.div
            key={g.url}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1 }}
            animate={{
              opacity: i === heroIdx ? 1 : 0,
              scale: i === heroIdx ? 1.18 : 1.05,
            }}
            transition={{ opacity: { duration: 1.2 }, scale: { duration: 7, ease: 'easeInOut' } }}
          >
            <img src={g.url} alt={g.label} className="h-full w-full object-cover" />
          </motion.div>
        ))}
        {/* overlay oscuro para legibilidad */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(13,17,16,0.3) 0%, rgba(13,17,16,0.1) 40%, rgba(13,17,16,0.92) 100%)' }} />

        {/* Contenido hero */}
        <div className="relative z-10 flex h-full items-end px-6 pb-16 md:px-12">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold"
              style={{ borderColor: C.border, color: C.emerald, backgroundColor: 'rgba(61,169,124,0.12)' }}
            >
              <TreeEvergreen className="h-3.5 w-3.5" weight="fill" />
              Turismo aventura y consciente · Chile
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-4 text-4xl font-black leading-[1.05] md:text-6xl"
            >
              Expediciones guiadas por <span style={{ color: C.emerald }}>ingenieros</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-4 max-w-xl text-base text-[#c8d6ce] md:text-lg"
            >
              Cupos limitados por fecha. Cada salida apoya la conservación con parte de la utilidad.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-6 flex flex-wrap gap-2"
            >
              {DEPORTES.slice(0, 6).map((d) => (
                <span key={d} className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: C.border, color: C.dim }}>
                  {d}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* indicador de galería */}
        <div className="absolute bottom-5 right-6 z-10 flex gap-2">
          {GALLERY.map((g, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className="h-1.5 rounded-full transition-all"
              style={{ width: i === heroIdx ? 24 : 10, backgroundColor: i === heroIdx ? C.emerald : C.border, cursor: 'pointer' }}
            />
          ))}
        </div>
      </section>

      {/* ===== NICHOS ===== */}
      <section className="px-6 py-14 md:px-12">
        <h2 className="text-2xl font-bold md:text-3xl">Experiencias por nicho</h2>
        <p className="mt-2 text-sm" style={{ color: C.dim }}>Conexión auténtica con la naturaleza y la cultura local</p>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {NICHOS.map((n) => (
            <div key={n.label} className="rounded-2xl border p-5 text-center transition-transform hover:-translate-y-1" style={{ borderColor: C.border, backgroundColor: C.card }}>
              <n.icon className="mx-auto mb-3 h-8 w-8" weight="duotone" color={C.emerald} />
              <p className="text-xs font-semibold">{n.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CATÁLOGO CON CUPOS ===== */}
      <section className="px-6 pb-16 md:px-12">
        <h2 className="text-2xl font-bold md:text-3xl">Experiencias con cupos limitados</h2>
        <p className="mt-2 text-sm" style={{ color: C.dim }}>Selecciona tu fecha y asegura tu cupo</p>

        {loading ? (
          <p className="mt-8" style={{ color: C.dim }}>Cargando catálogo...</p>
        ) : routes.length === 0 ? (
          <p className="mt-8" style={{ color: C.dim }}>Sin experiencias activas por ahora.</p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {routes.map((r, i) => {
              const deps = departures[r.slug] || [];
              return (
                <motion.div
                  key={r.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="overflow-hidden rounded-2xl border"
                  style={{ borderColor: C.border, backgroundColor: C.card }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={r.imagen}
                      alt={r.title}
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: C.emerald, color: '#0d1110' }}>
                      {r.nicho}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold">{r.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm" style={{ color: C.dim }}>{r.description}</p>

                    {/* cupos por fecha */}
                    <div className="mt-4 space-y-2">
                      {deps.slice(0, 2).map((d) => (
                        <div key={d.id} className="flex items-center justify-between rounded-lg border px-3 py-2" style={{ borderColor: C.border }}>
                          <div className="flex items-center gap-2">
                            <CalendarBlank className="h-4 w-4" weight="duotone" color={C.emerald} />
                            <span className="text-xs">
                              {d.start_date} → {d.end_date}
                            </span>
                          </div>
                          <span
                            className="flex items-center gap-1.5 text-xs font-bold"
                            style={{ color: d.available > 3 ? C.emerald : C.amber }}
                          >
                            <Users className="h-3.5 w-3.5" />
                            {d.available} cupos
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-colors hover:opacity-90"
                      style={{ backgroundColor: C.emerald }}
                    >
                      Ver expedición
                      <ArrowRight className="h-4 w-4" weight="bold" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
