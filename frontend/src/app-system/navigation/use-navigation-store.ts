'use client';

import { create } from 'zustand';

export interface NavigationEntry {
  path: string;
  label: string;
}

interface NavigationState {
  history: NavigationEntry[];
  currentIndex: number;

  push: (path: string, label: string) => void;
  back: () => NavigationEntry | null;
  forward: () => NavigationEntry | null;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
}

const MAX_HISTORY = 20;

export const useNavigationStore = create<NavigationState>((set, get) => ({
  history: [],
  currentIndex: -1,

  push: (path: string, label: string) => {
    const { history, currentIndex } = get();

    // If the new path matches the current entry, do nothing
    if (history[currentIndex]?.path === path) return;

    // Trim future entries if we're not at the end of history
    let nextHistory = history;
    if (currentIndex < history.length - 1) {
      nextHistory = history.slice(0, currentIndex + 1);
    }

    const newEntry: NavigationEntry = { path, label };
    let newHistory: NavigationEntry[];

    // If we're at max capacity, drop the oldest entry
    if (nextHistory.length >= MAX_HISTORY) {
      newHistory = [...nextHistory.slice(1), newEntry];
      set({
        history: newHistory,
        currentIndex: newHistory.length - 1,
      });
    } else {
      newHistory = [...nextHistory, newEntry];
      set({
        history: newHistory,
        currentIndex: newHistory.length - 1,
      });
    }
  },

  back: () => {
    const { history, currentIndex } = get();
    if (currentIndex <= 0) return null;
    const newIndex = currentIndex - 1;
    set({ currentIndex: newIndex });
    return history[newIndex];
  },

  forward: () => {
    const { history, currentIndex } = get();
    if (currentIndex >= history.length - 1) return null;
    const newIndex = currentIndex + 1;
    set({ currentIndex: newIndex });
    return history[newIndex];
  },

  canGoBack: () => {
    return get().currentIndex > 0;
  },

  canGoForward: () => {
    const { history, currentIndex } = get();
    return currentIndex < history.length - 1;
  },
}));
