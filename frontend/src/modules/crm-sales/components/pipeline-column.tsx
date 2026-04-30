'use client';

import { memo, useState, useMemo } from 'react';
import { useTheme } from 'next-themes';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import DealCard from './deal-card';
import type { Deal, DealStage } from '../types';

const STAGE_LABELS: Record<DealStage, string> = {
  new: 'New',
  discovery: 'Discovery',
  qualified: 'Qualified',
  demo: 'Demo',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
};

const STAGE_COLORS: Record<DealStage, { header: string; dot: string; darkHeader: string; darkDot: string }> = {
  new:         { header: 'bg-neutral-50', dot: 'bg-neutral-400', darkHeader: 'bg-white/[0.03]', darkDot: 'bg-neutral-400' },
  qualified:   { header: 'bg-sky-50', dot: 'bg-sky-400', darkHeader: 'bg-sky-500/[0.08]', darkDot: 'bg-sky-400/60' },
  discovery:   { header: 'bg-violet-50', dot: 'bg-violet-400', darkHeader: 'bg-violet-500/[0.08]', darkDot: 'bg-violet-400/60' },
  demo:        { header: 'bg-amber-50', dot: 'bg-amber-400', darkHeader: 'bg-amber-500/[0.08]', darkDot: 'bg-amber-400/60' },
  proposal:    { header: 'bg-orange-50', dot: 'bg-orange-400', darkHeader: 'bg-orange-500/[0.08]', darkDot: 'bg-orange-400/60' },
  negotiation: { header: 'bg-emerald-50', dot: 'bg-emerald-500', darkHeader: 'bg-emerald-500/[0.08]', darkDot: 'bg-emerald-400/60' },
  won:         { header: 'bg-emerald-100', dot: 'bg-emerald-600', darkHeader: 'bg-emerald-500/[0.15]', darkDot: 'bg-emerald-400' },
  lost:        { header: 'bg-red-50', dot: 'bg-red-400', darkHeader: 'bg-red-500/[0.08]', darkDot: 'bg-red-400/60' },
};

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

const DraggableDealCard = memo(function DraggableDealCard({ deal }: { deal: Deal }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: deal.id,
    data: { deal },
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={{ touchAction: 'none' }}>
      <DealCard deal={deal} isDragging={isDragging} />
    </div>
  );
});

const DroppableColumn = memo(function DroppableColumn({
  stage,
  deals,
  isDark,
}: {
  stage: DealStage;
  deals: Deal[];
  isDark: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
    data: { stage },
  });
  const colors = STAGE_COLORS[stage];
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
  const weightedRevenue = deals.reduce((sum, d) => sum + d.weightedValue, 0);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col min-w-[280px] max-w-[320px] w-[300px] rounded-2xl transition-all duration-200',
        isOver && (isDark ? 'bg-white/[0.02]' : 'bg-black/[0.01]')
      )}
    >
      {/* Stage Header */}
      <div className={cn(
        'rounded-t-2xl px-3 py-2.5 border-b',
        isDark ? `${colors.darkHeader} border-white/[0.04]` : `${colors.header} border-black/[0.04]`
      )}>
        <div className="flex items-center gap-2 mb-1">
          <div className={cn('w-2 h-2 rounded-full', isDark ? colors.darkDot : colors.dot)} />
          <h3 className={cn('text-xs font-semibold uppercase tracking-wider', isDark ? 'text-white/70' : 'text-black/70')}>
            {STAGE_LABELS[stage]}
          </h3>
          <span className={cn(
            'ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md',
            isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40'
          )}>
            {deals.length}
          </span>
        </div>
        <p className={cn('text-[11px] font-medium pl-4', isDark ? 'text-white/40' : 'text-black/40')}>
          {formatCurrency(totalValue)}
        </p>
      </div>

      {/* Cards */}
      <div className={cn(
        'flex-1 p-2 space-y-2 rounded-b-2xl min-h-[120px] max-h-[calc(100vh-340px)] overflow-y-auto transition-colors',
        isDark ? 'bg-white/[0.01]' : 'bg-black/[0.005]',
        isOver && (isDark ? 'bg-emerald-500/[0.03]' : 'bg-emerald-50/50'),
        isOver && 'ring-1 ring-dashed ' + (isDark ? 'ring-white/10' : 'ring-black/10')
      )}>
        {deals.length === 0 ? (
          <div className={cn(
            'flex flex-col items-center justify-center py-8 text-center',
            isDark ? 'text-white/20' : 'text-black/20'
          )}>
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center mb-2',
              isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'
            )}>
              <span className="text-lg">📋</span>
            </div>
            <p className="text-xs">No deals</p>
          </div>
        ) : (
          deals.map((deal) => (
            <DraggableDealCard key={deal.id} deal={deal} />
          ))
        )}
      </div>

      {/* Weighted Revenue Footer */}
      {deals.length > 0 && (
        <div className={cn(
          'rounded-b-2xl px-3 py-2 border-t',
          isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-black/[0.01] border-black/[0.04]'
        )}>
          <div className="flex items-center justify-between">
            <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
              Weighted Revenue
            </span>
            <span className={cn('text-[11px] font-bold', isDark ? 'text-emerald-400' : 'text-emerald-600')}>
              {formatCurrency(weightedRevenue)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

interface PipelineColumnProps {
  stage: DealStage;
  deals: Deal[];
}

const PipelineColumn = memo(function PipelineColumn({ stage, deals }: PipelineColumnProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const deal = deals.find(d => d.id === event.active.id);
    if (deal) setActiveDeal(deal);
  };

  const handleDragEnd = (_event: DragEndEvent) => {
    setActiveDeal(null);
  };

  return (
    <DroppableColumn stage={stage} deals={deals} isDark={isDark} />
  );
});

export default PipelineColumn;

// Export the DndContext wrapper for the pipeline board usage
export function PipelineBoardDndContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    // Find deal from active drag
    const data = event.active.data.current;
    if (data?.deal) setActiveDeal(data.deal as Deal);
  };

  const handleDragEnd = () => {
    setActiveDeal(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay>
        {activeDeal && (
          <div className="w-[280px]">
            <DealCard deal={activeDeal} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
