'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Wallet, TrendingUp, TrendingDown, Calendar, AlertTriangle, ArrowUpRight,
  ArrowDownRight, Activity, CircleDollarSign, Flame, Clock, Download,
} from 'lucide-react';
import { cashFlowData, financeDashboardStats } from '@/modules/finance/data/mock-data';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

export default function CashFlowPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedView, setSelectedView] = useState<'daily' | 'weekly'>('daily');

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const stats = financeDashboardStats;

  const openingBalance = cashFlowData[0]?.openingBalance ?? 11500000;
  const closingBalance = cashFlowData[cashFlowData.length - 1]?.closingBalance ?? 13790072;
  const totalInflow = cashFlowData.reduce((s, d) => s + d.inflow, 0);
  const totalOutflow = cashFlowData.reduce((s, d) => s + d.outflow, 0);
  const netCashFlow = totalInflow - totalOutflow;
  const netProjection = stats.burnRate * 30;
  const runwayMonths = stats.runwayMonths;

  const inflowBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    cashFlowData.forEach(d => d.inflowBreakdown.forEach(b => { map[b.label] = (map[b.label] || 0) + b.amount; }));
    return Object.entries(map).sort(([, a], [, b]) => b - a);
  }, []);

  const outflowBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    cashFlowData.forEach(d => d.outflowBreakdown.forEach(b => { map[b.label] = (map[b.label] || 0) + b.amount; }));
    return Object.entries(map).sort(([, a], [, b]) => b - a);
  }, []);

  const totalInflowForBreakdown = inflowBreakdown.reduce((s, [, v]) => s + v, 0);
  const totalOutflowForBreakdown = outflowBreakdown.reduce((s, [, v]) => s + v, 0);

  const inflowColors = ['bg-emerald-500', 'bg-teal-500', 'bg-emerald-400'];
  const outflowColors = ['bg-rose-500', 'bg-orange-500', 'bg-red-400', 'bg-amber-500', 'bg-rose-400'];

  const maxInOutflow = Math.max(...cashFlowData.map(d => Math.max(d.inflow, d.outflow)), 1);

  const kpis = [
    { label: 'Opening Balance', value: formatINR(openingBalance), icon: CircleDollarSign, color: 'text-sky-400', bg: 'bg-[var(--app-info-bg)]' },
    { label: 'Total Inflow', value: formatINR(totalInflow), icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]' },
    { label: 'Total Outflow', value: formatINR(totalOutflow), icon: TrendingDown, color: 'text-rose-400', bg: isDark ? 'bg-rose-500/10' : 'bg-rose-50' },
    { label: 'Closing Balance', value: formatINR(closingBalance), icon: Wallet, color: 'text-sky-400', bg: 'bg-[var(--app-info-bg)]' },
    { label: '30-day Projection', value: formatINR(netProjection), icon: Activity, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]' },
    { label: 'Runway Months', value: `${runwayMonths}`, icon: Flame, color: runwayMonths < 4 ? 'text-red-500' : 'text-emerald-400', bg: runwayMonths < 4 ? ('bg-[var(--app-danger-bg)]') : ('bg-[var(--app-success-bg)]') },
  ];

  const projectionDays = useMemo(() => {
    const days = [];
    const base = closingBalance;
    for (let i = 1; i <= 30; i++) {
      const projected = base - (stats.burnRate / 30) * i + (totalInflow / cashFlowData.length / 30) * i * 0.6;
      const upper = projected + (i * 80000);
      const lower = projected - (i * 120000);
      days.push({ day: i, value: Math.max(projected, 0), upper: Math.max(upper, 0), lower: Math.max(lower, 0) });
    }
    return days;
  }, [closingBalance, stats.burnRate, cashFlowData.length]);

  const maxProjection = Math.max(...projectionDays.map(d => d.upper), 1);
  const weeklyBurn = useMemo(() => {
    const weeks: { week: string; burn: number; balance: number }[] = [];
    let weekBurn = 0;
    cashFlowData.forEach((d, i) => {
      weekBurn += d.outflow - d.inflow;
      if ((i + 1) % 3 === 0 || i === cashFlowData.length - 1) {
        weeks.push({ week: `W${weeks.length + 1}`, burn: weekBurn, balance: d.closingBalance });
        weekBurn = 0;
      }
    });
    return weeks;
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <Wallet className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Cash Flow</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Founder Cash Runway</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={cn('px-3 py-1.5 text-xs font-medium gap-1.5', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
              <Calendar className="w-3.5 h-3.5" /> {today}
            </Badge>
            <Button className={cn('px-4 py-2 text-sm font-medium rounded-xl gap-2', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {kpis.map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{kpi.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', kpi.bg)}><kpi.icon className={cn('w-3.5 h-3.5', kpi.color)} /></div>
              </div>
              <p className="text-xl font-bold tracking-tight">{kpi.value}</p>
              {kpi.label === 'Runway Months' && runwayMonths < 4 && (
                <div className="flex items-center gap-1 mt-1.5">
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                  <span className="text-[10px] text-red-500 font-medium">Below 4-month threshold</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Daily Inflow/Outflow Chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }} className={cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Daily Inflow / Outflow</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /><span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Inflow</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-rose-500" /><span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Outflow</span></div>
            </div>
          </div>
          <div className="flex items-end gap-2 h-40">
            {cashFlowData.map((d, i) => (
              <div key={d.date} className="flex-1 flex flex-col justify-end items-center gap-1">
                <div className="flex items-end gap-0.5 w-full h-32">
                  <motion.div initial={{ height: 0 }} animate={{ height: `${(d.inflow / maxInOutflow) * 100}%` }} transition={{ delay: 0.3 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="flex-1 rounded-t-sm bg-emerald-500" />
                  <motion.div initial={{ height: 0 }} animate={{ height: `${(d.outflow / maxInOutflow) * 100}%` }} transition={{ delay: 0.35 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="flex-1 rounded-t-sm bg-rose-500" />
                </div>
                <span className={cn('text-[9px]', 'text-[var(--app-text-muted)]')}>{d.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Burn Curve & Projection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Weekly Burn Curve */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }} className={cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className={cn('w-4 h-4 text-amber-400')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Weekly Burn Curve</span>
              </div>
            </div>
            <div className="relative h-32 flex items-end">
              {weeklyBurn.map((w, i) => {
                const maxBurn = Math.max(...weeklyBurn.map(x => Math.abs(x.burn)), 1);
                const h = (Math.abs(w.burn) / maxBurn) * 100;
                const isPositive = w.burn > 0;
                return (
                  <div key={w.week} className="flex-1 flex flex-col items-center justify-end h-full relative">
                    <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.5 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className={cn('w-12 rounded-t-sm', isPositive ? 'bg-emerald-500/60' : 'bg-rose-500/60')} />
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 + i * 0.08, duration: 0.3 }} className={cn('absolute top-0 w-2.5 h-2.5 rounded-full -translate-y-1', isPositive ? 'bg-emerald-400' : 'bg-rose-400')} />
                    <span className={cn('text-[9px] mt-1.5', 'text-[var(--app-text-muted)]')}>{w.week}</span>
                    <span className={cn('text-[9px]', isPositive ? 'text-emerald-500' : 'text-rose-500')}>{formatINR(Math.abs(w.burn))}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Cash Projection */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.4 }} className={cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>30-Day Cash Projection</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className={cn('text-[9px]', 'text-[var(--app-text-muted)]')}>Confidence</span></div>
              </div>
            </div>
            <div className="relative h-32">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 128" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(245,158,11,0.15)" /><stop offset="100%" stopColor="rgba(245,158,11,0)" /></linearGradient>
                </defs>
                {projectionDays.filter((_, i) => i % 3 === 0).map((d, i) => {
                  const x = (d.day / 30) * 280 + 10;
                  const yLow = 128 - (d.lower / maxProjection) * 120 - 4;
                  const yHigh = 128 - (d.upper / maxProjection) * 120 - 4;
                  const opacity = Math.max(0.15, 1 - d.day / 30);
                  return (
                    <g key={d.day}>
                      <rect x={x - 4} y={yHigh} width={8} height={Math.max(yLow - yHigh, 2)} rx="4" fill={`rgba(245,158,11,${opacity * 0.3})`} />
                    </g>
                  );
                })}
              </svg>
              <div className="relative h-full flex items-end gap-0.5">
                {projectionDays.filter((_, i) => i % 3 === 0).map((d, i) => {
                  const h = (d.value / maxProjection) * 100;
                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full">
                      <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.5 + i * 0.06, duration: 0.5 }} className={cn('w-full rounded-t-sm', isDark ? 'bg-amber-500/40' : 'bg-amber-400')} />
                      {i % 2 === 0 && <span className={cn('text-[8px] mt-1', 'text-[var(--app-text-muted)]')}>D{d.day}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Breakdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Inflow Breakdown */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.4 }} className={cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Inflow Breakdown</span>
              <span className="ml-auto text-sm font-bold text-emerald-500">{formatINR(totalInflowForBreakdown)}</span>
            </div>
            <div className="space-y-3">
              {inflowBreakdown.map(([label, amount], i) => {
                const pct = totalInflowForBreakdown > 0 ? (amount / totalInflowForBreakdown) * 100 : 0;
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-3 h-3 rounded-sm', inflowColors[i % inflowColors.length])} />
                        <span className="text-xs font-medium">{label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">{formatINR(amount)}</span>
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{pct.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className={cn('w-full h-1.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }} className={cn('h-full rounded-full', inflowColors[i % inflowColors.length])} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Outflow Breakdown */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.4 }} className={cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Outflow Breakdown</span>
              <span className="ml-auto text-sm font-bold text-rose-500">{formatINR(totalOutflowForBreakdown)}</span>
            </div>
            <div className="space-y-3">
              {outflowBreakdown.map(([label, amount], i) => {
                const pct = totalOutflowForBreakdown > 0 ? (amount / totalOutflowForBreakdown) * 100 : 0;
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-3 h-3 rounded-sm', outflowColors[i % outflowColors.length])} />
                        <span className="text-xs font-medium">{label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">{formatINR(amount)}</span>
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{pct.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className={cn('w-full h-1.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.65 + i * 0.1, duration: 0.5 }} className={cn('h-full rounded-full', outflowColors[i % outflowColors.length])} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
