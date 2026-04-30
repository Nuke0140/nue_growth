'use client';

import { create } from 'zustand';

export type ViewMode = 'table' | 'card' | 'kanban';

const STORAGE_KEY = 'pxs-view-modes';
const DEFAULT_MODE: ViewMode = 'table';

function readStoredModes(): Record<string, ViewMode> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    // Validate all values are legitimate ViewModes
    const validModes = new Set<ViewMode>(['table', 'card', 'kanban']);
    const result: Record<string, ViewMode> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (validModes.has(v as ViewMode)) {
        result[k] = v as ViewMode;
      }
    }
    return result;
  } catch {
    return {};
  }
}

function persistModes(viewModes: Record<string, ViewMode>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(viewModes));
  } catch {
    // localStorage unavailable
  }
}

interface ViewModeState {
  viewModes: Record<string, ViewMode>;
  getViewMode: (pageKey: string) => ViewMode;
  setViewMode: (pageKey: string, mode: ViewMode) => void;
}

export const useViewMode = create<ViewModeState>((set, get) => ({
  viewModes: readStoredModes(),

  getViewMode: (pageKey: string): ViewMode => {
    return get().viewModes[pageKey] ?? DEFAULT_MODE;
  },

  setViewMode: (pageKey: string, mode: ViewMode) => {
    const next = { ...get().viewModes, [pageKey]: mode };
    set({ viewModes: next });
    persistModes(next);
  },
}));
