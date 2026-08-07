import { useState, ChangeEvent, FormEvent } from 'react';
import { PaperPlaneTilt, CheckCircle, Envelope, MapPin, ShieldCheck, Compass } from '@phosphor-icons/react';
import { getCMSState, saveCMSState } from '../lib/cmsState';

const C = {
  bg: '#0a0f0d', bg2: '#101713', card: '#141c18',
  ink: '#eef5f1', dim: '#8ba093', emerald: '#38c98b',
  border: 'rgba(255,255,255,0.07)',
};

export default function ContactoView() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.email || !formData.subject || !formData.message) { setError('Por favor, rellena todos los campos obligatorios (*).'); return; }
    if (!formData.email.includes('@')) { setError('Por favor, introduce un correo electrónico válido.'); return; }
    const state = getCMSState();
    state.contactoSubmissions.push({
      id: `con-${Date.now()}`, name: formData.name.trim(), email: formData.email.trim().toLowerCase(),
      subject: formData.subject.trim(), message: formData.message.trim(), createdAt: new Date().toISOString()
    });
    saveCMSState(state);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const inputCls = "w-full rounded-xl border px-4 py-3 text-sm focus:outline-none transition-colors";
  const inputStyle = { backgroundColor: C.bg, borderColor: C.border, color: C.ink, caretColor: C.emerald };
  const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wider";

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh', paddingTop: '96px' }}>

      {/* Header */}
      <section className="border-b px-4 py-16 text-center sm:px-6" style={{ borderColor: C.border, backgroundColor: C.bg2 }}>
        <div className="mx-auto max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold" style={{ borderColor: C.border, color: C.emerald }}>
            <Compass className="h-3.5 w-3.5" /> Contacto
          </span>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Hablemos de tu próxima salida</h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed" style={{ color: C.dim }}>
            ¿Dudas sobre itinerarios, dificultad, cupos o quieres reservar una fecha? Escríbenos y te respondemos a la brevedad.
          </p>
        </div>
      </section>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Info */}
          <div className="space-y-8 lg:col-span-5">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">Operamos en Chile</h2>
              <p className="text-sm leading-relaxed" style={{ color: C.dim }}>
                Salidas de aventura y conservación en el territorio chileno, con base logística local. Atención 100% remota y coordinación en terreno.
              </p>
            </div>
            <div className="space-y-6 text-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border" style={{ borderColor: C.border, backgroundColor: C.card }}>
                  <MapPin className="h-5 w-5" color={C.emerald} />
                </div>
                <div>
                  <h4 className="font-semibold">Operaciones en Chile</h4>
                  <p className="mt-1" style={{ color: C.dim }}>Valdivia, Región de Los Ríos.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border" style={{ borderColor: C.border, backgroundColor: C.card }}>
                  <Envelope className="h-5 w-5" color={C.emerald} />
                </div>
                <div>
                  <h4 className="font-semibold">Escríbenos</h4>
                  <p className="mt-1 font-semibold" style={{ color: C.emerald }}>rauliftravel@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl border p-8 lg:col-span-7" style={{ borderColor: C.border, backgroundColor: C.bg2 }}>
            {submitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(56,201,139,0.1)' }}>
                  <CheckCircle className="h-8 w-8" color={C.emerald} />
                </div>
                <h3 className="mt-4 text-xl font-bold">¡Mensaje enviado!</h3>
                <p className="mx-auto mt-2 max-w-md text-sm" style={{ color: C.dim }}>
                  Gracias por contactarnos. Te responderemos pronto con la información de tu salida.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold">Formulario de contacto</h3>
                  <p className="mt-1 text-xs" style={{ color: C.dim }}>Completa los campos y te responderemos a la brevedad.</p>
                </div>
                {error && <div className="rounded-xl border border-red-500/30 p-3 text-xs" style={{ color: '#fca5a5', backgroundColor: 'rgba(239,68,68,0.08)' }}>{error}</div>}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls} style={{ color: C.dim }}>Nombre completo *</label>
                    <input type="text" name="name" required placeholder="Tu nombre" value={formData.name} onChange={handleInputChange} className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className={labelCls} style={{ color: C.dim }}>Correo electrónico *</label>
                    <input type="email" name="email" required placeholder="tucorreo@email.com" value={formData.email} onChange={handleInputChange} className={inputCls} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label className={labelCls} style={{ color: C.dim }}>Asunto *</label>
                  <input type="text" name="subject" required placeholder="Ej. Interés en cupo / Reserva de fecha" value={formData.subject} onChange={handleInputChange} className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label className={labelCls} style={{ color: C.dim }}>Tu mensaje *</label>
                  <textarea name="message" required rows={5} placeholder="Escribe aquí tus dudas, ideas o intenciones de viaje..." value={formData.message} onChange={handleInputChange} className={inputCls} style={inputStyle} />
                </div>
                <button type="submit" className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-4 text-xs font-bold uppercase tracking-widest text-[#07120d] transition-transform hover:-translate-y-0.5" style={{ backgroundColor: C.emerald }}>
                  <PaperPlaneTilt className="h-4 w-4" /> Enviar mensaje
                </button>
                <div className="flex items-center justify-center gap-2 pt-2 text-[10px]" style={{ color: 'rgba(139,160,147,0.7)' }}>
                  <ShieldCheck className="h-4 w-4" color="rgba(56,201,139,0.5)" /> Tu mensaje queda registrado de forma segura.
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
