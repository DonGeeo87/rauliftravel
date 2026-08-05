/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Menu, X, Leaf, ShieldAlert, Settings, ArrowRight } from 'lucide-react';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ activePage, onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Inicio', hash: '#/' },
    { id: 'historia', label: 'Historia', hash: '#/historia' },
    { id: 'expediciones', label: 'Expediciones', hash: '#/expediciones' },
    { id: 'embajadores', label: 'Embajadores', hash: '#/embajadores' },
    { id: 'impacto', label: 'Impacto', hash: '#/impacto' },
    { id: 'blog', label: 'El Bosque Escrito', hash: '#/blog' },
    { id: 'contacto', label: 'Contacto', hash: '#/contacto' },
  ];

  const handleItemClick = (id: string, hash: string) => {
    window.location.hash = hash;
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-bg/90 backdrop-blur-md shadow-sm border-b border-brand-dark/5 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Identity */}
          <div
            id="navbar-logo"
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleItemClick('home', '#/')}
          >
            <div className="relative w-10 h-10 flex items-center justify-center bg-brand-green/10 rounded-full transition-transform group-hover:scale-105">
              {/* Specialized Custom Vector representing Leaf + Fingerprint (Raulif Identity) */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-brand-green"
              >
                {/* Fingerprint ridges that morph into leaf veins */}
                <path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 3.5 7.5L12 22l6.5-2.5C20.5 17.5 22 15 22 12c0-5.5-4.5-10-10-10z" />
                <path d="M12 6c-2 0-3.5 1.5-3.5 3.5 0 1 .5 2 1.5 3" />
                <path d="M12 10c-1 0-1.5.5-1.5 1.5 0 .5.5 1 1 1.5l1 1" />
                <path d="M14.5 10.5c.5.5 1 1 1 2 0 1.5-1 3-3 3.5" />
                {/* Center stem of the leaf */}
                <line x1="12" y1="6" x2="12" y2="18" strokeWidth="2.5" className="text-brand-green" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold tracking-widest text-brand-dark font-sans group-hover:text-brand-green transition-colors">
                RAULIF
              </span>
              <span className="block text-[9px] font-mono tracking-widest text-brand-green font-semibold uppercase leading-none">
                Conocer para proteger
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div id="desktop-nav-links" className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleItemClick(item.id, item.hash)}
                className={`text-xs uppercase tracking-widest font-medium transition-colors relative py-1 cursor-pointer ${
                  activePage === item.id || (item.id === 'expediciones' && activePage === 'bosque-valdiviano')
                    ? 'text-brand-dark font-bold'
                    : 'text-brand-dark/70 hover:text-brand-dark'
                }`}
              >
                {item.label}
                {(activePage === item.id || (item.id === 'expediciones' && activePage === 'bosque-valdiviano')) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Desktop CMS & CTA buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              id="navbar-admin-btn"
              onClick={() => handleItemClick('admin', '#/admin')}
              className={`p-2 rounded-full transition-colors ${
                activePage === 'admin'
                  ? 'bg-brand-green/10 text-brand-dark'
                  : 'text-brand-dark/40 hover:text-brand-dark hover:bg-brand-green/5'
              }`}
              title="Panel CMS Raulif"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              id="navbar-cta-btn"
              onClick={() => handleItemClick('bosque-valdiviano', '#/expediciones/bosque-valdiviano')}
              className="bg-brand-green text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full hover:bg-brand-green-dark transition-all shadow-sm flex items-center space-x-2 cursor-pointer"
            >
              <span>Ver Primera Expedición</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburguer Menu Button */}
          <div className="flex items-center space-x-3 lg:hidden">
            <button
              id="navbar-admin-btn-mobile"
              onClick={() => handleItemClick('admin', '#/admin')}
              className={`p-2 rounded-full text-stone-500 hover:text-stone-800`}
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-stone-800 hover:text-stone-950 focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          id="mobile-drawer"
          className="lg:hidden absolute top-full left-0 right-0 bg-brand-bg border-b border-brand-dark/10 shadow-xl py-6 px-4 animate-fade-in"
        >
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-link-${item.id}`}
                onClick={() => handleItemClick(item.id, item.hash)}
                className={`text-left text-xs uppercase tracking-widest font-semibold py-2.5 px-3 rounded-lg transition-colors cursor-pointer ${
                  activePage === item.id || (item.id === 'expediciones' && activePage === 'bosque-valdiviano')
                    ? 'bg-brand-green/10 text-brand-dark border-l-4 border-brand-green'
                    : 'text-brand-dark/70 hover:bg-brand-green/5 hover:text-brand-dark'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-brand-dark/10 pt-4 flex flex-col space-y-3">
              <button
                id="mobile-navbar-cta-btn"
                onClick={() => handleItemClick('bosque-valdiviano', '#/expediciones/bosque-valdiviano')}
                className="w-full bg-brand-green text-white text-center text-xs font-bold uppercase tracking-wider py-3.5 rounded-full hover:bg-brand-green-dark transition-colors cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Ver Primera Expedición</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
