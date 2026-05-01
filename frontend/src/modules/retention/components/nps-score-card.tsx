'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface NpsScoreCardProps {
  score: number;
  totalResponses: number;
  promoters: number;
  passives: number;
  detractors: number;
}

function getNpsColor(score: number) {
  if (score >= 70) return { text: 'text-emerald-400', bg: 'bg-emerald-400', label: 'Excellent' };
  if (score >= 50) return { text: 'text-amber-400', bg: 'bg-amber-400', label: 'Good' };
  return { text: 'text-red-400', bg: 'bg-red-400', label: 'Needs Improvement' };
}

export default function NpsScoreCard({ score, totalResponses, promoters, passives, detractors }: NpsScoreCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = getNpsColor(score);

  const total = promoters + passives + detractors;
  const promoterPct = total ? (promoters / total) * 100 : 0;
  const passivePct = total ? (passives / total) * 100 : 0;
  const detractorPct = total ? (detractors / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-2xl border p-5',
        isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
      )}
    >
      {/* Large NPS display */}
      <div className="text-center mb-5">
        <p className={cn('text-[10px] font-semibold tracking-wider uppercase mb-1', isDark ? 'text-white/30' : 'text-black/30')}>
          Net Promoter Score
        </p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15, type: 'spring' }}
        >
          <span className={cn('text-5xl font-bold', colors.text)}>{score}</span>
        </motion.div>
        <p className={cn('text-xs font-medium mt-1', colors.text)}>{colors.label}</p>
        <p className={cn('text-[10px] mt-0.5', isDark ? 'text-white/30' : 'text-black/30')}>
          {totalResponses.toLocaleString()} responses
        </p>
      </div>

      {/* Stacked bar visualization */}
      <div className="flex h-3 rounded-full overflow-hidden mb-3">
        <motion.div
          className="bg-emerald-400 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${promoterPct}%` }}
          transition={{ duration: 0.15}}
        />
        <motion.div
          className="bg-amber-400 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${passivePct}%` }}
          transition={{ duration: 0.15}}
        />
        <motion.div
          className="bg-red-400 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${detractorPct}%` }}
          transition={{ duration: 0.15}}
        />
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-3 gap-2">
        <div className={cn('rounded-lg p-2 text-center border', isDark ? 'bg-emerald-400/5 border-emerald-400/10' : 'bg-emerald-50 border-emerald-100')}>
          <p className="text-xs font-bold text-emerald-400">{promoters}</p>
          <p className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>Promoters</p>
        </div>
        <div className={cn('rounded-lg p-2 text-center border', isDark ? 'bg-amber-400/5 border-amber-400/10' : 'bg-amber-50 border-amber-100')}>
          <p className="text-xs font-bold text-amber-400">{passives}</p>
          <p className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>Passives</p>
        </div>
        <div className={cn('rounded-lg p-2 text-center border', isDark ? 'bg-red-400/5 border-red-400/10' : 'bg-red-50 border-red-100')}>
          <p className="text-xs font-bold text-red-400">{detractors}</p>
          <p className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>Detractors</p>
        </div>
      </div>
    </motion.div>
  );
}
