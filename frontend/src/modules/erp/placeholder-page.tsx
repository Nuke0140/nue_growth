'use client';

import { cn } from '@/lib/utils';

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
}

export default function PlaceholderPage({ title, subtitle }: PlaceholderPageProps) {
  return (
    <div className="p-6 lg:p-8 h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f5f5] tracking-tight">
          {title}
        </h1>
        <p className="text-sm mt-2 text-[rgba(245,245,245,0.5)]">
          {subtitle}
        </p>
      </div>

      <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#222325] p-12 lg:p-16 flex flex-col items-center justify-center gap-5 min-h-[420px]">
        <div className="w-20 h-20 rounded-2xl bg-[rgba(204,92,55,0.1)] border border-[rgba(204,92,55,0.15)] flex items-center justify-center">
          <span className="text-3xl font-bold text-[#cc5c37]/40">{title.charAt(0)}</span>
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-[rgba(245,245,245,0.3)]">{title}</p>
          <p className="text-sm text-[rgba(245,245,245,0.15)]">
            Full implementation coming soon
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-[rgba(245,245,245,0.2)]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#cc5c37]/40" />
          <span>In development</span>
        </div>
      </div>
    </div>
  );
}
