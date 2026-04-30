'use client';

import { useErpStore } from '../erp-store';

export function useDensity() {
  const { densityMode, setDensityMode } = useErpStore();
  const isCompact = densityMode === 'compact';

  // Returns Tailwind class maps for common patterns
  const classes = {
    rowPadding: isCompact ? 'py-1.5 px-3' : 'py-3 px-4',
    cellPadding: isCompact ? 'py-1.5' : 'py-3',
    cardPadding: isCompact ? 'p-3' : 'p-app-xl',
    gap: isCompact ? 'gap-2' : 'gap-4',
    text: {
      primary: isCompact ? 'text-[12px]' : 'text-[13px]',
      secondary: isCompact ? 'text-[11px]' : 'text-[12px]',
      muted: isCompact ? 'text-[10px]' : 'text-[11px]',
    },
    avatar: isCompact ? 'h-6 w-6' : 'h-8 w-8',
    icon: isCompact ? 'w-4 h-4' : 'w-4 h-4',
  };

  return { isCompact, densityMode, setDensityMode, classes };
}
