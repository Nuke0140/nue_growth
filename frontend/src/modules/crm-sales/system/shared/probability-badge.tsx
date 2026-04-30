'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

function getProbabilityColor(probability: number, isDark: boolean): { bg: string; text: string } {
  if (probability >= 70) return isDark
    ? { bg: 'bg-emerald-500/15', text: 'text-emerald-400' }
    : { bg: 'bg-emerald-50', text: 'text-emerald-600' };
  if (probability >= 40) return isDark
    ? { bg: 'bg-amber-500/15', text: 'text-amber-400' }
    : { bg: 'bg-amber-50', text: 'text-amber-600' };
  return isDark
    ? { bg: 'bg-red-500/15', text: 'text-red-400' }
    : { bg: 'bg-red-50', text: 'text-red-600' };
}

function getDotColor(probability: number): string {
  if (probability >= 70) return 'bg-emerald-500';
  if (probability >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

export default function ProbabilityBadge({
  probability,
  size = 'md',
}: {
  probability: number;
  size?: 'sm' | 'md';
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = getProbabilityColor(probability, isDark);
  const dotColor = getDotColor(probability);
  const isSm = size === 'sm';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-medium',
        colors.bg,
        colors.text,
        isSm ? 'text-[10px]' : 'text-xs'
      )}
    >
      <span className={cn('rounded-full', dotColor, isSm ? 'w-1.5 h-1.5' : 'w-2 h-2')} />
      {probability}%
    </motion.div>
  );
}
