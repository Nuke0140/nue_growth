'use client';

import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AudienceChipProps {
  name: string;
  count: number;
  operator?: string;
}

export default function AudienceChip({ name, count, operator }: AudienceChipProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.15 }}
      className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors',
        isDark ? 'bg-white/[0.04] border border-white/[0.08] text-white/70 hover:bg-white/[0.08]' : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
      )}
    >
      {operator && (
        <span className={cn('text-[10px] font-bold uppercase px-1 py-0.5 rounded',
          operator === 'AND' ? (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600')
            : (isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-600')
        )}>
          {operator}
        </span>
      )}
      <span className="font-medium truncate">{name}</span>
      <span className={cn('text-[10px] font-semibold tabular-nums', isDark ? 'text-white/30' : 'text-gray-400')}>
        {count.toLocaleString()}
      </span>
    </motion.div>
  );
}
