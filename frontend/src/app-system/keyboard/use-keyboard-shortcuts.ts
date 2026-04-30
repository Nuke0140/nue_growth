'use client';

import { useEffect, useCallback, useRef } from 'react';

type ShortcutHandler = (e: KeyboardEvent) => void;

/**
 * Maps a key-combo string to its handler.
 *
 * KeyCombo format:
 *   - "escape"            -- single key
 *   - "mod+k"             -- cmd (Mac) / ctrl (Windows/Linux) + k
 *   - "mod+shift+n"       -- cmd/ctrl + shift + n
 *   - "mod+alt+t"         -- cmd/ctrl + alt + t
 *   - "shift+arrowleft"   -- shift + left arrow
 *
 * Modifiers are always lower-case. The key portion is normalised to lower-case
 * for comparison, except for single-character letter keys.
 *
 * When multiple combos could match a single keystroke the longest combo wins
 * (e.g. "mod+shift+k" wins over "mod+k").
 */
export interface ShortcutMap {
  [keyCombo: string]: ShortcutHandler;
}

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

const MODIFIER_KEYS = ['mod', 'shift', 'alt', 'meta', 'ctrl'] as const;
type ModifierKey = (typeof MODIFIER_KEYS)[number];

interface ParsedCombo {
  modifiers: Set<ModifierKey>;
  key: string;
  length: number; // number of parts, used for longest-match
}

function parseCombo(combo: string): ParsedCombo {
  const parts = combo
    .toLowerCase()
    .split('+')
    .map((p) => p.trim())
    .filter(Boolean);

  const modifiers = new Set<ModifierKey>();
  const keys: string[] = [];

  for (const part of parts) {
    if ((MODIFIER_KEYS as readonly string[]).includes(part)) {
      modifiers.add(part as ModifierKey);
    } else {
      keys.push(part);
    }
  }

  // Normalise single-letter keys to their lower-case form
  const key = keys.length > 0 ? keys.join('+') : '';
  return { modifiers, key, length: parts.length };
}

// ---------------------------------------------------------------------------
// Event matcher
// ---------------------------------------------------------------------------

function comboMatchesEvent(combo: ParsedCombo, e: KeyboardEvent): boolean {
  // --- Modifiers ---
  const modRequired = combo.modifiers.has('mod');
  const ctrlRequired = combo.modifiers.has('ctrl');
  const metaRequired = combo.modifiers.has('meta');
  const shiftRequired = combo.modifiers.has('shift');
  const altRequired = combo.modifiers.has('alt');

  // "mod" means Cmd on Mac, Ctrl elsewhere
  const isMod = e.metaKey || e.ctrlKey;
  const wantsMod = modRequired || ctrlRequired || metaRequired;

  if (wantsMod !== isMod) return false;
  if (shiftRequired !== e.shiftKey) return false;
  if (altRequired !== e.altKey) return false;

  // --- Key ---
  if (!combo.key) return false;

  const eventKey = e.key.toLowerCase();

  // Map special key names to KeyboardEvent.key values
  const specialKeyMap: Record<string, string> = {
    escape: 'escape',
    esc: 'escape',
    enter: 'enter',
    tab: 'tab',
    backspace: 'backspace',
    delete: 'delete',
    space: ' ',
    arrowup: 'arrowup',
    arrowdown: 'arrowdown',
    arrowleft: 'arrowleft',
    arrowright: 'arrowright',
  };

  const normalizedKey = specialKeyMap[combo.key] ?? combo.key;
  return eventKey === normalizedKey;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Registers global keyboard shortcuts and cleans them up on unmount.
 *
 * @example
 * ```tsx
 * useKeyboardShortcuts({
 *   'mod+k': (e) => openCommandPalette(),
 *   'escape': (e) => closeModal(),
 *   'mod+shift+n': (e) => createNewEntity(),
 * });
 * ```
 */
export function useKeyboardShortcuts(shortcuts: ShortcutMap): void {
  // Stable ref to avoid re-registering listeners on every shortcuts change
  const shortcutsRef = useRef(shortcuts);

  // Pre-parse combos cache
  const parsedCombosRef = useRef<Map<string, ParsedCombo>>(new Map());

  const getParsed = useCallback((combo: string): ParsedCombo => {
    let parsed = parsedCombosRef.current.get(combo);
    if (!parsed) {
      parsed = parseCombo(combo);
      parsedCombosRef.current.set(combo, parsed);
    }
    return parsed;
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const current = shortcutsRef.current;
      const entries = Object.entries(current);
      if (entries.length === 0) return;

      let bestMatch: { combo: string; handler: ShortcutHandler; length: number } | null = null;

      for (const [comboStr, handler] of entries) {
        const parsed = getParsed(comboStr);
        if (comboMatchesEvent(parsed, e)) {
          // Longest combo wins (more specific match)
          if (!bestMatch || parsed.length > bestMatch.length) {
            bestMatch = { combo: comboStr, handler, length: parsed.length };
          }
        }
      }

      if (bestMatch) {
        e.preventDefault();
        bestMatch.handler(e);
      }
    },
    [getParsed]
  );

  useEffect(() => {
    // Sync the shortcuts ref whenever shortcuts change
    shortcutsRef.current = shortcuts;
    // Reset parsed cache when shortcuts change
    parsedCombosRef.current = new Map();

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, shortcuts]);
}
