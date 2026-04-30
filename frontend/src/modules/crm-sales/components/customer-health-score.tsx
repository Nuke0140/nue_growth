'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface CustomerHealthScoreProps {
  score: number;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

function getHealthColor(score: number): string {
  if (score > 75) return '#22c55e'; // green
  if (score > 50) return '#eab308'; // yellow
  if (score > 25) return '#f97316'; // orange
  return '#ef4444'; // red
}

function getHealthLabel(score: number): string {
  if (score > 75) return 'Excellent';
  if (score > 50) return 'Good';
  if (score > 25) return 'Fair';
  return 'At Risk';
}

function getHealthBgColor(isDark: boolean, score: number): string {
  if (score > 75) return isDark ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.08)';
  if (score > 50) return isDark ? 'rgba(234,179,8,0.1)' : 'rgba(234,179,8,0.08)';
  if (score > 25) return isDark ? 'rgba(249,115,22,0.1)' : 'rgba(249,115,22,0.08)';
  return isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.08)';
}

const sizeConfig = {
  sm: { container: 'h-12 w-12', svg: 'h-12 w-12', radius: 18, stroke: 3, fontSize: 'text-xs', labelSize: 'text-[9px]' },
  md: { container: 'h-20 w-20', svg: 'h-20 w-20', radius: 30, stroke: 3.5, fontSize: 'text-lg', labelSize: 'text-[10px]' },
  lg: { container: 'h-28 w-28', svg: 'h-28 w-28', radius: 44, stroke: 4, fontSize: 'text-2xl', labelSize: 'text-xs' },
};

export default function CustomerHealthScore({ score, name, size = 'md', showLabel = true }: CustomerHealthScoreProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isAtRisk = score < 40;

  const color = getHealthColor(score);
  const label = getHealthLabel(score);
  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <motion.div
        className={cn('relative', config.container)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Pulse animation for at-risk */}
        {isAtRisk && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                `0 0 0 0 ${color}40`,
                `0 0 0 6px ${color}00`,
                `0 0 0 0 ${color}40`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <svg className={config.svg} viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={config.radius}
            fill={getHealthBgColor(isDark, score)}
            stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
            strokeWidth={config.stroke}
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={config.radius}
            fill="none"
            stroke={color}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            transform="rotate(-90 50 50)"
          />
        </svg>

        {/* Score text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn('font-bold leading-none', config.fontSize)}
            style={{ color }}
          >
            {score}
          </span>
        </div>
      </motion.div>

      {showLabel && (
        <div className="text-center">
          {name && (
            <p className={cn(
              'text-[11px] font-medium truncate max-w-[100px]',
              isDark ? 'text-white/60' : 'text-black/60'
            )}>
              {name}
            </p>
          )}
          <p
            className={cn('font-medium', config.labelSize)}
            style={{ color }}
          >
            {label}
          </p>
        </div>
      )}
    </div>
  );
}
