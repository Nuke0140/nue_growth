'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import DealCard from './deal-card';
import { mockDeals } from '../data/mock-data';
import type { Deal, DealStage } from '../types';

const STAGES: DealStage[] = ['new', 'qualified', 'demo', 'proposal', 'negotiation', 'won', 'lost'];

const STAGE_LABELS: Record<DealStage, string> = {
  new: 'New',
  qualified: 'Qualified',
  demo: 'Demo',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
};

const STAGE_COLORS: Record<DealStage, { header: string; dot: string; isDarkHeader: string; isDarkDot: string }> = {
  new:         { header: 'bg-black/[0.04]', dot: 'bg-black/30', isDarkHeader: 'bg-white/[0.04]', isDarkDot: 'bg-white/30' },
  qualified:   { header: 'bg-blue-50', dot: 'bg-blue-400', isDarkHeader: 'bg-blue-500/[0.08]', isDarkDot: 'bg-blue-400/60' },
  demo:        { header: 'bg-purple-50', dot: 'bg-purple-400', isDarkHeader: 'bg-purple-500/[0.08]', isDarkDot: 'bg-purple-400/60' },
  proposal:    { header: 'bg-amber-50', dot: 'bg-amber-400', isDarkHeader: 'bg-amber-500/[0.08]', isDarkDot: 'bg-amber-400/60' },
  negotiation: { header: 'bg-emerald-50', dot: 'bg-emerald-500', isDarkHeader: 'bg-emerald-500/[0.08]', isDarkDot: 'bg-emerald-400/60' },
  won:         { header: 'bg-emerald-100', dot: 'bg-emerald-600', isDarkHeader: 'bg-emerald-500/[0.15]', isDarkDot: 'bg-emerald-400' },
  lost:        { header: 'bg-red-50', dot: 'bg-red-400', isDarkHeader: 'bg-red-500/[0.08]', isDarkDot: 'bg-red-400/60' },
};

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

function DraggableDealCard({ deal, onSelect }: { deal: Deal; onSelect?: (deal: Deal) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: deal.id,
    data: { deal },
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={{ touchAction: 'none' }}>
      <DealCard deal={deal} onSelect={onSelect} isDragging={isDragging} />
    </div>
  );
}

function DroppableColumn({
  stage,
  deals,
  onSelect,
  isDark,
}: {
  stage: DealStage;
  deals: Deal[];
  onSelect?: (deal: Deal) => void;
  isDark: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
    data: { stage },
  });
  const colors = STAGE_COLORS[stage];
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);

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
        isDark ? `${colors.isDarkHeader} border-white/[0.04]` : `${colors.header} border-black/[0.04]`
      )}>
        <div className="flex items-center gap-2 mb-1">
          <div className={cn('w-2 h-2 rounded-full', isDark ? colors.isDarkDot : colors.dot)} />
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
        'flex-1 p-2 space-y-2 rounded-b-2xl min-h-[120px] max-h-[calc(100vh-320px)] overflow-y-auto transition-colors',
        isDark ? 'bg-white/[0.01]' : 'bg-black/[0.005]',
        isOver && (isDark ? 'bg-blue-500/[0.03]' : 'bg-blue-50/50'),
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
            <DraggableDealCard key={deal.id} deal={deal} onSelect={onSelect} />
          ))
        )}
      </div>
    </div>
  );
}

export default function PipelineBoard({ onSelect }: { onSelect?: (deal: Deal) => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const dealsByStage = useMemo(() => {
    const grouped: Record<DealStage, Deal[]> = {
      new: [], qualified: [], demo: [], proposal: [], negotiation: [], won: [], lost: [],
    };
    mockDeals.forEach(deal => {
      grouped[deal.stage].push(deal);
    });
    return grouped;
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const deal = mockDeals.find(d => d.id === event.active.id);
    if (deal) setActiveDeal(deal);
  };

  const handleDragEnd = (_event: DragEndEvent) => {
    setActiveDeal(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-4 px-1">
        {STAGES.map((stage) => (
          <DroppableColumn
            key={stage}
            stage={stage}
            deals={dealsByStage[stage]}
            onSelect={onSelect}
            isDark={isDark}
          />
        ))}
      </div>

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
