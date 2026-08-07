import { useState, FormEvent } from 'react';
import { Envelope, CheckCircle, ArrowRight, ShieldCheck } from '@phosphor-icons/react';
import { getCMSState, saveCMSState } from '../lib/cmsState';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const C = {
  dark: '#070b09',
  emerald: '#38c98b',
  ink: '#eef5f1',
  dim: '#7d9187',
  border: 'rgba(255,255,255,0.07)',
};

export default function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !email.includes('@')) { setError('Por favor, introduce un correo electrónico válido.'); return; }
    const state = getCMSState();
    const exists = state.newsletter.some(sub => sub.email.toLowerCase() === email.toLowerCase());
    if (exists) { setError('Este correo ya está registrado en nuestra comunidad.'); return; }
    state.newsletter.push({ id: `sub-${Date.now()}`, email: email.trim().toLowerCase(), createdAt: new Date().toISOString() });
    saveCMSState(state);
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleLinkClick = (page: string, hash: string) => {
    window.location.hash = hash;
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ backgroundColor: C.dark, color: C.dim, borderTop: `1px solid ${C.border}` }} className="pt-20 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 pb-16 lg:grid-cols-12 lg:gap-8" style={{ borderBottom: `1px solid ${C.border}` }}>
          {/* Brand */}
          <div className="flex flex-col gap-5 lg:col-span-5">
            <button onClick={() => handleLinkClick('home', '#/')} className="flex cursor-pointer items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(56,201,139,0.14)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={C.emerald} strokeWidth="2" className="h-5 w-5">
                  <path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 3.5 7.5L12 22l6.5-2.5C20.5 17.5 22 15 22 12c0-5.5-4.5-10-10-10z" />
                  <path d="M12 6c-2 0-3.5 1.5-3.5 3.5 0 1 .5 2 1.5 3" />
                  <line x1="12" y1="6" x2="12" y2="18" strokeWidth="2.5" />
                </svg>
              </div>
              <div className="text-left">
                <span className="block text-lg font-bold tracking-widest" style={{ color: C.ink }}>RAULIF</span>
                <span className="block text-[8px] font-semibold uppercase tracking-widest" style={{ color: C.emerald }}>Conocer para proteger</span>
              </div>
            </button>
            <p className="max-w-sm text-sm leading-relaxed">
              Expediciones de turismo aventura y consciente en Chile, con salidas guiadas por especialistas que conocen cada territorio. Cupos limitados por fecha, con parte de la utilidad destinada a conservación.
            </p>
          </div>

          {/* Navegación */}
          <div className="grid grid-cols-2 gap-4 lg:col-span-3">
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider" style={{ color: C.ink }}>Explorar</h4>
              <ul className="space-y-2.5 text-sm">
                {[['catalogo','#/catalogo','Catálogo'],['expediciones','#/expediciones','Expediciones'],['impacto','#/impacto','Impacto'],['historia','#/historia','Historia']].map(([p,h,l]) => (
                  <li key={p}><button onClick={() => handleLinkClick(p,h)} className="cursor-pointer text-left transition-colors hover:text-white">{l}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider" style={{ color: C.ink }}>Comunidad</h4>
              <ul className="space-y-2.5 text-sm">
                {[['embajadores','#/embajadores','Embajadores'],['blog','#/blog','El Bosque Escrito'],['contacto','#/contacto','Contacto'],['admin','#/admin','Panel CMS']].map(([p,h,l]) => (
                  <li key={p}><button onClick={() => handleLinkClick(p,h)} className="cursor-pointer text-left transition-colors hover:text-white" style={l==='Panel CMS'?{color:C.emerald}:{}}>{l}</button></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4 lg:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: C.ink }}>Sé el primero en reservar</h4>
            <p className="text-xs leading-relaxed">
              Cupos limitados por fecha. Recibe las convocatorias de cada salida antes de que se agoten.
            </p>
            {submitted ? (
              <div className="flex items-start gap-3 rounded-xl border p-4" style={{ borderColor: 'rgba(56,201,139,0.3)', backgroundColor: 'rgba(56,201,139,0.06)' }}>
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" color={C.emerald} />
                <div>
                  <h5 className="text-xs font-semibold" style={{ color: C.ink }}>¡Te has unido a la huella!</h5>
                  <p className="mt-1 text-[11px]">Te notificaremos las próximas salidas y cupos.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex items-center rounded-xl border p-1 pl-4 transition-colors" style={{ borderColor: C.border }}>
                  <Envelope className="mr-2 h-4 w-4" color={C.dim} />
                  <input type="email" placeholder="Tu correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent py-1.5 text-xs focus:outline-none" style={{ color: C.ink, caretColor: C.emerald }} />
                  <button type="submit" className="cursor-pointer rounded-lg p-2 transition-colors hover:opacity-90" style={{ backgroundColor: C.emerald }}>
                    <ArrowRight className="h-4 w-4" color="#07120d" />
                  </button>
                </div>
                {error && <p className="pl-4 text-[11px] text-red-500">{error}</p>}
              </form>
            )}
            <p className="flex items-center gap-1.5 text-[10px]" style={{ color: 'rgba(125,145,135,0.7)' }}>
              <ShieldCheck className="h-3.5 w-3.5" color="rgba(56,201,139,0.4)" />
              <span>Respetamos tu privacidad. Sin spam. Cancela cuando quieras.</span>
            </p>
          </div>
        </div>

        {/* Legal */}
        <div className="flex flex-col items-center justify-between pt-8 text-xs md:flex-row" style={{ color: 'rgba(125,145,135,0.5)' }}>
          <p>© 2026 RAULIF. Expediciones de aventura y conservación en Chile.</p>
          <div className="flex gap-6">
            <span className="cursor-pointer transition-colors hover:text-white">Privacidad</span>
            <span className="cursor-pointer transition-colors hover:text-white">Condiciones</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
