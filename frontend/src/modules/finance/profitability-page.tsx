'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp, TrendingDown, AlertTriangle, Shield, Download, ArrowUpRight, ArrowDownRight, Target, Users,
} from 'lucide-react';
import { clientProfitability, projectMargins, serviceMargins } from '@/modules/finance/data/mock-data';
import type { ClientProfitability, ProjectMargin, ServiceMargin } from '@/modules/finance/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const riskColors = {
  low: { badge: isDark => 'bg-[var(--app-success-bg)] text-[var(--app-success)]', dot: 'bg-emerald-500' },
  medium: { badge: isDark => 'bg-[var(--app-warning-bg)] text-[var(--app-warning)]', dot: 'bg-amber-500' },
  high: { badge: isDark => 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]', dot: 'bg-red-500' },
};

const statusColors = {
  profitable: { badge: isDark => 'bg-[var(--app-success-bg)] text-[var(--app-success)]' },
  breakeven: { badge: isDark => 'bg-[var(--app-warning-bg)] text-[var(--app-warning)]' },
  loss: { badge: isDark => 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]' },
};

function getMarginColor(margin: number) {
  if (margin >= 50) return 'text-emerald-500';
  if (margin >= 35) return 'text-sky-500';
  if (margin >= 25) return 'text-amber-500';
  return 'text-red-500';
}

export default function ProfitabilityPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const lowMarginClients = useMemo(() => clientProfitability.filter(c => c.margin < 25), []);
  const highRiskClients = useMemo(() => clientProfitability.filter(c => c.risk === 'high'), []);
  const avgMargin = useMemo(() => {
    const total = clientProfitability.reduce((s, c) => s + c.margin, 0);
    return (total / clientProfitability.length).toFixed(1);
  }, []);
  const totalProfit = useMemo(() => clientProfitability.reduce((s, c) => s + c.profit, 0), []);
  const totalRevenue = useMemo(() => clientProfitability.reduce((s, c) => s + c.revenue, 0), []);
  const totalRevision = useMemo(() => clientProfitability.reduce((s, c) => s + c.revisionCost, 0), []);

  const kpis = [
    { label: 'Avg Margin', value: `${avgMargin}%`, icon: Target, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 2.1 },
    { label: 'Total Profit', value: formatINR(totalProfit), icon: TrendingUp, color: 'text-sky-400', bg: 'bg-[var(--app-info-bg)]', change: 8.4 },
    { label: 'Total Revenue', value: formatINR(totalRevenue), icon: ArrowUpRight, color: 'text-violet-400', bg: 'bg-[var(--app-purple-light)]', change: 12.2 },
    { label: 'Revision Cost', value: formatINR(totalRevision), icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]', change: -3.5 },
    { label: 'Healthy Clients', value: `${clientProfitability.filter(c => c.margin >= 35).length}/${clientProfitability.length}`, icon: Users, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 10.0 },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <Target className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Profitability</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Margin Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button className={cn('px-4 py-2 text-sm font-medium rounded-[var(--app-radius-lg)] gap-2', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
              <Download className="w-4 h-4" /> Export Report
            </Button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {kpis.map((kpi, i) => {
            const isPositive = kpi.change >= 0;
            return (
              <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-[var(--app-radius-xl)] border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
                <div className="flex items-center justify-between mb-2">
                  <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{kpi.label}</span>
                  <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', kpi.bg)}><kpi.icon className={cn('w-4 h-4', kpi.color)} /></div>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-bold tracking-tight">{kpi.value}</p>
                  <span className={cn('flex items-center gap-0.5 text-[10px] font-medium', isPositive ? 'text-emerald-500' : 'text-red-500')}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(kpi.change)}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Client Profitability Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Client Profitability</span>
            </div>
            <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>{clientProfitability.length} clients</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {clientProfitability.map((client, i) => (
              <motion.div key={client.client} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-[var(--app-radius-xl)] border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]', 'transition-colors duration-200 cursor-pointer')}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold">{client.client}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={cn('text-[10px] font-medium', getMarginColor(client.margin))}>{client.margin}%</span>
                    {client.trend >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div>
                    <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Revenue</p>
                    <p className="text-xs font-semibold">{formatINR(client.revenue)}</p>
                  </div>
                  <div>
                    <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Cost</p>
                    <p className="text-xs font-semibold">{formatINR(client.cost)}</p>
                  </div>
                  <div>
                    <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Profit</p>
                    <p className={cn('text-xs font-semibold', client.profit > 0 ? 'text-emerald-500' : 'text-red-500')}>{formatINR(client.profit)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Revision:</span>
                    <span className="text-[10px] font-medium text-amber-500">{formatINR(client.revisionCost)}</span>
                  </div>
                  <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 capitalize', riskColors[client.risk].badge(isDark))}>{client.risk}</Badge>
                </div>
                <div className={cn('mt-3 w-full h-1 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(client.margin, 100)}%` }} transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }} className={cn('h-full rounded-full', client.margin >= 50 ? 'bg-emerald-500' : client.margin >= 35 ? 'bg-sky-500' : client.margin >= 25 ? 'bg-amber-500' : 'bg-red-500')} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Project Margin Table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }} className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
          <div className="flex items-center justify-between mb-4">
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Project Margins</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                  {['Project', 'Client', 'Revenue', 'Budget', 'Spent', 'Margin %', 'Status'].map(h => (
                    <th key={h} className={cn('text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-3', 'text-[var(--app-text-muted)]')}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projectMargins.map((proj, i) => (
                  <motion.tr key={proj.project} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 + i * 0.05 }} className={cn('border-b transition-colors', 'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]')}>
                    <td className="py-3 px-3 text-xs font-medium">{proj.project}</td>
                    <td className="py-3 px-3 text-xs">{proj.client}</td>
                    <td className="py-3 px-3 text-xs">{formatINR(proj.revenue)}</td>
                    <td className="py-3 px-3 text-xs">{formatINR(proj.budget)}</td>
                    <td className="py-3 px-3 text-xs">{formatINR(proj.spent)}</td>
                    <td className={cn('py-3 px-3 text-xs font-semibold', getMarginColor(proj.margin + 30))}>{proj.margin}%</td>
                    <td className="py-3 px-3">
                      <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5 capitalize', statusColors[proj.status].badge(isDark))}>{proj.status}</Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Service Margins & Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Service Margin Chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.4 }} className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
            <div className="flex items-center gap-2 mb-4">
              <Target className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Service Margins</span>
            </div>
            <div className="space-y-3">
              {serviceMargins.map((svc, i) => (
                <div key={svc.service}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{svc.service}</span>
                    <span className={cn('text-xs font-bold', getMarginColor(svc.margin))}>{svc.margin}%</span>
                  </div>
                  <div className={cn('w-full h-2 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(svc.margin, 100)}%` }} transition={{ delay: 0.65 + i * 0.08, duration: 0.5 }} className={cn('h-full rounded-full', svc.margin >= 50 ? 'bg-emerald-500' : svc.margin >= 35 ? 'bg-sky-500' : svc.margin >= 25 ? 'bg-amber-500' : 'bg-red-500')} />
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className={cn('text-[9px]', 'text-[var(--app-text-muted)]')}>{formatINR(svc.revenue)} rev</span>
                    <span className={cn('text-[9px]', 'text-[var(--app-text-muted)]')}>{svc.projects} projects</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Low Margin & Churn Risk */}
          <div className="space-y-4">
            {/* Low Margin Alerts */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.4 }} className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Low Margin Alerts</span>
                <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]')}>{lowMarginClients.length}</Badge>
              </div>
              <div className="space-y-2">
                {lowMarginClients.map((c, i) => (
                  <motion.div key={c.client} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.75 + i * 0.05, duration: 0.3 }} className={cn('flex items-center justify-between p-3 rounded-[var(--app-radius-lg)] border', 'border-[var(--app-border-light)]')}>
                    <div>
                      <p className="text-xs font-medium">{c.client}</p>
                      <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{formatINR(c.revenue)} revenue</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-red-500">{c.margin}%</span>
                      <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{formatINR(c.revisionCost)} revisions</p>
                    </div>
                  </motion.div>
                ))}
                {lowMarginClients.length === 0 && <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>All clients above 25% margin threshold.</p>}
              </div>
            </motion.div>

            {/* Churn Risk */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.4 }} className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-red-400" />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Churn Risk</span>
                <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]')}>{highRiskClients.length}</Badge>
              </div>
              <div className="space-y-2">
                {highRiskClients.map((c, i) => (
                  <motion.div key={c.client} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.85 + i * 0.05, duration: 0.3 }} className={cn('flex items-center justify-between p-3 rounded-[var(--app-radius-lg)] border', 'border-[var(--app-border-light)]')}>
                    <div>
                      <p className="text-xs font-medium">{c.client}</p>
                      <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Trend: {c.trend}%</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-red-500">{formatINR(c.revenue)}</span>
                      <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>revenue at risk</p>
                    </div>
                  </motion.div>
                ))}
                {highRiskClients.length === 0 && <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>No high-risk clients identified.</p>}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
