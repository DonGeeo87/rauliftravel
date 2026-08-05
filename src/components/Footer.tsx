/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Mail, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { getCMSState, saveCMSState } from '../lib/cmsState';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Por favor, introduce un correo electrónico válido.');
      return;
    }

    const state = getCMSState();
    
    // Check if already subscribed
    const exists = state.newsletter.some(sub => sub.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      setError('Este correo electrónico ya está registrado en nuestra comunidad.');
      return;
    }

    // Add subscriber
    const newSub = {
      id: `sub-${Date.now()}`,
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString()
    };

    state.newsletter.push(newSub);
    saveCMSState(state);

    setSubmitted(true);
    setEmail('');
    
    // Reset confirmation after 5s
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleLinkClick = (page: string, hash: string) => {
    window.location.hash = hash;
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-brand-dark text-brand-bg/60 border-t border-white/5 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/5">
          
          {/* Main Brand Column */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleLinkClick('home', '#/')}>
              <div className="w-9 h-9 flex items-center justify-center bg-brand-green/10 rounded-full">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-brand-green"
                >
                  <path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 3.5 7.5L12 22l6.5-2.5C20.5 17.5 22 15 22 12c0-5.5-4.5-10-10-10z" />
                  <path d="M12 6c-2 0-3.5 1.5-3.5 3.5 0 1 .5 2 1.5 3" />
                  <line x1="12" y1="6" x2="12" y2="18" strokeWidth="2.5" className="text-brand-green" />
                </svg>
              </div>
              <div>
                <span className="text-lg font-bold tracking-widest text-white">RAULIF</span>
                <span className="block text-[8px] font-mono tracking-widest text-brand-green uppercase font-semibold leading-none">
                  Conocer para proteger
                </span>
              </div>
            </div>
            <p className="text-brand-bg/60 text-sm leading-relaxed max-w-sm">
              RAULIF es la principal comunidad europea dedicada a conectar exploradores con los ecosistemas silvestres de Chile para financiar proyectos reales de conservación y reforestación comunitaria.
            </p>
            <div className="text-xs font-mono text-brand-bg/40 flex items-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
              <span>Motor de Impacto Activo: Reforestación y Educación Rural</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 font-sans">Comunidad</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button onClick={() => handleLinkClick('home', '#/')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Inicio
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('historia', '#/historia')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Nuestra Historia
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('expediciones', '#/expediciones')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Expediciones
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('embajadores', '#/embajadores')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Embajadores
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 font-sans">Sostenibilidad</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button onClick={() => handleLinkClick('impacto', '#/impacto')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Impacto Real
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('blog', '#/blog')} className="hover:text-white transition-colors cursor-pointer text-left">
                    El Bosque Escrito
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('contacto', '#/contacto')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Contacto
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('admin', '#/admin')} className="text-brand-green hover:text-brand-green-dark transition-colors cursor-pointer text-left font-medium">
                    Panel CMS Admin
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Integrated Newsletter Subscription */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider font-sans">El Latido del Bosque</h4>
            <p className="text-brand-bg/60 text-xs leading-relaxed">
              Únete a nuestra lista de correo preferente. Recibe crónicas de conservación, reportajes fotográficos y sé el primero en conocer los cupos para las expediciones limitadas a Chile.
            </p>
            
            {submitted ? (
              <div className="bg-white/5 border border-brand-green/20 rounded-xl p-4 flex items-start space-x-3 text-brand-bg/85">
                <CheckCircle className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-xs text-white">¡Te has unido a la huella!</h5>
                  <p className="text-[11px] text-brand-bg/60 mt-1">Hemos registrado tu email. Te notificaremos pronto sobre los avances de Raulif.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative flex items-center bg-white/5 border border-white/5 rounded-full focus-within:border-brand-green focus-within:ring-1 focus-within:ring-brand-green p-1 pl-4">
                  <Mail className="w-4 h-4 text-brand-bg/40 shrink-0 mr-2" />
                  <input
                    type="email"
                    placeholder="Tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-0 text-white placeholder-brand-bg/30 focus:outline-none focus:ring-0 text-xs py-1.5"
                  />
                  <button
                    type="submit"
                    className="bg-brand-green text-white rounded-full p-2 hover:bg-brand-green-dark transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {error && <p className="text-[11px] text-red-500 pl-4">{error}</p>}
              </form>
            )}
            
            <p className="text-[10px] text-brand-bg/30 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-green/35" />
              <span>Respetamos tu privacidad. Sin spam. Cancela en cualquier momento.</span>
            </p>
          </div>

        </div>

        {/* Legal & Brand Footer Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-brand-bg/30 space-y-4 md:space-y-0">
          <p>© 2026 RAULIF. Todos los derechos reservados. Diseñado para perdurar e inspirar.</p>
          <div className="flex space-x-6">
            <span className="hover:text-brand-bg/50 cursor-pointer">Privacidad</span>
            <span className="hover:text-brand-bg/50 cursor-pointer">Condiciones</span>
            <span className="hover:text-brand-bg/50 cursor-pointer">Regeneración 20-Años</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
