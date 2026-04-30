'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { LayoutGrid, User, Users, Building2, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportTemplateCardProps {
  name: string;
  description: string;
  icon?: React.ElementType;
  category: 'personal' | 'team' | 'client' | 'executive';
  widgetCount: number;
  onClick?: () => void;
}

const categoryConfig: Record<
  string,
  { label: string; icon: React.ElementType; bgColor: string; textColor: string }
> = {
  personal: {
    label: 'Personal',
    icon: User,
    bgColor: 'bg-violet-500/15',
    textColor: 'text-violet-400',
  },
  team: {
    label: 'Team',
    icon: Users,
    bgColor: 'bg-cyan-500/15',
    textColor: 'text-cyan-400',
  },
  client: {
    label: 'Client',
    icon: Building2,
    bgColor: 'bg-amber-500/15',
    textColor: 'text-amber-400',
  },
  executive: {
    label: 'Executive',
    icon: Crown,
    bgColor: 'bg-emerald-500/15',
    textColor: 'text-emerald-400',
  },
};

export default function ReportTemplateCard({
  name,
  description,
  icon: IconProp,
  category,
  widgetCount,
  onClick,
}: ReportTemplateCardProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const config = categoryConfig[category];
  const CategoryIcon = config.icon;
  const DisplayIcon = IconProp ?? LayoutGrid;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={cn(
        'group relative flex flex-col rounded-2xl border p-4 sm:p-5 shadow-sm cursor-pointer',
        'hover:shadow-lg transition-shadow duration-200',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
          : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.03]',
      )}
    >
      {/* Top: Icon + Badge */}
      <div className="flex items-start justify-between mb-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
            isDark
              ? 'bg-white/[0.06] group-hover:bg-white/[0.1]'
              : 'bg-black/[0.04] group-hover:bg-black/[0.06]',
          )}
        >
          <DisplayIcon
            className={cn(
              'h-5 w-5',
              'text-[var(--app-text-muted)]',
            )}
          />
        </div>

        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
            config.bgColor,
            config.textColor,
          )}
        >
          <CategoryIcon className="h-3 w-3" />
          {config.label}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4
          className={cn(
            'text-sm font-semibold truncate mb-1',
            'text-[var(--app-text)]',
          )}
        >
          {name}
        </h4>
        <p
          className={cn(
            'text-xs leading-relaxed line-clamp-2',
            'text-[var(--app-text-muted)]',
          )}
        >
          {description}
        </p>
      </div>

      {/* Footer: Widget count */}
      <div className="mt-3 pt-3 border-t flex items-center justify-between">
        <span
          className={cn(
            'text-[10px] font-medium uppercase tracking-wider',
            'text-[var(--app-text-muted)]',
          )}
        >
          Widgets
        </span>
        <span
          className={cn(
            'inline-flex items-center justify-center h-5 min-w-[20px] rounded-full px-1.5 text-[10px] font-bold',
            isDark
              ? 'bg-white/[0.08] text-zinc-300'
              : 'bg-black/[0.06] text-zinc-600',
          )}
        >
          {widgetCount}
        </span>
      </div>
    </motion.div>
  );
}
