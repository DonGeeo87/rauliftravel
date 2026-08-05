/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Calendar, Clock, ArrowLeft, BookOpen, Share2 } from 'lucide-react';
import { GlobalCMSState, BlogPost } from '../types';

interface BlogViewProps {
  db: GlobalCMSState;
}

export default function BlogView({ db }: BlogViewProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Filter out unpublished posts for safety
  const posts = db.blog.filter(post => post.isPublished);

  // Retrieve author details helper
  const getAuthor = (authorId: string) => {
    return db.embajadores.find(a => a.id === authorId) || {
      name: 'Equipo Raulif',
      role: 'Conservacionista',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
    };
  };

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. FULL ARTICLE LECTURE VIEW
  if (selectedPost) {
    const author = getAuthor(selectedPost.authorId);
    
    return (
      <div id="blog-post-detail" className="bg-brand-bg min-h-screen pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 font-sans">
          
          {/* Back Action */}
          <button
            onClick={() => setSelectedPost(null)}
            className="text-brand-dark/50 hover:text-brand-dark font-mono text-xs font-bold uppercase tracking-widest flex items-center space-x-2 cursor-pointer focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la bitácora</span>
          </button>

          {/* Article Header */}
          <div className="space-y-4 text-left">
            <div className="flex flex-wrap gap-1.5">
              {selectedPost.tags.map((t, idx) => (
                <span key={idx} className="bg-brand-green/10 text-brand-green font-mono text-[9px] font-bold uppercase px-2.5 py-1 rounded-md">
                  {t}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-brand-dark tracking-tight leading-tight">
              {selectedPost.title}
            </h1>
            
            <p className="text-brand-dark/70 text-sm leading-relaxed border-l-2 border-brand-green pl-4 py-0.5 italic">
              {selectedPost.excerpt}
            </p>

            <div className="pt-4 border-y border-brand-dark/5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Author Card */}
              <div className="flex items-center space-x-3">
                <img
                  src={author.photo}
                  alt={author.name}
                  className="w-10 h-10 object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-bold text-brand-dark leading-none">{author.name}</h4>
                  <span className="text-[10px] text-brand-dark/60 leading-none block mt-1">{author.role}</span>
                </div>
              </div>

              {/* Meta information */}
              <div className="flex items-center space-x-4 text-xs text-brand-dark/40 font-mono">
                <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5 shrink-0" />{selectedPost.publishedAt}</span>
                <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 shrink-0" />{selectedPost.readTime}</span>
              </div>
            </div>
          </div>

          {/* Majestic Hero Image */}
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-brand-dark/5 shadow-sm">
            <img
              src={selectedPost.coverImage}
              alt={selectedPost.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Body Content with nice Typography */}
          <article className="prose prose-stone max-w-none text-brand-dark/80 font-sans text-sm sm:text-base leading-relaxed space-y-6 pt-4">
            {selectedPost.content.split('\n\n').map((para, pIdx) => {
              if (para.startsWith('###')) {
                return (
                  <h3 key={pIdx} className="text-lg sm:text-xl font-serif text-brand-dark pt-4">
                    {para.replace('###', '').trim()}
                  </h3>
                );
              }
              if (para.startsWith('1.') || para.startsWith('-')) {
                return (
                  <ul key={pIdx} className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                    {para.split('\n').map((li, lIdx) => (
                      <li key={lIdx}>{li.replace(/^[-\d.]\s*/, '').replace(/\*\*/g, '')}</li>
                    ))}
                  </ul>
                );
              }
              // Normal Paragraph with bold formatting regex
              return (
                <p key={pIdx} className="text-brand-dark/75 text-xs sm:text-sm leading-relaxed font-light">
                  {para.split('**').map((chunk, cIdx) => 
                    cIdx % 2 === 1 ? <strong key={cIdx} className="text-brand-dark font-semibold">{chunk}</strong> : chunk
                  )}
                </p>
              );
            })}
          </article>

          {/* Social Share Callout */}
          <div className="border-t border-brand-dark/5 pt-8 mt-12 flex items-center justify-between">
            <div className="text-xs text-brand-dark/45 font-mono">
              Comunidad RAULIF • El Bosque Escrito
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Enlace copiado al portapapeles. ¡Compártelo con tu red!');
              }}
              className="px-4 py-2 border border-brand-dark/10 hover:bg-white text-brand-dark rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer focus:outline-none"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartir artículo</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 2. MAIN BLOG GRID VIEW
  return (
    <div id="blog-view" className="bg-brand-bg min-h-screen pt-16">
      
      {/* Header */}
      <section className="py-20 bg-brand-dark text-white text-center border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-green uppercase bg-white/10 px-3 py-1.5 rounded-full">Bitácora de Conservación</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight">El Bosque Escrito</h1>
          <p className="text-brand-bg/80 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-sans font-light">
            Crónicas, divulgación de biólogos chilenos y apuntes fotográficos recopilados directamente en las expediciones activas.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => {
            const author = getAuthor(post.authorId);
            return (
              <div
                key={post.id}
                id={`blog-card-${post.slug}`}
                onClick={() => handlePostClick(post)}
                className="bg-white border border-brand-dark/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Banner */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-brand-dark/90 backdrop-blur-sm text-brand-green font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
                      {post.tags[0] || 'Conservación'}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center space-x-3 text-xs text-brand-dark/45 font-mono">
                      <span>{post.publishedAt}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-lg font-serif text-brand-dark group-hover:text-brand-green transition-colors leading-tight line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-brand-dark/75 text-xs sm:text-sm leading-relaxed font-sans font-light line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer specs inside card */}
                <div className="px-6 pb-6 pt-4 border-t border-brand-dark/5 flex items-center justify-between">
                  {/* Author metadata */}
                  <div className="flex items-center space-x-2 text-xs">
                    <img
                      src={author.photo}
                      alt={author.name}
                      className="w-7 h-7 object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-semibold text-brand-dark">{author.name}</span>
                  </div>

                  <span className="text-brand-dark font-mono text-xs font-bold uppercase group-hover:text-brand-green transition-colors">
                    Leer más →
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
