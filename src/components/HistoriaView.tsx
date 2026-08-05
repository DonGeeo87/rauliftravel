/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, Target, Heart, Leaf } from 'lucide-react';
import { GlobalCMSState } from '../types';

interface HistoriaViewProps {
  db: GlobalCMSState;
}

export default function HistoriaView({ db }: HistoriaViewProps) {
  return (
    <div id="historia-view" className="bg-brand-bg min-h-screen pt-16">
      
      {/* Editorial Header Banner */}
      <section className="relative h-[45vh] w-full overflow-hidden bg-brand-dark flex items-center justify-center">
        <img
          src={db.historia.heroImage}
          alt="Raulif Bosque Ancestral"
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-brand-dark/60" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative text-center text-white space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-green uppercase bg-white/10 px-3.5 py-1.5 rounded-full">Génesis • Propósito</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-normal tracking-tight">
            {db.historia.title}
          </h1>
          <p className="text-brand-bg/80 max-w-xl mx-auto text-sm sm:text-base font-sans font-light leading-relaxed">
            {db.historia.subtitle}
          </p>
        </div>
      </section>

      {/* 2. THE CHRONOLOGY OF THE STARTUP */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="space-y-8 text-brand-dark/80 text-base leading-relaxed font-sans">
          <p className="text-xl text-brand-dark font-serif italic">
            {db.historia.originText1}
          </p>
          <p className="font-light">
            {db.historia.originText2}
          </p>
        </div>
      </section>

      {/* 3. SYMBOLISM & NAMING STUDY */}
      <section className="py-24 bg-white border-y border-brand-dark/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-green">Identidad Corporativa</span>
              <h2 className="text-3xl font-serif text-brand-dark tracking-tight">
                {db.historia.symbolTitle}
              </h2>
              <p className="text-brand-dark/75 text-sm leading-relaxed font-sans">
                {db.historia.symbolText}
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 font-sans text-xs">
                <div className="p-4 bg-brand-bg border border-brand-dark/5 rounded-xl">
                  <strong className="block text-brand-dark uppercase tracking-wider font-bold mb-1">RAULÍ</strong>
                  <span className="text-brand-dark/60">Árbol imponente de los bosques templados del sur de Chile, símbolo de arraigo ecológico profundo.</span>
                </div>
                <div className="p-4 bg-brand-bg border border-brand-dark/5 rounded-xl">
                  <strong className="block text-brand-dark uppercase tracking-wider font-bold mb-1">LETRA F</strong>
                  <span className="text-brand-dark/60">Compromiso absoluto e irrenunciable con las Futuras Generaciones que heredarán la biosfera.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative p-6 bg-brand-dark text-white rounded-3xl overflow-hidden flex flex-col items-center justify-center aspect-[4/3] text-center border border-white/5">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-brand-green mb-6 border border-white/10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-12 h-12"
                  >
                    <path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 3.5 7.5L12 22l6.5-2.5C20.5 17.5 22 15 22 12c0-5.5-4.5-10-10-10z" />
                    <line x1="12" y1="6" x2="12" y2="18" strokeWidth="2.5" className="text-brand-green" />
                  </svg>
                </div>
                <span className="text-lg font-bold tracking-widest">RAULIF SYSTEM</span>
                <span className="text-[10px] font-mono text-brand-bg/40 uppercase tracking-widest mt-1">Conocer para proteger • 20-Años Visión</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. MISSION, VISION, PHILOSOPHY (SOLID PILLARS) */}
      <section className="py-24 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Mision */}
            <div className="bg-white border border-brand-dark/5 rounded-3xl p-8 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif text-brand-dark">Misión</h3>
              <p className="text-brand-dark/70 text-xs leading-relaxed font-sans">
                {db.historia.missionText}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white border border-brand-dark/5 rounded-3xl p-8 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif text-brand-dark">Visión a 20 Años</h3>
              <p className="text-brand-dark/70 text-xs leading-relaxed font-sans">
                {db.historia.visionText}
              </p>
            </div>

            {/* Philosophy */}
            <div className="bg-white border border-brand-dark/5 rounded-3xl p-8 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif text-brand-dark">Filosofía</h3>
              <p className="text-brand-dark/70 text-xs leading-relaxed font-sans">
                {db.historia.philosophyText}
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
