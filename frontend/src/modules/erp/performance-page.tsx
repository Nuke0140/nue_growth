'use client';

import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, Trophy, Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageShell } from '@/components/shared/page-shell';
import { SmartDataTable, type DataTableColumnDef } from '@/components/shared/smart-data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { CSS } from '@/styles/design-tokens';
import { mockPerformanceReviews, mockEmployees } from '@/modules/erp/data/mock-data';
import type { PerformanceReview, PromotionReadiness } from '@/modules/erp/types';

function getEmployee(id: string) {
  return mockEmployees.find(e => e.id === id);
}

function getBarColor(score: number): string {
  if (score >= 85) return '#34d399';
  if (score >= 70) return '#fbbf24';
  return '#f87171';
}

const promoLabels: Record<PromotionReadiness, string> = {
  'not-ready': 'Not Ready',
  developing: 'Developing',
  ready: 'Ready',
  overdue: 'Overdue',
};

function PerformancePageInner() {
  const reviews = useMemo(() => {
    return mockPerformanceReviews
      .map(r => ({ ...r, employee: getEmployee(r.employeeId)! }))
      .filter(r => r.employee);
  }, []);

  const stats = useMemo(() => {
    if (reviews.length === 0) return { avgKpi: 0, avgSla: 0, topPerformer: '—' };
    const sorted = [...reviews].sort((a, b) => {
      const aAvg = (a.kpiScore + a.slaScore + a.taskCompletion + a.clientFeedback) / 4;
      const bAvg = (b.kpiScore + b.slaScore + b.taskCompletion + b.clientFeedback) / 4;
      return bAvg - aAvg;
    });
    return {
      avgKpi: Math.round(reviews.reduce((s, r) => s + r.kpiScore, 0) / reviews.length),
      avgSla: Math.round(reviews.reduce((s, r) => s + r.slaScore, 0) / reviews.length),
      topPerformer: sorted[0]?.employee?.name || '—',
    };
  }, [reviews]);

  const columns: DataTableColumnDef[] = [
    {
      key: 'employeeId',
      label: 'Employee',
      sortable: true,
      render: (row) => {
        const review = row as unknown as (PerformanceReview & { employee: typeof mockEmployees[0] });
        const emp = review.employee;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-[10px] font-semibold" style={{ backgroundColor: CSS.accentLight, color: CSS.accent }}>
                {emp?.avatar || '??'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium" style={{ color: CSS.text }}>{emp?.name}</p>
              <p className="text-[11px]" style={{ color: CSS.textMuted }}>{emp?.department}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'period',
      label: 'Period',
      sortable: true,
      render: (row) => (
        <span className="text-sm" style={{ color: CSS.textSecondary }}>{String(row.period)}</span>
      ),
    },
    {
      key: 'kpiScore',
      label: 'KPI',
      sortable: true,
      render: (row) => {
        const score = Number(row.kpiScore);
        return (
          <div className="flex items-center gap-2 min-w-[80px]">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: CSS.hoverBg }}>
              <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: getBarColor(score) }} />
            </div>
            <span className="text-[11px] font-medium w-6 text-right" style={{ color: getBarColor(score) }}>{score}</span>
          </div>
        );
      },
    },
    {
      key: 'slaScore',
      label: 'SLA',
      sortable: true,
      render: (row) => {
        const score = Number(row.slaScore);
        return (
          <div className="flex items-center gap-2 min-w-[80px]">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: CSS.hoverBg }}>
              <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: getBarColor(score) }} />
            </div>
            <span className="text-[11px] font-medium w-6 text-right" style={{ color: getBarColor(score) }}>{score}</span>
          </div>
        );
      },
    },
    {
      key: 'taskCompletion',
      label: 'Tasks',
      sortable: true,
      render: (row) => {
        const score = Number(row.taskCompletion);
        return (
          <div className="flex items-center gap-2 min-w-[80px]">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: CSS.hoverBg }}>
              <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: getBarColor(score) }} />
            </div>
            <span className="text-[11px] font-medium w-6 text-right" style={{ color: getBarColor(score) }}>{score}</span>
          </div>
        );
      },
    },
    {
      key: 'clientFeedback',
      label: 'Feedback',
      sortable: true,
      render: (row) => {
        const score = Number(row.clientFeedback);
        return (
          <span className="text-sm font-medium" style={{ color: score > 0 ? getBarColor(score) : CSS.textMuted }}>
            {score > 0 ? `${score}%` : 'N/A'}
          </span>
        );
      },
    },
    {
      key: 'promotionReadiness',
      label: 'Promotion',
      sortable: true,
      render: (row) => <StatusBadge status={promoLabels[row.promotionReadiness as PromotionReadiness]} />,
    },
  ];

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <PageShell title="Performance" icon={Target} subtitle="Q1 2026">
      <motion.div className="space-y-6" variants={stagger} initial="hidden" animate="show">
        {/* Stats */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiWidget label="Avg KPI Score" value={`${stats.avgKpi}%`} icon={Target} color="accent" />
          <KpiWidget label="Avg SLA Score" value={`${stats.avgSla}%`} icon={Clock} color="info" />
          <KpiWidget label="Top Performer" value={stats.topPerformer} icon={Trophy} color="success" />
        </motion.div>

        {/* Table */}
        <motion.div variants={fadeUp}>
          <SmartDataTable
            data={reviews as unknown as Record<string, unknown>[]}
            columns={columns}
            searchable
            searchPlaceholder="Search employees..."
            searchKeys={['employeeId']}
            emptyMessage="No performance reviews found."
            enableExport
          />
        </motion.div>
      </motion.div>
    </PageShell>
  );
}

export default memo(PerformancePageInner);
