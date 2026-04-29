'use client';

import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Flame, Wallet, Building2, BarChart3, PieChart,
  Activity, CheckCircle2, Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PageShell } from '@/components/shared/page-shell';
import { SmartDataTable, type DataTableColumnDef } from '@/components/shared/smart-data-table';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { CSS } from '@/styles/design-tokens';
import { mockFinanceOps } from '@/modules/erp/data/mock-data';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
  return `₹${num}`;
}

const monthlyTrend = [
  { month: 'Oct', revenue: 3200000, expense: 2100000 },
  { month: 'Nov', revenue: 3800000, expense: 2500000 },
  { month: 'Dec', revenue: 2900000, expense: 2200000 },
  { month: 'Jan', revenue: 4100000, expense: 2800000 },
  { month: 'Feb', revenue: 3500000, expense: 2600000 },
  { month: 'Mar', revenue: 5200000, expense: 3400000 },
  { month: 'Apr', revenue: 5750000, expense: 3875000 },
];

function FinanceOpsPageInner() {
  const data = mockFinanceOps;
  const maxTrendRevenue = Math.max(...monthlyTrend.map(m => m.revenue));

  const columns: DataTableColumnDef[] = [
    {
      key: 'projectName',
      label: 'Project',
      sortable: true,
      render: (row) => {
        const cc = row as unknown as typeof data.projectCostCenters[0];
        const spentPct = cc.budget > 0 ? Math.round((cc.spent / cc.budget) * 100) : 0;
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: CSS.hoverBg }}
            >
              <PieChart className="w-4 h-4" style={{ color: CSS.textMuted }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate max-w-[220px]" style={{ color: CSS.text }}>{cc.projectName}</p>
              <p className="text-[10px]" style={{ color: CSS.textDisabled }}>{spentPct}% utilized</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'budget',
      label: 'Budget',
      sortable: true,
      render: (row) => (
        <span className="text-sm font-medium" style={{ color: CSS.text }}>{formatINR(Number(row.budget))}</span>
      ),
    },
    {
      key: 'spent',
      label: 'Spent',
      sortable: true,
      render: (row) => {
        const cc = row as unknown as typeof data.projectCostCenters[0];
        const spentPct = cc.budget > 0 ? Math.round((cc.spent / cc.budget) * 100) : 0;
        return (
          <div>
            <span className="text-sm" style={{ color: CSS.text }}>{formatINR(cc.spent)}</span>
            <div className="h-1 rounded-full overflow-hidden mt-1" style={{ backgroundColor: CSS.hoverBg }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(spentPct, 100)}%` }}
                transition={{ duration: 0.6 }}
                className="h-full rounded-full"
                style={{ backgroundColor: spentPct > 100 ? '#f87171' : spentPct > 80 ? '#fbbf24' : '#34d399' }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'variance',
      label: 'Variance',
      sortable: true,
      render: (row) => {
        const cc = row as unknown as typeof data.projectCostCenters[0];
        const variancePct = cc.budget > 0 ? Math.round((cc.variance / cc.budget) * 100) : 0;
        const isOverBudget = cc.variance < 0;
        const varianceColor = isOverBudget ? '#f87171' : '#34d399';
        return (
          <div className="text-right">
            <span className="text-sm font-semibold" style={{ color: varianceColor }}>
              {cc.variance > 0 ? '+' : ''}{formatINR(cc.variance)}
            </span>
            <p className="text-[10px]" style={{ color: varianceColor }}>{variancePct}%</p>
          </div>
        );
      },
    },
    {
      key: 'burnRate',
      label: 'Burn Rate',
      render: (row) => (
        <span className="text-xs" style={{ color: CSS.textSecondary }}>
          {formatINR(Number(row.burnRate))}/mo
        </span>
      ),
    },
    {
      key: 'healthStatus',
      label: 'Status',
      render: (row) => {
        const cc = row as unknown as typeof data.projectCostCenters[0];
        const spentPct = cc.budget > 0 ? Math.round((cc.spent / cc.budget) * 100) : 0;
        const isOverBudget = cc.variance < 0;
        const status = isOverBudget ? 'over-budget' : spentPct > 80 ? 'caution' : 'healthy';
        if (status === 'healthy') {
          return (
            <Badge className="text-[10px] font-medium border bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3 mr-0.5" />Healthy
            </Badge>
          );
        }
        if (status === 'caution') {
          return (
            <Badge className="text-[10px] font-medium border bg-amber-500/15 text-amber-500 dark:text-amber-400 border-amber-500/20">
              <Activity className="w-3 h-3 mr-0.5" />Caution
            </Badge>
          );
        }
        return (
          <Badge className="text-[10px] font-medium border bg-red-500/15 text-red-500 dark:text-red-400 border-red-500/20">
            <Clock className="w-3 h-3 mr-0.5" />Over Budget
          </Badge>
        );
      },
    },
  ];

  const tableData = data.projectCostCenters.map(cc => ({
    ...cc,
    healthStatus: cc.variance < 0 ? 'over-budget' : (cc.budget > 0 && Math.round((cc.spent / cc.budget) * 100) > 80) ? 'caution' : 'healthy',
  }));

  return (
    <PageShell title="Finance Ops" icon={TrendingDown}>
      <div className="space-y-6">
        {/* KPI Widgets Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiWidget label="Receivables" value={formatINR(data.receivables)} icon={ArrowDownRight} color="warning" trend="down" trendValue="+12% vs last month" />
          <KpiWidget label="Payables" value={formatINR(data.payables)} icon={ArrowUpRight} color="danger" trend="up" trendValue="-5% vs last month" />
          <KpiWidget label="Cash Flow" value={formatINR(data.cashFlow)} icon={TrendingUp} color="success" trend="up" trendValue="+18% growth" />
          <KpiWidget label="Budget Variance" value={`${((data.budgetVariance / (data.receivables + data.monthlyProfit)) * 100).toFixed(1)}%`} icon={Activity} color={data.budgetVariance < 0 ? 'danger' : 'success'} trend={data.budgetVariance >= 0 ? 'up' : 'down'} trendValue={data.budgetVariance < 0 ? 'Over budget' : 'Under budget'} />
          <KpiWidget label="Burn Rate" value={`${formatINR(data.burnRate)}/mo`} icon={Flame} color="warning" />
          <KpiWidget label="Vendor Payouts Due" value={formatINR(data.vendorPayouts)} icon={Wallet} color="warning" />
          <KpiWidget label="Monthly Profit" value={formatINR(data.monthlyProfit)} icon={TrendingUp} color="success" trend="up" trendValue="+22% vs March" />
          <KpiWidget label="Cost Centers" value={`${data.projectCostCenters.length}`} icon={Building2} color="info" />
        </div>

        {/* Monthly Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="rounded-2xl p-5"
          style={{
            backgroundColor: CSS.cardBg,
            border: `1px solid ${CSS.border}`,
            boxShadow: CSS.shadowCard,
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" style={{ color: CSS.textMuted }} />
              <span className="text-sm font-semibold" style={{ color: CSS.text }}>Monthly Revenue vs Expense Trend</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                <span className="text-[10px]" style={{ color: CSS.textMuted }}>Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-red-300" />
                <span className="text-[10px]" style={{ color: CSS.textMuted }}>Expense</span>
              </div>
            </div>
          </div>
          <div className="flex items-end gap-3 h-40">
            {monthlyTrend.map((m, i) => {
              const revHeight = (m.revenue / maxTrendRevenue) * 100;
              const expHeight = (m.expense / maxTrendRevenue) * 100;
              const profit = m.revenue - m.expense;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full flex items-end gap-0.5 h-32 cursor-pointer group">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${revHeight}%` }}
                            transition={{ delay: 0.4 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="flex-1 rounded-t-sm bg-emerald-300 group-hover:bg-emerald-400 transition-all"
                          />
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${expHeight}%` }}
                            transition={{ delay: 0.5 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="flex-1 rounded-t-sm bg-red-200 group-hover:bg-red-300 transition-all"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs space-y-1">
                          <p className="font-semibold">{m.month} 2026</p>
                          <p className="text-emerald-500 dark:text-emerald-400">Revenue: {formatINR(m.revenue)}</p>
                          <p className="text-red-500 dark:text-red-400">Expense: {formatINR(m.expense)}</p>
                          <p className="font-semibold">Profit: {formatINR(profit)}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="text-[10px] font-medium" style={{ color: CSS.textDisabled }}>{m.month}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Project Cost Centers Table */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" style={{ color: CSS.textMuted }} />
            <span className="text-sm font-semibold" style={{ color: CSS.text }}>Project Cost Centers</span>
          </div>
          <Badge variant="secondary" className="text-[10px]" style={{ backgroundColor: CSS.hoverBg, color: CSS.textSecondary }}>
            {data.projectCostCenters.length} active
          </Badge>
        </div>

        <SmartDataTable
          data={tableData as unknown as Record<string, unknown>[]}
          columns={columns}
          searchable
          searchPlaceholder="Search projects..."
          searchKeys={['projectName']}
          emptyMessage="No cost centers found"
          enableExport
        />

        {/* Summary Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl p-4"
            style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}
          >
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: CSS.textMuted }}>Total Budget Allocated</p>
            <p className="text-lg font-bold" style={{ color: CSS.text }}>{formatINR(data.projectCostCenters.reduce((s, c) => s + c.budget, 0))}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="rounded-2xl p-4"
            style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}
          >
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: CSS.textMuted }}>Total Spent</p>
            <p className="text-lg font-bold" style={{ color: CSS.text }}>{formatINR(data.projectCostCenters.reduce((s, c) => s + c.spent, 0))}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl p-4"
            style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}
          >
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: CSS.textMuted }}>Net Variance</p>
            <p
              className="text-lg font-bold"
              style={{ color: data.projectCostCenters.reduce((s, c) => s + c.variance, 0) > 0 ? CSS.success : CSS.danger }}
            >
              {data.projectCostCenters.reduce((s, c) => s + c.variance, 0) > 0 ? '+' : ''}{formatINR(data.projectCostCenters.reduce((s, c) => s + c.variance, 0))}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="rounded-2xl p-4"
            style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}
          >
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: CSS.textMuted }}>Projects at Risk</p>
            <p className="text-lg font-bold" style={{ color: CSS.danger }}>
              {data.projectCostCenters.filter(c => c.variance < 0).length}
            </p>
          </motion.div>
        </div>
      </div>
    </PageShell>
  );
}

export default memo(FinanceOpsPageInner);
