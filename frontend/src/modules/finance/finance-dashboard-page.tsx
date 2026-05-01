'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, CreditCard, Banknote, Clock, Shield,
  TrendingUp, TrendingDown, AlertTriangle, CircleAlert, AlertCircle,
  Sparkles, ArrowRight, Zap, Send, Eye, Target,
} from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { StatusBadge } from '@/components/shared/status-badge';
import { CSS, ANIMATION } from '@/styles/design-tokens';
import { formatINR } from './utils';
import {
  cfoDashboardStats, cfoFunnelData, cashflowProjections,
  aiInsights, financeAlerts,
} from './data/mock-data';
import { useFinanceStore } from './finance-store';
import type { AIInsight, FinanceAlert, CFOFunnelStep, CashflowProjection } from './types';

// ---- Helpers ----

const maxInflow = Math.max(...cashflowProjections.map((p: CashflowProjection) => p.inflow));
const maxOutflow = Math.max(...cashflowProjections.map((p: CashflowProjection) => p.outflow));
const chartMax = Math.max(maxInflow, maxOutflow);

function severityIcon(severity: FinanceAlert['severity']) {
  if (severity === 'critical') return <CircleAlert className="w-4 h-4" style={{ color: CSS.danger }} />;
  if (severity === 'warning') return <AlertTriangle className="w-4 h-4" style={{ color: CSS.warning }} />;
  return <AlertCircle className="w-4 h-4" style={{ color: CSS.info }} />;
}

// ---- Component ----

export default function FinanceDashboardPage() {
  const navigateTo = useFinanceStore((s) => s.navigateTo);
  const stats = cfoDashboardStats;

  // ---- Derived data ----
  const criticalInsights = useMemo(
    () => aiInsights.filter((i: AIInsight) => i.impact === 'critical' || i.impact === 'high').slice(0, 3),
    [],
  );

  const activeAlerts = useMemo(
    () => financeAlerts.slice(0, 5),
    [],
  );

  const funnelMaxCount = Math.max(...cfoFunnelData.map((s: CFOFunnelStep) => s.count));

  // ---- KPI row ----
  const kpis = [
    {
      label: 'Revenue',
      value: formatINR(stats.totalRevenue),
      icon: DollarSign,
      color: 'success' as const,
      trend: 'up' as const,
      trendValue: '+8.3%',
    },
    {
      label: 'Expenses',
      value: formatINR(stats.expenses),
      icon: CreditCard,
      color: 'warning' as const,
      trend: 'up' as const,
      trendValue: '+4.6%',
    },
    {
      label: 'Profit',
      value: formatINR(stats.profit),
      icon: TrendingUp,
      color: 'success' as const,
      trend: 'up' as const,
      trendValue: '+13.3%',
    },
    {
      label: 'Cash Balance',
      value: formatINR(stats.cashBalance),
      icon: Banknote,
      color: 'accent' as const,
      trend: 'up' as const,
      trendValue: '+12.4%',
    },
    {
      label: 'Runway',
      value: `${stats.runwayMonths} mo`,
      icon: Clock,
      color: 'danger' as const,
      trend: 'down' as const,
      trendValue: '-18.2%',
    },
  ];

  // ---- Quick actions ----
  const quickActions = [
    { label: 'Send Payment Reminder', icon: Send, page: 'receivables' as const },
    { label: 'Review Expenses', icon: Eye, page: 'expenses' as const },
    { label: 'View Forecast', icon: Target, page: 'forecasting' as const },
  ];

  return (
    <PageShell
      title="CFO Command Center"
      subtitle="Real-time financial intelligence & decision support"
      icon={() => <Shield className="w-5 h-5" style={{ color: CSS.accent }} />}
    >
      <div className="space-y-6">
        {/* ── 1. Top KPI Row ──────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {kpis.map((kpi) => (
            <KpiWidget
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              icon={kpi.icon}
              color={kpi.color}
              trend={kpi.trend}
              trendValue={kpi.trendValue}
            />
          ))}
        </div>

        {/* ── 2. Cashflow Visualization ──────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION.duration.slow }}
          className="rounded-2xl p-6"
          style={{
            backgroundColor: CSS.cardBg,
            border: `1px solid ${CSS.border}`,
            boxShadow: CSS.shadowCard,
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: CSS.accent }} />
              <span className="text-sm font-semibold" style={{ color: CSS.text }}>
                Cashflow Projection
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: CSS.accent }} />
                <span className="text-xs" style={{ color: CSS.textSecondary }}>Cash In</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: CSS.danger }} />
                <span className="text-xs" style={{ color: CSS.textSecondary }}>Cash Out</span>
              </div>
            </div>
          </div>

          <div className="flex items-end gap-3" style={{ height: 200 }}>
            {cashflowProjections.map((proj: CashflowProjection) => {
              const inflowH = Math.max(8, (proj.inflow / chartMax) * 180);
              const outflowH = Math.max(8, (proj.outflow / chartMax) * 180);
              return (
                <div key={proj.month} className="flex-1 flex flex-col items-center gap-1">
                  {/* Bars */}
                  <div className="flex items-end gap-1 w-full justify-center" style={{ height: 180 }}>
                    {/* Inflow bar */}
                    <div
                      className="w-5 rounded-t-md transition-all"
                      style={{
                        height: inflowH,
                        backgroundColor: CSS.accent,
                        opacity: proj.isProjected ? 0.6 : 1,
                        border: proj.isProjected ? `1px dashed ${CSS.accent}` : 'none',
                        borderRadius: proj.isProjected ? 4 : undefined,
                      }}
                    />
                    {/* Outflow bar */}
                    <div
                      className="w-5 rounded-t-md transition-all"
                      style={{
                        height: outflowH,
                        backgroundColor: CSS.danger,
                        opacity: proj.isProjected ? 0.6 : 1,
                        border: proj.isProjected ? `1px dashed ${CSS.danger}` : 'none',
                        borderRadius: proj.isProjected ? 4 : undefined,
                      }}
                    />
                  </div>
                  {/* Month label */}
                  <span className="text-[10px] font-medium" style={{ color: CSS.textMuted }}>
                    {proj.month.split(' ')[0]}
                  </span>
                  {/* Net value */}
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: proj.net >= 0 ? CSS.success : CSS.danger }}
                  >
                    {formatINR(proj.net)}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── 3. Revenue Funnel ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION.duration.slow, delay: 0.05 }}
          className="rounded-2xl p-6"
          style={{
            backgroundColor: CSS.cardBg,
            border: `1px solid ${CSS.border}`,
            boxShadow: CSS.shadowCard,
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Zap className="w-4 h-4" style={{ color: CSS.orange }} />
            <span className="text-sm font-semibold" style={{ color: CSS.text }}>
              Revenue Funnel
            </span>
          </div>

          <div className="space-y-3">
            {cfoFunnelData.map((step: CFOFunnelStep, idx: number) => {
              const widthPct = Math.max(20, (step.count / funnelMaxCount) * 100);
              return (
                <motion.div
                  key={step.stage}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.06 }}
                  className="flex items-center gap-4"
                >
                  {/* Funnel bar */}
                  <div className="flex-1 min-w-0">
                    <div
                      className="h-10 rounded-lg flex items-center px-4 transition-all"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor:
                          idx === 0
                            ? CSS.accentLight
                            : idx === cfoFunnelData.length - 1
                              ? CSS.successBg
                              : CSS.hoverBg,
                        border: `1px solid ${idx === 0 ? CSS.accent : idx === cfoFunnelData.length - 1 ? CSS.success : CSS.border}`,
                      }}
                    >
                      <span className="text-xs font-medium truncate" style={{ color: CSS.text }}>
                        {step.stage}
                      </span>
                    </div>
                  </div>
                  {/* Stats */}
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right min-w-[60px]">
                      <p className="text-sm font-bold" style={{ color: CSS.text }}>{step.count}</p>
                      <p className="text-[10px]" style={{ color: CSS.textMuted }}>count</p>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className="text-sm font-semibold" style={{ color: CSS.textSecondary }}>
                        {formatINR(step.value)}
                      </p>
                      <p className="text-[10px]" style={{ color: CSS.textMuted }}>value</p>
                    </div>
                    <div className="text-right min-w-[50px]">
                      <p className="text-xs font-medium" style={{ color: CSS.accent }}>
                        {step.conversionRate}%
                      </p>
                      <p className="text-[10px]" style={{ color: CSS.textMuted }}>conv.</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── 4. AI Insights Panel ────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION.duration.slow, delay: 0.1 }}
          className="rounded-2xl p-6"
          style={{
            backgroundColor: CSS.cardBg,
            border: `1px solid ${CSS.border}`,
            boxShadow: CSS.shadowCard,
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-4 h-4" style={{ color: CSS.orange }} />
            <span className="text-sm font-semibold" style={{ color: CSS.text }}>
              AI Insights — Critical & High Impact
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {criticalInsights.map((insight: AIInsight, idx: number) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 + idx * 0.05 }}
                className="rounded-xl p-4 flex flex-col gap-3"
                style={{
                  backgroundColor: CSS.surface2,
                  border: `1px solid ${insight.impact === 'critical' ? CSS.danger : CSS.warning}`,
                }}
              >
                {/* Impact badge + confidence */}
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                    style={{
                      backgroundColor: insight.impact === 'critical' ? CSS.dangerBg : CSS.warningBg,
                      color: insight.impact === 'critical' ? CSS.danger : CSS.warning,
                    }}
                  >
                    {insight.impact}
                  </span>
                  <span className="text-[11px] font-medium" style={{ color: CSS.accent }}>
                    {insight.confidence}% confidence
                  </span>
                </div>

                {/* Title & description */}
                <div>
                  <p className="text-sm font-semibold leading-snug mb-1" style={{ color: CSS.text }}>
                    {insight.title}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: CSS.textSecondary }}>
                    {insight.description}
                  </p>
                </div>

                {/* Recommendation */}
                <div
                  className="rounded-lg p-2.5"
                  style={{ backgroundColor: CSS.hoverBg, borderLeft: `3px solid ${CSS.accent}` }}
                >
                  <p className="text-[10px] font-semibold uppercase mb-0.5" style={{ color: CSS.textMuted }}>
                    Recommendation
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: CSS.textSecondary }}>
                    {insight.recommendation}
                  </p>
                </div>

                {/* Action button */}
                {insight.actionPage && (
                  <button
                    type="button"
                    onClick={() => navigateTo(insight.actionPage!)}
                    className="mt-auto flex items-center gap-1.5 text-xs font-medium self-start px-3 py-1.5 rounded-lg transition-colors"
                    style={{
                      color: CSS.accent,
                      backgroundColor: CSS.accentLight,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = CSS.accent;
                      (e.currentTarget as HTMLElement).style.color = CSS.cardBg;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = CSS.accentLight;
                      (e.currentTarget as HTMLElement).style.color = CSS.accent;
                    }}
                  >
                    {insight.actionLabel || 'Take Action'}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── 5. Quick Actions + Active Alerts ────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: ANIMATION.duration.slow, delay: 0.15 }}
            className="rounded-2xl p-6"
            style={{
              backgroundColor: CSS.cardBg,
              border: `1px solid ${CSS.border}`,
              boxShadow: CSS.shadowCard,
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Zap className="w-4 h-4" style={{ color: CSS.accent }} />
              <span className="text-sm font-semibold" style={{ color: CSS.text }}>
                Quick Actions
              </span>
            </div>

            <div className="space-y-3">
              {quickActions.map((action) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => navigateTo(action.page)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: CSS.hoverBg,
                      color: CSS.text,
                      border: `1px solid ${CSS.border}`,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = CSS.accentLight;
                      (e.currentTarget as HTMLElement).style.borderColor = CSS.accent;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = CSS.hoverBg;
                      (e.currentTarget as HTMLElement).style.borderColor = CSS.border;
                    }}
                  >
                    <ActionIcon className="w-4 h-4 shrink-0" style={{ color: CSS.accent }} />
                    <span className="flex-1 text-left">{action.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" style={{ color: CSS.textMuted }} />
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Active Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: ANIMATION.duration.slow, delay: 0.2 }}
            className="rounded-2xl p-6 lg:col-span-2"
            style={{
              backgroundColor: CSS.cardBg,
              border: `1px solid ${CSS.border}`,
              boxShadow: CSS.shadowCard,
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" style={{ color: CSS.warning }} />
                <span className="text-sm font-semibold" style={{ color: CSS.text }}>
                  Active Alerts
                </span>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: CSS.dangerBg, color: CSS.danger }}
                >
                  {financeAlerts.filter((a: FinanceAlert) => !a.isRead).length} unread
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {activeAlerts.map((alert: FinanceAlert, idx: number) => {
                const isCritical = alert.severity === 'critical';
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.05, duration: 0.3 }}
                    className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                    style={{
                      backgroundColor: isCritical ? CSS.dangerBg : CSS.hoverBg,
                      border: `1px solid ${isCritical ? CSS.danger : CSS.border}`,
                    }}
                    onClick={() => alert.actionPage && navigateTo(alert.actionPage)}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = CSS.activeBg;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = isCritical ? CSS.dangerBg : CSS.hoverBg;
                    }}
                  >
                    {/* Severity icon */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        backgroundColor: isCritical ? CSS.dangerBg : CSS.infoBg,
                      }}
                    >
                      {severityIcon(alert.severity)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium truncate" style={{ color: CSS.text }}>
                          {alert.title}
                        </p>
                        {!alert.isRead && (
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: CSS.accent }}
                          />
                        )}
                        <StatusBadge
                          status={alert.severity}
                          variant="pill"
                          className="shrink-0 text-[9px] px-1.5 py-0"
                        />
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: CSS.textSecondary }}>
                        {alert.description}
                      </p>
                      <p className="text-[10px] mt-1" style={{ color: CSS.textMuted }}>
                        {new Date(alert.timestamp).toLocaleString('en-IN', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {/* Arrow */}
                    {alert.actionPage && (
                      <ArrowRight
                        className="w-4 h-4 shrink-0 mt-2"
                        style={{ color: CSS.textMuted }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </PageShell>
  );
}
