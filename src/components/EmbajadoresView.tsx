/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Award, Globe, BookOpen, Heart } from 'lucide-react';
import { GlobalCMSState } from '../types';

interface EmbajadoresViewProps {
  db: GlobalCMSState;
}

export default function EmbajadoresView({ db }: EmbajadoresViewProps) {
  return (
    <div id="embajadores-view" className="bg-brand-bg min-h-screen pt-16">
      
      {/* Header */}
      <section className="py-20 bg-brand-dark text-white text-center border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-green uppercase bg-white/10 px-3 py-1.5 rounded-full">Equipo Científico</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight">Nuestros Embajadores</h1>
          <p className="text-brand-bg/80 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-sans font-light">
            No te acompañan operadores turísticos, te acompañan biólogos, investigadores y fotógrafos dedicados activamente a defender la salud del territorio.
          </p>
        </div>
      </section>

      {/* Main Grid of Profiles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
        
        {db.embajadores.map((amb, idx) => (
          <div
            key={amb.id}
            className={`bg-white border border-brand-dark/5 rounded-3xl p-8 lg:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-12 items-center`}
          >
            {/* Guide Photo Column */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
              <img
                src={amb.photo}
                alt={amb.name}
                className="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded-full border-4 border-brand-bg shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="text-xl font-serif text-brand-dark">{amb.name}</h3>
                <span className="block text-xs font-mono text-brand-green font-bold uppercase mt-1">{amb.role}</span>
              </div>
            </div>

            {/* Guide Profile Specs Column */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Quote Block */}
              {amb.quote && (
                <p className="text-lg sm:text-xl font-serif text-brand-dark italic leading-relaxed border-l-4 border-brand-green pl-4 py-1">
                  "{amb.quote}"
                </p>
              )}

              {/* Bio */}
              <p className="text-brand-dark/75 text-xs sm:text-sm leading-relaxed font-sans font-light">
                {amb.bio}
              </p>

              {/* Spec tags bento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-brand-dark/5 font-sans">
                
                {/* Specialty */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-brand-dark/45 font-bold uppercase flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-brand-green" />
                    <span>Especialidad</span>
                  </span>
                  <span className="block text-xs text-brand-dark font-semibold">{amb.specialty}</span>
                </div>

                {/* Languages */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-brand-dark/45 font-bold uppercase flex items-center space-x-1.5">
                    <Globe className="w-3.5 h-3.5 text-brand-green" />
                    <span>Idiomas de campo</span>
                  </span>
                  <span className="block text-xs text-brand-dark font-semibold">{amb.languages.join(', ')}</span>
                </div>

                {/* Certifications */}
                {amb.certifications && amb.certifications.length > 0 && (
                  <div className="sm:col-span-2 space-y-1.5">
                    <span className="text-[10px] font-mono text-brand-dark/45 font-bold uppercase flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5 text-brand-green" />
                      <span>Certificaciones y Títulos</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {amb.certifications.map((cert, cIdx) => (
                        <span
                          key={cIdx}
                          className="px-2.5 py-1 bg-brand-bg text-brand-dark/70 border border-brand-dark/5 rounded-md text-[10px] font-semibold"
                        >
                          {cert}
                        </span>
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
