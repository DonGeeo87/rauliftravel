/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HeartHandshake, Check, ShieldCheck, MapPin } from 'lucide-react';
import { GlobalCMSState } from '../types';

interface ImpactoViewProps {
  db: GlobalCMSState;
}

export default function ImpactoView({ db }: ImpactoViewProps) {
  return (
    <div id="impacto-view" className="bg-brand-bg min-h-screen pt-16">
      
      {/* Header */}
      <section className="py-20 bg-brand-dark text-white text-center border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-green uppercase bg-white/10 px-3 py-1.5 rounded-full">Transparencia • Motor de Impacto</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight">Resultados e Impacto Real</h1>
          <p className="text-brand-bg/80 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-sans font-light">
            Creemos en la contabilidad honesta del territorio. Todo el capital procedente de membresías y donaciones financia de manera exclusiva los hitos que verás a continuación.
          </p>
        </div>
      </section>

      {/* Main Stats Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="bg-white border border-brand-dark/5 p-8 rounded-3xl text-center shadow-sm">
            <span className="block text-5xl font-serif font-normal text-brand-green">{db.impacto.reforestedCount}+</span>
            <span className="block text-sm font-semibold text-brand-dark mt-3 uppercase tracking-wide font-sans">Árboles Nativos Sembrados</span>
            <p className="text-xs text-brand-dark/65 mt-2 font-sans leading-relaxed font-light">
              Plántulas endémicas cultivadas en cooperativas comunitarias y sembradas en áreas devastadas.
            </p>
          </div>
          <div className="bg-white border border-brand-dark/5 p-8 rounded-3xl text-center shadow-sm">
            <span className="block text-5xl font-serif font-normal text-brand-green">{db.impacto.schoolsSupported}</span>
            <span className="block text-sm font-semibold text-brand-dark mt-3 uppercase tracking-wide font-sans">Escuelas Rurales Apoyadas</span>
            <p className="text-xs text-brand-dark/65 mt-2 font-sans leading-relaxed font-light">
              Becas completas de educación ambiental y salidas científicas para niños locales.
            </p>
          </div>
          <div className="bg-white border border-brand-dark/5 p-8 rounded-3xl text-center shadow-sm">
            <span className="block text-5xl font-serif font-normal text-brand-green">{db.impacto.conservedHectares} ha</span>
            <span className="block text-sm font-semibold text-brand-dark mt-3 uppercase tracking-wide font-sans">Área en Monitoreo de Fauna</span>
            <p className="text-xs text-brand-dark/65 mt-2 font-sans leading-relaxed font-light">
              Mapeo de corredores biológicos mediante red infrarroja activa para proteger al pudú.
            </p>
          </div>
        </div>
      </div>

      {/* Narrative Section with specific projects */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-green block mb-1">Métricas Detalladas</span>
          <h2 className="text-2xl font-serif text-brand-dark">Nuestros Proyectos de Campo Activos</h2>
        </div>

        <div className="space-y-16">
          {db.impacto.projects.map((proj, idx) => (
            <div
              key={proj.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-t border-brand-dark/5 pt-16 ${
                idx === 0 ? 'border-t-0 pt-0' : ''
              }`}
            >
              {/* Project Visual Card */}
              <div className={`lg:col-span-5 relative overflow-hidden rounded-3xl ${idx % 2 === 1 ? 'lg:order-last' : ''}`}>
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full aspect-[4/3] object-cover rounded-3xl shadow-sm border border-brand-dark/5"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-brand-dark/90 backdrop-blur-sm text-white font-mono text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-green" />
                  <span>{proj.location}</span>
                </div>
              </div>

              {/* Project Explanation Card */}
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[10px] font-mono text-brand-green font-bold uppercase bg-brand-green/10 px-2.5 py-1 rounded-md border border-brand-green/15">
                  {proj.category}
                </span>
                <h3 className="text-2xl font-serif text-brand-dark">
                  {proj.title}
                </h3>
                <p className="text-brand-dark/85 font-serif italic text-base leading-relaxed">
                  "{proj.description}"
                </p>
                <p className="text-brand-dark/75 text-xs sm:text-sm leading-relaxed font-sans font-light">
                  {proj.details}
                </p>

                <div className="p-4 bg-brand-bg rounded-2xl flex items-center space-x-4 border border-brand-dark/5 max-w-md">
                  <div className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-lg">
                    {proj.metricValue.includes('+') ? '+' : ''}
                  </div>
                  <div>
                    <span className="block text-xs font-mono font-bold text-brand-dark uppercase">Hito alcanzado</span>
                    <span className="block text-sm font-semibold text-brand-dark/70">{proj.metricValue} {proj.metricLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legal & audit note */}
        <div className="bg-white border border-brand-dark/5 rounded-2xl p-6 flex items-start space-x-4 text-xs max-w-3xl mx-auto">
          <ShieldCheck className="w-6 h-6 text-brand-green shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-serif text-lg text-brand-dark">Compromiso de Auditoría Ambiental Abierta</h4>
            <p className="text-brand-dark/75 leading-relaxed font-sans font-light">
              La transparencia es nuestro motor de confianza. Los fondos recaudados a través de las expediciones, patrocinios y membresías se asocian de forma biunívoca con coordenadas geográficas georreferenciadas de plantación de árboles nativos y auditorías contables públicas. Puedes consultar todos los movimientos contables contactando a nuestro equipo.
            </p>
          </div>
        </div>

      </section>

    </div>
  );
}
