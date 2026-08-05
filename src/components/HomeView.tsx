/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormEvent } from 'react';
import { Compass, BookOpen, Heart, ArrowRight, ShieldCheck, Mail, CheckCircle } from 'lucide-react';
import { GlobalCMSState, Expedition } from '../types';

interface HomeViewProps {
  db: GlobalCMSState;
  onNavigate: (page: string) => void;
  onSubscribe: (email: string) => void;
  subStatus: { submitted: boolean; error: string };
}

export default function HomeView({ db, onNavigate, onSubscribe, subStatus }: HomeViewProps) {
  const activeExpeditions = db.expediciones.filter(e => e.status === 'active');
  const soonExpeditions = db.expediciones.filter(e => e.status === 'soon');

  const handleSubscribeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    onSubscribe(email);
    e.currentTarget.reset();
  };

  const handleNavigateWithScroll = (page: string, hash: string) => {
    window.location.hash = hash;
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="home-view" className="bg-brand-bg min-h-screen pt-16">
      
      {/* 1. HERO HEROIC BANNER (National Geographic Vibe) */}
      <section id="hero-section" className="relative h-screen w-full overflow-hidden bg-brand-dark flex items-center justify-center">
        <img
          src={db.home.heroImage}
          alt="Chilean Patagonia Raulif Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105 animate-subtle-zoom"
          referrerPolicy="no-referrer"
        />
        {/* Subtle vignette gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/50 via-transparent to-brand-dark/90" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center text-white space-y-6">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-green uppercase bg-brand-bg/15 px-4 py-2 rounded-full border border-brand-green/20">
            Comunidad Europea de Conservación
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-normal leading-tight tracking-tight max-w-4xl mx-auto">
            {db.home.heroTitle}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-brand-bg/80 font-sans max-w-2xl mx-auto leading-relaxed font-light">
            {db.home.heroSubtitle}
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleNavigateWithScroll('bosque-valdiviano', '#/expediciones/bosque-valdiviano')}
              className="w-full sm:w-auto bg-brand-green hover:bg-brand-green-dark text-white text-xs font-mono font-bold uppercase tracking-widest px-8 py-4.5 rounded-full shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Descubre la primera Expedición</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => handleNavigateWithScroll('historia', '#/historia')}
              className="w-full sm:w-auto bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-xs font-mono font-bold uppercase tracking-widest px-8 py-4.5 rounded-full border border-white/20 transition-colors cursor-pointer"
            >
              Nuestra Historia
            </button>
          </div>
        </div>
      </section>

      {/* 2. MANIFESTO & PHILOSOPHY (The Core Narrative) */}
      <section id="manifesto-section" className="py-24 sm:py-32 bg-brand-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-green">Nuestra Razón de Ser</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-brand-dark max-w-2xl mx-auto leading-tight">
            {db.home.missionTitle}
          </h2>
          <blockquote className="text-2xl sm:text-3.5xl font-serif italic text-brand-green leading-relaxed max-w-3xl mx-auto font-light">
            "{db.home.missionQuote}"
          </blockquote>
          <p className="text-brand-dark/75 text-sm leading-relaxed max-w-2xl mx-auto font-sans">
            {db.home.missionText}
          </p>
          <div className="pt-4">
            <button
              onClick={() => handleNavigateWithScroll('historia', '#/historia')}
              className="text-brand-dark text-xs font-mono font-bold uppercase tracking-widest hover:text-brand-green transition-colors flex items-center justify-center space-x-2 mx-auto cursor-pointer"
            >
              <span>Profundizar en nuestra filosofía</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. CORE STORY PREVIEW (Meaning of Raulif, Logo symbol) */}
      <section id="story-preview-section" className="py-24 bg-white border-y border-brand-dark/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-green">Simbolismo Originario</span>
              <h2 className="text-3xl font-serif text-brand-dark tracking-tight">{db.home.storyPreviewTitle}</h2>
              <p className="text-brand-dark/75 text-sm leading-relaxed font-sans">{db.home.storyPreviewText}</p>
              
              <div className="p-6 bg-brand-bg border border-brand-dark/5 rounded-2xl flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5"
                  >
                    <path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 3.5 7.5L12 22l6.5-2.5C20.5 17.5 22 15 22 12c0-5.5-4.5-10-10-10z" />
                    <line x1="12" y1="6" x2="12" y2="18" strokeWidth="2.5" className="text-brand-green" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-dark font-sans">Huella Digital Colectiva</h4>
                  <p className="text-xs text-brand-dark/65 mt-1 leading-relaxed">
                    Nuestra huella representa el impacto indeleble de nuestras aventuras. Trabajamos para asegurarnos de que esta marca sea eternamente positiva para los bosques y las futuras generaciones de Chile.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleNavigateWithScroll('historia', '#/historia')}
                  className="text-brand-dark text-xs font-mono font-bold uppercase tracking-widest hover:text-brand-green transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <span>Conocer la historia completa</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <img
                src={db.home.storyPreviewImage}
                alt="Bosque lluvioso nativo chile"
                className="w-full aspect-[4/3] object-cover rounded-3xl shadow-sm border border-brand-dark/5 grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 4. ACTIVE EXPEDITIONS DISPLAY (Experiences Catalog) */}
      <section id="expeditions-section" className="py-24 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-green">Catálogo de Conservación</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-brand-dark mt-2">
              Expediciones de Impacto Silvestre
            </h2>
            <p className="text-brand-dark/60 max-w-xl mx-auto mt-3 text-sm font-sans">
              No vendemos planes turísticos. Diseñamos documentales de campo activos guiados por directores científicos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Active Expedition Card */}
            {activeExpeditions.map((exp) => (
              <div
                key={exp.id}
                id={`home-exp-card-${exp.id}`}
                className="bg-white border border-brand-dark/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
                onClick={() => handleNavigateWithScroll('bosque-valdiviano', '#/expediciones/bosque-valdiviano')}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={exp.featuredImage}
                    alt={exp.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-brand-green text-white font-mono text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                    Convocatoria Abierta
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-brand-green font-bold uppercase">{exp.duration}</span>
                    <h3 className="text-lg font-bold text-brand-dark group-hover:text-brand-green transition-colors font-sans uppercase">
                      {exp.title}
                    </h3>
                    <p className="text-xs text-brand-dark/70 leading-relaxed line-clamp-3">
                      {exp.storySummary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-brand-dark/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-brand-dark/60">Dificultad: <strong className="text-brand-dark">{exp.physicalLevel}</strong></span>
                    <span className="text-brand-green font-bold">{exp.price}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Soon/Upcoming Expeditions Card */}
            {soonExpeditions.map((exp) => (
              <div
                key={exp.id}
                className="bg-white border border-brand-dark/5 rounded-3xl overflow-hidden p-6 flex flex-col justify-between relative group"
              >
                <div className="space-y-4">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-brand-bg">
                    <img
                      src={exp.featuredImage}
                      alt={exp.title}
                      className="w-full h-full object-cover grayscale opacity-30 transition-all duration-700 group-hover:opacity-50"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-brand-dark/10" />
                    <div className="absolute top-4 left-4 bg-brand-dark/70 text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
                      Próximamente
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-brand-dark/40 font-bold uppercase">Temporada 2027</span>
                    <h3 className="text-base font-bold text-brand-dark font-sans uppercase">{exp.title}</h3>
                    <p className="text-xs text-brand-dark/60 leading-relaxed line-clamp-2">
                      {exp.storySummary}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-brand-dark/10 flex items-center justify-between text-[11px] font-mono text-brand-dark/40">
                  <span>Inscripciones Cerradas</span>
                  <button
                    onClick={() => handleNavigateWithScroll('contacto', '#/contacto')}
                    className="text-brand-green hover:text-brand-green-dark font-semibold cursor-pointer"
                  >
                    Consultar →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE ECOLOGICAL IMPACT TRACKER */}
      <section id="impact-tracker-section" className="py-24 bg-brand-dark text-white border-y border-brand-dark relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,90,39,0.08),transparent)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-green">Motor de Impacto Activo</span>
              <h2 className="text-3xl font-serif text-white tracking-tight">La Transparencia en Cifras</h2>
              <p className="text-brand-bg/70 text-sm leading-relaxed font-sans">
                {db.impacto.summary}
              </p>
              
              <div className="pt-4">
                <button
                  onClick={() => handleNavigateWithScroll('impacto', '#/impacto')}
                  className="bg-brand-green hover:bg-brand-green-dark text-white text-xs font-mono font-bold uppercase tracking-widest px-6 py-3.5 rounded-full transition-colors inline-flex items-center space-x-2 cursor-pointer"
                >
                  <span>Ver Proyectos de Impacto</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/5 p-6 rounded-3xl relative">
                <span className="block text-4xl font-serif text-brand-green">{db.impacto.reforestedCount}+</span>
                <span className="block text-xs font-bold text-brand-bg mt-2 font-sans uppercase tracking-wider">Árboles Nativos Sembrados</span>
                <span className="block text-[10px] text-brand-bg/50 mt-1 font-sans">En cuencas costeras vulnerables</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-6 rounded-3xl relative">
                <span className="block text-4xl font-serif text-brand-green">{db.impacto.schoolsSupported}</span>
                <span className="block text-xs font-bold text-brand-bg mt-2 font-sans uppercase tracking-wider">Colegios Rurales Apoyados</span>
                <span className="block text-[10px] text-brand-bg/50 mt-1 font-sans">Programas de educación ambiental</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-6 rounded-3xl relative">
                <span className="block text-4xl font-serif text-brand-green">{db.impacto.conservedHectares} ha</span>
                <span className="block text-xs font-bold text-brand-bg mt-2 font-sans uppercase tracking-wider">Área Silvestre Bajo Monitoreo</span>
                <span className="block text-[10px] text-brand-bg/50 mt-1 font-sans">Red de cámaras infrarrojas activas</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. EMBAJADORES PREVIEW (The Field Directors) */}
      <section id="guides-preview-section" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-green">Dirección Científica</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-brand-dark mt-2">
              Embajadores del Territorio
            </h2>
            <p className="text-brand-dark/60 max-w-md mx-auto mt-3 text-sm font-sans">
              Nuestros guías son doctores en ecología, fotógrafos galardonados y biólogos activos comprometidos con la divulgación científica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {db.embajadores.slice(0, 2).map((amb) => (
              <div key={amb.id} className="bg-brand-bg border border-brand-dark/5 rounded-3xl p-6 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <img
                  src={amb.photo}
                  alt={amb.name}
                  className="w-24 h-24 object-cover rounded-full shrink-0 border border-brand-dark/10"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-2 text-center sm:text-left">
                  <h3 className="text-base font-bold text-brand-dark font-sans">{amb.name}</h3>
                  <span className="block text-[10px] font-mono text-brand-green uppercase font-bold">{amb.role}</span>
                  <p className="text-xs text-brand-dark/60 leading-relaxed font-sans line-clamp-3">
                    {amb.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-12 text-center">
            <button
              onClick={() => handleNavigateWithScroll('embajadores', '#/embajadores')}
              className="text-brand-dark text-xs font-mono font-bold uppercase tracking-widest hover:text-brand-green transition-colors flex items-center justify-center space-x-2 mx-auto cursor-pointer"
            >
              <span>Ver fichas de embajadores completas</span>
              <span>→</span>
            </button>
          </div>

        </div>
      </section>

      {/* 7. NEWSLETTER BLOCK (Conversion Engine) */}
      <section id="newsletter-section" className="py-24 bg-brand-bg border-t border-brand-dark/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-green">El Latido de la Selva</span>
          <h2 className="text-3xl font-serif text-brand-dark">Únete a la Lista de Selección Prioritaria</h2>
          <p className="text-brand-dark/70 text-sm leading-relaxed max-w-xl mx-auto">
            Recibe crónicas de conservación científica, reportajes fotográficos de expedición y entérate de las convocatorias prioritarias para Chile antes del lanzamiento oficial.
          </p>

          <div className="max-w-md mx-auto pt-4">
            {subStatus.submitted ? (
              <div className="bg-brand-green/10 border border-brand-green/20 rounded-2xl p-6 text-center text-brand-green-dark space-y-2">
                <CheckCircle className="w-8 h-8 text-brand-green mx-auto" />
                <h4 className="font-bold text-sm">¡Registro completo en nuestra comunidad!</h4>
                <p className="text-xs text-brand-green-dark/80">Te enviaremos los primeros avances e informes de conservación pronto.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribeSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Tu correo electrónico"
                    className="w-full bg-white border border-brand-dark/10 rounded-full px-6 py-3.5 text-sm text-brand-dark placeholder-brand-dark/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                  />
                  <button
                    type="submit"
                    className="bg-brand-green text-white text-xs font-mono font-bold uppercase tracking-widest px-8 py-3.5 rounded-full hover:bg-brand-green-dark transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Unirse a la Huella
                  </button>
                </div>
                {subStatus.error && <p className="text-xs text-red-500 font-sans">{subStatus.error}</p>}
                <div className="flex items-center justify-center space-x-1.5 text-[10px] text-brand-dark/50">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                  <span>Respetamos tu privacidad. Sin spam. Cancela cuando quieras.</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
