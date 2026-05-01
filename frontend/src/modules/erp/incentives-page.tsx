'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, IndianRupee, Clock, CheckCircle2, TrendingUp, BarChart3,
  ChevronDown, MoreHorizontal, Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { PageShell } from '@/components/shared/page-shell';
import { SmartDataTable, type DataTableColumnDef } from '@/components/shared/smart-data-table';
import { FilterBar } from '@/components/shared/filter-bar';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { CSS } from '@/styles/design-tokens';
import { mockIncentives, mockEmployees } from '@/modules/erp/data/mock-data';
import type { IncentiveType, IncentiveStatus } from '@/modules/erp/types';

type FilterKey = 'all' | IncentiveStatus;

const typeConfig: Record<IncentiveType, { label: string; color: string; bg: string }> = {
  performance: { label: 'Performance', color: '#34d399', bg: 'rgba(52, 211, 153, 0.12)' },
  referral: { label: 'Referral', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.12)' },
  'project-bonus': { label: 'Project Bonus', color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.12)' },
  'spot-award': { label: 'Spot Award', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)' },
  retention: { label: 'Retention', color: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.12)' },
};

const statusConfig: Record<IncentiveStatus, { label: string; color: string; bg: string; dotColor: string }> = {
  pending: { label: 'Pending', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)', dotColor: '#fbbf24' },
  approved: { label: 'Approved', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.12)', dotColor: '#60a5fa' },
  disbursed: { label: 'Disbursed', color: '#34d399', bg: 'rgba(52, 211, 153, 0.12)', dotColor: '#34d399' },
};

function getEmployee(id: string) {
  return mockEmployees.find(e => e.id === id);
}

function formatCurrency(val: number) {
  return `₹${val.toLocaleString('en-IN')}`;
}

function IncentivesPageInner() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');

  const filtered = useMemo(() => {
    let result = selectedMonth === 'all' ? mockIncentives : mockIncentives.filter(i => i.month === selectedMonth);
    if (activeFilter !== 'all') result = result.filter(i => i.status === activeFilter);
    return result;
  }, [activeFilter, selectedMonth]);

  const stats = useMemo(() => {
    const monthData = selectedMonth === 'all' ? mockIncentives : mockIncentives.filter(i => i.month === selectedMonth);
    return {
      total: monthData.reduce((s, i) => s + i.amount, 0),
      pending: monthData.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0),
      disbursed: monthData.filter(i => i.status === 'disbursed').reduce((s, i) => s + i.amount, 0),
      avgPerEmployee: monthData.length > 0 ? Math.round(monthData.reduce((s, i) => s + i.amount, 0) / monthData.length) : 0,
    };
  }, [selectedMonth]);

  const typeDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach(i => { map[i.type] = (map[i.type] || 0) + i.amount; });
    return Object.entries(map).map(([type, amount]) => ({
      type: typeConfig[type as IncentiveType] || { label: type, color: CSS.textMuted },
      amount,
    })).sort((a, b) => b.amount - a.amount);
  }, [filtered]);

  const maxTypeAmount = Math.max(...typeDistribution.map(d => d.amount), 1);

  const filters = [
    { key: 'all', label: 'All', count: mockIncentives.length },
    { key: 'pending', label: 'Pending', count: mockIncentives.filter(i => i.status === 'pending').length },
    { key: 'approved', label: 'Approved', count: mockIncentives.filter(i => i.status === 'approved').length },
    { key: 'disbursed', label: 'Disbursed', count: mockIncentives.filter(i => i.status === 'disbursed').length },
  ];

  const months = ['all', '2026-04', '2026-03', '2026-02'];

  const columns: DataTableColumnDef[] = [
    {
      key: 'employeeId',
      label: 'Employee',
      sortable: true,
      render: (row) => {
        const inc = row as unknown as typeof mockIncentives[0];
        const emp = getEmployee(inc.employeeId);
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[10px] font-semibold" style={{ backgroundColor: CSS.hoverBg, color: CSS.accent }}>
                {emp?.avatar || '??'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium" style={{ color: CSS.text }}>{emp?.name || inc.employeeId}</span>
          </div>
        );
      },
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (row) => {
        const inc = row as unknown as typeof mockIncentives[0];
        const type = typeConfig[inc.type];
        return (
          <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium border" style={{ backgroundColor: type.bg, color: type.color, borderColor: `${type.color}30` }}>
            {type.label}
          </span>
        );
      },
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (row) => (
        <span className="text-sm font-semibold" style={{ color: CSS.text }}>{formatCurrency(Number(row.amount))}</span>
      ),
    },
    {
      key: 'month',
      label: 'Month',
      sortable: true,
      render: (row) => (
        <span className="text-sm" style={{ color: CSS.textSecondary }}>
          {new Date(String(row.month) + '-01').toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (row) => (
        <span className="text-xs max-w-[200px] truncate block" style={{ color: CSS.textMuted }}>
          {String(row.description)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => {
        const inc = row as unknown as typeof mockIncentives[0];
        const status = statusConfig[inc.status];
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border" style={{ backgroundColor: status.bg, color: status.color, borderColor: `${status.color}30` }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.dotColor }} />
            {status.label}
          </span>
        );
      },
    },
  ];

  return (
    <PageShell title="Incentives" icon={Gift} onCreate={() => {}}>
      <div className="space-y-6">
        {/* Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none text-xs font-medium px-3 py-1.5 pr-7 rounded-lg border cursor-pointer focus:outline-none"
              style={{ backgroundColor: CSS.hoverBg, borderColor: CSS.border, color: CSS.textSecondary }}
            >
              {months.map(m => (
                <option key={m} value={m}>{m === 'all' ? 'All Time' : new Date(m + '-01').toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: CSS.textMuted }} />
          </div>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="h-9 rounded-xl gap-2 text-white" style={{ backgroundColor: CSS.accent }}>
                  <Plus className="w-4 h-4" /> Add Incentive
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Add a new incentive entry</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Filter Tabs */}
        <FilterBar
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={(key) => setActiveFilter(key as FilterKey)}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiWidget label="Total This Month" value={formatCurrency(stats.total)} icon={IndianRupee} color="success" />
          <KpiWidget label="Pending" value={formatCurrency(stats.pending)} icon={Clock} color="warning" />
          <KpiWidget label="Disbursed" value={formatCurrency(stats.disbursed)} icon={CheckCircle2} color="info" />
          <KpiWidget label="Avg Per Employee" value={formatCurrency(stats.avgPerEmployee)} icon={TrendingUp} color="accent" />
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Table */}
          <div className="flex-1">
            <SmartDataTable
              data={filtered as unknown as Record<string, unknown>[]}
              columns={columns}
              searchable
              searchPlaceholder="Search incentives..."
              searchKeys={['employeeId', 'description']}
              emptyMessage="No incentive records found."
              enableExport
              actions={(row) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" style={{ color: CSS.textMuted }}>
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Approve</DropdownMenuItem>
                    <DropdownMenuItem>Process Payment</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            />
          </div>

          {/* Sidebar - Type Distribution */}
          <div className="w-full xl:w-72 shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="rounded-2xl p-5"
              style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}
            >
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: CSS.text }}>
                <BarChart3 className="w-4 h-4" /> Type Distribution
              </h3>
              <div className="space-y-3">
                {typeDistribution.map((d, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ color: CSS.textSecondary }}>{d.type.label}</span>
                      <span className="text-xs font-medium" style={{ color: CSS.text }}>{formatCurrency(d.amount)}</span>
                    </div>
                    <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: CSS.hoverBg }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(d.amount / maxTypeAmount) * 100}%` }}
                        transition={{ delay: i * 0.1, duration: 0.2 }}
                        className="h-full rounded-full bg-purple-500/70"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default memo(IncentivesPageInner);
