import { Trophy, Globe, BookOpenText, Microscope, Camera } from '@phosphor-icons/react';
import { GlobalCMSState } from '../types';

interface EmbajadoresViewProps {
  db: GlobalCMSState;
}

const C = {
  bg: '#0a0f0d', bg2: '#101713', card: '#141c18',
  ink: '#eef5f1', dim: '#8ba093', emerald: '#38c98b',
  border: 'rgba(255,255,255,0.07)',
};

export default function EmbajadoresView({ db }: EmbajadoresViewProps) {
  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh', paddingTop: '96px' }}>

      {/* Header */}
      <section className="border-b px-4 py-16 text-center sm:px-6" style={{ borderColor: C.border, backgroundColor: C.bg2 }}>
        <div className="mx-auto max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold" style={{ borderColor: C.border, color: C.emerald }}>
            <Microscope className="h-3.5 w-3.5" /> Equipo científico
          </span>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Nuestros guías</h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed" style={{ color: C.dim }}>
            No te acompañan operadores turísticos, te acompañan biólogos, investigadores y fotógrafos dedicados a defender la salud del territorio.
          </p>
        </div>
      </section>

      {/* Perfiles */}
      <div className="mx-auto max-w-7xl space-y-16 px-4 py-20 sm:px-6 lg:px-8">
        {db.embajadores.map((amb) => (
          <div key={amb.id} className="grid grid-cols-1 items-center gap-12 rounded-3xl border p-8 lg:grid-cols-12 lg:p-12" style={{ borderColor: C.border, backgroundColor: C.bg2 }}>
            {/* Foto */}
            <div className="flex flex-col items-center space-y-4 text-center lg:col-span-4">
              <img src={amb.photo} alt={amb.name} className="h-48 w-48 rounded-full border-4 object-cover sm:h-56 sm:w-56" style={{ borderColor: 'rgba(56,201,139,0.3)' }} referrerPolicy="no-referrer" />
              <div>
                <h3 className="text-xl font-bold">{amb.name}</h3>
                <span className="mt-1 block text-xs font-bold uppercase tracking-wider" style={{ color: C.emerald }}>{amb.role}</span>
              </div>
            </div>

            {/* Perfil */}
            <div className="space-y-6 lg:col-span-8">
              {amb.quote && (
                <p className="border-l-4 py-1 pl-4 text-lg italic leading-relaxed" style={{ borderColor: C.emerald, color: '#c4d4cb' }}>"{amb.quote}"</p>
              )}
              <p className="text-sm leading-relaxed" style={{ color: C.dim }}>{amb.bio}</p>

              <div className="grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-2" style={{ borderColor: C.border }}>
                <div className="space-y-1.5">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(139,160,147,0.6)' }}>
                    <BookOpenText className="h-3.5 w-3.5" color={C.emerald} /> Especialidad
                  </span>
                  <span className="block text-xs font-semibold">{amb.specialty}</span>
                </div>
                <div className="space-y-1.5">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(139,160,147,0.6)' }}>
                    <Globe className="h-3.5 w-3.5" color={C.emerald} /> Idiomas
                  </span>
                  <span className="block text-xs font-semibold">{amb.languages.join(', ')}</span>
                </div>
                {amb.certifications && amb.certifications.length > 0 && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(139,160,147,0.6)' }}>
                      <Trophy className="h-3.5 w-3.5" color={C.emerald} /> Títulos y certificaciones
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {amb.certifications.map((cert, cIdx) => (
                        <span key={cIdx} className="rounded-md border px-2.5 py-1 text-[10px] font-semibold" style={{ borderColor: C.border, color: C.dim }}>{cert}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
