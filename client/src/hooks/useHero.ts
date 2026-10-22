import { useState, useEffect } from 'react';
import { api, HeroContent } from '../utils/api';

export function useHero() {
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await api.get<HeroContent>('/hero');
        setHero(response.data);
      } catch {
        setHero(null);
      } finally {
        setLoading(false);
      }
    };
    void fetchHero();
  }, []);

  return { hero, loading };
}