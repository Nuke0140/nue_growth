'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className,
  onKeyDown,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // CMD+K / CTRL+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className={cn('relative', className)}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
        style={{ color: 'var(--app-text-muted)' }}
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="ops-input w-full pl-9 pr-16 py-2 text-sm"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-md transition-colors"
          style={{ color: 'var(--app-text-muted)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              'var(--app-hover-bg)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              'transparent';
          }}
          aria-label="Clear search"
        >
          <X className="w-3 h-3" />
        </button>
      )}
      <kbd
        className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono pointer-events-none"
        style={{
          backgroundColor: 'var(--app-hover-bg)',
          color: 'var(--app-text-muted)',
          border: '1px solid var(--app-border)',
        }}
      >
        ⌘K
      </kbd>
    </div>
  );
}
