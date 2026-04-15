'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
}

export default function FilterChip({
  label,
  active = false,
  onClick,
  removable = false,
  onRemove,
}: FilterChipProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium select-none transition-colors cursor-pointer',
        active
          ? isDark
            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            : 'bg-blue-50 text-blue-700 border border-blue-200'
          : isDark
            ? 'bg-white/[0.06] text-zinc-300 border border-white/[0.08] hover:bg-white/[0.1]'
            : 'bg-black/[0.03] text-zinc-600 border border-black/[0.06] hover:bg-black/[0.06]',
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {label}

      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className={cn(
            'ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full transition-colors',
            isDark
              ? 'hover:bg-white/[0.15] text-zinc-400 hover:text-zinc-200'
              : 'hover:bg-black/[0.08] text-zinc-400 hover:text-zinc-700',
          )}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </motion.span>
  );
}
