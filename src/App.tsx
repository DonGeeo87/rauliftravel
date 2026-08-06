/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import HistoriaView from './components/HistoriaView';
import ExpedicionesView from './components/ExpedicionesView';
import EmbajadoresView from './components/EmbajadoresView';
import ImpactoView from './components/ImpactoView';
import BlogView from './components/BlogView';
import ContactoView from './components/ContactoView';
import InteractiveDocumentary from './components/InteractiveDocumentary';
import AdminPanel from './components/AdminPanel';
import SEOManager from './components/SEOManager';
import CatalogoMVP from './components/CatalogoMVP';
import { getCMSState, saveCMSState } from './lib/cmsState';
import { GlobalCMSState } from './types';

export default function App() {
  const [db, setDb] = useState<GlobalCMSState>(getCMSState());
  const [activePage, setActivePage] = useState<string>('home');
  const [newsletterStatus, setNewsletterStatus] = useState<{ submitted: boolean; error: string }>({
    submitted: false,
    error: ''
  });

  // 1. Hash-based Clean Routing System
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash || hash === '#/') {
        setActivePage('home');
      } else if (hash === '#/catalogo') {
        setActivePage('catalogo');
      } else if (hash === '#/historia') {
        setActivePage('historia');
      } else if (hash === '#/expediciones') {
        setActivePage('expediciones');
      } else if (hash === '#/expediciones/bosque-valdiviano') {
        setActivePage('bosque-valdiviano');
      } else if (hash === '#/embajadores') {
        setActivePage('embajadores');
      } else if (hash === '#/impacto') {
        setActivePage('impacto');
      } else if (hash === '#/blog') {
        setActivePage('blog');
      } else if (hash === '#/contacto') {
        setActivePage('contacto');
      } else if (hash === '#/admin') {
        setActivePage('admin');
      } else {
        setActivePage('home');
      }
      window.scrollTo(0, 0);
    };

    // Parse initial route
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 2. Local Sync with Database updates (CMS state changes)
  useEffect(() => {
    const handleCMSUpdate = () => {
      setDb(getCMSState());
    };
    window.addEventListener('cms_state_updated', handleCMSUpdate);
    return () => window.removeEventListener('cms_state_updated', handleCMSUpdate);
  }, []);

  // 3. Global Newsletter subscription coordinator
  const handleGlobalSubscribe = (email: string) => {
    setNewsletterStatus({ submitted: false, error: '' });

    if (!email || !email.includes('@')) {
      setNewsletterStatus({ submitted: false, error: 'Por favor, introduce un correo válido.' });
      return;
    }

    const currentDb = getCMSState();
    const alreadySubscribed = currentDb.newsletter.some(sub => sub.email.toLowerCase() === email.toLowerCase());

    if (alreadySubscribed) {
      setNewsletterStatus({ submitted: false, error: 'Este correo electrónico ya está registrado.' });
      return;
    }

    const newSub = {
      id: `sub-${Date.now()}`,
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString()
    };

    currentDb.newsletter.push(newSub);
    saveCMSState(currentDb);
    setDb(currentDb); // Sync reactive state

    setNewsletterStatus({ submitted: true, error: '' });
    setTimeout(() => setNewsletterStatus({ submitted: false, error: '' }), 6000);
  };

  // Determine active SEO configuration based on routing
  const getPageSEO = () => {
    switch (activePage) {
      case 'home':
        return db.seo.home;
      case 'historia':
        return db.seo.historia;
      case 'expediciones':
        return db.seo.expediciones;
      case 'bosque-valdiviano':
        return db.seo.bosqueValdiviano;
      case 'embajadores':
        return db.seo.embajadores;
      case 'impacto':
        return db.seo.impacto;
      case 'blog':
        return db.seo.blog;
      case 'contacto':
        return db.seo.contacto;
      default:
        return db.seo.home;
    }
  };

  const activeSEO = getPageSEO();

  return (
    <div className="bg-stone-50 min-h-screen text-stone-900 flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      
      {/* Dynamic Head SEO metadata coordinator */}
      <SEOManager config={activeSEO} pageType={activePage} />

      {/* Navigation - Hidden only inside full screen secure admin back-office */}
      {activePage !== 'admin' && (
        <Navbar activePage={activePage} onNavigate={(page) => setActivePage(page)} />
      )}

      {/* Main Core View Area with Framer Motion slide-fade transitions */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {activePage === 'home' && (
              <HomeView
                db={db}
                onNavigate={(page) => setActivePage(page)}
                onSubscribe={handleGlobalSubscribe}
                subStatus={newsletterStatus}
              />
            )}
            {activePage === 'catalogo' && <CatalogoMVP />}
            {activePage === 'historia' && <HistoriaView db={db} />}
            {activePage === 'expediciones' && (
              <ExpedicionesView db={db} onNavigate={(page) => setActivePage(page)} />
            )}
            {activePage === 'bosque-valdiviano' && (
              <InteractiveDocumentary
                expedition={db.expediciones.find(e => e.id === 'bosque-valdiviano')!}
                onNavigate={(page) => setActivePage(page)}
              />
            )}
            {activePage === 'embajadores' && <EmbajadoresView db={db} />}
            {activePage === 'impacto' && <ImpactoView db={db} />}
            {activePage === 'blog' && <BlogView db={db} />}
            {activePage === 'contacto' && <ContactoView />}
            {activePage === 'admin' && (
              <AdminPanel onNavigate={(page) => setActivePage(page)} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer - Hidden only inside full screen secure admin back-office */}
      {activePage !== 'admin' && (
        <Footer onNavigate={(page) => setActivePage(page)} />
      )}

    </div>
  );
}
