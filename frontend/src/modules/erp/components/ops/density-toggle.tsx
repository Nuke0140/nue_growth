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
              className="hidden sm:flex h-8 w-8 rounded-lg text-[rgba(245,245,245,0.4)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]"
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
        className="w-44 bg-[#222325] border-[rgba(255,255,255,0.08)] rounded-xl ops-dropdown-enter"
      >
        <DropdownMenuLabel className="text-[rgba(245,245,245,0.4)] text-xs font-semibold tracking-wider uppercase">
          Display Density
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => setDensityMode('comfortable')}
          className={cn(
            'flex items-center gap-2.5 py-2 text-[13px] cursor-pointer rounded-lg mx-1',
            !isCompact
              ? 'text-[#f5f5f5] bg-[rgba(204,92,55,0.08)]'
              : 'text-[rgba(245,245,245,0.6)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]'
          )}
        >
          <Rows3 className="w-4 h-4 shrink-0 text-[rgba(245,245,245,0.35)]" />
          <span>Comfortable</span>
          {!isCompact && (
            <span className="ml-auto text-[10px] text-[#cc5c37] font-medium">Active</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setDensityMode('compact')}
          className={cn(
            'flex items-center gap-2.5 py-2 text-[13px] cursor-pointer rounded-lg mx-1',
            isCompact
              ? 'text-[#f5f5f5] bg-[rgba(204,92,55,0.08)]'
              : 'text-[rgba(245,245,245,0.6)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]'
          )}
        >
          <Rows4 className="w-4 h-4 shrink-0 text-[rgba(245,245,255,0.35)]" />
          <span>Compact</span>
          {isCompact && (
            <span className="ml-auto text-[10px] text-[#cc5c37] font-medium">Active</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DensityToggle;
