import { useState, useEffect } from 'react';
import { Gear, X, List, ArrowRight } from '@phosphor-icons/react';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const C = {
  emerald: '#38c98b',
  dark: '#0a0f0d',
  ink: '#eef5f1',
  dim: '#8ba093',
  border: 'rgba(255,255,255,0.08)',
};

export default function Navbar({ activePage, onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Inicio', hash: '#/' },
    { id: 'catalogo', label: 'Catálogo', hash: '#/catalogo' },
    { id: 'expediciones', label: 'Expediciones', hash: '#/expediciones' },
    { id: 'impacto', label: 'Impacto', hash: '#/impacto' },
    { id: 'historia', label: 'Historia', hash: '#/historia' },
    { id: 'contacto', label: 'Contacto', hash: '#/contacto' },
  ];

  const handleItemClick = (id: string, hash: string) => {
    window.location.hash = hash;
    onNavigate(id);
    setIsOpen(false);
  };

  const isActive = (id: string) =>
    activePage === id || (id === 'expediciones' && activePage === 'bosque-valdiviano');

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(10,15,13,0.92)' : 'rgba(10,15,13,0.35)',
        backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => handleItemClick('home', '#/')} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(56,201,139,0.14)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke={C.emerald} strokeWidth="2" className="h-5 w-5">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 3.5 7.5L12 22l6.5-2.5C20.5 17.5 22 15 22 12c0-5.5-4.5-10-10-10z" />
                <path d="M12 6c-2 0-3.5 1.5-3.5 3.5 0 1 .5 2 1.5 3" />
                <line x1="12" y1="6" x2="12" y2="18" strokeWidth="2.5" />
              </svg>
            </div>
            <div className="text-left">
              <span className="block text-lg font-bold tracking-widest" style={{ color: C.ink }}>RAULIF</span>
              <span className="block text-[9px] font-semibold uppercase tracking-widest" style={{ color: C.emerald }}>Conocer para proteger</span>
            </div>
          </button>

          {/* Desktop nav */}
          <div className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id, item.hash)}
                className="relative py-1 text-xs font-semibold uppercase tracking-widest transition-colors"
                style={{ color: isActive(item.id) ? C.ink : C.dim }}
              >
                {item.label}
                {isActive(item.id) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: C.emerald }} />
                )}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-4 lg:flex">
            <button
              onClick={() => handleItemClick('admin', '#/admin')}
              className="rounded-full p-2 transition-colors"
              style={{ color: C.dim }}
              title="Panel CMS"
            >
              <Gear className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleItemClick('catalogo', '#/catalogo')}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#07120d] transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: C.emerald }}
            >
              <span>Explorar salidas</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => handleItemClick('admin', '#/admin')}
              className="rounded-full p-2"
              style={{ color: C.dim }}
            >
              <Gear className="h-5 w-5" />
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2" style={{ color: C.ink }}>
              {isOpen ? <X className="h-6 w-6" /> : <List className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="border-t px-4 py-6 lg:hidden" style={{ backgroundColor: C.dark, borderColor: C.border }}>
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id, item.hash)}
                className="rounded-lg px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-widest"
                style={{ color: isActive(item.id) ? C.emerald : C.dim, backgroundColor: isActive(item.id) ? 'rgba(56,201,139,0.08)' : 'transparent' }}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleItemClick('catalogo', '#/catalogo')}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-bold uppercase tracking-wider text-[#07120d]"
              style={{ backgroundColor: C.emerald }}
            >
              <span>Explorar salidas</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
