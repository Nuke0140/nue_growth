'use client';

import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface RoiWidgetProps {
  roi: number;
  trend?: number;
  label?: string;
}

export default function RoiWidget({ roi, trend, label = 'Return on Investment' }: RoiWidgetProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const colorClass = roi > 200 ? 'text-emerald-500' : roi >= 100 ? 'text-amber-500' : 'text-red-500';
  const bgAccent = roi > 200
    ? (isDark ? 'bg-emerald-500/10' : 'bg-emerald-50')
    : roi >= 100
      ? (isDark ? 'bg-amber-500/10' : 'bg-amber-50')
      : (isDark ? 'bg-red-500/10' : 'bg-red-50');

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15 }}
      className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
    >
      <p className={cn('text-[10px] mb-1', isDark ? 'text-white/40' : 'text-gray-500')}>{label}</p>
      <div className="flex items-end gap-2">
        <span className={cn('text-3xl font-bold tabular-nums', colorClass)}>{roi}x</span>
        {trend !== undefined && (
          <div className={cn('flex items-center gap-0.5 mb-1', trend >= 0 ? 'text-emerald-500' : 'text-red-500')}>
            {trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span className="text-xs font-medium">{trend >= 0 ? '+' : ''}{trend}%</span>
          </div>
        )}
      </div>
      <div className={cn('mt-2 h-1 rounded-full', bgAccent)}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, roi / 5)}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={cn('h-full rounded-full', colorClass)}
          style={{ opacity: 0.3 }}
        />
      </div>
    </motion.div>
  );
}
