'use client';

import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
}

export default function PlaceholderPage({ title, subtitle }: PlaceholderPageProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-black')}>{title}</h2>
        <p className={cn('text-sm mt-1', isDark ? 'text-white/50' : 'text-black/50')}>{subtitle}</p>
      </div>

      <div className={cn(
        'rounded-xl border p-12 flex flex-col items-center justify-center gap-4 min-h-[400px]',
        isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]'
      )}>
        <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center', isDark ? 'bg-white/[0.04]' : 'bg-black/[0.03]')}>
          <span className={cn('text-2xl font-bold', isDark ? 'text-white/10' : 'text-black/10')}>{title.charAt(0)}</span>
        </div>
        <div className="text-center">
          <p className={cn('text-lg font-semibold', isDark ? 'text-white/30' : 'text-black/30')}>{title}</p>
          <p className={cn('text-sm mt-1', isDark ? 'text-white/15' : 'text-black/15')}>Full implementation coming soon</p>
        </div>
      </div>
    </div>
  );
}
