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
    <div className="p-6 lg:p-8 h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-[var(--app-text)] tracking-tight">
          {title}
        </h1>
        <p className="text-sm mt-2 text-[var(--app-text-secondary)]">
          {subtitle}
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-bg)] p-12 lg:p-16 flex flex-col items-center justify-center gap-5 min-h-[420px]">
        <div className="w-20 h-20 rounded-2xl bg-[var(--app-accent-light)] border border-[var(--app-accent-light)] flex items-center justify-center">
          <span className="text-3xl font-bold" style={{ color: 'var(--app-accent)', opacity: 0.4 }}>{title.charAt(0)}</span>
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-[var(--app-text-muted)]">{title}</p>
          <p className="text-sm text-[var(--app-text-disabled)]">
            Full implementation coming soon
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-[var(--app-text-disabled)]">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--app-accent)', opacity: 0.4 }} />
          <span>In development</span>
        </div>
      </div>
    </div>
  );
}
