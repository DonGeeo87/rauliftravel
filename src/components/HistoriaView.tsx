import { Target, TreeEvergreen, Heartbeat } from '@phosphor-icons/react';
import { GlobalCMSState } from '../types';

interface HistoriaViewProps {
  db: GlobalCMSState;
}

const C = {
  bg: '#0a0f0d', bg2: '#101713', card: '#141c18',
  ink: '#eef5f1', dim: '#8ba093', emerald: '#38c98b',
  border: 'rgba(255,255,255,0.07)',
};

export default function HistoriaView({ db }: HistoriaViewProps) {
  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh', paddingTop: '96px' }}>

      {/* Header */}
      <section className="relative h-[45vh] w-full overflow-hidden flex items-center justify-center">
        <img src={db.historia.heroImage} alt="Raulif Bosque Ancestral" className="absolute inset-0 h-full w-full object-cover opacity-35" referrerPolicy="no-referrer" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,15,13,0.6) 0%, rgba(10,15,13,0.9) 100%)' }} />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{db.historia.title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed sm:text-base" style={{ color: C.dim }}>{db.historia.subtitle}</p>
        </div>
      </section>

      {/* Origen */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <div className="space-y-6 text-base leading-relaxed" style={{ color: C.dim }}>
          <p className="text-xl font-semibold" style={{ color: C.ink }}>{db.historia.originText1}</p>
          <p className="font-light">{db.historia.originText2}</p>
        </div>
      </section>

      {/* Simbolismo */}
      <section className="py-20" style={{ backgroundColor: C.bg2, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-6">
              <h2 className="text-3xl font-bold tracking-tight">{db.historia.symbolTitle}</h2>
              <p className="text-sm leading-relaxed" style={{ color: C.dim }}>{db.historia.symbolText}</p>
              <div className="grid grid-cols-2 gap-4 pt-4 text-xs">
                <div className="rounded-xl border p-4" style={{ borderColor: C.border, backgroundColor: C.card }}>
                  <strong className="mb-1 block font-bold uppercase tracking-wider" style={{ color: C.emerald }}>RAULÍ</strong>
                  <span className="leading-relaxed" style={{ color: C.dim }}>Árbol imponente de los bosques templados del sur de Chile, símbolo de arraigo ecológico.</span>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: C.border, backgroundColor: C.card }}>
                  <strong className="mb-1 block font-bold uppercase tracking-wider" style={{ color: C.emerald }}>LETRA F</strong>
                  <span className="leading-relaxed" style={{ color: C.dim }}>Compromiso con las Futuras Generaciones que heredarán la biosfera.</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-3xl border p-6 text-center" style={{ borderColor: C.border, backgroundColor: C.bg }}>
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border" style={{ borderColor: C.border, backgroundColor: 'rgba(56,201,139,0.08)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={C.emerald} strokeWidth="2" className="h-12 w-12">
                    <path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 3.5 7.5L12 22l6.5-2.5C20.5 17.5 22 15 22 12c0-5.5-4.5-10-10-10z" />
                    <line x1="12" y1="6" x2="12" y2="18" strokeWidth="2.5" />
                  </svg>
                </div>
                <span className="text-lg font-bold tracking-widest">RAULIF</span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: C.emerald }}>Conocer para proteger</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misión, Visión, Filosofía */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-3xl border p-8" style={{ borderColor: C.border, backgroundColor: C.card }}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(56,201,139,0.1)' }}>
                <Target className="h-5 w-5" color={C.emerald} />
              </div>
              <h3 className="text-lg font-bold">Misión</h3>
              <p className="mt-3 text-xs leading-relaxed" style={{ color: C.dim }}>{db.historia.missionText}</p>
            </div>
            <div className="rounded-3xl border p-8" style={{ borderColor: C.border, backgroundColor: C.card }}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(56,201,139,0.1)' }}>
                <TreeEvergreen className="h-5 w-5" color={C.emerald} />
              </div>
              <h3 className="text-lg font-bold">Visión</h3>
              <p className="mt-3 text-xs leading-relaxed" style={{ color: C.dim }}>{db.historia.visionText}</p>
            </div>
            <div className="rounded-3xl border p-8" style={{ borderColor: C.border, backgroundColor: C.card }}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(56,201,139,0.1)' }}>
                <Heartbeat className="h-5 w-5" color={C.emerald} />
              </div>
              <h3 className="text-lg font-bold">Filosofía</h3>
              <p className="mt-3 text-xs leading-relaxed" style={{ color: C.dim }}>{db.historia.philosophyText}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
