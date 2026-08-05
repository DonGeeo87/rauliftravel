/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ChangeEvent, FormEvent } from 'react';
import { Calendar, Clock, Trophy, Users, Check, X, ChevronDown, ChevronUp, MapPin, Award, BookOpen, Send, CheckCircle, ShieldCheck } from 'lucide-react';
import { getCMSState, saveCMSState } from '../lib/cmsState';
import { Expedition } from '../types';

interface InteractiveDocumentaryProps {
  expedition: Expedition;
  onNavigate: (page: string) => void;
}

export default function InteractiveDocumentary({ expedition, onNavigate }: InteractiveDocumentaryProps) {
  // Waitlist Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: expedition.dates[0] || 'Próxima convocatoria 2026/2027',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  // Itinerary Active Day State
  const [activeDay, setActiveDay] = useState<number>(0);

  // FAQ open indexes
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWaitlistSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.email || !formData.phone) {
      setFormError('Por favor, rellena todos los campos obligatorios (*).');
      return;
    }

    if (!formData.email.includes('@')) {
      setFormError('El correo electrónico no parece ser válido.');
      return;
    }

    const state = getCMSState();

    // Check if email already on waitlist for this expedition
    const exists = state.waitlist.some(
      lead => lead.email.toLowerCase() === formData.email.toLowerCase() && lead.expeditionId === expedition.id
    );

    if (exists) {
      setFormError('Ya te has registrado en la lista de espera para esta expedición. ¡Te contactaremos pronto!');
      return;
    }

    // Add waitlist entry
    const newWaitlistLead = {
      id: `wait-${Date.now()}`,
      expeditionId: expedition.id,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      preferredDate: formData.preferredDate,
      notes: formData.notes.trim(),
      createdAt: new Date().toISOString()
    };

    state.waitlist.push(newWaitlistLead);
    saveCMSState(state);

    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      preferredDate: expedition.dates[0] || '',
      notes: ''
    });
  };

  const guide = getCMSState().embajadores.find(g => g.id === expedition.responsibleGuideId) || {
    name: 'Guía Raulif',
    role: 'Guía Científico',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    quote: ''
  };

  return (
    <div id="expedicion-bosque-valdiviano" className="bg-brand-bg min-h-screen pt-16">
      
      {/* 1. IMMERSIVE HERO BANNERS */}
      <div className="relative h-[85vh] w-full overflow-hidden bg-brand-dark">
        <img
          src={expedition.featuredImage}
          alt={expedition.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 animate-subtle-zoom"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20 text-left">
            <span className="inline-block px-3 py-1 bg-brand-green/20 text-brand-green border border-brand-green/35 text-xs font-mono font-bold tracking-widest uppercase rounded-full mb-4">
              Primera Convocatoria • Exclusivo
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-white max-w-4xl">
              {expedition.title}
            </h1>
            <p className="text-lg sm:text-xl text-brand-bg/85 font-normal max-w-2xl mt-4 font-serif leading-relaxed">
              {expedition.subtitle}
            </p>
            
            {/* Rapid Info Tags */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl bg-brand-dark/60 backdrop-blur-sm border border-white/5 p-6 rounded-2xl">
              <div className="flex items-center space-x-3 text-stone-200">
                <Clock className="w-5 h-5 text-brand-green shrink-0" />
                <div>
                  <span className="block text-[10px] font-mono text-brand-bg/50 uppercase">Duración</span>
                  <span className="text-sm font-semibold">{expedition.duration}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-stone-200">
                <Trophy className="w-5 h-5 text-brand-green shrink-0" />
                <div>
                  <span className="block text-[10px] font-mono text-brand-bg/50 uppercase">Dificultad</span>
                  <span className="text-sm font-semibold">Nivel {expedition.physicalLevel}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-stone-200">
                <Users className="w-5 h-5 text-brand-green shrink-0" />
                <div>
                  <span className="block text-[10px] font-mono text-brand-bg/50 uppercase">Capacidad</span>
                  <span className="text-sm font-semibold">Máx. {expedition.maxGroupSize} exploradores</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-stone-200">
                <Calendar className="w-5 h-5 text-brand-green shrink-0" />
                <div>
                  <span className="block text-[10px] font-mono text-brand-bg/50 uppercase">Aporte Sostenible</span>
                  <span className="text-sm font-semibold">25 árboles nativos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PREFATORY SECTION & INTENT */}
      <div className="py-24 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-green mb-4">El Manifiesto de la Expedición</h2>
        <p className="text-2xl sm:text-3xl font-serif text-brand-dark leading-relaxed italic">
          "{expedition.storySummary}"
        </p>
        <div className="w-16 h-[2px] bg-brand-dark/10 mx-auto mt-8"></div>
      </div>

      {/* 3. DYNAMIC CHAPTERS: INTERACTIVE DOCUMENTARY */}
      {expedition.chapters && expedition.chapters.length > 0 && (
        <div className="bg-brand-dark text-brand-bg py-24 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-green">Documental Interactivo</span>
              <h3 className="text-3xl sm:text-4xl font-serif font-normal text-white tracking-tight mt-2">
                Explora el territorio por capítulos
              </h3>
              <p className="text-brand-bg/75 max-w-xl mx-auto mt-3 text-sm font-light">
                Desliza para adentrarte en el ecosistema antes de pisar el suelo vivo de la selva valdiviana.
              </p>
            </div>

            <div className="space-y-24">
              {expedition.chapters.map((chapter, idx) => (
                <div
                  key={idx}
                  id={`chapter-${idx}`}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
                    idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Photo Section */}
                  <div className={`lg:col-span-6 relative overflow-hidden rounded-2xl group ${idx % 2 === 1 ? 'lg:order-last' : ''}`}>
                    <img
                      src={chapter.image}
                      alt={chapter.title}
                      className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105 rounded-2xl"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-brand-dark/95 backdrop-blur-sm text-brand-green font-mono text-xs font-bold px-3 py-1.5 rounded-full border border-white/5">
                      Capítulo 0{idx + 1}
                    </div>
                  </div>

                  {/* Story Text Section */}
                  <div className="lg:col-span-6 flex flex-col justify-center space-y-4 px-2">
                    <h4 className="text-2xl font-serif text-white">{chapter.title}</h4>
                    <p className="text-brand-bg/70 text-sm leading-relaxed font-sans font-light">{chapter.description}</p>
                    <div className="pt-2 flex items-center space-x-3 text-brand-green font-mono text-xs font-semibold">
                      <BookOpen className="w-4 h-4" />
                      <span>Inmersión científica activa</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. MAP AND LOCATION SCHEMATICS */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Map Image Mockup with beautiful tags */}
          <div className="lg:col-span-7 relative bg-white rounded-3xl p-4 border border-brand-dark/5 overflow-hidden shadow-sm">
            <img
              src={expedition.mapImage}
              alt="Mapa de la Expedición"
              className="w-full aspect-[16/10] object-cover rounded-2xl grayscale contrast-125 opacity-85"
              referrerPolicy="no-referrer"
            />
            {/* Visual Markers overlay */}
            <div className="absolute top-1/4 left-1/3 flex items-center space-x-2 bg-brand-dark text-white text-[10px] font-mono px-3 py-1.5 rounded-full shadow-lg border border-brand-green/30 animate-bounce">
              <MapPin className="w-3.5 h-3.5 text-brand-green shrink-0" />
              <span>Senda de los Alerces Abuelos</span>
            </div>
            <div className="absolute top-1/2 left-2/3 flex items-center space-x-2 bg-brand-dark text-white text-[10px] font-mono px-3 py-1.5 rounded-full shadow-lg border border-brand-green/30">
              <MapPin className="w-3.5 h-3.5 text-brand-green shrink-0" />
              <span>Refugio Raulif Costero</span>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col space-y-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-green">Geografía y Acceso</span>
            <h3 className="text-3xl font-serif text-brand-dark tracking-tight">El epicentro de la conservación costera</h3>
            <p className="text-brand-dark/75 text-sm leading-relaxed font-sans font-light">
              Nuestra expedición se localiza en la provincia de Valdivia, Región de Los Ríos, Chile. Nos adentraremos en los cordones montañosos de la Cordillera de la Costa meridional, un relieve aislado que actúa como un refugio insular biológico único, donde el bosque lluvioso templado colisiona con el Océano Pacífico.
            </p>
            <div className="space-y-3 font-sans">
              <div className="flex items-start space-x-3 text-sm text-brand-dark/80">
                <Check className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                <span><strong>Punto de partida:</strong> Valdivia, Chile (Aeropuerto Pichoy - LDQ).</span>
              </div>
              <div className="flex items-start space-x-3 text-sm text-brand-dark/80">
                <Check className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                <span><strong>Ecosistema primario:</strong> Bosque templado lluvioso costero de baja altura.</span>
              </div>
              <div className="flex items-start space-x-3 text-sm text-brand-dark/80">
                <Check className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                <span><strong>Estación óptima:</strong> Primavera tardía e invierno del Hemisferio Norte (Noviembre a Marzo).</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. INTERACTIVE DAY-BY-DAY ITINERARY TIMELINE */}
      {expedition.itinerary && expedition.itinerary.length > 0 && (
        <div className="bg-white py-24 border-y border-brand-dark/5">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-green">El Ritmo del Viaje</span>
              <h3 className="text-3xl font-serif text-brand-dark tracking-tight mt-2">Cronograma Científico Diario</h3>
              <p className="text-brand-dark/60 max-w-md mx-auto mt-3 text-sm font-sans font-light">
                Diseñado minuciosamente para equilibrar caminatas de campo, monitoreo científico y espacio de descanso e integración.
              </p>
            </div>

            {/* Daily Selectors Tab */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {expedition.itinerary.map((it, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDay(idx)}
                  className={`px-4 py-2.5 rounded-full text-xs font-mono tracking-widest uppercase transition-all cursor-pointer ${
                    activeDay === idx
                      ? 'bg-brand-dark text-white font-medium shadow-md'
                      : 'bg-brand-bg text-brand-dark/70 hover:bg-brand-dark/5'
                  }`}
                >
                  {it.day}
                </button>
              ))}
            </div>

            {/* Active Day Card */}
            <div className="bg-brand-bg border border-brand-dark/5 rounded-3xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/10 rounded-bl-full flex items-center justify-center text-brand-green font-mono text-xl font-bold">
                {expedition.itinerary[activeDay].day}
              </div>
              <span className="text-xs font-mono text-brand-green font-bold uppercase block mb-2">Especialidad del día</span>
              <h4 className="text-2xl font-serif text-brand-dark mb-4">
                {expedition.itinerary[activeDay].title}
              </h4>
              <p className="text-brand-dark/75 text-sm leading-relaxed mb-6 font-sans font-light">
                {expedition.itinerary[activeDay].description}
              </p>
              {expedition.itinerary[activeDay].accommodation && (
                <div className="border-t border-brand-dark/5 pt-5 flex items-center justify-between text-xs text-brand-dark/60 font-mono">
                  <span>Hospedaje de Conservación:</span>
                  <span className="text-brand-dark font-semibold">{expedition.itinerary[activeDay].accommodation}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. WHAT IS INCLUDED / NOT INCLUDED SECTION */}
      {expedition.whatsIncluded && expedition.whatsIncluded.length > 0 && (
        <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Whats Included */}
            <div className="bg-white border border-brand-dark/5 p-8 rounded-3xl shadow-sm">
              <h4 className="text-lg font-serif text-brand-dark tracking-tight mb-6 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <span>Qué incluye la experiencia</span>
              </h4>
              <ul className="space-y-4 font-sans text-sm text-brand-dark/75 font-light">
                {expedition.whatsIncluded.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Whats Not Included */}
            <div className="bg-brand-bg border border-brand-dark/5 p-8 rounded-3xl">
              <h4 className="text-lg font-serif text-brand-dark tracking-tight mb-6 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-brand-dark/5 text-brand-dark flex items-center justify-center">
                  <X className="w-4 h-4" />
                </div>
                <span>Qué no incluye</span>
              </h4>
              <ul className="space-y-4 font-sans text-sm text-brand-dark/75 font-light">
                {expedition.whatsNotIncluded.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <X className="w-4 h-4 text-brand-dark/30 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* 7. RESPONSIBLE GUIDE PROFILE SECTION */}
      <div className="bg-brand-dark text-brand-bg py-24 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-green">Dirección Científica</span>
            <h3 className="text-3xl font-serif text-white tracking-tight mt-1">Guía Responsable en Terreno</h3>
          </div>
          <div className="bg-brand-bg/5 border border-white/5 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex justify-center">
              <img
                src={guide.photo}
                alt={guide.name}
                className="w-40 h-40 object-cover rounded-full border-2 border-brand-green/30"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="md:col-span-8 space-y-4">
              <div>
                <h4 className="text-xl font-serif text-white">{guide.name}</h4>
                <p className="text-xs font-mono text-brand-green uppercase">{guide.role}</p>
              </div>
              <p className="text-brand-bg/75 text-xs leading-relaxed font-sans italic font-light">
                "{guide.quote || 'Caminaremos para entender el lenguaje secreto del bosque.'}"
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    window.location.hash = '#/embajadores';
                    onNavigate('embajadores');
                  }}
                  className="text-white text-xs font-mono font-bold uppercase tracking-widest hover:text-brand-green transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <span>Ver perfil de embajador completo</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Collapsible FAQ Accordion */}
      {expedition.faqs && expedition.faqs.length > 0 && (
        <div className="py-24 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-green">Preguntas Frecuentes</span>
            <h3 className="text-3xl font-serif text-brand-dark tracking-tight mt-1">Resuelve tus dudas</h3>
          </div>
          
          <div className="space-y-4">
            {expedition.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-white border border-brand-dark/5 rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between font-serif font-normal text-brand-dark hover:bg-brand-bg/5 transition-colors focus:outline-none cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-brand-dark/50" /> : <ChevronDown className="w-5 h-5 text-brand-dark/50" />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-brand-dark/75 text-sm leading-relaxed font-sans font-light border-t border-brand-dark/5 pt-4 bg-brand-bg/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 9. LISTA DE ESPERA FORM & CONVERSION ENGINE */}
      <div id="lista-espera" className="bg-brand-dark text-white py-24 border-t border-white/5 overflow-hidden relative">
        {/* Background visual graphics */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(45,90,39,0.15),transparent)] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Conversion text block */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-block px-3 py-1 bg-brand-green/10 text-brand-green border border-brand-green/20 text-xs font-mono font-bold tracking-widest uppercase rounded-full">
                Cupos Estrictamente Limitados
              </span>
              <h3 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight">
                Sé uno de los 10 guardianes del bosque
              </h3>
              <p className="text-brand-bg/85 text-sm leading-relaxed font-sans font-light">
                Nuestras expediciones no son masivas. Cada salida cuenta con un grupo máximo de 10 participantes para asegurar el mínimo impacto ambiental y la máxima profundidad educativa de la experiencia científica.
              </p>
              <p className="text-brand-bg/85 text-sm leading-relaxed font-sans font-light">
                Registrarte en la lista de espera preferente no tiene costo alguno y te otorgará derecho a:
              </p>
              <div className="space-y-3 font-mono text-xs text-brand-green">
                <div className="flex items-center space-x-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                  <span>Acceso prioritario 48 horas antes del lanzamiento público.</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                  <span>Entrevista personal informativa telemática con Claudio Araya.</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                  <span>Material preparatorio científico exclusivo en formato PDF.</span>
                </div>
              </div>
            </div>

            {/* Form card */}
            <div className="lg:col-span-7 bg-white text-brand-dark rounded-3xl p-8 shadow-2xl border border-brand-dark/5">
              {submitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto text-brand-green">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-serif text-brand-dark">¡Estás en la lista de espera!</h4>
                  <p className="text-brand-dark/75 text-sm max-w-md mx-auto font-light">
                    Hemos registrado tu solicitud correctamente para la <strong>Expedición Bosque Valdiviano</strong>. Uno de nuestros coordinadores se pondrá en contacto contigo vía email en las próximas 24 horas para agendar tu entrevista de orientación.
                  </p>
                  <p className="text-[11px] text-brand-dark/40 font-mono">
                    ID Registro: REG-{Date.now().toString().slice(-6)}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <div>
                    <h4 className="text-lg font-serif text-brand-dark">Solicitud de Inscripción Prioritaria</h4>
                    <p className="text-xs text-brand-dark/50 mt-1">Completa los campos y asegura tu prioridad en la selección.</p>
                  </div>

                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl p-3">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-brand-dark/60 uppercase mb-1.5">Nombre completo *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Ej. Marta Gómez"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-brand-bg border border-brand-dark/10 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder-brand-dark/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-brand-dark/60 uppercase mb-1.5">Correo electrónico *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="Ej. marta@gmail.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-brand-bg border border-brand-dark/10 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder-brand-dark/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-brand-dark/60 uppercase mb-1.5">Teléfono móvil *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="Ej. +34 600 000 000"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-brand-bg border border-brand-dark/10 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder-brand-dark/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-brand-dark/60 uppercase mb-1.5">Convocatoria Preferida</label>
                      <select
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        className="w-full bg-brand-bg border border-brand-dark/10 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                      >
                        {expedition.dates.map((d, i) => (
                          <option key={i} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-brand-dark/60 uppercase mb-1.5">¿Qué te motiva a unirte a esta misión? (Opcional)</label>
                    <textarea
                      name="notes"
                      rows={3}
                      placeholder="Cuéntanos un poco sobre tu interés por la conservación, senderismo o fotografía..."
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full bg-brand-bg border border-brand-dark/10 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder-brand-dark/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-dark text-white text-xs font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-brand-green transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Inscribirse en la Lista de Espera</span>
                  </button>

                  <div className="flex items-center space-x-2 text-[10px] text-brand-dark/50 justify-center pt-2">
                    <ShieldCheck className="w-4 h-4 text-brand-green shrink-0" />
                    <span>Tus datos están seguros. El registro prioritario no constituye obligación de pago.</span>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
