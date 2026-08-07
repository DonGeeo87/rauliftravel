import { useState, useEffect } from 'react';

export interface PexelsPhoto {
  id: number;
  alt: string;
  url: string;
  thumb: string;
  photographer: string;
}

/** Hook que consulta el proxy de Pexels del backend (key segura en servidor). */
export function usePexels(query: string, perPage = 8): { photos: PexelsPhoto[]; loading: boolean } {
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    if (!query) {
      setPhotos([]);
      setLoading(false);
      return;
    }
    fetch(`/api/raulif-mvp/images?q=${encodeURIComponent(query)}&per_page=${perPage}`)
      .then((r) => r.json())
      .then((d) => {
        if (active) setPhotos(Array.isArray(d.photos) ? d.photos : []);
      })
      .catch(() => { if (active) setPhotos([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [query, perPage]);

  return { photos, loading };
}
