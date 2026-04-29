'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Monitor, Laptop, Smartphone, Server, Printer, Shield, AlertTriangle,
  Wrench, Archive, MoreHorizontal, FileWarning, IndianRupee, Plus,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { CSS } from '@/styles/design-tokens';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageShell } from './components/ops/page-shell';
import { mockAssets } from '@/modules/erp/data/mock-data';
import type { AssetStatus } from '@/modules/erp/types';

type FilterKey = 'all' | 'active' | 'in-repair' | 'disposed';

function getStatusLabel(status: AssetStatus) {
  const map: Record<AssetStatus, string> = { active: 'Active', 'in-repair': 'In Repair', disposed: 'Disposed', retired: 'Retired' };
  return map[status] || status;
}

function getTypeIcon(type: string) {
  const map: Record<string, React.ElementType> = {
    'Laptop': Laptop, 'Mobile': Smartphone, 'Monitor': Monitor,
    'Server': Server, 'Printer': Printer, 'AV Equipment': Monitor,
    'Tablet': Smartphone,
  };
  return map[type] || Monitor;
}

function getWarrantyStatus(endDate: string) {
  const now = new Date();
  const end = new Date(endDate);
  const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return { label: 'Expired', color: 'text-red-500 dark:text-red-400' };
  if (daysLeft <= 30) return { label: `${daysLeft}d left`, color: 'text-amber-500 dark:text-amber-400' };
  return { label: `${daysLeft}d left`, color: 'text-emerald-500 dark:text-emerald-400' };
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
}

function AssetManagementPageInner() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() => {
    let result = [...mockAssets];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.serialNo.toLowerCase().includes(q) ||
        a.assignedTo.toLowerCase().includes(q)
      );
    }
    switch (activeFilter) {
      case 'active': result = result.filter(a => a.status === 'active'); break;
      case 'in-repair': result = result.filter(a => a.status === 'in-repair' || a.status === 'retired'); break;
      case 'disposed': result = result.filter(a => a.status === 'disposed' || a.status === 'retired'); break;
    }
    return result;
  }, [searchQuery, activeFilter]);

  const stats = useMemo(() => ({
    total: mockAssets.length,
    active: mockAssets.filter(a => a.status === 'active').length,
    inRepair: mockAssets.filter(a => a.status === 'in-repair').length,
    totalValue: mockAssets.reduce((s, a) => s + a.purchaseCost, 0),
  }), []);

  const filters: { key: FilterKey; label: string; icon: React.ElementType; count: number }[] = [
    { key: 'all', label: 'All', icon: Monitor, count: stats.total },
    { key: 'active', label: 'Active', icon: Shield, count: stats.active },
    { key: 'in-repair', label: 'In Repair', icon: Wrench, count: stats.inRepair },
    { key: 'disposed', label: 'Disposed', icon: Archive, count: mockAssets.filter(a => a.status === 'disposed' || a.status === 'retired').length },
  ];

  const columns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'name', label: 'Asset Name', sortable: true,
      render: (row) => {
        const TypeIcon = getTypeIcon(String(row.type));
        return (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: CSS.hoverBg }}>
              <TypeIcon className="w-4 h-4" style={{ color: CSS.textSecondary }} />
            </div>
            <span className="text-sm font-medium" style={{ color: CSS.text }}>{String(row.name)}</span>
          </div>
        );
      },
    },
    { key: 'type', label: 'Type', sortable: true, render: (row) => <StatusBadge status={String(row.type)} variant="dot" /> },
    { key: 'serialNo', label: 'Serial No', sortable: true, visible: false, render: (row) => <code className="text-xs" style={{ color: CSS.textSecondary }}>{String(row.serialNo)}</code> },
    { key: 'assignedTo', label: 'Assigned To', sortable: true, visible: false, render: (row) => <span className="text-xs" style={{ color: CSS.textSecondary }}>{String(row.assignedTo)}</span> },
    {
      key: 'warrantyEnd', label: 'Warranty', sortable: true,
      render: (row) => {
        const warranty = getWarrantyStatus(String(row.warrantyEnd));
        return <span className={`text-xs font-medium ${warranty.color}`}>{warranty.label}</span>;
      },
    },
    { key: 'status', label: 'Status', sortable: true, render: (row) => <StatusBadge status={getStatusLabel(row.status as AssetStatus)} variant="pill" /> },
    { key: 'purchaseCost', label: 'Cost (₹)', sortable: true, visible: false, render: (row) => <span className="text-xs font-medium" style={{ color: CSS.text }}>{formatCurrency(Number(row.purchaseCost))}</span> },
    {
      key: 'issues', label: 'Issues', visible: false,
      render: (row) => {
        const issueLogs = row.issueLogs as Array<{ resolved: boolean }> | undefined;
        const count = issueLogs?.length ?? 0;
        const unresolved = issueLogs?.filter(i => !i.resolved).length ?? 0;
        if (count === 0) return <span className="text-xs" style={{ color: CSS.textMuted }}>—</span>;
        return (
          <div className="flex items-center gap-1">
            <FileWarning className={`w-3.5 h-3.5 ${unresolved > 0 ? 'text-red-500 dark:text-red-400' : ''}`} style={unresolved === 0 ? { color: CSS.textDisabled } : undefined} />
            <span className={`text-xs ${unresolved > 0 ? 'text-red-500 dark:text-red-400 font-medium' : ''}`} style={unresolved === 0 ? { color: CSS.textSecondary } : undefined}>{count}</span>
          </div>
        );
      },
    },
  ], []);

  return (
    <PageShell title="Asset Management" icon={Monitor} headerRight={
      <div className="flex items-center gap-2">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: CSS.accent, color: '#fff' }}>
                <Plus className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent><p>Add Asset</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    }>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: CSS.hoverBg }}>
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                style={{
                  backgroundColor: isActive ? CSS.activeBg : 'transparent',
                  color: isActive ? CSS.text : CSS.textMuted,
                  boxShadow: isActive ? CSS.shadowCard : undefined,
                }}
              >
                <filter.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{filter.label}</span>
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                  style={{ backgroundColor: isActive ? CSS.hoverBg : CSS.hoverBg, color: isActive ? CSS.text : CSS.textMuted }}
                >
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Assets', value: stats.total, icon: Monitor },
            { label: 'Active', value: stats.active, icon: Shield },
            { label: 'In Repair', value: stats.inRepair, icon: AlertTriangle },
            { label: 'Total Value', value: formatCurrency(stats.totalValue), icon: IndianRupee },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="rounded-2xl border p-4" style={{ backgroundColor: CSS.cardBg, borderColor: CSS.borderLight, boxShadow: CSS.shadowCard }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium" style={{ color: CSS.textMuted }}>{stat.label}</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: CSS.hoverBg }}>
                  <stat.icon className="w-3.5 h-3.5" style={{ color: CSS.textDisabled }} />
                </div>
              </div>
              <p className="text-xl font-bold" style={{ color: CSS.text }}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <SmartDataTable
          data={filtered as unknown as Record<string, unknown>[]}
          columns={columns}
          searchable
          searchPlaceholder="Search assets..."
          enableExport
          emptyMessage="No assets found"
          pageSize={8}
        />
    </PageShell>
  );
}

export default memo(AssetManagementPageInner);
