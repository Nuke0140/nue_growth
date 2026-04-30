'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Download,
  FileText,
  FileSpreadsheet,
  Table,
  Presentation,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExportMenuProps {
  onExport?: (format: 'pdf' | 'csv' | 'excel' | 'ppt') => void;
}

interface ExportOption {
  format: 'pdf' | 'csv' | 'excel' | 'ppt';
  label: string;
  icon: React.ElementType;
}

const exportOptions: ExportOption[] = [
  { format: 'pdf', label: 'PDF Document', icon: FileText },
  { format: 'csv', label: 'CSV Spreadsheet', icon: Table },
  { format: 'excel', label: 'Excel Workbook', icon: FileSpreadsheet },
  { format: 'ppt', label: 'PowerPoint', icon: Presentation },
];

export default function ExportMenu({ onExport }: ExportMenuProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className={cn(
          'inline-flex items-center gap-2 rounded-[var(--app-radius-lg)] px-3 py-2 text-xs font-medium transition-colors',
          isDark
            ? 'bg-white/[0.06] text-zinc-300 hover:bg-white/[0.1] border border-white/[0.08]'
            : 'bg-black/[0.03] text-zinc-600 hover:bg-black/[0.06] border border-black/[0.06]',
        )}
      >
        <Download className="h-3.5 w-3.5" />
        Export
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute right-0 top-full z-50 mt-1.5 min-w-[180px] rounded-[var(--app-radius-lg)] border shadow-[var(--app-shadow-md)]-lg py-1',
              isDark
                ? 'bg-zinc-800 border-white/[0.08]'
                : 'bg-white border-black/[0.08]',
            )}
          >
            {exportOptions.map((option) => {
              const OptIcon = option.icon;
              return (
                <button
                  key={option.format}
                  onClick={() => {
                    onExport?.(option.format);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors text-left',
                    isDark
                      ? 'text-zinc-300 hover:bg-white/[0.06]'
                      : 'text-zinc-700 hover:bg-black/[0.03]',
                  )}
                >
                  <OptIcon className="h-4 w-4 shrink-0" />
                  {option.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
