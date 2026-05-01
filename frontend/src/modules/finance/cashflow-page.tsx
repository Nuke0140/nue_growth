'use client';

import { formatINR } from './utils';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CSS, ANIMATION } from '@/styles/design-tokens';
import { PageShell } from '@/components/shared/page-shell';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { StatusBadge } from '@/components/shared/status-badge';
import { FilterBar } from '@/components/shared/filter-bar';
import {
  Waves, Flame, Clock, Banknote, TrendingUp, TrendingDown,
  AlertTriangle, ArrowDownRight, ArrowUpRight,
} from 'lucide-react';
import {
  cashflowProjections, burnRateInfo, cfoDashboardStats,
} from './data/mock-data';
import { useFinanceStore } from './finance-store';

// ── Runway gauge arc component ────────────────────────
function RunwayGauge({ months, threshold }: { months: number; threshold: number }) {
  const pct = Math.min(months / (threshold * 2), 1);
  const arcLen = 220;
  const dashOff = arcLen * (1 - pct);
  const color = months < threshold ? CSS.danger : months < threshold * 1.5 ? CSS.warning : CSS.success;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="140" height="80" viewBox="0 0 140 80">
        <path
          d="M 15 75 A 55 55 0 0 1 125 75"
          fill="none"
          stroke={CSS.hoverBg}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 15 75 A 55 55 0 0 1 125 75"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={arcLen}
          strokeDashoffset={dashOff}
          style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.3s' }}
        />
        <text x="70" y="60" textAnchor="middle" fontSize="22" fontWeight="700" fill={CSS.text}>
          {months}mo
        </text>
      </svg>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: CSS.border }} />
        <span className="text-[10px]" style={{ color: CSS.textMuted }}>
          Safety: {threshold} months
        </span>
      </div>
    </div>
  );
}

export default function CashflowPage() {
  const navigateTo = useFinanceStore((s) => s.navigateTo);

  // ── Derived data ─────────────────────────────────────
  const latestProjection = cashflowProjections[cashflowProjections.length - 1];
  const netCashflow = cashflowProjections.reduce((s, p) => s + p.net, 0);
  const safetyThreshold = burnRateInfo.runwaySafetyThreshold;

  const inflowBreakdown = useMemo(() => {
    const total = cashflowProjections.reduce((s, p) => s + p.inflow, 0);
    return [
      { label: 'Client Payments', amount: total * 0.58 },
      { label: 'Retainer Revenue', amount: total * 0.24 },
      { label: 'Project Milestones', amount: total * 0.12 },
      { label: 'Other Inflow', amount: total * 0.06 },
    ];
  }, []);

  const outflowBreakdown = useMemo(() => {
    const total = cashflowProjections.reduce((s, p) => s + p.outflow, 0);
    return [
      { label: 'Payroll & Benefits', amount: total * 0.34 },
      { label: 'Software & Infra', amount: total * 0.21 },
      { label: 'Office & Admin', amount: total * 0.14 },
      { label: 'Marketing Spend', amount: total * 0.18 },
      { label: 'Freelancers', amount: total * 0.08 },
      { label: 'Other Outflow', amount: total * 0.05 },
    ];
  }, []);

  const totalInflow = inflowBreakdown.reduce((s, b) => s + b.amount, 0);
  const totalOutflow = outflowBreakdown.reduce((s, b) => s + b.amount, 0);

  // ── Chart helpers ────────────────────────────────────
  const maxVal = Math.max(...cashflowProjections.map((p) => Math.max(p.inflow, p.outflow)), 1);
  const balanceMax = Math.max(...cashflowProjections.map((p) => p.closingBalance), 1);
  const chartW = 640;
  const chartH = 180;
  const barW = 28;
  const gap = (chartW - cashflowProjections.length * barW * 2) / (cashflowProjections.length + 1);

  const shortageDate = burnRateInfo.cashShortageDate
    ? new Date(burnRateInfo.cashShortageDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  // ── Render ───────────────────────────────────────────
  return (
    <PageShell
      title="Cashflow Intelligence"
      subtitle="Founder Cash Runway & Burn Monitoring"
      icon={() => <Waves className="w-5 h-5" style={{ color: CSS.accent }} />}
      headerRight={
        <span
          className="px-3 py-1.5 text-xs font-medium rounded-full"
          style={{ backgroundColor: CSS.hoverBg, color: CSS.textSecondary }}
        >
          <Clock className="w-3.5 h-3.5 inline mr-1.5" />
          Live
        </span>
      }
    >
      <div className="space-y-6">
        {/* ── KPI Row ────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiWidget
            label="Monthly Burn"
            value={formatINR(burnRateInfo.monthlyBurn) + '/mo'}
            icon={Flame}
            color="danger"
            trend="up"
            trendValue="+8.2%"
          />
          <KpiWidget
            label="Runway"
            value={`${burnRateInfo.runwayMonths} mo`}
            icon={Clock}
            color="danger"
            trend="down"
            trendValue="-0.4mo"
          />
          <KpiWidget
            label="Cash Balance"
            value={formatINR(cfoDashboardStats.cashBalance)}
            icon={Banknote}
            color="accent"
            trend="up"
            trendValue="+6.1%"
          />
          <KpiWidget
            label="Net Cashflow"
            value={formatINR(netCashflow)}
            icon={TrendingUp}
            color="success"
            trend="up"
            trendValue="+12.4%"
          />
        </div>

        {/* ── Burn Rate Card ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION.duration.slow, ease: ANIMATION.ease as unknown as number[] }}
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: CSS.cardBg,
            borderColor: CSS.border,
            boxShadow: CSS.shadowCard,
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Flame className="w-4 h-4" style={{ color: CSS.danger }} />
            <span className="text-sm font-semibold" style={{ color: CSS.text }}>
              Burn Rate & Runway
            </span>
            <StatusBadge
              status={burnRateInfo.burnTrend === 'increasing' ? 'critical' : 'good'}
              variant="pill"
              className="ml-2 text-[10px] px-2 py-0"
            >
              {burnRateInfo.burnTrend}
            </StatusBadge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left: Stats */}
            <div className="space-y-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider" style={{ color: CSS.textMuted }}>Monthly Burn</p>
                <p className="text-2xl font-bold" style={{ color: CSS.danger }}>{formatINR(burnRateInfo.monthlyBurn)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider" style={{ color: CSS.textMuted }}>Runway Remaining</p>
                <p className="text-2xl font-bold" style={{ color: burnRateInfo.runwayMonths < safetyThreshold ? CSS.danger : CSS.success }}>
                  {burnRateInfo.runwayMonths} months
                </p>
              </div>
              {shortageDate && (
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" style={{ color: CSS.danger }} />
                  <span className="text-xs font-medium" style={{ color: CSS.danger }}>
                    Shortage by {shortageDate}
                  </span>
                </div>
              )}
            </div>

            {/* Center: Runway Gauge */}
            <div className="flex justify-center">
              <RunwayGauge months={burnRateInfo.runwayMonths} threshold={safetyThreshold} />
            </div>

            {/* Right: Safety Threshold Bar */}
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-wider" style={{ color: CSS.textMuted }}>Runway vs Safety Threshold</p>
              <div className="w-full h-3 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((burnRateInfo.runwayMonths / (safetyThreshold * 2)) * 100, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: burnRateInfo.runwayMonths < safetyThreshold ? CSS.danger : CSS.success }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px]" style={{ color: CSS.textMuted }}>
                <span>0 mo</span>
                <span style={{ color: CSS.warning }}>Safety: {safetyThreshold} mo</span>
                <span>{safetyThreshold * 2} mo</span>
              </div>
              <div className="relative w-full h-0.5" style={{ backgroundColor: CSS.border }}>
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3"
                  style={{ left: '25%', backgroundColor: CSS.warning }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Cashflow Timeline Chart ────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: ANIMATION.duration.slow, ease: ANIMATION.ease as unknown as number[] }}
          className="rounded-2xl border p-6"
          style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border, boxShadow: CSS.shadowCard }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: CSS.textMuted }} />
              <span className="text-sm font-semibold" style={{ color: CSS.text }}>Cashflow Timeline</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CSS.accent }} />
                <span className="text-[10px]" style={{ color: CSS.textMuted }}>Inflow</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CSS.danger }} />
                <span className="text-[10px]" style={{ color: CSS.textMuted }}>Outflow</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-0 border-t-2 border-dashed" style={{ borderColor: CSS.info }} />
                <span className="text-[10px]" style={{ color: CSS.textMuted }}>Balance</span>
              </div>
            </div>
          </div>

          <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 40}`} preserveAspectRatio="xMidYMid meet">
            {cashflowProjections.map((p, i) => {
              const x = gap + i * (barW * 2 + gap);
              const inH = (p.inflow / maxVal) * chartH;
              const outH = (p.outflow / maxVal) * chartH;
              return (
                <g key={p.month}>
                  {/* Inflow bar */}
                  <rect
                    x={x} y={chartH - inH} width={barW} height={inH}
                    rx="4" fill={CSS.accent}
                    opacity={p.isProjected ? 0.5 : 0.85}
                    stroke={p.isProjected ? CSS.accent : 'none'}
                    strokeDasharray={p.isProjected ? '4 3' : 'none'}
                  />
                  {/* Outflow bar */}
                  <rect
                    x={x + barW + 2} y={chartH - outH} width={barW} height={outH}
                    rx="4" fill={CSS.danger}
                    opacity={p.isProjected ? 0.5 : 0.85}
                    stroke={p.isProjected ? CSS.danger : 'none'}
                    strokeDasharray={p.isProjected ? '4 3' : 'none'}
                  />
                  {/* Month label */}
                  <text x={x + barW + 1} y={chartH + 16} textAnchor="middle" fontSize="10" fill={CSS.textMuted}>
                    {p.month.split(' ')[0]}
                  </text>
                </g>
              );
            })}
            {/* Closing balance line */}
            <polyline
              fill="none"
              stroke={CSS.info}
              strokeWidth="2"
              strokeDasharray="6 4"
              points={cashflowProjections.map((p, i) => {
                const x = gap + i * (barW * 2 + gap) + barW + 1;
                const y = chartH - (p.closingBalance / balanceMax) * chartH;
                return `${x},${y}`;
              }).join(' ')}
            />
            {cashflowProjections.map((p, i) => {
              const x = gap + i * (barW * 2 + gap) + barW + 1;
              const y = chartH - (p.closingBalance / balanceMax) * chartH;
              return (
                <circle key={`dot-${p.month}`} cx={x} cy={y} r="3" fill={CSS.info} />
              );
            })}
          </svg>
        </motion.div>

        {/* ── Cash Shortage Alerts ────────────────────── */}
        {burnRateInfo.runwayMonths < safetyThreshold && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: ANIMATION.duration.slow }}
            className="rounded-2xl border p-5"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--app-danger) 4%, transparent)',
              borderColor: 'color-mix(in srgb, var(--app-danger) 15%, transparent)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4" style={{ color: CSS.danger }} />
              <span className="text-sm font-semibold" style={{ color: CSS.danger }}>Cash Shortage Alerts</span>
            </div>
            <div className="space-y-3">
              {shortageDate && (
                <div
                  className="flex items-center justify-between p-3 rounded-xl border"
                  style={{ borderColor: 'color-mix(in srgb, var(--app-danger) 10%, transparent)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: CSS.dangerBg }}>
                      <AlertTriangle className="w-4 h-4" style={{ color: CSS.danger }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: CSS.text }}>
                        Cash shortage projected by {shortageDate}
                      </p>
                      <p className="text-xs" style={{ color: CSS.textMuted }}>
                        At current burn rate, cash reserves will deplete below operating needs
                      </p>
                    </div>
                  </div>
                  <ArrowDownRight className="w-4 h-4" style={{ color: CSS.danger }} />
                </div>
              )}
              <div
                className="flex items-center justify-between p-3 rounded-xl border"
                style={{ borderColor: 'color-mix(in srgb, var(--app-danger) 10%, transparent)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: CSS.warningBg }}>
                    <Flame className="w-4 h-4" style={{ color: CSS.warning }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: CSS.text }}>
                      Burn rate trending {burnRateInfo.burnTrend} — {formatINR(burnRateInfo.monthlyBurn)}/mo
                    </p>
                    <p className="text-xs" style={{ color: CSS.textMuted }}>
                      Runway at {burnRateInfo.runwayMonths} months, below {safetyThreshold}-month safety threshold
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4" style={{ color: CSS.warning }} />
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Inflow / Outflow Breakdown ──────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Inflow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: ANIMATION.duration.slow, ease: ANIMATION.ease as unknown as number[] }}
            className="rounded-2xl border p-5"
            style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border, boxShadow: CSS.shadowCard }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4" style={{ color: CSS.success }} />
                <span className="text-sm font-semibold" style={{ color: CSS.text }}>Inflow Sources</span>
              </div>
              <span className="text-sm font-bold" style={{ color: CSS.success }}>{formatINR(totalInflow)}</span>
            </div>
            <div className="space-y-3">
              {inflowBreakdown.map((item, i) => {
                const pct = totalInflow > 0 ? (item.amount / totalInflow) * 100 : 0;
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium" style={{ color: CSS.text }}>{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold" style={{ color: CSS.text }}>{formatINR(item.amount)}</span>
                        <span className="text-[10px]" style={{ color: CSS.textMuted }}>{pct.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: CSS.accent }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Outflow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: ANIMATION.duration.slow, ease: ANIMATION.ease as unknown as number[] }}
            className="rounded-2xl border p-5"
            style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border, boxShadow: CSS.shadowCard }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ArrowDownRight className="w-4 h-4" style={{ color: CSS.danger }} />
                <span className="text-sm font-semibold" style={{ color: CSS.text }}>Outflow Categories</span>
              </div>
              <span className="text-sm font-bold" style={{ color: CSS.danger }}>{formatINR(totalOutflow)}</span>
            </div>
            <div className="space-y-3">
              {outflowBreakdown.map((item, i) => {
                const pct = totalOutflow > 0 ? (item.amount / totalOutflow) * 100 : 0;
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium" style={{ color: CSS.text }}>{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold" style={{ color: CSS.text }}>{formatINR(item.amount)}</span>
                        <span className="text-[10px]" style={{ color: CSS.textMuted }}>{pct.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.45 + i * 0.08, duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: CSS.danger }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </PageShell>
  );
}
