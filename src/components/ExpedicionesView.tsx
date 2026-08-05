/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Compass, Clock, Trophy, Users, ShieldAlert } from 'lucide-react';
import { GlobalCMSState } from '../types';

interface ExpedicionesViewProps {
  db: GlobalCMSState;
  onNavigate: (page: string) => void;
}

export default function ExpedicionesView({ db, onNavigate }: ExpedicionesViewProps) {
  const activeExpeditions = db.expediciones.filter(e => e.status === 'active');
  const soonExpeditions = db.expediciones.filter(e => e.status === 'soon');

  const handleNavigateWithScroll = (page: string, hash: string) => {
    window.location.hash = hash;
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="expediciones-view" className="bg-brand-bg min-h-screen pt-16">
      
      {/* Header */}
      <section className="py-20 bg-brand-dark text-white text-center border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-green uppercase bg-white/10 px-3 py-1.5 rounded-full">Exploración Regenerativa</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight">Expediciones de Conservación</h1>
          <p className="text-brand-bg/80 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-sans font-light">
            Cada viaje es un proyecto científico in-situ. Elige una experiencia interactiva para involucrarte activamente en la protección del territorio silvestre de Chile.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
        
        {/* Active Trips Section */}
        <div className="space-y-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-green block mb-1">Convocatorias Abiertas</span>
            <h2 className="text-2xl font-serif text-brand-dark">Aventuras Activas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeExpeditions.map((exp) => (
              <div
                key={exp.id}
                onClick={() => handleNavigateWithScroll('bosque-valdiviano', '#/expediciones/bosque-valdiviano')}
                className="bg-white border border-brand-dark/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={exp.featuredImage}
                    alt={exp.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-brand-green text-white font-mono text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/10">
                    Convocatoria Abierta • Cupos Limitados
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-brand-green font-bold uppercase">{exp.duration}</span>
                    <h3 className="text-2xl font-serif text-brand-dark group-hover:text-brand-green transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-brand-dark/75 text-xs sm:text-sm leading-relaxed font-sans font-light">
                      {exp.storySummary}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-brand-dark/5 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="flex flex-col items-center">
                      <Clock className="w-4 h-4 text-brand-dark/45 mb-1" />
                      <span className="text-[10px] text-brand-dark/45">Duración</span>
                      <span className="font-semibold text-brand-dark">{exp.duration.split('/')[0]}</span>
                    </div>
                    <div className="flex flex-col items-center border-x border-brand-dark/5">
                      <Trophy className="w-4 h-4 text-brand-dark/45 mb-1" />
                      <span className="text-[10px] text-brand-dark/45">Físico</span>
                      <span className="font-semibold text-brand-dark">{exp.physicalLevel}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Users className="w-4 h-4 text-brand-dark/45 mb-1" />
                      <span className="text-[10px] text-brand-dark/45">Precio</span>
                      <span className="font-semibold text-brand-dark">{exp.price}</span>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <button className="w-full bg-brand-dark text-white text-xs font-mono font-bold uppercase tracking-widest py-3.5 rounded-xl hover:bg-brand-green transition-colors cursor-pointer">
                      Ver Documental de la Experiencia
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Future Trips Section */}
        {soonExpeditions.length > 0 && (
          <div className="space-y-8 pt-12 border-t border-brand-dark/5">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-green block mb-1">Próximos Destinos</span>
              <h2 className="text-2xl font-serif text-brand-dark">Planificación 2027</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {soonExpeditions.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white border border-brand-dark/5 rounded-3xl p-6 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-brand-bg">
                      <img
                        src={exp.featuredImage}
                        alt={exp.title}
                        className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 transition-opacity"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-brand-dark text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
                        Próximamente
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-lg font-serif text-brand-dark">{exp.title}</h3>
                      <p className="text-xs text-brand-dark/65 leading-relaxed font-sans font-light">
                        {exp.storySummary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-brand-dark/5 flex items-center justify-between text-xs font-mono text-brand-dark/45">
                    <span>Apertura de Cupos 2027</span>
                    <button
                      onClick={() => handleNavigateWithScroll('contacto', '#/contacto')}
                      className="text-brand-green hover:text-brand-green-dark font-semibold cursor-pointer"
                    >
                      Recibir Aviso →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
