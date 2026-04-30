'use client';

import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, Flame, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Target, BarChart2, BarChart3, Zap, Info, Bell
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PageShell } from '@/components/shared/page-shell';
import { SmartDataTable, type DataTableColumnDef } from '@/components/shared/smart-data-table';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { CSS } from '@/styles/design-tokens';
import { mockProfitability } from '@/modules/erp/data/mock-data';

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
}

function getMarginColor(margin: number) {
  if (margin >= 20) return { bar: 'bg-emerald-500', text: '#34d399' };
  if (margin >= 10) return { bar: 'bg-sky-500', text: '#60a5fa' };
  if (margin >= 0) return { bar: 'bg-amber-500', text: '#fbbf24' };
  return { bar: 'bg-red-500', text: '#f87171' };
}

function getAlertSeverity(severity: string) {
  switch (severity) {
    case 'critical': return { icon: AlertTriangle, color: '#f87171', bg: 'rgba(248, 113, 113, 0.08)', border: 'rgba(248, 113, 113, 0.15)' };
    case 'warning': return { icon: Flame, color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.08)', border: 'rgba(251, 191, 36, 0.15)' };
    default: return { icon: Info, color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.08)', border: 'rgba(96, 165, 250, 0.15)' };
  }
}

const serviceTypeRevenue = [
  { service: 'Custom Development', revenue: 4200000 },
  { service: 'UI/UX Design', revenue: 1200000 },
  { service: 'Quality Assurance', revenue: 600000 },
  { service: 'DevOps & Infra', revenue: 540000 },
  { service: 'Security Audits', revenue: 960000 },
  { service: 'Staff Augmentation', revenue: 360000 },
];

const burnRevenueData = [
  { month: 'Oct', burn: 1200000, revenue: 1800000 },
  { month: 'Nov', burn: 1400000, revenue: 2100000 },
  { month: 'Dec', burn: 1600000, revenue: 2400000 },
  { month: 'Jan', burn: 1700000, revenue: 2600000 },
  { month: 'Feb', burn: 1800000, revenue: 2800000 },
  { month: 'Mar', burn: 1850000, revenue: 3200000 },
  { month: 'Apr', burn: 1900000, revenue: 3500000 },
];

const barColors = ['bg-emerald-500', 'bg-sky-500', 'bg-violet-500', 'bg-pink-500', 'bg-amber-500', 'bg-teal-500'];

function ProfitabilityPageInner() {
  const kpis = useMemo(() => {
    const totalRevenue = mockProfitability.reduce((s, p) => s + p.revenue, 0);
    const totalCost = mockProfitability.reduce((s, p) => s + p.cost, 0);
    const netMargin = ((totalRevenue - totalCost) / totalRevenue * 100);
    const avgBurn = mockProfitability.reduce((s, p) => s + p.burnRate, 0) / mockProfitability.filter(p => p.burnRate > 0).length;
    return { totalRevenue, totalCost, netMargin: netMargin.toFixed(1), burnRate: avgBurn };
  }, []);

  const maxRevenue = Math.max(...serviceTypeRevenue.map(s => s.revenue));
  const maxBurnRevenue = Math.max(...burnRevenueData.map(d => Math.max(d.burn, d.revenue)));

  const allAlerts = useMemo(() => {
    return mockProfitability.flatMap(p =>
      p.alerts.map(a => ({ ...a, clientName: p.clientName }))
    ).sort((a, b) => {
      if (a.severity === 'critical' && b.severity !== 'critical') return -1;
      if (b.severity === 'critical' && a.severity !== 'critical') return 1;
      return 0;
    });
  }, []);

  const columns: DataTableColumnDef[] = [
    {
      key: 'clientName',
      label: 'Client',
      sortable: true,
      render: (row) => {
        const client = row as unknown as typeof mockProfitability[0];
        const isNegMargin = client.margin < 0;
        return (
          <div className="flex items-center gap-2">
            {isNegMargin && <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: CSS.danger }} />}
            <span className="text-sm font-medium" style={{ color: isNegMargin ? CSS.danger : CSS.text }}>
              {client.clientName}
            </span>
          </div>
        );
      },
    },
    {
      key: 'revenue',
      label: 'Revenue (₹)',
      sortable: true,
      render: (row) => (
        <span className="text-xs font-medium" style={{ color: CSS.text }}>
          {formatCurrency(Number(row.revenue))}
        </span>
      ),
    },
    {
      key: 'cost',
      label: 'Cost (₹)',
      sortable: true,
      render: (row) => (
        <span className="text-xs font-medium" style={{ color: CSS.text }}>
          {formatCurrency(Number(row.cost))}
        </span>
      ),
    },
    {
      key: 'margin',
      label: 'Margin',
      sortable: true,
      render: (row) => {
        const client = row as unknown as typeof mockProfitability[0];
        const marginColor = getMarginColor(client.margin);
        return (
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs font-bold" style={{ color: marginColor.text }}>
              {client.margin > 0 ? '+' : ''}{client.margin}%
            </span>
            <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: CSS.hoverBg }}>
              <div className={`h-full rounded-full transition-all ${marginColor.bar}`} style={{ width: `${Math.min(Math.abs(client.margin) * 2, 100)}%` }} />
            </div>
          </div>
        );
      },
    },
    {
      key: 'burnRate',
      label: 'Burn',
      sortable: true,
      render: (row) => (
        <span className="text-xs" style={{ color: CSS.textSecondary }}>
          {Number(row.burnRate) > 0 ? formatCurrency(Number(row.burnRate)) : '—'}
        </span>
      ),
    },
    {
      key: 'alerts',
      label: 'Alerts',
      render: (row) => {
        const client = row as unknown as typeof mockProfitability[0];
        const hasAlerts = client.alerts.length > 0;
        if (!hasAlerts) {
          return <span style={{ color: CSS.textDisabled }}>—</span>;
        }
        const hasCritical = client.alerts.some(a => a.severity === 'critical');
        return (
          <Badge className={`text-[9px] px-1.5 py-0 min-w-[18px] justify-center ${hasCritical ? 'bg-red-500/15 text-red-300 border border-red-500/20' : 'bg-amber-500/15 text-amber-300 border border-amber-500/20'}`}>
            {client.alerts.length}
          </Badge>
        );
      },
    },
  ];

  return (
    <PageShell title="Profitability" icon={BarChart2} headerRight={
      <div className="flex items-center gap-2">
<<<<<<< HEAD
        <Badge className="text-xs font-medium bg-purple-500/15 text-purple-300 border-purple-500/20 border">
          <Target className="w-3 h-3 mr-1" />
          Founder View
        </Badge>
      </div>
    }>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiWidget label="Total Revenue" value={formatCurrency(kpis.totalRevenue)} icon={DollarSign} color="success" trend="up" trendValue="+15%" />
        <KpiWidget label="Total Cost" value={formatCurrency(kpis.totalCost)} icon={TrendingDown} color="danger" trend="down" trendValue="-8%" />
        <KpiWidget label="Net Margin" value={`${kpis.netMargin}%`} icon={Target} color={Number(kpis.netMargin) >= 10 ? 'success' : 'warning'} trend={Number(kpis.netMargin) > 0 ? 'up' : 'down'} trendValue={String(kpis.netMargin)} />
        <KpiWidget label="Burn Rate" value={`${formatCurrency(kpis.burnRate)}/mo`} icon={Flame} color="warning" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Client Profitability Table */}
        <div className="xl:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold" style={{ color: CSS.textSecondary }}>Client Profitability</h2>
          <SmartDataTable
            data={mockProfitability as unknown as Record<string, unknown>[]}
            columns={columns}
            searchable
            searchPlaceholder="Search clients..."
            searchKeys={['clientName']}
            emptyMessage="No clients found"
            enableExport
          />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Profit by Service Type */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl p-4 space-y-3" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}>
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: CSS.text }}>
              <BarChart3 className="w-4 h-4" style={{ color: CSS.textMuted }} />
              Profit by Service
            </h3>
            {serviceTypeRevenue.map((s, i) => (
              <div key={s.service} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: CSS.text }}>{s.service}</span>
                  <span className="text-[11px] font-medium" style={{ color: CSS.textSecondary }}>{formatCurrency(s.revenue)}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: CSS.hoverBg }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.revenue / maxRevenue) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                    className={`h-full rounded-full ${barColors[i % barColors.length]}`}
                  />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Burn vs Revenue Chart */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl p-4 space-y-3" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: CSS.text }}>
                <Zap className="w-4 h-4" style={{ color: CSS.textMuted }} />
                Burn vs Revenue
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-[9px]" style={{ color: CSS.textDisabled }}>Burn</span></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-[9px]" style={{ color: CSS.textDisabled }}>Revenue</span></div>
              </div>
            </div>
            <div className="flex items-end gap-2 h-32">
              {burnRevenueData.map((d, i) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-0.5 items-end" style={{ height: '100%' }}>
=======
        <Badge className={cn('text-xs font-medium bg-purple-500/15 text-purple-300 border-purple-500/20 border')}>
          <Target className="w-4 h-4 mr-1" />
          Founder View
        </Badge>
        <div className={cn('flex items-center gap-2 px-3 py-2 rounded-[var(--app-radius-lg)] border w-full sm:w-64 transition-colors', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
          <Search className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
          <input type="text" placeholder="Search clients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={cn('bg-transparent text-sm focus:outline-none w-full', 'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]')} />
        </div>
      </div>
    }>
      {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: formatCurrency(kpis.totalRevenue), icon: DollarSign, change: '+15%', up: true, color: 'text-emerald-500 dark:text-emerald-400' },
            { label: 'Total Cost', value: formatCurrency(kpis.totalCost), icon: TrendingDown, change: '-8%', up: false, color: 'text-red-500 dark:text-red-400' },
            { label: 'Net Margin', value: `${kpis.netMargin}%`, icon: Target, change: kpis.netMargin, up: Number(kpis.netMargin) > 0, color: Number(kpis.netMargin) >= 10 ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400' },
            { label: 'Burn Rate', value: `${formatCurrency(kpis.burnRate)}/mo`, icon: Flame, change: 'per month', up: false, color: 'text-orange-400' },
          ].map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-[var(--app-radius-xl)] border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>{kpi.label}</span>
                <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}><kpi.icon className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} /></div>
              </div>
              <p className="text-xl font-bold">{kpi.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {kpi.up ? <ArrowUpRight className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <ArrowDownRight className="w-4 h-4 text-red-500 dark:text-red-400" />}
                <span className={cn('text-[10px] font-medium', kpi.color)}>{kpi.change}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Client Profitability Table */}
          <div className="xl:col-span-2 space-y-3">
            <h2 className={cn('text-sm font-semibold', 'text-[var(--app-text-secondary)]')}>Client Profitability</h2>
            <div className={cn('rounded-[var(--app-radius-xl)] border overflow-hidden', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={cn('border-b', 'border-[var(--app-border-light)]')}>
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-semibold">Client</th>
                      <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider font-semibold">Revenue (₹)</th>
                      <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider font-semibold">Cost (₹)</th>
                      <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider font-semibold">Margin</th>
                      <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider font-semibold">Burn</th>
                      <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider font-semibold">Alerts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((client, idx) => {
                      const marginColor = getMarginColor(client.margin);
                      const hasAlerts = client.alerts.length > 0;
                      const isNegMargin = client.margin < 0;
                      return (
                        <motion.tr key={client.clientId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }} className={cn('border-b last:border-0 transition-colors', isDark ? 'border-white/[0.03] hover:bg-white/[0.03]' : 'border-black/[0.03] hover:bg-black/[0.02]')}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {isNegMargin && <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />}
                              <span className={cn('text-sm font-medium', isNegMargin && 'text-red-500 dark:text-red-400')}>{client.clientName}</span>
                            </div>
                          </td>
                          <td className="text-right px-4 py-3">
                            <span className="text-xs font-medium">{formatCurrency(client.revenue)}</span>
                          </td>
                          <td className="text-right px-4 py-3">
                            <span className="text-xs font-medium">{formatCurrency(client.cost)}</span>
                          </td>
                          <td className="text-right px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <span className={cn('text-xs font-bold', marginColor.text)}>{client.margin > 0 ? '+' : ''}{client.margin}%</span>
                              <div className={cn('w-16 h-1.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                                <div className={cn('h-full rounded-full transition-colors', marginColor.bar)} style={{ width: `${Math.min(Math.abs(client.margin) * 2, 100)}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="text-right px-4 py-3">
                            <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>{client.burnRate > 0 ? formatCurrency(client.burnRate) : '—'}</span>
                          </td>
                          <td className="text-center px-4 py-3">
                            {hasAlerts ? (
                              <Badge className={cn('text-[9px] px-1.5 py-0 min-w-[18px] justify-center', client.alerts.some(a => a.severity === 'critical') ? 'bg-red-500/15 text-red-300 border border-red-500/20' : 'bg-amber-500/15 text-amber-300 border border-amber-500/20')}>
                                {client.alerts.length}
                              </Badge>
                            ) : (
                              <span className={cn('text-[10px]', 'text-[var(--app-text-disabled)]')}>—</span>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Profit by Service Type */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={cn('rounded-[var(--app-radius-xl)] border p-4 space-y-3', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
                Profit by Service
              </h3>
              {serviceTypeRevenue.map((s, i) => (
                <div key={s.service} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{s.service}</span>
                    <span className={cn('text-[11px] font-medium', 'text-[var(--app-text-secondary)]')}>{formatCurrency(s.revenue)}</span>
                  </div>
                  <div className={cn('h-2 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.burn / maxBurnRevenue) * 100}%` }}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.4 }}
                      className="flex-1 bg-red-400/60 rounded-t-sm"
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.revenue / maxBurnRevenue) * 100}%` }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                      className="flex-1 bg-emerald-400/60 rounded-t-sm"
                    />
                  </div>
                  <span className="text-[9px]" style={{ color: CSS.textDisabled }}>{d.month}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Alerts Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" style={{ color: CSS.textSecondary }} />
          <h2 className="text-sm font-semibold" style={{ color: CSS.textSecondary }}>Profitability Alerts</h2>
          <Badge className="text-[9px] px-1.5 py-0 bg-red-500/15 text-red-300 border border-red-500/20">{allAlerts.length}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allAlerts.map((alert, idx) => {
            const severity = getAlertSeverity(alert.severity);
            const SeverityIcon = severity.icon;
            return (
              <motion.div key={alert.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="rounded-2xl p-3 flex items-start gap-3" style={{ backgroundColor: severity.bg, border: `1px solid ${severity.border}` }}>
                <SeverityIcon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: severity.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium mb-0.5" style={{ color: CSS.textMuted }}>{alert.clientName}</p>
                  <p className="text-xs" style={{ color: CSS.text }}>{alert.message}</p>
                  <span className="text-[9px] uppercase tracking-wider font-bold mt-1 inline-block" style={{ color: severity.color }}>{alert.type.replace('-', ' ')}</span>
                </div>
              </motion.div>
            );
          })}
=======
            {/* Burn vs Revenue Chart */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={cn('rounded-[var(--app-radius-xl)] border p-4 space-y-3', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Zap className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
                  Burn vs Revenue
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400" /><span className={cn('text-[9px]', 'text-[var(--app-text-muted)]')}>Burn</span></div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className={cn('text-[9px]', 'text-[var(--app-text-muted)]')}>Revenue</span></div>
                </div>
              </div>
              <div className="flex items-end gap-2 h-32">
                {burnRevenueData.map((d, i) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex gap-0.5 items-end" style={{ height: '100%' }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.burn / maxBurnRevenue) * 100}%` }}
                        transition={{ delay: 0.4 + i * 0.05, duration: 0.4 }}
                        className="flex-1 bg-red-400/60 rounded-t-sm"
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.revenue / maxBurnRevenue) * 100}%` }}
                        transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                        className="flex-1 bg-emerald-400/60 rounded-t-sm"
                      />
                    </div>
                    <span className={cn('text-[9px]', 'text-[var(--app-text-muted)]')}>{d.month}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Bell className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
            <h2 className={cn('text-sm font-semibold', 'text-[var(--app-text-secondary)]')}>Profitability Alerts</h2>
            <Badge className={cn('text-[9px] px-1.5 py-0 bg-red-500/15 text-red-300 border border-red-500/20')}>{allAlerts.length}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allAlerts.map((alert, idx) => {
              const severity = getAlertSeverity(alert.severity);
              const SeverityIcon = severity.icon;
              return (
                <motion.div key={alert.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className={cn('rounded-[var(--app-radius-xl)] border p-3 flex items-start gap-3', severity.bg(isDark))}>
                  <SeverityIcon className={cn('w-4 h-4 shrink-0 mt-0.5', severity.color)} />
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-[10px] font-medium mb-0.5', 'text-[var(--app-text-muted)]')}>{alert.clientName}</p>
                    <p className="text-xs">{alert.message}</p>
                    <span className={cn('text-[9px] uppercase tracking-wider font-bold mt-1 inline-block', severity.color)}>{alert.type.replace('-', ' ')}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
        </div>
      </div>
    </PageShell>
  );
}

export default memo(ProfitabilityPageInner);
