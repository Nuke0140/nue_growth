'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface ChurnRiskChipProps {
  level: 'high' | 'medium' | 'safe';
  score: number;
}

function getLevelConfig(level: 'high' | 'medium' | 'safe') {
  if (level === 'high') return {
    bg: 'bg-red-400/15',
    text: 'text-red-400',
    border: 'border-red-400/30',
    pulse: true,
    label: 'High Risk',
  };
  if (level === 'medium') return {
    bg: 'bg-amber-400/15',
    text: 'text-amber-400',
    border: 'border-amber-400/30',
    pulse: false,
    label: 'Medium Risk',
  };
  return {
    bg: 'bg-emerald-400/15',
    text: 'text-emerald-400',
    border: 'border-emerald-400/30',
    pulse: false,
    label: 'Safe',
  };
}

export default function ChurnRiskChip({ level, score }: ChurnRiskChipProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const config = getLevelConfig(level);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium',
        config.bg, config.text, config.border
      )}
    >
      {config.pulse && (
        <motion.span
          className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-red-400"
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
          transition={{ duration: 0.2, repeat: Infinity }}
        />
      )}
      <span className="font-bold">{score}</span>
      <span className={cn('hidden sm:inline', isDark ? 'text-white/50' : 'text-black/50')}>/ 100</span>
    </motion.span>
  );
}
