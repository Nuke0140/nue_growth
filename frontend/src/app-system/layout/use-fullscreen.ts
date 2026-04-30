'use client';

import { useSyncExternalStore, useEffect, useCallback, useRef } from 'react';

// ---------------------------------------------------------------------------
// Fullscreen API types (not fully typed in all browsers)
// ---------------------------------------------------------------------------
type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
};

type DocumentWithFullscreen = Document & {
  webkitFullscreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
};

// ---------------------------------------------------------------------------
// Browser compatibility helpers
// ---------------------------------------------------------------------------
function getFullscreenElement(doc: DocumentWithFullscreen): Element | null {
  return (
    doc.fullscreenElement ??
    doc.webkitFullscreenElement ??
    doc.msFullscreenElement ??
    null
  );
}

function requestFullscreen(el: FullscreenElement): Promise<void> {
  if (el.requestFullscreen) {
    return el.requestFullscreen();
  }
  if (el.webkitRequestFullscreen) {
    return el.webkitRequestFullscreen();
  }
  if (el.msRequestFullscreen) {
    return el.msRequestFullscreen();
  }
  return Promise.reject(new Error('Fullscreen API is not supported'));
}

function exitFullscreen(doc: DocumentWithFullscreen): Promise<void> {
  if (doc.exitFullscreen) {
    return doc.exitFullscreen();
  }
  if (doc.webkitExitFullscreen) {
    return doc.webkitExitFullscreen();
  }
  if (doc.msExitFullscreen) {
    return doc.msExitFullscreen();
  }
  return Promise.reject(new Error('Fullscreen exit is not supported'));
}

function checkSupport(): boolean {
  if (typeof document === 'undefined') return false;
  return !!(
    document.fullscreenEnabled ||
    (document as DocumentWithFullscreen).webkitFullscreenElement ||
    (document as DocumentWithFullscreen).msFullscreenElement
  );
}

// ---------------------------------------------------------------------------
// useSyncExternalStore for fullscreen state (avoids setState in effects)
// ---------------------------------------------------------------------------
let fullscreenListeners: Array<() => void> = [];

function subscribeFullscreen(callback: () => void): () => void {
  fullscreenListeners.push(callback);
  return () => {
    fullscreenListeners = fullscreenListeners.filter((l) => l !== callback);
  };
}

function emitFullscreenChange() {
  for (const listener of fullscreenListeners) {
    listener();
  }
}

function getFullscreenSnapshot(): boolean {
  if (typeof document === 'undefined') return false;
  return getFullscreenElement(document as DocumentWithFullscreen) !== null;
}

function getServerFullscreenSnapshot(): boolean {
  return false;
}

// ---------------------------------------------------------------------------
// Hook: useFullscreen
// ---------------------------------------------------------------------------
export interface UseFullscreenReturn {
  /** Whether the page is currently in fullscreen mode */
  isFullscreen: boolean;
  /** Toggle between fullscreen and normal mode */
  toggleFullscreen: () => Promise<void>;
  /** Exit fullscreen mode (no-op if not in fullscreen) */
  exitFullscreen: () => Promise<void>;
  /** Whether the browser supports the Fullscreen API */
  isSupported: boolean;
}

export function useFullscreen(): UseFullscreenReturn {
  const isFullscreen = useSyncExternalStore(
    subscribeFullscreen,
    getFullscreenSnapshot,
    getServerFullscreenSnapshot,
  );

  // Set up native event listeners once
  const hasSetupRef = useRef(false);
  useEffect(() => {
    if (hasSetupRef.current) return;
    hasSetupRef.current = true;

    const handleChange = () => {
      emitFullscreenChange();
    };

    document.addEventListener('fullscreenchange', handleChange);
    document.addEventListener('webkitfullscreenchange', handleChange);
    document.addEventListener('msfullscreenchange', handleChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
      document.removeEventListener('webkitfullscreenchange', handleChange);
      document.removeEventListener('msfullscreenchange', handleChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      const doc = document as DocumentWithFullscreen;
      const currentEl = getFullscreenElement(doc);

      if (currentEl) {
        await exitFullscreen(doc);
      } else {
        await requestFullscreen(document.documentElement as FullscreenElement);
      }
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err);
    }
  }, []);

  const handleExitFullscreen = useCallback(async () => {
    try {
      const doc = document as DocumentWithFullscreen;
      const currentEl = getFullscreenElement(doc);
      if (currentEl) {
        await exitFullscreen(doc);
      }
    } catch (err) {
      console.warn('Fullscreen exit failed:', err);
    }
  }, []);

  return {
    isFullscreen,
    toggleFullscreen,
    exitFullscreen: handleExitFullscreen,
    isSupported: checkSupport(),
  };
}


