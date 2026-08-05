/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ChangeEvent, FormEvent } from 'react';
import { Send, CheckCircle, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { getCMSState, saveCMSState } from '../lib/cmsState';

export default function ContactoView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Por favor, rellena todos los campos obligatorios (*).');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Por favor, introduce una dirección de correo electrónico válida.');
      return;
    }

    const state = getCMSState();

    // Add submission
    const newSubmission = {
      id: `con-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      createdAt: new Date().toISOString()
    };

    state.contactoSubmissions.push(newSubmission);
    saveCMSState(state);

    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div id="contacto-view" className="bg-brand-bg min-h-screen pt-16">
      
      {/* Header */}
      <section className="py-20 bg-brand-dark text-white text-center border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-green uppercase bg-white/10 px-3 py-1.5 rounded-full">Contacto Directo</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight">Únete a la Conversación</h1>
          <p className="text-brand-bg/80 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-sans font-light">
            ¿Tienes dudas técnicas sobre el itinerario, la dificultad o te interesa proponer un patrocinio para colegios rurales? Escríbenos directamente.
          </p>
        </div>
      </section>

      {/* Main Grid: Info Cards + Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Info Side Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-green">Oficinas del Movimiento</span>
              <h2 className="text-2xl font-serif text-brand-dark">Enlace Continental</h2>
              <p className="text-brand-dark/75 text-sm leading-relaxed font-sans font-light">
                Operamos con base logística y administrativa descentralizada entre Europa (coordinación comercial, divulgación en España y Alemania) y Chile (directorio de científicos y logística de campo).
              </p>
            </div>

            <div className="space-y-6 font-sans text-sm">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand-bg text-brand-dark/70 border border-brand-dark/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-dark">Coordinación de Operaciones Chile</h4>
                  <p className="text-brand-dark/60 mt-1">General Lagos, Valdivia, Región de Los Ríos, Chile.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand-bg text-brand-dark/70 border border-brand-dark/5 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-dark">Escríbenos directamente</h4>
                  <p className="text-brand-green font-semibold mt-1">rauliftravel@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-brand-dark/5 font-sans text-xs text-brand-dark/75 space-y-1">
              <h5 className="font-serif text-sm text-brand-dark">¿Eres biólogo o científico chileno?</h5>
              <p className="leading-relaxed font-light">
                Siempre estamos expandiendo nuestra red de embajadores en terreno. Si tienes un proyecto de monitoreo, reforestación o tesis de campo que creas que puede ser apoyado por nuestro motor de sostenibilidad, por favor ponte en contacto detallando tu perfil académico.
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-white border border-brand-dark/5 rounded-3xl p-8 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto text-brand-green">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif text-brand-dark">¡Mensaje enviado con éxito!</h3>
                <p className="text-brand-dark/75 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-sans font-light">
                  Agradecemos tu contacto. Tu mensaje ha quedado registrado en la Consola Central Raulif de forma segura. Uno de nuestros naturalistas europeos se pondrá en contacto contigo en las próximas 24 horas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-serif text-brand-dark">Formulario de Contacto Directo</h3>
                  <p className="text-xs text-brand-dark/50 mt-1">Por favor rellena todos los campos e inicia la conversación hoy.</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl p-3">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-brand-dark/60 uppercase mb-1.5">Nombre completo *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Ej. Juan de la Cruz"
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
                      placeholder="Ej. juan@gmail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-brand-bg border border-brand-dark/10 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder-brand-dark/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-brand-dark/60 uppercase mb-1.5">Asunto del Mensaje *</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder="Ej. Interés en cupo grupal / Propuesta científica"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full bg-brand-bg border border-brand-dark/10 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder-brand-dark/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-brand-dark/60 uppercase mb-1.5">Tu Mensaje *</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Escribe aquí con libertad tus dudas, ideas o intenciones de viaje..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full bg-brand-bg border border-brand-dark/10 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder-brand-dark/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-dark hover:bg-brand-green text-white text-xs font-mono font-bold uppercase tracking-widest py-4 rounded-xl transition-colors shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar mensaje central</span>
                </button>

                <div className="flex items-center space-x-2 text-[10px] text-brand-dark/50 justify-center pt-2">
                  <ShieldCheck className="w-4 h-4 text-brand-green shrink-0" />
                  <span>Tu comunicación está cifrada de forma segura y solo accesible por RAULIF.</span>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
