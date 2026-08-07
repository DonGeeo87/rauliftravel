import { useState } from 'react';
import { Calendar, Clock, ArrowLeft, BookOpenText, ShareNetwork } from '@phosphor-icons/react';
import { GlobalCMSState, BlogPost } from '../types';

interface BlogViewProps {
  db: GlobalCMSState;
}

const C = {
  bg: '#0a0f0d', bg2: '#101713', card: '#141c18',
  ink: '#eef5f1', dim: '#8ba093', emerald: '#38c98b',
  border: 'rgba(255,255,255,0.07)',
};

export default function BlogView({ db }: BlogViewProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const posts = db.blog.filter(post => post.isPublished);

  const getAuthor = (authorId: string) => {
    return db.embajadores.find(a => a.id === authorId) || {
      name: 'Equipo Raulif', role: 'Conservacionista',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
    };
  };

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (selectedPost) {
    const author = getAuthor(selectedPost.authorId);
    return (
      <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh', paddingTop: '96px' }}>
        <div className="mx-auto max-w-4xl space-y-8 px-4 py-12 sm:px-6">
          <button onClick={() => setSelectedPost(null)} className="flex cursor-pointer items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors" style={{ color: C.dim }}>
            <ArrowLeft className="h-4 w-4" /> Volver a la bitácora
          </button>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5">
              {selectedPost.tags.map((t, idx) => (
                <span key={idx} className="rounded-md px-2.5 py-1 text-[9px] font-bold uppercase" style={{ backgroundColor: 'rgba(56,201,139,0.12)', color: C.emerald }}>{t}</span>
              ))}
            </div>
            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">{selectedPost.title}</h1>
            <p className="border-l-2 py-0.5 pl-4 text-sm italic leading-relaxed" style={{ borderColor: C.emerald, color: C.dim }}>{selectedPost.excerpt}</p>
            <div className="flex flex-col justify-between gap-4 border-y py-4 sm:flex-row sm:items-center" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-3">
                <img src={author.photo} alt={author.name} className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="text-xs font-bold" style={{ color: C.ink }}>{author.name}</h4>
                  <span className="mt-1 block text-[10px]" style={{ color: C.dim }}>{author.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 font-mono text-xs" style={{ color: 'rgba(139,160,147,0.6)' }}>
                <span className="flex items-center"><Calendar className="mr-1.5 h-3.5 w-3.5 shrink-0" />{selectedPost.publishedAt}</span>
                <span className="flex items-center"><Clock className="mr-1.5 h-3.5 w-3.5 shrink-0" />{selectedPost.readTime}</span>
              </div>
            </div>
          </div>

          <div className="aspect-[16/9] overflow-hidden rounded-3xl border" style={{ borderColor: C.border }}>
            <img src={selectedPost.coverImage} alt={selectedPost.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </div>

          <article className="space-y-6 pt-4 text-sm leading-relaxed sm:text-base" style={{ color: C.dim }}>
            {selectedPost.content.split('\n\n').map((para, pIdx) => {
              if (para.startsWith('###')) return <h3 key={pIdx} className="pt-4 text-lg font-bold sm:text-xl" style={{ color: C.ink }}>{para.replace('###', '').trim()}</h3>;
              if (para.startsWith('1.') || para.startsWith('-')) return (
                <ul key={pIdx} className="list-disc space-y-1.5 pl-5 text-xs sm:text-sm">
                  {para.split('\n').map((li, lIdx) => <li key={lIdx}>{li.replace(/^[-\d.]\s*/, '').replace(/\*\*/g, '')}</li>)}
                </ul>
              );
              return <p key={pIdx} className="font-light">{para.split('**').map((chunk, cIdx) => cIdx % 2 === 1 ? <strong key={cIdx} style={{ color: C.ink }}>{chunk}</strong> : chunk)}</p>;
            })}
          </article>

          <div className="mt-12 flex items-center justify-between border-t pt-8" style={{ borderColor: C.border }}>
            <div className="font-mono text-xs" style={{ color: 'rgba(139,160,147,0.6)' }}>Comunidad RAULIF · El Bosque Escrito</div>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); }} className="flex cursor-pointer items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-semibold transition-colors hover:bg-white/5" style={{ borderColor: C.border, color: C.dim }}>
              <ShareNetwork className="h-3.5 w-3.5" /> Compartir artículo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh', paddingTop: '96px' }}>
      <section className="border-b px-4 py-16 text-center sm:px-6" style={{ borderColor: C.border, backgroundColor: C.bg2 }}>
        <div className="mx-auto max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold" style={{ borderColor: C.border, color: C.emerald }}>
            <BookOpenText className="h-3.5 w-3.5" /> Bitácora
          </span>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">El Bosque Escrito</h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed" style={{ color: C.dim }}>
            Crónicas, divulgación de biólogos chilenos y apuntes fotográficos recopilados en las expediciones.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {posts.map((post) => {
            const author = getAuthor(post.authorId);
            return (
              <div key={post.id} onClick={() => handlePostClick(post)} className="flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border transition-all hover:-translate-y-1" style={{ borderColor: C.border, backgroundColor: C.bg2 }}>
                <div className="space-y-4">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" referrerPolicy="no-referrer" />
                    <div className="absolute left-4 top-4 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest" style={{ backgroundColor: 'rgba(10,15,13,0.9)', color: C.emerald }}>{post.tags[0] || 'Conservación'}</div>
                  </div>
                  <div className="space-y-3 p-6">
                    <div className="flex items-center gap-3 font-mono text-xs" style={{ color: 'rgba(139,160,147,0.6)' }}>
                      <span>{post.publishedAt}</span><span>·</span><span>{post.readTime}</span>
                    </div>
                    <h3 className="line-clamp-2 text-lg font-bold leading-tight transition-colors" style={{ color: C.ink }}>{post.title}</h3>
                    <p className="line-clamp-3 text-xs leading-relaxed sm:text-sm" style={{ color: C.dim }}>{post.excerpt}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t px-6 pb-6 pt-4" style={{ borderColor: C.border }}>
                  <div className="flex items-center gap-2 text-xs">
                    <img src={author.photo} alt={author.name} className="h-7 w-7 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <span className="font-semibold" style={{ color: C.ink }}>{author.name}</span>
                  </div>
                  <span className="text-xs font-bold uppercase" style={{ color: C.emerald }}>Leer más →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
