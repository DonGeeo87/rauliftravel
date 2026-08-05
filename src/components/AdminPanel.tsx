/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { 
  Lock, KeyRound, LayoutDashboard, FileText, Compass, Users, Flame, BookOpen, 
  Settings, Download, RotateCcw, Save, Plus, Trash2, Eye, ShieldCheck, Mail, Phone, Calendar, CheckSquare
} from 'lucide-react';
import { getCMSState, saveCMSState, resetCMSState } from '../lib/cmsState';
import { GlobalCMSState, Expedition, Ambassador, ImpactProject, BlogPost } from '../types';

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // CMS State representing active database
  const [db, setDb] = useState<GlobalCMSState | null>(null);
  
  // Navigation inside Admin Panel
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pages' | 'expeditions' | 'ambassadors' | 'impact' | 'blog' | 'leads' | 'seo'>('dashboard');
  
  // Status feedback
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load state on mount
  useEffect(() => {
    setDb(getCMSState());
  }, []);

  // Listen to external changes (leads captured during session)
  useEffect(() => {
    const handleUpdate = () => {
      setDb(getCMSState());
    };
    window.addEventListener('cms_state_updated', handleUpdate);
    return () => window.removeEventListener('cms_state_updated', handleUpdate);
  }, []);

  // Authentication Handler
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === 'admin' || password === 'raulif2026') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Contraseña incorrecta. Pista: usa "admin"');
    }
  };

  // State Persistence
  const handlePersist = (updatedDb: GlobalCMSState) => {
    setDb(updatedDb);
    saveCMSState(updatedDb);
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  // Database Reset
  const handleReset = () => {
    if (confirm('¿Estás seguro de que deseas restablecer la base de datos a sus valores pre-sembrados originales? Se perderán todos los datos y correos registrados.')) {
      const reseted = resetCMSState();
      setDb(reseted);
      alert('Base de datos restablecida correctamente.');
    }
  };

  // JSON Backup Export
  const handleExportBackup = () => {
    if (!db) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(db, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `raulif_mvp_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!db) return <div className="p-20 text-center font-mono">Cargando base de datos CMS...</div>;

  // 1. SECURE LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div id="admin-login-screen" className="min-h-screen bg-stone-900 flex items-center justify-center px-4 py-20 font-sans">
        <div className="max-w-md w-full bg-stone-950 border border-stone-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          
          {/* Custom Brand Logo */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center text-emerald-500">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-widest text-white uppercase">RAULIF Core CMS</h1>
            <p className="text-xs text-stone-500 font-mono">Panel de Control de la Organización • Seguro</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-mono font-bold text-stone-400 uppercase mb-2">Clave de Administración</label>
              <div className="relative flex items-center bg-stone-900 border border-stone-800 rounded-xl p-1 focus-within:border-emerald-600">
                <KeyRound className="w-4 h-4 text-stone-500 ml-3" />
                <input
                  type="password"
                  placeholder="Introduce 'admin' para desbloquear"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-0 text-white placeholder-stone-600 focus:outline-none focus:ring-0 text-sm py-2 px-3"
                  required
                />
              </div>
            </div>

            {loginError && <p className="text-xs text-red-500">{loginError}</p>}

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Desbloquear Consola</span>
            </button>
          </form>

          <p className="text-[10px] text-stone-600 leading-relaxed font-mono">
            El sistema de administración de RAULIF está diseñado bajo arquitectura estéril sin estado central rígido, permitiendo portabilidad absoluta hacia servidores NextJS / Supabase de forma nativa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-main-panel" className="min-h-screen bg-stone-100 pt-20 flex flex-col font-sans">
      
      {/* CMS Top Controls Bar */}
      <div className="bg-white border-b border-stone-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-stone-900 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900 leading-tight">Consola de Control RAULIF</h2>
              <p className="text-[10px] font-mono text-emerald-600 uppercase font-bold">Estado: Cloud Sync Local (Persistente)</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {saveStatus === 'saving' && <span className="text-xs font-mono text-stone-500 animate-pulse">Guardando...</span>}
            {saveStatus === 'saved' && <span className="text-xs font-mono text-emerald-600 font-semibold">✓ Cambios guardados</span>}
            
            <button
              onClick={handleExportBackup}
              className="px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Descargar base de datos completa como JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Copia JSON</span>
            </button>

            <button
              onClick={handleReset}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Restablecer base de datos inicial"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => {
                window.location.hash = '#/';
                window.location.reload();
              }}
              className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Web</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Admin Navigation Sidebar */}
        <aside className="lg:col-span-3 flex flex-col space-y-1.5 bg-white border border-stone-200 rounded-2xl p-4 shadow-sm h-fit">
          <span className="text-[10px] font-mono text-stone-400 font-bold uppercase px-3 mb-2">Administrar Módulos</span>
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-stone-950 text-white' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-950'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Resumen General</span>
          </button>

          <button
            onClick={() => setActiveTab('pages')}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${
              activeTab === 'pages' ? 'bg-stone-950 text-white' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-950'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Páginas de Contenido</span>
          </button>

          <button
            onClick={() => setActiveTab('expeditions')}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${
              activeTab === 'expeditions' ? 'bg-stone-950 text-white' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-950'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span>Expediciones (Catalog)</span>
          </button>

          <button
            onClick={() => setActiveTab('ambassadors')}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${
              activeTab === 'ambassadors' ? 'bg-stone-950 text-white' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-950'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Embajadores (Guías)</span>
          </button>

          <button
            onClick={() => setActiveTab('impact')}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${
              activeTab === 'impact' ? 'bg-stone-950 text-white' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-950'
            }`}
          >
            <Flame className="w-4 h-4 shrink-0" />
            <span>Proyectos de Impacto</span>
          </button>

          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${
              activeTab === 'blog' ? 'bg-stone-950 text-white' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-950'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Blog (El Bosque Escrito)</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${
              activeTab === 'leads' ? 'bg-stone-950 text-white' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-950'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <CheckSquare className="w-4 h-4 shrink-0" />
              <span>Leads y Registros</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
              {db.newsletter.length + db.waitlist.length + db.contactoSubmissions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${
              activeTab === 'seo' ? 'bg-stone-950 text-white' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-950'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Metadatos SEO</span>
          </button>
        </aside>

        {/* Admin Content Area */}
        <main className="lg:col-span-9 bg-white border border-stone-200 rounded-2xl shadow-sm p-6 sm:p-8 min-h-[60vh] flex flex-col justify-between">
          <div>
            
            {/* 1. DASHBOARD OVERVIEW TAB */}
            {activeTab === 'dashboard' && (
              <div id="cms-tab-dashboard" className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold text-stone-950">Métricas del Motor de Sostenibilidad</h3>
                  <p className="text-xs text-stone-500 mt-1">Monitorea los prospectos y el impacto generado de forma inmediata.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-stone-50 border border-stone-100 p-5 rounded-2xl relative overflow-hidden">
                    <span className="block text-[10px] font-mono text-stone-400 font-bold uppercase">Boletín Informativo</span>
                    <span className="block text-3xl font-extrabold text-stone-950 mt-1">{db.newsletter.length}</span>
                    <span className="block text-[10px] text-stone-500 mt-1">Correos captados para nutrir</span>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl relative overflow-hidden">
                    <span className="block text-[10px] font-mono text-emerald-700 font-bold uppercase">Lista de Espera</span>
                    <span className="block text-3xl font-extrabold text-emerald-950 mt-1">{db.waitlist.length}</span>
                    <span className="block text-[10px] text-emerald-700 mt-1">Prospectos calificados de clientes</span>
                  </div>
                  <div className="bg-stone-50 border border-stone-100 p-5 rounded-2xl relative overflow-hidden">
                    <span className="block text-[10px] font-mono text-stone-400 font-bold uppercase">Mensajes de Contacto</span>
                    <span className="block text-3xl font-extrabold text-stone-950 mt-1">{db.contactoSubmissions.length}</span>
                    <span className="block text-[10px] text-stone-500 mt-1">Consultas y propuestas comerciales</span>
                  </div>
                </div>

                <div className="border border-stone-200 rounded-2xl p-6 space-y-4">
                  <h4 className="text-sm font-bold text-stone-950 uppercase tracking-wide">Métricas de Impacto Activo en Chile</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Reforestación (Árboles)</label>
                      <input
                        type="number"
                        value={db.impacto.reforestedCount}
                        onChange={(e) => {
                          const updated = { ...db };
                          updated.impacto.reforestedCount = parseInt(e.target.value) || 0;
                          handlePersist(updated);
                        }}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Escuelas Rurales Apoyadas</label>
                      <input
                        type="number"
                        value={db.impacto.schoolsSupported}
                        onChange={(e) => {
                          const updated = { ...db };
                          updated.impacto.schoolsSupported = parseInt(e.target.value) || 0;
                          handlePersist(updated);
                        }}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Hectáreas de Pudú Custodiadas</label>
                      <input
                        type="number"
                        value={db.impacto.conservedHectares}
                        onChange={(e) => {
                          const updated = { ...db };
                          updated.impacto.conservedHectares = parseInt(e.target.value) || 0;
                          handlePersist(updated);
                        }}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-sm font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-stone-950 mb-2">Instrucciones del Panel CMS</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Este panel permite modificar de forma directa y dinámica todos los contenidos de la aplicación. Cualquier cambio en títulos, imágenes, itinerarios, guías o SEO es guardado automáticamente en el almacén persistente del navegador y renderizado en vivo al instante en la parte pública del sitio. No necesitas saber programación para editar la plataforma.
                  </p>
                </div>
              </div>
            )}

            {/* 2. PAGES EDIT TAB (HOME & HISTORIA) */}
            {activeTab === 'pages' && (
              <div id="cms-tab-pages" className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold text-stone-950">Editor de Páginas de Contenido</h3>
                  <p className="text-xs text-stone-500 mt-1 font-mono">Modifica textos estratégicos, títulos y banners del Inicio e Historia.</p>
                </div>

                {/* Home Page Content */}
                <div className="border border-stone-200 rounded-2xl p-6 space-y-6">
                  <h4 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2 uppercase tracking-wider">Sección Inicio (Home)</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Título Principal (Hero)</label>
                      <input
                        type="text"
                        value={db.home.heroTitle}
                        onChange={(e) => {
                          const updated = { ...db };
                          updated.home.heroTitle = e.target.value;
                          handlePersist(updated);
                        }}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Imagen Hero (URL)</label>
                      <input
                        type="text"
                        value={db.home.heroImage}
                        onChange={(e) => {
                          const updated = { ...db };
                          updated.home.heroImage = e.target.value;
                          handlePersist(updated);
                        }}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Subtítulo Hero</label>
                    <textarea
                      value={db.home.heroSubtitle}
                      onChange={(e) => {
                        const updated = { ...db };
                        updated.home.heroSubtitle = e.target.value;
                        handlePersist(updated);
                      }}
                      rows={2}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-sm"
                    />
                  </div>

                  <div className="border-t border-stone-100 pt-4 space-y-4">
                    <h5 className="text-xs font-bold text-stone-800">Caja de Misión (Home)</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Título de Misión</label>
                        <input
                          type="text"
                          value={db.home.missionTitle}
                          onChange={(e) => {
                            const updated = { ...db };
                            updated.home.missionTitle = e.target.value;
                            handlePersist(updated);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Cita Destacada</label>
                        <input
                          type="text"
                          value={db.home.missionQuote}
                          onChange={(e) => {
                            const updated = { ...db };
                            updated.home.missionQuote = e.target.value;
                            handlePersist(updated);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Texto de Misión Completo</label>
                      <textarea
                        value={db.home.missionText}
                        onChange={(e) => {
                          const updated = { ...db };
                          updated.home.missionText = e.target.value;
                          handlePersist(updated);
                        }}
                        rows={3}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Historia Content */}
                <div className="border border-stone-200 rounded-2xl p-6 space-y-4">
                  <h4 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2 uppercase tracking-wider">Nuestra Historia</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Título Principal</label>
                      <input
                        type="text"
                        value={db.historia.title}
                        onChange={(e) => {
                          const updated = { ...db };
                          updated.historia.title = e.target.value;
                          handlePersist(updated);
                        }}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Imagen de Fondo (Banner)</label>
                      <input
                        type="text"
                        value={db.historia.heroImage}
                        onChange={(e) => {
                          const updated = { ...db };
                          updated.historia.heroImage = e.target.value;
                          handlePersist(updated);
                        }}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Origen del Movimiento (Párrafo 1)</label>
                    <textarea
                      value={db.historia.originText1}
                      onChange={(e) => {
                        const updated = { ...db };
                        updated.historia.originText1 = e.target.value;
                        handlePersist(updated);
                      }}
                      rows={3}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Símbolo y su Significado</label>
                    <textarea
                      value={db.historia.symbolText}
                      onChange={(e) => {
                        const updated = { ...db };
                        updated.historia.symbolText = e.target.value;
                        handlePersist(updated);
                      }}
                      rows={3}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. EXPEDITIONS MANAGER TAB */}
            {activeTab === 'expeditions' && (
              <div id="cms-tab-expeditions" className="space-y-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-stone-950">Catálogo de Experiencias</h3>
                    <p className="text-xs text-stone-500 mt-1">Crea, edita o retira expediciones de conservación activa.</p>
                  </div>
                  <button
                    onClick={() => {
                      const newExp: Expedition = {
                        id: `exp-${Date.now()}`,
                        slug: `nueva-expedicion-${Date.now()}`,
                        title: 'Nueva Expedición Raulif',
                        subtitle: 'Ecosistema inexplorado de Chile',
                        status: 'soon',
                        duration: '6 Días / 5 Noches',
                        physicalLevel: 'Medio',
                        dates: ['Por definir 2027'],
                        price: '1.800 €',
                        maxGroupSize: 10,
                        featuredImage: 'https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=800&auto=format&fit=crop',
                        gallery: [],
                        mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop',
                        responsibleGuideId: 'claudio-araya',
                        storySummary: 'Describe la historia de conservación de esta nueva expedición.',
                        chapters: [],
                        itinerary: [],
                        whatsIncluded: [],
                        whatsNotIncluded: [],
                        faqs: []
                      };
                      const updated = { ...db };
                      updated.expediciones.push(newExp);
                      handlePersist(updated);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir Expedición</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {db.expediciones.map((exp) => (
                    <div key={exp.id} className="border border-stone-200 rounded-2xl p-5 bg-stone-50 flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={exp.featuredImage}
                          alt={exp.title}
                          className="w-20 h-20 object-cover rounded-xl"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-bold text-stone-900">{exp.title}</h4>
                            <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                              exp.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {exp.status === 'active' ? 'Convocatoria Abierta' : 'Próximamente'}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 max-w-md">{exp.subtitle}</p>
                          <div className="text-xs font-mono text-stone-600 flex items-center space-x-3 pt-1">
                            <span>{exp.duration}</span>
                            <span>•</span>
                            <span>Nivel: {exp.physicalLevel}</span>
                            <span>•</span>
                            <span className="font-bold text-stone-900">{exp.price}</span>
                          </div>
                        </div>
                      </div>

                      {/* Editing Actions */}
                      <div className="flex items-center space-x-3 shrink-0 self-end md:self-center">
                        <button
                          onClick={() => {
                            // Inline Quick status change
                            const updated = { ...db };
                            const idx = updated.expediciones.findIndex(e => e.id === exp.id);
                            if (idx !== -1) {
                              updated.expediciones[idx].status = updated.expediciones[idx].status === 'active' ? 'soon' : 'active';
                              handlePersist(updated);
                            }
                          }}
                          className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 rounded-lg text-xs font-mono transition-colors cursor-pointer"
                        >
                          Alternar Estado
                        </button>

                        <button
                          onClick={() => {
                            // Delete
                            if (confirm(`¿Estás seguro de que deseas eliminar la expedición "${exp.title}"?`)) {
                              const updated = { ...db };
                              updated.expediciones = updated.expediciones.filter(e => e.id !== exp.id);
                              handlePersist(updated);
                            }
                          }}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. AMBASSADORS MANAGER TAB */}
            {activeTab === 'ambassadors' && (
              <div id="cms-tab-ambassadors" className="space-y-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-stone-950">Embajadores y Guías Científicos</h3>
                    <p className="text-xs text-stone-500 mt-1">Configura las biografías, certificaciones y especialidades del equipo en terreno.</p>
                  </div>
                  <button
                    onClick={() => {
                      const newGuide: Ambassador = {
                        id: `guide-${Date.now()}`,
                        name: 'Nuevo Guía',
                        role: 'Guía de Conservación',
                        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
                        bio: 'Explorador y biólogo...',
                        specialty: 'Botánica, Ornitología, Primeros auxilios',
                        languages: ['Español', 'Inglés'],
                        certifications: ['Guía WFR'],
                        quote: 'Cuidar la Tierra es nuestro único camino.',
                        gallery: []
                      };
                      const updated = { ...db };
                      updated.embajadores.push(newGuide);
                      handlePersist(updated);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir Guía</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {db.embajadores.map((amb, idx) => (
                    <div key={amb.id} className="border border-stone-200 rounded-2xl p-6 bg-stone-50 space-y-4 relative">
                      <button
                        onClick={() => {
                          const updated = { ...db };
                          updated.embajadores = updated.embajadores.filter(a => a.id !== amb.id);
                          handlePersist(updated);
                        }}
                        className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-3 text-center">
                          <img
                            src={amb.photo}
                            alt={amb.name}
                            className="w-20 h-20 object-cover rounded-full mx-auto border"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Nombre</label>
                            <input
                              type="text"
                              value={amb.name}
                              onChange={(e) => {
                                const updated = { ...db };
                                updated.embajadores[idx].name = e.target.value;
                                handlePersist(updated);
                              }}
                              className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Rol / Cargo</label>
                            <input
                              type="text"
                              value={amb.role}
                              onChange={(e) => {
                                const updated = { ...db };
                                updated.embajadores[idx].role = e.target.value;
                                handlePersist(updated);
                              }}
                              className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Cita Representativa (Quote)</label>
                        <input
                          type="text"
                          value={amb.quote}
                          onChange={(e) => {
                            const updated = { ...db };
                            updated.embajadores[idx].quote = e.target.value;
                            handlePersist(updated);
                          }}
                          className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs italic"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Biografía Breve</label>
                        <textarea
                          value={amb.bio}
                          onChange={(e) => {
                            const updated = { ...db };
                            updated.embajadores[idx].bio = e.target.value;
                            handlePersist(updated);
                          }}
                          rows={3}
                          className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. IMPACT PROJECTS TAB */}
            {activeTab === 'impact' && (
              <div id="cms-tab-impact" className="space-y-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-stone-950">Módulos de Impacto</h3>
                    <p className="text-xs text-stone-500 mt-1">Sube y documenta los proyectos reales financiados por el motor de sostenibilidad.</p>
                  </div>
                  <button
                    onClick={() => {
                      const newProj: ImpactProject = {
                        id: `proj-${Date.now()}`,
                        title: 'Nueva Iniciativa de Impacto',
                        category: 'Reforestación',
                        description: 'Breve descripción del logro.',
                        metricValue: '100+',
                        metricLabel: 'Hitos',
                        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop',
                        location: 'Chile',
                        details: 'Explicación técnica del proyecto.'
                      };
                      const updated = { ...db };
                      updated.impacto.projects.push(newProj);
                      handlePersist(updated);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir Proyecto</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {db.impacto.projects.map((proj, idx) => (
                    <div key={proj.id} className="border border-stone-200 rounded-2xl p-5 bg-stone-50 space-y-4 relative">
                      <button
                        onClick={() => {
                          const updated = { ...db };
                          updated.impacto.projects = updated.impacto.projects.filter(p => p.id !== proj.id);
                          handlePersist(updated);
                        }}
                        className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Título del Proyecto</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const updated = { ...db };
                              updated.impacto.projects[idx].title = e.target.value;
                              handlePersist(updated);
                            }}
                            className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Categoría</label>
                          <select
                            value={proj.category}
                            onChange={(e) => {
                              const updated = { ...db };
                              updated.impacto.projects[idx].category = e.target.value as any;
                              handlePersist(updated);
                            }}
                            className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs"
                          >
                            <option value="Reforestación">Reforestación</option>
                            <option value="Educación">Educación</option>
                            <option value="Conservación">Conservación</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Valor Métrica (Ej. "4.500+")</label>
                          <input
                            type="text"
                            value={proj.metricValue}
                            onChange={(e) => {
                              const updated = { ...db };
                              updated.impacto.projects[idx].metricValue = e.target.value;
                              handlePersist(updated);
                            }}
                            className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Etiqueta Métrica (Ej. "Árboles Plantados")</label>
                          <input
                            type="text"
                            value={proj.metricLabel}
                            onChange={(e) => {
                              const updated = { ...db };
                              updated.impacto.projects[idx].metricLabel = e.target.value;
                              handlePersist(updated);
                            }}
                            className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Ubicación Geográfica</label>
                        <input
                          type="text"
                          value={proj.location}
                          onChange={(e) => {
                            const updated = { ...db };
                            updated.impacto.projects[idx].location = e.target.value;
                            handlePersist(updated);
                          }}
                          className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Descripción Corta</label>
                        <input
                          type="text"
                          value={proj.description}
                          onChange={(e) => {
                            const updated = { ...db };
                            updated.impacto.projects[idx].description = e.target.value;
                            handlePersist(updated);
                          }}
                          className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Detalles Técnicos y Cronología</label>
                        <textarea
                          value={proj.details}
                          onChange={(e) => {
                            const updated = { ...db };
                            updated.impacto.projects[idx].details = e.target.value;
                            handlePersist(updated);
                          }}
                          rows={3}
                          className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. BLOG MANAGER TAB */}
            {activeTab === 'blog' && (
              <div id="cms-tab-blog" className="space-y-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-stone-950">El Bosque Escrito (Blog)</h3>
                    <p className="text-xs text-stone-500 mt-1">Publica artículos, crónicas, entrevistas o reportes científicos.</p>
                  </div>
                  <button
                    onClick={() => {
                      const newPost: BlogPost = {
                        id: `post-${Date.now()}`,
                        title: 'Título del Nuevo Artículo',
                        slug: `nuevo-articulo-${Date.now()}`,
                        excerpt: 'Resumen o copete del artículo para previsualización.',
                        content: 'Escribe tu contenido aquí usando Markdown nativo si lo deseas.',
                        authorId: 'claudio-araya',
                        publishedAt: new Date().toISOString().split('T')[0],
                        readTime: '4 min lectura',
                        coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
                        tags: ['Conservación'],
                        isPublished: true
                      };
                      const updated = { ...db };
                      updated.blog.unshift(newPost);
                      handlePersist(updated);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Redactar Artículo</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {db.blog.map((post, idx) => (
                    <div key={post.id} className="border border-stone-200 rounded-2xl p-5 bg-stone-50 space-y-4 relative">
                      <button
                        onClick={() => {
                          const updated = { ...db };
                          updated.blog = updated.blog.filter(p => p.id !== post.id);
                          handlePersist(updated);
                        }}
                        className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Título del Artículo</label>
                          <input
                            type="text"
                            value={post.title}
                            onChange={(e) => {
                              const updated = { ...db };
                              updated.blog[idx].title = e.target.value;
                              updated.blog[idx].slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                              handlePersist(updated);
                            }}
                            className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono font-bold text-stone-600 mb-1">URL amigable (Slug auto-generado)</label>
                          <input
                            type="text"
                            value={post.slug}
                            disabled
                            className="w-full bg-stone-100 border border-stone-200 rounded-lg p-2 text-xs text-stone-500 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Autor</label>
                          <select
                            value={post.authorId}
                            onChange={(e) => {
                              const updated = { ...db };
                              updated.blog[idx].authorId = e.target.value;
                              handlePersist(updated);
                            }}
                            className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs"
                          >
                            {db.embajadores.map(a => (
                              <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Fecha de Publicación</label>
                          <input
                            type="date"
                            value={post.publishedAt}
                            onChange={(e) => {
                              const updated = { ...db };
                              updated.blog[idx].publishedAt = e.target.value;
                              handlePersist(updated);
                            }}
                            className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Tiempo de Lectura</label>
                          <input
                            type="text"
                            value={post.readTime}
                            onChange={(e) => {
                              const updated = { ...db };
                              updated.blog[idx].readTime = e.target.value;
                              handlePersist(updated);
                            }}
                            className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Imagen de Portada (URL)</label>
                        <input
                          type="text"
                          value={post.coverImage}
                          onChange={(e) => {
                            const updated = { ...db };
                            updated.blog[idx].coverImage = e.target.value;
                            handlePersist(updated);
                          }}
                          className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Resumen del Artículo (Excerpt)</label>
                        <input
                          type="text"
                          value={post.excerpt}
                          onChange={(e) => {
                            const updated = { ...db };
                            updated.blog[idx].excerpt = e.target.value;
                            handlePersist(updated);
                          }}
                          className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Cuerpo Completo del Artículo (Soporta Markdown)</label>
                        <textarea
                          value={post.content}
                          onChange={(e) => {
                            const updated = { ...db };
                            updated.blog[idx].content = e.target.value;
                            handlePersist(updated);
                          }}
                          rows={8}
                          className="w-full bg-white border border-stone-200 rounded-lg p-3 text-xs font-sans leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. LEADS VIEWER & NEWSLETTER MANAGEMENT */}
            {activeTab === 'leads' && (
              <div id="cms-tab-leads" className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold text-stone-950">Consola de Prospectos y Solicitudes</h3>
                  <p className="text-xs text-stone-500 mt-1">Administra los correos de boletines, las listas de espera de expediciones y los contactos recibidos.</p>
                </div>

                {/* WAITLIST REGISTERED CLIENTS */}
                <div className="border border-stone-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h4 className="text-sm font-bold text-stone-950 uppercase tracking-wide flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span>Inscritos en Lista de Espera</span>
                    </h4>
                    <span className="bg-stone-100 text-stone-800 font-mono font-bold text-xs px-2.5 py-1 rounded-full">
                      {db.waitlist.length} registros
                    </span>
                  </div>

                  {db.waitlist.length === 0 ? (
                    <p className="text-xs text-stone-500 italic py-4 text-center">No hay registros de solicitudes prioritarias aún.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-stone-100 text-stone-400 font-mono font-bold">
                            <th className="py-2.5">Nombre</th>
                            <th className="py-2.5">Contacto</th>
                            <th className="py-2.5">Expedición / Fecha</th>
                            <th className="py-2.5">Fecha Registro</th>
                            <th className="py-2.5">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50 font-sans">
                          {db.waitlist.map((lead) => (
                            <tr key={lead.id} className="hover:bg-stone-50/50">
                              <td className="py-3 font-semibold text-stone-950">{lead.name}</td>
                              <td className="py-3">
                                <div className="flex flex-col">
                                  <span className="flex items-center text-stone-700"><Mail className="w-3 h-3 text-stone-400 mr-1 shrink-0" />{lead.email}</span>
                                  <span className="flex items-center text-stone-500"><Phone className="w-3 h-3 text-stone-400 mr-1 shrink-0" />{lead.phone}</span>
                                </div>
                              </td>
                              <td className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-semibold text-stone-800">{lead.expeditionId === 'bosque-valdiviano' ? 'Bosque Valdiviano' : lead.expeditionId}</span>
                                  <span className="text-[10px] text-stone-500 flex items-center"><Calendar className="w-3 h-3 text-stone-400 mr-1 shrink-0" />{lead.preferredDate}</span>
                                </div>
                              </td>
                              <td className="py-3 font-mono text-stone-500 text-[10px]">{new Date(lead.createdAt).toLocaleString()}</td>
                              <td className="py-3">
                                <button
                                  onClick={() => {
                                    const updated = { ...db };
                                    updated.waitlist = updated.waitlist.filter(w => w.id !== lead.id);
                                    handlePersist(updated);
                                  }}
                                  className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* NEWSLETTER SUBSCRIBERS */}
                <div className="border border-stone-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h4 className="text-sm font-bold text-stone-950 uppercase tracking-wide flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                      <span>Boletín de Correo (Newsletter)</span>
                    </h4>
                    <span className="bg-stone-100 text-stone-800 font-mono font-bold text-xs px-2.5 py-1 rounded-full">
                      {db.newsletter.length} correos
                    </span>
                  </div>

                  {db.newsletter.length === 0 ? (
                    <p className="text-xs text-stone-500 italic py-4 text-center">No hay suscriptores suscritos.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                      {db.newsletter.map((sub) => (
                        <div key={sub.id} className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex items-center justify-between text-xs">
                          <div className="flex flex-col">
                            <span className="font-semibold text-stone-900">{sub.email}</span>
                            <span className="text-[9px] font-mono text-stone-400">Inscrito: {new Date(sub.createdAt).toLocaleDateString()}</span>
                          </div>
                          <button
                            onClick={() => {
                              const updated = { ...db };
                              updated.newsletter = updated.newsletter.filter(n => n.id !== sub.id);
                              handlePersist(updated);
                            }}
                            className="text-red-500 hover:text-red-700 font-semibold cursor-pointer shrink-0"
                          >
                            Quitar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CONTACT SUBMISSIONS */}
                <div className="border border-stone-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h4 className="text-sm font-bold text-stone-950 uppercase tracking-wide flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span>Mensajes de Contacto Recibidos</span>
                    </h4>
                    <span className="bg-stone-100 text-stone-800 font-mono font-bold text-xs px-2.5 py-1 rounded-full">
                      {db.contactoSubmissions.length} mensajes
                    </span>
                  </div>

                  {db.contactoSubmissions.length === 0 ? (
                    <p className="text-xs text-stone-500 italic py-4 text-center">No hay mensajes entrantes.</p>
                  ) : (
                    <div className="space-y-4">
                      {db.contactoSubmissions.map((msg) => (
                        <div key={msg.id} className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2 text-xs">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-2">
                            <span className="font-bold text-stone-900">{msg.name} ({msg.email})</span>
                            <span className="text-[10px] font-mono text-stone-500">{new Date(msg.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="font-bold text-stone-800">Asunto: {msg.subject}</p>
                          <p className="text-stone-600 leading-relaxed bg-white border border-stone-100 p-3 rounded-lg font-sans italic">
                            "{msg.message}"
                          </p>
                          <button
                            onClick={() => {
                              const updated = { ...db };
                              updated.contactoSubmissions = updated.contactoSubmissions.filter(c => c.id !== msg.id);
                              handlePersist(updated);
                            }}
                            className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                          >
                            Eliminar este mensaje
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 8. SEO MASTER TAB */}
            {activeTab === 'seo' && (
              <div id="cms-tab-seo" className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold text-stone-950">Metadatos Dinámicos (SEO Master)</h3>
                  <p className="text-xs text-stone-500 mt-1 font-mono">Modifica las etiquetas Head, títulos y palabras clave dinámicamente por página.</p>
                </div>

                <div className="space-y-6">
                  {Object.keys(db.seo).map((pageKey) => {
                    const key = pageKey as keyof typeof db.seo;
                    return (
                      <div key={key} className="border border-stone-200 rounded-2xl p-5 bg-stone-50 space-y-4">
                        <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-wider block">Página: {key}</span>
                        
                        <div>
                          <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Meta Title (Título de pestaña)</label>
                          <input
                            type="text"
                            value={db.seo[key].title}
                            onChange={(e) => {
                              const updated = { ...db };
                              updated.seo[key].title = e.target.value;
                              handlePersist(updated);
                            }}
                            className="w-full bg-white border border-stone-200 rounded-lg p-2.5 text-xs font-semibold text-stone-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Meta Description (Snippet de búsqueda Google)</label>
                          <textarea
                            value={db.seo[key].description}
                            onChange={(e) => {
                              const updated = { ...db };
                              updated.seo[key].description = e.target.value;
                              handlePersist(updated);
                            }}
                            rows={2}
                            className="w-full bg-white border border-stone-200 rounded-lg p-2.5 text-xs text-stone-700"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-bold text-stone-600 mb-1">Keywords (Palabras clave separadas por comas)</label>
                          <input
                            type="text"
                            value={db.seo[key].keywords}
                            onChange={(e) => {
                              const updated = { ...db };
                              updated.seo[key].keywords = e.target.value;
                              handlePersist(updated);
                            }}
                            className="w-full bg-white border border-stone-200 rounded-lg p-2.5 text-xs text-stone-600 font-mono"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Persistent Save Status Indicator at bottom */}
          <div className="border-t border-stone-100 pt-6 mt-8 flex justify-end">
            <span className="text-xs text-stone-400 font-mono">Consola RAULIF v1.0.0 • React & LocalStorage Engine</span>
          </div>
        </main>
      </div>

    </div>
  );
}
