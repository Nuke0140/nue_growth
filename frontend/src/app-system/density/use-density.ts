'use client';

import { create } from 'zustand';

export type Density = 'comfortable' | 'compact';

const STORAGE_KEY = 'pxs-density';

function readStoredDensity(): Density {
  if (typeof window === 'undefined') return 'comfortable';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'compact' || stored === 'comfortable') return stored;
  } catch {
    // localStorage unavailable
  }
  return 'comfortable';
}

interface DensityState {
  density: Density;
  isCompact: boolean;
  toggleDensity: () => void;
}

export const useDensity = create<DensityState>((set, get) => ({
  density: readStoredDensity(),
  isCompact: readStoredDensity() === 'compact',

  toggleDensity: () => {
    const next: Density = get().density === 'comfortable' ? 'compact' : 'comfortable';
    set({ density: next, isCompact: next === 'compact' });
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable
    }
  },
}));
