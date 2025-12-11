// src/context/ShowsContext.tsx
import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { fetchShows } from '../api/api';
import type { DoctorOrShow } from '../types';

interface ShowsCtx {
  shows: DoctorOrShow[] | null;
  refreshShows: () => Promise<void>;
}

export const ShowsContext = createContext<ShowsCtx | null>(null);

export const ShowsProvider = ({ children }: { children: ReactNode }) => {
  const [shows, setShows] = useState<DoctorOrShow[] | null>(null);

  const refreshShows = async () => {
    try {
      const data = await fetchShows();
      setShows(data);
    } catch (err) {
      console.error('Failed to refresh shows', err);
      setShows([]);
    }
  };

  useEffect(() => {
    // fetch once on mount
    refreshShows();
  }, []);

  return (
    <ShowsContext.Provider value={{ shows, refreshShows }}>
      {children}
    </ShowsContext.Provider>
  );
};
