'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Users, Activity, Gauge, Clock, Mail, Phone, Calendar,
  BarChart3, ArrowUpRight, ArrowDownRight, ChevronRight, Shield, Eye,
} from 'lucide-react';
import KPICard from './components/kpi-card';
import ChartCard from './components/chart-card';
import DashboardWidget from './components/dashboard-widget';
import FilterChip from './components/filter-chip';
import ExportMenu from './components/export-menu';
import { crmAnalyticsData } from './data/mock-data';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { CSS } from '@/styles/design-tokens';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

function formatNum(num: number): string {
  if (num >= 100000) return `${(num / 1000).toFixed(0)}K`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return `${num}`;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const engagementIcons: Record<string, React.ElementType> = {
  'Email Open Rate': Mail,
  'Call Connect Rate': Phone,
  'Meeting Booked': Calendar,
  'Avg Response Time': Clock,
  'WhatsApp Response': Phone,
  'Follow-up Completion': Shield,
  'Demo Conversion': Eye,
};

export default function CRMAnalyticsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const data = crmAnalyticsData;

  const [activeFilter, setActiveFilter] = useState('all');
  const filters = ['all', 'hot', 'warm', 'cold'];

  // Derived KPIs
  const totalLeads = data.leadSourceMix.reduce((s, l) => s + l.leads, 0);
  const avgHealthScore = data.healthScoreAvg;
  const pipelineVelocityDays = data.pipelineVelocity.reduce((s, p) => s + p.avgDays, 0);
  const sla = data.followUpSLA[0];
  const followUpSLAPct = Math.round(
    (sla.withinSLA / (sla.withinSLA + sla.breached)) * 100,
  );

  const maxLeadSource = Math.max(...data.leadSourceMix.map((s) => s.leads));
  const maxPipelineDays = Math.max(...data.pipelineVelocity.map((s) => s.avgDays));

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });

  // ── Rep Response Performance column definitions ──
  const repColumns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'rep',
      label: 'Rep',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold"
            style={{ backgroundColor: CSS.hoverBg, color: CSS.textSecondary }}
          >
            {String(row.rep).split(' ').map((n: string) => n[0]).join('')}
          </div>
          <span className="text-sm font-medium" style={{ color: CSS.text }}>{String(row.rep)}</span>
        </div>
      ),
    },
    {
      key: 'avgResponse',
      label: 'Avg Response',
      sortable: true,
      render: (row) => {
        const fastestRep = data.repResponsePerformance[0]?.rep;
        const isFastest = fastestRep === row.rep;
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{Number(row.avgResponse)}h</span>
            {isFastest && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-400">
                Fastest
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'meetings',
      label: 'Meetings',
      sortable: true,
      render: (row) => <span className="text-sm">{String(row.meetings)}</span>,
    },
    {
      key: 'conversion',
      label: 'Conversion',
      sortable: true,
      render: (row) => {
        const conv = Number(row.conversion);
        return (
          <div className="flex items-center gap-2">
            <div className="w-14 h-1.5 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${conv}%`,
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.5)' : '#60a5fa',
                }}
              />
            </div>
            <span className="text-sm font-medium">{conv}%</span>
          </div>
        );
      },
    },
  ], [isDark]);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: CSS.hoverBg }}>
              <Users className="w-5 h-5" style={{ color: CSS.textSecondary }} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">CRM Analytics</h1>
              <p className="text-xs" style={{ color: CSS.textMuted }}>
                Lead sources, lifecycle stages &amp; contact engagement
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {filters.map((f) => (
                <FilterChip
                  key={f}
                  label={f.charAt(0).toUpperCase() + f.slice(1)}
                  active={activeFilter === f}
                  onClick={() => setActiveFilter(f)}
                />
              ))}
            </div>
            <ExportMenu />
            <span className="px-3 py-1.5 text-xs font-medium rounded-xl" style={{ backgroundColor: CSS.hoverBg, color: CSS.textMuted }}>
              <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
              {today}
            </span>
          </div>
        </div>

        {/* KPI Row */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <KPICard
            label="Total Leads"
            value={totalLeads.toLocaleString('en-IN')}
            change={12.4}
            changeLabel="vs last month"
            icon={Users}
          />
          <KPICard
            label="Avg Health Score"
            value={`${avgHealthScore}`}
            change={2.1}
            changeLabel="out of 100"
            icon={Activity}
          />
          <KPICard
            label="Pipeline Velocity"
            value={`${pipelineVelocityDays} days`}
            change={-4.2}
            changeLabel="avg cycle time"
            icon={Gauge}
          />
          <KPICard
            label="Follow-up SLA %"
            value={`${followUpSLAPct}%`}
            change={1.1}
            changeLabel="within SLA"
            icon={Shield}
            severity="normal"
          />
        </motion.div>

        {/* Row: Lead Source Mix + Lifecycle Conversion */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Lead Source Mix */}
          <ChartCard title="Lead Source Mix" subtitle="Leads count & conversion rate by source">
            <div className="space-y-4 pt-2">
              {data.leadSourceMix.map((src, i) => (
                <motion.div
                  key={src.source}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{src.source}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: CSS.textMuted }}>
                        {src.conversion}% conv
                      </span>
                      <span className="text-sm font-semibold">{formatNum(src.leads)}</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(src.leads / maxLeadSource) * 100}%` }}
                      transition={{ delay: 0.35 + i * 0.06, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('h-full rounded-full', isDark ? 'bg-blue-500/50' : 'bg-blue-400')}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </ChartCard>

          {/* Lifecycle Conversion Funnel */}
          <ChartCard title="Lifecycle Conversion" subtitle="Stage-wise conversion rates">
            <div className="flex flex-col items-center gap-2 pt-2">
              {data.lifecycleConversion.map((stage, i) => {
                const widthPct = Math.max(35, 100 - i * 14);
                return (
                  <div key={stage.stage} className="w-full flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{stage.stage}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-400">
                        {stage.rate}%
                      </span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: CSS.hoverBg, maxWidth: '100%' }}
                    >
                      <div className="text-center">
                        <p className="text-base font-bold" style={{ color: CSS.text }}>
                          {formatNum(stage.converted)}
                        </p>
                        <p className="text-[10px]" style={{ color: CSS.textMuted }}>
                          of {formatNum(stage.total)}
                        </p>
                      </div>
                    </motion.div>
                    {i < data.lifecycleConversion.length - 1 && (
                      <ChevronRight className="w-4 h-4 my-0.5 rotate-90" style={{ color: CSS.textMuted }} />
                    )}
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </div>

        {/* Contact Engagement Metric Cards */}
        <ChartCard title="Contact Engagement" subtitle="Key engagement metrics across channels">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {[
              { metric: 'Email Open Rate', value: 42.8, change: 3.2, unit: '%', icon: Mail, color: 'blue' },
              { metric: 'Meeting Booked', value: 342, change: 18.4, unit: '', icon: Calendar, color: 'emerald' },
              { metric: 'Avg Response Time', value: 4.2, change: -12.5, unit: ' hrs', icon: Clock, color: 'violet' },
              { metric: 'WhatsApp Response', value: 78.4, change: 8.6, unit: '%', icon: Phone, color: 'amber' },
            ].map((item, i) => {
              const isGoodChange = item.metric === 'Avg Response Time'
                ? item.change < 0
                : item.change > 0;
              return (
                <motion.div
                  key={item.metric}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}
                  className="rounded-xl border p-4 transition-colors"
                  style={{ backgroundColor: CSS.cardBgHover, borderColor: CSS.border }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: CSS.hoverBg }}
                  >
                    <item.icon className="w-4 h-4" style={{ color: CSS.textSecondary }} />
                  </div>
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: CSS.textMuted }}>
                    {item.metric}
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-xl font-bold">{item.value}{item.unit}</p>
                    {item.change !== 0 && (
                      <span className={cn(
                        'flex items-center gap-0.5 text-[10px] font-medium',
                        isGoodChange ? 'text-emerald-500' : 'text-red-500',
                      )}>
                        {item.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(item.change)}%
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ChartCard>

        {/* Row: Pipeline Velocity + Rep Response Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Pipeline Velocity */}
          <ChartCard title="Pipeline Velocity" subtitle="Average days per pipeline stage">
            <div className="space-y-4 pt-2">
              {data.pipelineVelocity.map((stage, i) => (
                <motion.div
                  key={stage.stage}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: CSS.textMuted }}>
                        {stage.deals} deals
                      </span>
                      <span className="text-sm font-semibold">{stage.avgDays}d</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stage.avgDays / maxPipelineDays) * 100}%` }}
                      transition={{ delay: 0.35 + i * 0.06, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('h-full rounded-full', isDark ? 'bg-violet-500/50' : 'bg-violet-400')}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </ChartCard>

          {/* Rep Response Performance */}
          <ChartCard title="Rep Response Performance" subtitle="Response time, meetings &amp; conversion by rep">
            <SmartDataTable
              data={data.repResponsePerformance as unknown as Record<string, unknown>[]}
              columns={repColumns}
              searchable
              enableExport
              pageSize={10}
              searchPlaceholder="Search reps…"
            />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
