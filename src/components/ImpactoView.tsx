import { motion } from 'motion/react';
import { TreeEvergreen, Heartbeat, Wind, HandHeart, SealCheck, ChartLine, Recycle } from '@phosphor-icons/react';

const C = {
  bg: '#0a0f0d', bg2: '#101713', card: '#141c18',
  ink: '#eef5f1', dim: '#8ba093', emerald: '#38c98b', amber: '#e8a54a',
  border: 'rgba(255,255,255,0.07)',
};

const IMPACTOS = [
  { icon: TreeEvergreen, titulo: 'Conservación', texto: 'Parte de la utilidad de cada salida se reserva para proyectos de conservación con reporte transparente.' },
  { icon: Recycle, titulo: 'Cero greenwashing', texto: 'Publicamos qué se destinó y a dónde, salida por salida. La transparencia es el estándar.' },
  { icon: HandHeart, titulo: 'Cultura local', texto: 'Experiencias con pueblos originarios, cocina, cosechas y flora sagrada que respetan y visibilizan su sabiduría.' },
  { icon: ChartLine, titulo: 'Medición real', texto: 'El impacto no se promete, se mide y se reporta con la utilidad concreta de cada expedición.' },
];

export default function ImpactoView({ db }: { db?: any }) {
  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh', paddingTop: '96px' }}>
      <div className="mx-auto max-w-6xl px-6 pb-20 md:px-12">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold" style={{ borderColor: C.border, color: C.emerald }}>
            <Heartbeat className="h-3.5 w-3.5" weight="fill" /> Impacto con propósito
          </span>
          <h1 className="mt-5 text-3xl font-black md:text-4xl">Parte de la utilidad, destinada a conservación</h1>
          <p className="mt-4 text-sm leading-relaxed md:text-base" style={{ color: C.dim }}>
            No operamos reforestación propia ni plantamos banderas de marketing. Reservamos un porcentaje de la utilidad de cada salida y lo destinamos a proyectos reales de conservación y cultura local, con total transparencia.
          </p>
        </div>

        {/* Cifras */}
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: TreeEvergreen, n: '5%', t: 'de utilidad por salida', d: 'reservado a conservación' },
            { icon: Wind, n: '100%', t: 'guias especializados', d: 'en cada territorio' },
            { icon: SealCheck, n: 'Cero', t: 'greenwashing', d: 'reportes por cada salida' },
          ].map((s) => (
            <motion.div key={s.t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }} className="rounded-2xl border p-6" style={{ borderColor: C.border, backgroundColor: C.card }}>
              <s.icon className="mb-4 h-8 w-8" weight="duotone" color={C.emerald} />
              <p className="text-4xl font-black" style={{ color: C.emerald }}>{s.n}</p>
              <p className="mt-2 font-semibold">{s.t}</p>
              <p className="text-sm" style={{ color: C.dim }}>{s.d}</p>
            </motion.div>
          ))}
        </div>

        {/* Principios */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {IMPACTOS.map((imp, i) => (
            <motion.div key={imp.titulo} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: i * 0.06 }} className="flex gap-4 rounded-2xl border p-6" style={{ borderColor: C.border, backgroundColor: C.bg2 }}>
              <imp.icon className="h-8 w-8 shrink-0" weight="duotone" color={C.emerald} />
              <div>
                <h3 className="font-bold">{imp.titulo}</h3>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: C.dim }}>{imp.texto}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Callout */}
        <div className="mt-12 rounded-2xl border p-6 md:p-8" style={{ borderColor: 'rgba(56,201,139,0.3)', backgroundColor: 'rgba(56,201,139,0.06)' }}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Wind className="h-10 w-10 shrink-0" weight="duotone" color={C.emerald} />
            <div>
              <h3 className="text-lg font-bold">Viajar es proteger lo que conoces</h3>
              <p className="mt-1 text-sm" style={{ color: C.dim }}>
                Cada expedición es una forma directa de financiar la conservación del territorio chileno y de visibilizar a sus comunidades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
