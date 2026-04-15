'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface RenewalItem {
  client: string;
  renewalDate: string;
  contractValue: number;
  probability: number;
  status: 'on-track' | 'at-risk' | 'overdue' | 'lost';
}

interface RenewalTimelineProps {
  renewals: RenewalItem[];
}

function getStatusConfig(status: RenewalItem['status']) {
  switch (status) {
    case 'on-track': return { dot: 'bg-emerald-400', line: 'bg-emerald-400', label: 'On Track', textColor: 'text-emerald-400' };
    case 'at-risk': return { dot: 'bg-amber-400', line: 'bg-amber-400', label: 'At Risk', textColor: 'text-amber-400' };
    case 'overdue': return { dot: 'bg-red-400', line: 'bg-red-400', label: 'Overdue', textColor: 'text-red-400' };
    case 'lost': return { dot: 'bg-gray-400', line: 'bg-gray-400', label: 'Lost', textColor: 'text-gray-400' };
  }
}

function formatValue(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${(value / 1000).toFixed(0)}K`;
}

export default function RenewalTimeline({ renewals }: RenewalTimelineProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-2xl border p-5 overflow-x-auto',
        isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
      )}
    >
      <div className="flex items-center gap-3 pb-4 min-w-max">
        {renewals.map((item, idx) => {
          const config = getStatusConfig(item.status);
          return (
            <div key={idx} className="flex items-center gap-3">
              {/* Node */}
              <div className="flex flex-col items-center gap-2 min-w-[140px]">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    'rounded-xl border p-3 w-full text-center',
                    isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]'
                  )}
                >
                  <p className="text-xs font-semibold truncate mb-1">{item.client}</p>
                  <p className={cn('text-[10px] font-medium mb-2', config.textColor)}>{config.label}</p>
                  <p className="text-sm font-bold">{formatValue(item.contractValue)}</p>
                  <p className={cn('text-[10px] mt-1', isDark ? 'text-white/40' : 'text-black/40')}>
                    {item.probability}% likely
                  </p>
                </motion.div>
                <div className={cn('w-2.5 h-2.5 rounded-full', config.dot)} />
                <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
                  {new Date(item.renewalDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              {/* Connector line */}
              {idx < renewals.length - 1 && (
                <div className={cn('w-8 h-0.5 rounded-full mb-8 shrink-0', config.line, idx === renewals.length - 1 ? 'opacity-0' : 'opacity-40')} />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
