'use client';

import { useState, useMemo, useCallback } from 'react';
import { memo } from 'react';
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
} from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { TrendingUp, AlertTriangle, Pencil, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import DealCard from '@/modules/crm-sales/core/deals/deal-card';
import { mockDeals } from '@/modules/crm-sales/data/mock-data';
import type { Deal, DealStage } from '@/modules/crm-sales/system/types';

const STAGES: DealStage[] = ['new', 'discovery', 'qualified', 'demo', 'proposal', 'negotiation', 'won', 'lost'];

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

const STAGE_COLORS: Record<DealStage, { header: string; dot: string; isDarkHeader: string; isDarkDot: string }> = {
  new:         { header: 'bg-black/[0.04]', dot: 'bg-black/30', isDarkHeader: 'bg-white/[0.04]', isDarkDot: 'bg-white/30' },
  discovery:   { header: 'bg-violet-50', dot: 'bg-violet-400', isDarkHeader: 'bg-violet-500/[0.08]', isDarkDot: 'bg-violet-400/60' },
  qualified:   { header: 'bg-blue-50', dot: 'bg-blue-400', isDarkHeader: 'bg-blue-500/[0.08]', isDarkDot: 'bg-blue-400/60' },
  demo:        { header: 'bg-purple-50', dot: 'bg-purple-400', isDarkHeader: 'bg-purple-500/[0.08]', isDarkDot: 'bg-purple-400/60' },
  proposal:    { header: 'bg-amber-50', dot: 'bg-amber-400', isDarkHeader: 'bg-amber-500/[0.08]', isDarkDot: 'bg-amber-400/60' },
  negotiation: { header: 'bg-emerald-50', dot: 'bg-emerald-500', isDarkHeader: 'bg-emerald-500/[0.08]', isDarkDot: 'bg-emerald-400/60' },
  won:         { header: 'bg-emerald-100', dot: 'bg-emerald-600', isDarkHeader: 'bg-emerald-500/[0.15]', isDarkDot: 'bg-emerald-400' },
  lost:        { header: 'bg-red-50', dot: 'bg-red-400', isDarkHeader: 'bg-red-500/[0.08]', isDarkDot: 'bg-red-400/60' },
};

const STAGE_CONVERSION_RATES: Record<string, number> = {
  new: 0.15,
  discovery: 0.25,
  qualified: 0.40,
  demo: 0.55,
  proposal: 0.55,
  negotiation: 0.70,
  won: 1.0,
  lost: 0,
};

const STAGE_PROBABILITIES: Record<string, number> = {
  new: 10,
  discovery: 0,
  qualified: 35,
  demo: 50,
  proposal: 50,
  negotiation: 65,
  won: 100,
  lost: 0,
};

function getConversionRate(stage: string): string {
  return `${Math.round((STAGE_CONVERSION_RATES[stage] || 0) * 100)}%`;
}

function isBottleneckStage(deals: Deal[]): boolean {
  const activeDeals = deals.filter(d => {
    const days = d.daysInStage || 0;
    return days > 15;
  });
  return deals.length > 0 && (activeDeals.length / deals.length) > 0.5;
}

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

const DraggableDealCard = memo(function DraggableDealCard({ deal, onSelect }: { deal: Deal; onSelect?: (deal: Deal) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: deal.id,
    data: { deal },
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={{ touchAction: 'none' }}>
      <DealCard deal={deal} onSelect={onSelect} isDragging={isDragging} />
    </div>
  );
});

const DroppableColumn = memo(function DroppableColumn({
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
  const convRate = getConversionRate(stage);
  const isBottleneck = isBottleneckStage(deals);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col min-w-[280px] max-w-[320px] w-[300px] rounded-[var(--app-radius-xl)] transition-colors duration-200',
        isOver && ('bg-[var(--app-hover-bg)]')
      )}
    >
      {/* Stage Header */}
      <div className={cn(
        'rounded-t-2xl px-3 py-2.5 border-b',
        isDark ? `${colors.isDarkHeader} border-white/[0.04]` : `${colors.header} border-black/[0.04]`
      )}>
        <div className="flex items-center gap-1.5 mb-1">
          <div className={cn('w-2 h-2 rounded-full', isDark ? colors.isDarkDot : colors.dot)} />
          <h3 className={cn('text-xs font-semibold uppercase tracking-wider', 'text-[var(--app-text)]')}>
            {STAGE_LABELS[stage]}
          </h3>
          {/* Conversion Rate */}
          <div className={cn(
            'flex items-center gap-0.5 ml-1',
            isDark ? 'text-emerald-400/60' : 'text-emerald-600/60'
          )}>
            <TrendingUp className="w-2.5 h-2.5" />
            <span className={cn('text-[9px] font-medium', isDark ? 'text-white/35' : 'text-black/35')}>
              {convRate} conv.
            </span>
          </div>
          {/* Bottleneck Warning */}
          {isBottleneck && (
            <AlertTriangle className={cn('w-4 h-4 ml-1', isDark ? 'text-amber-400' : 'text-amber-500')} />
          )}
          <span className={cn(
            'ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-[var(--app-radius-md)]',
            'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
          )}>
            {deals.length}
          </span>
        </div>
        <p className={cn('text-[11px] font-medium pl-4', 'text-[var(--app-text-muted)]')}>
          {formatCurrency(totalValue)}
        </p>
      </div>

      {/* Cards */}
      <div className={cn(
        'flex-1 p-2 space-y-2 rounded-b-2xl min-h-[120px] max-h-[calc(100vh-320px)] overflow-y-auto transition-colors',
        'bg-[var(--app-hover-bg)]',
        isOver && (isDark ? 'bg-blue-500/[0.03]' : 'bg-blue-50/50'),
        isOver && 'ring-1 ring-dashed ' + (isDark ? 'ring-white/10' : 'ring-black/10')
      )}>
        {deals.length === 0 ? (
          <div className={cn(
            'flex flex-col items-center justify-center py-app-3xl text-center',
            'text-[var(--app-text-disabled)]'
          )}>
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center mb-2',
              'bg-[var(--app-hover-bg)]'
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
});

export default function PipelineBoard({ onSelect }: { onSelect?: (deal: Deal) => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [deals, setDeals] = useState<Deal[]>(mockDeals);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const dealsByStage = useMemo(() => {
    const grouped: Record<string, Deal[]> = {};
    STAGES.forEach(stage => { grouped[stage] = []; });
    deals.forEach(deal => {
      if (!grouped[deal.stage]) grouped[deal.stage] = [];
      grouped[deal.stage].push(deal);
    });
    return grouped;
  }, [deals]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const deal = deals.find(d => d.id === event.active.id);
    if (deal) setActiveDeal(deal);
  }, [deals]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDeal(null);

    if (!over) return;

    const dealId = active.id as string;
    const newStage = over.id as DealStage;

    setDeals(prevDeals =>
      prevDeals.map(deal => {
        if (deal.id !== dealId) return deal;
        const newProbability = STAGE_PROBABILITIES[newStage] ?? deal.probability;
        return {
          ...deal,
          stage: newStage,
          probability: newProbability,
          weightedValue: deal.value * newProbability / 100,
          daysInStage: 0,
        };
      })
    );
  }, []);

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
            deals={dealsByStage[stage] || []}
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
