'use client';

import React, { useRef, useEffect, memo, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { CSS } from '@/styles/design-tokens';
import { Search, X } from 'lucide-react';

// ── Types ──────────────────────────────────────────────

export interface SearchInputProps {
  /** Current search value */
  value: string;
  /** Callback when the value changes */
  onChange: (value: string) => void;
  /** Placeholder text (default: "Search...") */
  placeholder?: string;
  /** Additional class name */
  className?: string;
  /** Optional keydown handler (e.g. for Enter to submit) */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

// ── Component ──────────────────────────────────────────

export const SearchInput = memo(function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className,
  onKeyDown,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // CMD+K / CTRL+K shortcut to focus the input
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

  const handleClear = useCallback(() => {
    onChange('');
    inputRef.current?.focus();
  }, [onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Escape clears the input when focused
      if (e.key === 'Escape' && value) {
        e.preventDefault();
        handleClear();
        return;
      }
      onKeyDown?.(e);
    },
    [onKeyDown, value, handleClear],
  );

  return (
    <div
      className={cn('relative group', className)}
      role="search"
    >
      {/* Search icon */}
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors"
        style={{ color: isFocused ? CSS.textSecondary : CSS.textDisabled }}
        aria-hidden="true"
      />

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full pl-9 pr-16 py-2 text-[13px] rounded-xl outline-none transition-all"
        style={{
          backgroundColor: CSS.hoverBg,
          color: CSS.text,
          border: `1px solid ${isFocused ? CSS.accent : CSS.border}`,
          boxShadow: isFocused ? `0 0 0 3px ${CSS.accentLight}` : 'none',
        }}
        aria-label={placeholder}
      />

      {/* Clear button (visible when value is non-empty) */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-md transition-colors"
          style={{
            color: CSS.textMuted,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              CSS.activeBg;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              'transparent';
          }}
          aria-label="Clear search"
          type="button"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Keyboard shortcut hint */}
      <kbd
        className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono pointer-events-none transition-opacity"
        style={{
          backgroundColor: CSS.hoverBg,
          color: CSS.textMuted,
          border: `1px solid ${CSS.border}`,
          opacity: value ? 0 : 0.7,
        }}
        aria-hidden="true"
      >
        ⌘K
      </kbd>
    </div>
  );
});

export default SearchInput;
