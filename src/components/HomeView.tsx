/**
 * RAULIF Travel - Home (rediseño premium)
 * Dirección visual: dark forest + esmeralda. Turismo aventura y consciente en Chile.
 * Guías = ingenieros en expediciones. Impacto = % de la utilidad a conservación.
 * Elimina el look "plantilla WordPress": sin eyebrows excesivos, sin serif genérico.
 */
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Compass, Mountains, Bird, TreeEvergreen, Users, MapPin, CalendarBlank,
  ArrowRight, Heartbeat, Wind, Flame,
} from '@phosphor-icons/react';
import { usePexels, PexelsPhoto } from '../lib/usePexels';
import ExpedicionModal from './ExpedicionModal';

const NICHOS = [
  { icon: Bird, label: 'Avistamiento de aves', desc: 'Humedales y bosques' },
  { icon: Mountains, label: 'Fauna silvestre', desc: 'Seguimiento guiado' },
  { icon: Compass, label: 'Interpretación ambiental', desc: 'Cátedra en terreno' },
  { icon: Flame, label: 'Cocina y cosechas', desc: 'Experiencias auténticas' },
  { icon: TreeEvergreen, label: 'Flora sagrada', desc: 'Medicinal originaria' },
  { icon: Users, label: 'Pueblos originarios', desc: 'Cultura viva' },
];

const DEPORTES = ['Kayak', 'Rafting', 'Trekking', 'Escalada', 'SUP', 'MTB', 'Snowboard', 'Surf', 'Buceo', 'Sandboard'];

const C = {
  bg: '#0a0f0d',
  bg2: '#101713',
  card: '#141c18',
  ink: '#eef5f1',
  dim: '#8ba093',
  emerald: '#38c98b',
  amber: '#e8a54a',
  border: 'rgba(255,255,255,0.07)',
};

export default function HomeView({ onNavigate, db, onSubscribe, subStatus }: {
  onNavigate: (p: string) => void;
  db?: any;
  onSubscribe?: (e: string) => void;
  subStatus?: any;
}) {
  const [heroIdx, setHeroIdx] = useState(0);
  const [expedicionSlug, setExpedicionSlug] = useState<string | null>(null);
  const [routes, setRoutes] = useState<any[]>([]);
  const [departures, setDepartures] = useState<Record<string, any[]>>({});
  const { photos: heroPhotos } = usePexels('adventure chile landscape', 6);

  const gallery: { url: string; label: string }[] = heroPhotos.length
    ? heroPhotos.map((p) => ({ url: p.url, label: p.alt || 'Aventura en Chile' }))
    : [{ url: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1600&auto=format&fit=crop', label: 'Aventura en Chile' }];

  useEffect(() => {
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % gallery.length), 5000);
    return () => clearInterval(t);
  }, [gallery.length]);

  useEffect(() => {
    fetch('/api/raulif-mvp/catalog/routes')
      .then((r) => r.json())
      .then((data) => {
        setRoutes(data);
        data.forEach((route: any) => {
          fetch(`/api/raulif-mvp/catalog/routes/${route.slug}/departures`)
            .then((r) => r.json())
            .then((deps) => setDepartures((prev) => ({ ...prev, [route.slug]: deps })));
        });
      })
      .catch(() => {});
  }, []);

  const hero = gallery[heroIdx];

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh' }}>

      {/* ===== HERO GALERÍA ===== */}
      <section className="relative flex min-h-[100dvh] items-end overflow-hidden">
        {gallery.map((g, i) => (
          <motion.div
            key={g.url}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: i === heroIdx ? 1 : 0, scale: i === heroIdx ? 1.18 : 1.05 }}
            transition={{ opacity: { duration: 1.2 }, scale: { duration: 8, ease: 'easeInOut' } }}
          >
            <img src={g.url} alt={g.label} className="h-full w-full object-cover" />
          </motion.div>
        ))}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,15,13,0.35) 0%, rgba(10,15,13,0.1) 45%, rgba(10,15,13,0.94) 100%)' }} />

        <div className="relative z-10 w-full px-6 pb-14 md:px-12">
          <div className="mx-auto max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold" style={{ borderColor: 'rgba(255,255,255,0.15)', color: C.emerald, backgroundColor: 'rgba(0,0,0,0.3)' }}>
                <MapPin className="h-3.5 w-3.5" weight="fill" />
                Turismo aventura y consciente · Chile
              </span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="mt-5 text-4xl font-black leading-[1.03] md:text-6xl lg:text-7xl">
              Bienvenido a tu{' '}
              <span style={{ color: C.emerald }}>próxima aventura</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="mt-5 max-w-2xl text-base text-[#c4d4cb] md:text-lg">
              Vive Chile con salidas guiadas por fecha, cupos limitados y un impacto real en la conservación. Aventura con propósito, de norte a sur.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="mt-7 flex flex-wrap items-center gap-3">
              <button onClick={() => onNavigate('catalogo')} className="flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-[#07120d] transition-transform hover:-translate-y-0.5" style={{ backgroundColor: C.emerald }}>
                Explorar expediciones
                <ArrowRight className="h-4 w-4" weight="bold" />
              </button>
              <button onClick={() => onNavigate('impacto')} className="rounded-xl border px-6 py-3.5 text-sm font-semibold transition-colors" style={{ borderColor: 'rgba(255,255,255,0.18)' }}>
                Nuestro impacto
              </button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-8 flex flex-wrap gap-2">
              {DEPORTES.slice(0, 7).map((d) => (
                <span key={d} className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: C.border, color: C.dim }}>{d}</span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* indicador galería */}
        <div className="absolute bottom-6 right-8 z-10 flex gap-2">
          {gallery.map((g, i) => (
            <button key={i} onClick={() => setHeroIdx(i)} className="h-1.5 rounded-full transition-all" style={{ width: i === heroIdx ? 26 : 10, backgroundColor: i === heroIdx ? C.emerald : 'rgba(255,255,255,0.25)', cursor: 'pointer' }} />
          ))}
        </div>
      </section>

      {/* ===== MANIFIESTO (2 col, sin eyebrow) ===== */}
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-bold leading-tight md:text-4xl">
              Viajar que deja huella. <span style={{ color: C.emerald }}>Positiva.</span>
            </h2>
          </div>
          <div className="space-y-4 text-[#a9bbb1]">
            <p>
              No vendemos planes turísticos genéricos. Diseñamos salidas en el territorio chileno guiadas por especialistas que conocen cada ecosistema y cada cultura local.
            </p>
            <p className="text-sm" style={{ color: C.dim }}>
              Avistamiento de aves en humedales, fauna silvestre, interpretación ambiental, cocina y cosechas auténticas, flora sagrada y medicinal de los pueblos originarios. Aventura con propósito.
            </p>
          </div>
        </div>
      </section>

      {/* ===== NICHOS ===== */}
      <section className="px-6 py-16 md:px-12" style={{ backgroundColor: C.bg2 }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold md:text-3xl">Experiencias por nicho</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {NICHOS.map((n) => (
              <motion.div key={n.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }} className="rounded-2xl border p-5 transition-transform hover:-translate-y-1" style={{ borderColor: C.border, backgroundColor: C.card }}>
                <n.icon className="mb-3 h-7 w-7" weight="duotone" color={C.emerald} />
                <p className="text-sm font-bold">{n.label}</p>
                <p className="mt-1 text-xs" style={{ color: C.dim }}>{n.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GALERÍA DE DEPORTES (Pexels) ===== */}
      <DeportesGaleria />

      {/* ===== CATÁLOGO CON CUPOS ===== */}
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold md:text-3xl">Salidas con cupos limitados</h2>
          <p className="mt-2 text-sm" style={{ color: C.dim }}>Cada expedición tiene fechas exactas y cupos que se liberan según las reservas.</p>

          {routes.length === 0 ? (
            <p className="mt-8" style={{ color: C.dim }}>Cargando catálogo...</p>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {routes.map((r, i) => {
                const deps = departures[r.slug] || [];
                return (
                  <motion.div key={r.slug} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: i * 0.08 }} className="overflow-hidden rounded-2xl border" style={{ borderColor: C.border, backgroundColor: C.card }}>
                    <div className="relative h-48 overflow-hidden">
                      <motion.img src={r.imagen} alt={r.title} className="h-full w-full object-cover" whileHover={{ scale: 1.1 }} transition={{ duration: 0.6 }} />
                      <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: C.emerald, color: '#07120d' }}>{r.nicho}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold">{r.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm" style={{ color: C.dim }}>{r.description}</p>
                      <div className="mt-4 space-y-2">
                        {deps.slice(0, 2).map((d) => (
                          <div key={d.id} className="flex items-center justify-between rounded-lg border px-3 py-2" style={{ borderColor: C.border }}>
                            <span className="flex items-center gap-2 text-xs"><CalendarBlank className="h-4 w-4" weight="duotone" color={C.emerald} />{d.start_date} → {d.end_date}</span>
                            <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: d.available > 3 ? C.emerald : C.amber }}>
                              <Users className="h-3.5 w-3.5" />{d.available} cupos
                            </span>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setExpedicionSlug(r.slug)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-[#07120d] transition-colors hover:opacity-90" style={{ backgroundColor: C.emerald }}>
                        Ver itinerario <ArrowRight className="h-4 w-4" weight="bold" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===== IMPACTO (cifras, no eyebrow) ===== */}
      <section className="px-6 py-20 md:px-12" style={{ backgroundColor: C.bg2 }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold md:text-3xl">Impacto con parte de la utilidad</h2>
          <p className="mt-2 max-w-2xl text-sm" style={{ color: C.dim }}>
            No operamos reforestación: reservamos un % de la utilidad de cada salida y lo destinamos a proyectos de conservación con transparencia total.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: TreeEvergreen, n: '5%', t: 'de utilidad por salida', d: 'reservado a conservación' },
              { icon: Wind, n: '100%', t: 'guias especializados', d: 'en cada territorio' },
              { icon: Heartbeat, n: 'Cero', t: 'greenwashing', d: 'reportes por cada salida' },
            ].map((s) => (
              <div key={s.t} className="rounded-2xl border p-6" style={{ borderColor: C.border, backgroundColor: C.card }}>
                <s.icon className="mb-4 h-8 w-8" weight="duotone" color={C.emerald} />
                <p className="text-4xl font-black" style={{ color: C.emerald }}>{s.n}</p>
                <p className="mt-2 font-semibold">{s.t}</p>
                <p className="text-sm" style={{ color: C.dim }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ExpedicionModal slug={expedicionSlug} onClose={() => setExpedicionSlug(null)} />
    </div>
  );
}

/** Galería de deportes de aventura poblada con fotos reales de Pexels por deporte. */
function DeportesGaleria() {
  const deportes = [
    { nombre: 'Kayak', query: 'kayak paddle' },
    { nombre: 'Rafting', query: 'white water rafting' },
    { nombre: 'Trekking', query: 'hiking trail mountain' },
    { nombre: 'Escalada', query: 'rock climbing' },
    { nombre: 'Surf', query: 'surfing wave' },
    { nombre: 'MTB', query: 'mountain biking' },
    { nombre: 'Snowboard', query: 'snowboarding' },
    { nombre: 'Buceo', query: 'scuba diving' },
  ];
  const [fotos, setFotos] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all(
      deportes.map((d) =>
        fetch(`/api/raulif-mvp/images?q=${encodeURIComponent(d.query)}&per_page=1`)
          .then((r) => r.json())
          .then((data) => [d.nombre, data.photos?.[0]?.url] as [string, string])
          .catch(() => [d.nombre, ''] as [string, string])
      )
    ).then((entries) => {
      if (!active) return;
      const map: Record<string, string> = {};
      entries.forEach(([nombre, url]) => { map[nombre] = url; });
      setFotos(map);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  return (
    <section className="px-6 py-20 md:px-12" style={{ backgroundColor: C.bg2 }}>
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold md:text-3xl">Deportes de aventura</h2>
        <p className="mt-2 text-sm" style={{ color: C.dim }}>Actividades guiadas en terreno, con equipamiento y seguridad profesional.</p>

        {loading ? (
          <p className="mt-8" style={{ color: C.dim }}>Cargando imágenes...</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {deportes.map((d, i) => (
              <motion.div
                key={d.nombre}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
                style={{ border: `1px solid ${C.border}` }}
              >
                {fotos[d.nombre] ? (
                  <img src={fotos[d.nombre]} alt={d.nombre} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: C.card }}>
                    <Compass className="h-10 w-10" color={C.emerald} />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <span className="text-sm font-bold" style={{ color: '#fff' }}>{d.nombre}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

