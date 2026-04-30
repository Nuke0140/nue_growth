'use client';

import { cn } from '@/lib/utils';
import { Rows3, Rows4 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useErpStore } from '../../erp-store';

export function DensityToggle() {
  const { densityMode, setDensityMode } = useErpStore();
  const isCompact = densityMode === 'compact';

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex h-8 w-8 rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]"
            >
              {isCompact ? (
                <Rows4 className="w-4 h-4" />
              ) : (
                <Rows3 className="w-4 h-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          Density: {isCompact ? 'Compact' : 'Comfortable'}
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        align="end"
        className="w-44 bg-[var(--app-card-bg)] border-[var(--app-border-strong)] rounded-xl ops-dropdown-enter"
      >
        <DropdownMenuLabel className="text-[var(--app-text-muted)] text-xs font-semibold tracking-wider uppercase">
          Display Density
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => setDensityMode('comfortable')}
          className={cn(
            'flex items-center gap-2.5 py-2 text-[13px] cursor-pointer rounded-lg mx-1',
            !isCompact
              ? 'text-[var(--app-text)] bg-[var(--app-accent-light)]'
              : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]'
          )}
        >
          <Rows3 className="w-4 h-4 shrink-0 text-[var(--app-text-muted)]" />
          <span>Comfortable</span>
          {!isCompact && (
            <span className="ml-auto text-[10px] text-[var(--app-accent)] font-medium">Active</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setDensityMode('compact')}
          className={cn(
            'flex items-center gap-2.5 py-2 text-[13px] cursor-pointer rounded-lg mx-1',
            isCompact
              ? 'text-[var(--app-text)] bg-[var(--app-accent-light)]'
              : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]'
          )}
        >
          <Rows4 className="w-4 h-4 shrink-0 text-[var(--app-text-muted)]" />
          <span>Compact</span>
          {isCompact && (
            <span className="ml-auto text-[10px] text-[var(--app-accent)] font-medium">Active</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DensityToggle;
