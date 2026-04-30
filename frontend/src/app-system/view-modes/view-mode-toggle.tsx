'use client';

import React from 'react';
import { Table2, LayoutGrid, Columns3 } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useViewMode } from './use-view-mode';
import type { ViewMode } from './use-view-mode';

interface ViewModeOption {
  value: ViewMode;
  label: string;
  icon: React.ReactNode;
}

const VIEW_MODE_OPTIONS: ViewModeOption[] = [
  { value: 'table', label: 'Table view', icon: React.createElement(Table2, { className: 'size-4' }) },
  { value: 'card', label: 'Card view', icon: React.createElement(LayoutGrid, { className: 'size-4' }) },
  { value: 'kanban', label: 'Kanban view', icon: React.createElement(Columns3, { className: 'size-4' }) },
];

interface ViewModeToggleProps {
  /** Identifies which page's view mode to control */
  pageKey: string;
  className?: string;
}

const ViewModeToggleInner: React.FC<ViewModeToggleProps> = ({ pageKey, className }) => {
  const currentMode = useViewMode((s) => s.getViewMode(pageKey));
  const setViewMode = useViewMode((s) => s.setViewMode);

  const handleChange = (value: string) => {
    if (value) {
      setViewMode(pageKey, value as ViewMode);
    }
  };

  return (
    <ToggleGroup
      type="single"
      value={currentMode}
      onValueChange={handleChange}
      className={className}
    >
      {VIEW_MODE_OPTIONS.map((opt) => (
        <Tooltip key={opt.value}>
          <TooltipTrigger asChild>
            <ToggleGroupItem value={opt.value} aria-label={opt.label}>
              {opt.icon}
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent side="bottom">{opt.label}</TooltipContent>
        </Tooltip>
      ))}
    </ToggleGroup>
  );
};

export const ViewModeToggle = React.memo(ViewModeToggleInner);

ViewModeToggle.displayName = 'ViewModeToggle';
