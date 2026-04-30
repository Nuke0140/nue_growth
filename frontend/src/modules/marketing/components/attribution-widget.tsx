'use client';

import { useMemo } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { AttributionChannel } from '@/modules/marketing/types';

interface AttributionWidgetProps {
  channels: AttributionChannel[];
  model?: string;
}

export default function AttributionWidget({ channels, model = 'Multi-Touch' }: AttributionWidgetProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const maxRevenue = useMemo(() => Math.max(...channels.map(c => c.revenue)), [channels]);
  const totalRevenue = useMemo(() => channels.reduce((s, c) => s + c.revenue, 0), [channels]);

  return (
    <div className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-gray-900')}>Revenue Attribution</h3>
          <p className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-gray-500')}>Model: {model} • Total: ₹{(totalRevenue / 1000000).toFixed(1)}Cr</p>
        </div>
      </div>
      <div className="space-y-3">
        {channels.map((channel, i) => {
          const widthPct = (channel.revenue / maxRevenue) * 100;
          return (
            <motion.div
              key={channel.channel}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: channel.color }} />
                  <span className={cn('text-xs font-medium', isDark ? 'text-white/70' : 'text-gray-700')}>{channel.channel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('text-[10px] font-medium tabular-nums', isDark ? 'text-white/50' : 'text-gray-600')}>
                    ₹{(channel.revenue / 100000).toFixed(1)}L
                  </span>
                  <span className={cn('text-[10px] font-semibold tabular-nums', isDark ? 'text-white/30' : 'text-gray-400')}>
                    {channel.contribution}%
                  </span>
                </div>
              </div>
              <div className={cn('w-full h-2 rounded-full', isDark ? 'bg-white/[0.06]' : 'bg-gray-100')}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: channel.color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
