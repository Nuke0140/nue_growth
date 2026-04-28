'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import {
  Search,
  ArrowRight,
  Command,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────

export interface CommandItem {
  id: string;
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  section: 'pages' | 'actions' | 'recent';
  action: () => void;
}

interface RecentPage {
  id: string;
  icon: LucideIcon;
  label: string;
  action: () => void;
}

interface CommandPaletteProps {
  commands: CommandItem[];
  recentPages?: RecentPage[];
  className?: string;
}

// Internal: a flat entry with its section heading
interface FlatEntry {
  type: 'section';
  key: string;
  label: string;
}
interface FlatItem {
  type: 'item';
  item: CommandItem;
  globalIndex: number;
}
type FlatRow = FlatEntry | FlatItem;

// ── Command Palette ────────────────────────────────────

export function CommandPalette({
  commands,
  recentPages,
  className,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Build flat row list + extract only-item references for keyboard nav
  const { rows, selectableItems } = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = commands.filter((cmd) =>
      !q || cmd.label.toLowerCase().includes(q)
    );

    const recent: CommandItem[] = (recentPages ?? [])
      .filter((rp) => !q || rp.label.toLowerCase().includes(q))
      .slice(0, 5)
      .map((rp) => ({
        id: `recent-${rp.id}`,
        icon: rp.icon,
        label: rp.label,
        section: 'recent' as const,
        action: rp.action,
      }));

    const pages = filtered.filter((c) => c.section === 'pages');
    const actions = filtered.filter((c) => c.section === 'actions');

    const builtRows: FlatRow[] = [];
    const items: CommandItem[] = [];
    let idx = 0;

    const addSection = (key: string, label: string, sectionItems: CommandItem[]) => {
      if (sectionItems.length === 0) return;
      builtRows.push({ type: 'section', key, label });
      for (const item of sectionItems) {
        builtRows.push({ type: 'item', item, globalIndex: idx });
        items.push(item);
        idx++;
      }
    };

    addSection('recent', 'Recent', recent);
    addSection('pages', 'Pages', pages);
    addSection('actions', 'Actions', actions);

    return { rows: builtRows, selectableItems: items };
  }, [commands, recentPages, query]);

  // Reset active index on query change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Global ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Focus input on open, reset on close
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector('[data-active="true"]');
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const handleSelect = useCallback((item: CommandItem) => {
    setOpen(false);
    item.action();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % selectableItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(
          (prev) => (prev - 1 + selectableItems.length) % selectableItems.length
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectableItems[activeIndex]) handleSelect(selectableItems[activeIndex]);
      }
    },
    [selectableItems, activeIndex, handleSelect]
  );

  return (
    <>
      {/* Trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer',
            className
          )}
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            color: 'var(--ops-text-muted)',
            border: '1px solid var(--ops-border)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              'rgba(255,255,255,0.07)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              'rgba(255,255,255,0.04)';
          }}
          aria-label="Open command palette"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search…</span>
          <kbd
            className="ml-4 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--ops-border)',
            }}
          >
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>
      )}

      {/* Full palette overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 top-[15%] z-[101] mx-auto w-full max-w-lg px-4"
            >
              <div
                className="rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  backgroundColor: 'var(--ops-card-bg)',
                  border: '1px solid var(--ops-border)',
                }}
              >
                {/* Search bar */}
                <div
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ borderBottom: '1px solid var(--ops-border)' }}
                >
                  <Search
                    className="w-5 h-5 shrink-0"
                    style={{ color: 'var(--ops-text-muted)' }}
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a command or search…"
                    className="flex-1 bg-transparent text-sm outline-none"
                    style={{ color: 'var(--ops-text)' }}
                  />
                  <kbd
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      color: 'var(--ops-text-muted)',
                      border: '1px solid var(--ops-border)',
                    }}
                  >
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
                  {selectableItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10">
                      <Search
                        className="w-8 h-8 mb-2"
                        style={{ color: 'var(--ops-text-muted)' }}
                      />
                      <p className="text-sm" style={{ color: 'var(--ops-text-muted)' }}>
                        No results found
                      </p>
                    </div>
                  )}

                  {rows.map((row) => {
                    if (row.type === 'section') {
                      return (
                        <div
                          key={`s-${row.key}`}
                          className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--ops-text-muted)' }}
                        >
                          {row.label}
                        </div>
                      );
                    }

                    const { item, globalIndex } = row;
                    const isActive = globalIndex === activeIndex;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        data-active={isActive ? 'true' : undefined}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setActiveIndex(globalIndex)}
                        className="flex items-center gap-3 w-full py-2.5 text-left transition-colors cursor-pointer"
                        style={{
                          backgroundColor: isActive
                            ? 'var(--ops-accent-light)'
                            : 'transparent',
                          color: isActive
                            ? 'var(--ops-text)'
                            : 'var(--ops-text-secondary)',
                        }}
                      >
                        <div
                          className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                          style={{
                            backgroundColor: isActive
                              ? 'rgba(204, 92, 55, 0.15)'
                              : 'rgba(255,255,255,0.04)',
                          }}
                        >
                          <Icon
                            className="w-4 h-4"
                            style={{
                              color: isActive
                                ? 'var(--ops-accent)'
                                : 'var(--ops-text-muted)',
                            }}
                          />
                        </div>
                        <span className="flex-1 text-sm font-medium truncate">
                          {item.label}
                        </span>
                        {item.shortcut && (
                          <kbd
                            className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono"
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.06)',
                              color: 'var(--ops-text-muted)',
                              border: '1px solid var(--ops-border)',
                            }}
                          >
                            {item.shortcut}
                          </kbd>
                        )}
                        {isActive && (
                          <ArrowRight
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: 'var(--ops-accent)' }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Footer hints */}
                <div
                  className="flex items-center justify-between px-4 py-2.5"
                  style={{ borderTop: '1px solid var(--ops-border)' }}
                >
                  <div
                    className="flex items-center gap-3 text-[11px]"
                    style={{ color: 'var(--ops-text-muted)' }}
                  >
                    <span className="flex items-center gap-1">
                      <kbd
                        className="px-1 py-0.5 rounded font-mono"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          border: '1px solid var(--ops-border)',
                        }}
                      >
                        ↑↓
                      </kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd
                        className="px-1 py-0.5 rounded font-mono"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          border: '1px solid var(--ops-border)',
                        }}
                      >
                        ↵
                      </kbd>
                      Select
                    </span>
                  </div>
                  <span
                    className="flex items-center gap-1 text-[11px]"
                    style={{ color: 'var(--ops-text-muted)' }}
                  >
                    <kbd
                      className="px-1 py-0.5 rounded font-mono"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--ops-border)',
                      }}
                    >
                      esc
                    </kbd>
                    Close
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
