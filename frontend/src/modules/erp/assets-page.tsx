'use client';

import { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Monitor, Shield, Wrench, Archive, IndianRupee, Package,
  Laptop, Smartphone, Printer, Server, Video, LayoutGrid, List,
  AlertTriangle, CheckCircle2, XCircle, Calendar, Tag, Plus,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DataTable, type Column } from './components/ops/data-table';
import { DrawerForm } from './components/ops/drawer-form';
import { StatusBadge } from './components/ops/status-badge';
import { FilterBar } from './components/ops/filter-bar';
import { SearchInput } from './components/ops/search-input';
import { KpiWidget } from './components/ops/kpi-widget';
import { Timeline, type TimelineItem } from './components/ops/timeline';
import { mockAssets, mockEmployees } from './data/mock-data';
import type { Asset, IssueLog } from './types';
import { PageShell } from './components/ops/page-shell';

function formatINR(num: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
}

const statusLabels: Record<string, string> = {
  active: 'Active', 'in-repair': 'In Repair', disposed: 'Disposed', retired: 'Retired',
};

const statusBadgeMap: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: 'rgba(52,211,153,0.12)', text: '#34d399', dot: '#34d399' },
  'in-repair': { bg: 'rgba(251,191,36,0.12)', text: '#fbbf24', dot: '#fbbf24' },
  retired: { bg: 'var(--ops-hover-bg)', text: 'var(--ops-text-secondary)', dot: 'var(--ops-text-muted)' },
  disposed: { bg: 'rgba(248,113,113,0.12)', text: '#f87171', dot: '#f87171' },
};

const assetTypes = ['Laptop', 'Monitor', 'Mobile', 'Tablet', 'Printer', 'Server', 'AV Equipment'];

const assetIconMap: Record<string, typeof Laptop> = {
  Laptop,
  Monitor,
  Mobile: Smartphone,
  Tablet: Monitor,
  Printer,
  Server,
  'AV Equipment': Video,
};

const assetIconColorMap: Record<string, string> = {
  Laptop: 'rgba(204, 92, 55, 0.12)',
  Monitor: 'rgba(96, 165, 250, 0.12)',
  Mobile: 'rgba(168, 85, 247, 0.12)',
  Tablet: 'rgba(52, 211, 153, 0.12)',
  Printer: 'rgba(251, 191, 36, 0.12)',
  Server: 'rgba(248, 113, 113, 0.12)',
  'AV Equipment': 'rgba(244, 114, 182, 0.12)',
};

const assetIconTextColorMap: Record<string, string> = {
  Laptop: '#cc5c37',
  Monitor: '#60a5fa',
  Mobile: '#a855f7',
  Tablet: '#34d399',
  Printer: '#fbbf24',
  Server: '#f87171',
  'AV Equipment': '#f472b6',
};

// ── Asset Card Component ───────────────────────────────

interface AssetCardProps {
  asset: Asset;
  onClick: () => void;
  idx: number;
}

function AssetCard({ asset, onClick, idx }: AssetCardProps) {
  const Icon = assetIconMap[asset.type] || Package;
  const badge = statusBadgeMap[asset.status] || statusBadgeMap.active;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04, duration: 0.3 }}
      className="ops-card p-5 cursor-pointer transition-colors"
      style={{ borderRadius: '1rem' }}
      onClick={onClick}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(204,92,55,0.3)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--ops-border)'; }}
    >
      {/* Icon + Status */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-xl"
          style={{ backgroundColor: assetIconColorMap[asset.type] || 'rgba(204,92,55,0.12)' }}
        >
          <Icon className="w-6 h-6" style={{ color: assetIconTextColorMap[asset.type] || '#cc5c37' }} />
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: badge.bg, color: badge.text }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: badge.dot }} />
          {statusLabels[asset.status] || asset.status}
        </span>
      </div>

      {/* Name + Type */}
      <div className="mb-3">
        <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--ops-text)' }}>{asset.name}</p>
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--ops-text-muted)' }}>{asset.type}</p>
      </div>

      {/* Details */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[8px] font-semibold" style={{ backgroundColor: 'var(--ops-accent-light)', color: 'var(--ops-accent)' }}>
              {asset.assignedTo.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs truncate" style={{ color: 'var(--ops-text-secondary)' }}>{asset.assignedTo}</span>
        </div>
        <code className="block text-[10px]" style={{ color: 'var(--ops-text-muted)' }}>{asset.serialNo}</code>
      </div>

      {/* Cost */}
      <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--ops-border)' }}>
        <p className="text-sm font-bold" style={{ color: 'var(--ops-text)' }}>{formatINR(asset.purchaseCost)}</p>
      </div>
    </motion.div>
  );
}

// ── Issue History Panel Content ────────────────────────

interface AssetDetailPanelProps {
  asset: Asset | null;
  onClose: () => void;
}

function AssetDetailContent({ asset }: { asset: Asset }) {
  if (!asset) return null;

  // Build lifecycle timeline
  const lifecycleItems: TimelineItem[] = [
    {
      id: `purchase-${asset.id}`,
      icon: Package,
      title: 'Purchased',
      description: `${asset.name} acquired`,
      timestamp: new Date(asset.purchaseDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      accentColor: '#34d399',
    },
    {
      id: `active-${asset.id}`,
      icon: CheckCircle2,
      title: 'Active',
      description: `Assigned to ${asset.assignedTo}`,
      timestamp: new Date(asset.purchaseDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      accentColor: '#60a5fa',
    },
  ];

  // Add repair events from issue logs
  asset.issueLogs.forEach(log => {
    lifecycleItems.push({
      id: `issue-${log.id}`,
      icon: log.resolved ? CheckCircle2 : AlertTriangle,
      title: log.resolved ? 'Issue Resolved' : 'Issue Reported',
      description: log.description,
      timestamp: new Date(log.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      accentColor: log.resolved ? '#34d399' : '#fbbf24',
    });
  });

  // Current status as final timeline item
  const statusColor = statusBadgeMap[asset.status]?.text || '#fbbf24';
  lifecycleItems.push({
    id: `current-${asset.id}`,
    icon: Tag,
    title: `Current: ${statusLabels[asset.status] || asset.status}`,
    timestamp: '—',
    accentColor: statusColor,
  });

  return (
    <div className="space-y-6">
      {/* Asset header */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
          style={{ backgroundColor: assetIconColorMap[asset.type] || 'rgba(204,92,55,0.12)' }}
        >
          {(() => {
            const Icon = assetIconMap[asset.type] || Package;
            return <Icon className="w-6 h-6" style={{ color: assetIconTextColorMap[asset.type] || '#cc5c37' }} />;
          })()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--ops-text)' }}>{asset.name}</p>
          <p className="text-[11px]" style={{ color: 'var(--ops-text-muted)' }}>{asset.type} &middot; {asset.serialNo}</p>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--ops-hover-bg)', border: '1px solid var(--ops-border)' }}>
          <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--ops-text-muted)' }}>Assigned To</p>
          <p className="text-sm font-medium mt-1 truncate" style={{ color: 'var(--ops-text)' }}>{asset.assignedTo}</p>
        </div>
        <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--ops-hover-bg)', border: '1px solid var(--ops-border)' }}>
          <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--ops-text-muted)' }}>Status</p>
          <p className="mt-1">
            <StatusBadge status={statusLabels[asset.status] || asset.status} />
          </p>
        </div>
        <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--ops-hover-bg)', border: '1px solid var(--ops-border)' }}>
          <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--ops-text-muted)' }}>Purchase Cost</p>
          <p className="text-sm font-medium mt-1" style={{ color: 'var(--ops-text)' }}>{formatINR(asset.purchaseCost)}</p>
        </div>
        <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--ops-hover-bg)', border: '1px solid var(--ops-border)' }}>
          <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--ops-text-muted)' }}>Warranty Until</p>
          <p className="text-sm font-medium mt-1" style={{ color: 'var(--ops-text)' }}>{asset.warrantyEnd}</p>
        </div>
      </div>

      {/* Lifecycle Timeline */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--ops-text-muted)' }}>
          Lifecycle Timeline
        </h4>
        <Timeline items={lifecycleItems} />
      </div>

      {/* Issue History */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--ops-text-muted)' }}>
          Issue History
        </h4>
        {asset.issueLogs.length === 0 ? (
          <div className="rounded-xl p-6 text-center" style={{ backgroundColor: 'var(--ops-hover-bg)', border: '1px solid var(--ops-border)' }}>
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: '#34d399', opacity: 0.4 }} />
            <p className="text-xs" style={{ color: 'var(--ops-text-muted)' }}>No issues reported</p>
          </div>
        ) : (
          <div className="space-y-2">
            {asset.issueLogs.map(log => (
              <div
                key={log.id}
                className="rounded-xl p-3 flex items-start gap-3"
                style={{ backgroundColor: 'var(--ops-hover-bg)', border: '1px solid var(--ops-border)' }}
              >
                <div className="mt-0.5">
                  {log.resolved ? (
                    <CheckCircle2 className="w-4 h-4" style={{ color: '#34d399' }} />
                  ) : (
                    <AlertTriangle className="w-4 h-4" style={{ color: '#fbbf24' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-snug" style={{ color: 'var(--ops-text)' }}>{log.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px]" style={{ color: 'var(--ops-text-muted)' }}>
                      {new Date(log.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: log.resolved ? 'rgba(52,211,153,0.12)' : 'rgba(251,191,36,0.12)',
                        color: log.resolved ? '#34d399' : '#fbbf24',
                      }}
                    >
                      {log.resolved ? 'Resolved' : 'Unresolved'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Issue button */}
      <button
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors"
        style={{ backgroundColor: 'var(--ops-accent-light)', color: 'var(--ops-accent)' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(204,92,55,0.2)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(204,92,55,0.12)'; }}
      >
        <AlertTriangle className="w-3.5 h-3.5" /> Report Issue
      </button>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────

type ViewMode = 'table' | 'card';

function AssetsPageInner() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailAsset, setDetailAsset] = useState<Asset | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Form state
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('Laptop');
  const [formSerial, setFormSerial] = useState('');
  const [formAssigned, setFormAssigned] = useState('');
  const [formPurchaseDate, setFormPurchaseDate] = useState('');
  const [formCost, setFormCost] = useState('');
  const [formWarranty, setFormWarranty] = useState('');

  const filtered = useMemo(() => {
    let data = [...mockAssets];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.serialNo.toLowerCase().includes(q) ||
        a.assignedTo.toLowerCase().includes(q)
      );
    }
    if (activeFilter !== 'all') data = data.filter(a => a.status === activeFilter);
    return data;
  }, [search, activeFilter]);

  const stats = useMemo(() => ({
    total: mockAssets.length,
    active: mockAssets.filter(a => a.status === 'active').length,
    inRepair: mockAssets.filter(a => a.status === 'in-repair').length,
    totalValue: mockAssets.reduce((s, a) => s + a.purchaseCost, 0),
  }), []);

  const filterOptions = [
    { key: 'all', label: 'All', count: stats.total },
    { key: 'active', label: 'Active', count: stats.active },
    { key: 'in-repair', label: 'In Repair', count: stats.inRepair },
    { key: 'retired', label: 'Retired', count: mockAssets.filter(a => a.status === 'retired').length },
    { key: 'disposed', label: 'Disposed', count: mockAssets.filter(a => a.status === 'disposed').length },
  ];

  const columns: Column<Asset & Record<string, unknown>>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
            style={{ backgroundColor: assetIconColorMap[row.type as string] || 'rgba(204,92,55,0.12)' }}
          >
            {(() => {
              const Icon = assetIconMap[row.type as string] || Package;
              return <Icon className="w-4 h-4" style={{ color: assetIconTextColorMap[row.type as string] || '#cc5c37' }} />;
            })()}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--ops-text)' }}>{row.name}</p>
            <p className="text-[11px]" style={{ color: 'var(--ops-text-muted)' }}>{row.type}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'serialNo',
      label: 'Serial #',
      sortable: true,
      hiddenMobile: true,
      render: (row) => <code className="text-xs" style={{ color: 'var(--ops-text-secondary)' }}>{row.serialNo}</code>,
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      sortable: true,
      render: (row) => <span className="text-sm" style={{ color: 'var(--ops-text-secondary)' }}>{row.assignedTo}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={statusLabels[row.status as string] || row.status} />,
    },
    {
      key: 'purchaseDate',
      label: 'Purchase Date',
      sortable: true,
      hiddenMobile: true,
      render: (row) => <span className="text-sm" style={{ color: 'var(--ops-text-secondary)' }}>{row.purchaseDate}</span>,
    },
    {
      key: 'purchaseCost',
      label: 'Cost',
      sortable: true,
      hiddenMobile: true,
      render: (row) => <span className="text-sm font-medium" style={{ color: 'var(--ops-text)' }}>{formatINR(row.purchaseCost as number)}</span>,
    },
  ];

  const handleRowClick = (row: Asset & Record<string, unknown>) => {
    setDetailAsset(row as Asset);
    setDetailOpen(true);
  };

  const handleCardClick = (asset: Asset) => {
    setDetailAsset(asset);
    setDetailOpen(true);
  };

  const handleSubmit = () => {
    setDrawerOpen(false);
    setFormName(''); setFormType('Laptop'); setFormSerial('');
    setFormAssigned(''); setFormPurchaseDate(''); setFormCost(''); setFormWarranty('');
  };

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <>
    <PageShell title="Assets" icon={Monitor} createType="asset">
      <motion.div className="space-y-6" variants={stagger} initial="hidden" animate="show">
        {/* Search + Filter + View Toggle */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search assets by name, type, serial..." className="max-w-sm" />
          <FilterBar filters={filterOptions} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <div className="sm:ml-auto flex items-center gap-1 p-0.5 rounded-lg" style={{ backgroundColor: 'var(--ops-hover-bg)' }}>
            <button
              className={cn('flex items-center justify-center w-8 h-8 transition-colors')}
              style={{
                backgroundColor: viewMode === 'table' ? 'var(--ops-accent-light)' : 'transparent',
                color: viewMode === 'table' ? 'var(--ops-accent)' : 'var(--ops-text-muted)',
              }}
              onClick={() => setViewMode('table')}
              aria-label="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              className={cn('flex items-center justify-center w-8 h-8 transition-colors')}
              style={{
                backgroundColor: viewMode === 'card' ? 'var(--ops-accent-light)' : 'transparent',
                color: viewMode === 'card' ? 'var(--ops-accent)' : 'var(--ops-text-muted)',
              }}
              onClick={() => setViewMode('card')}
              aria-label="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiWidget label="Total Assets" value={stats.total} icon={Monitor} color="accent" />
          <KpiWidget label="Active" value={stats.active} icon={Shield} color="success" />
          <KpiWidget label="In Repair" value={stats.inRepair} icon={Wrench} color="warning" />
          <KpiWidget label="Total Value" value={formatINR(stats.totalValue)} icon={IndianRupee} color="info" />
        </motion.div>

        {/* Content: Table or Card view */}
        <motion.div variants={fadeUp}>
          <AnimatePresence mode="wait">
            {viewMode === 'table' ? (
              <motion.div
                key="table-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DataTable
                  columns={columns}
                  data={filtered as (Asset & Record<string, unknown>)[]}
                  onRowClick={handleRowClick}
                  emptyMessage="No assets found."
                />
              </motion.div>
            ) : (
              <motion.div
                key="card-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filtered.length === 0 ? (
                  <div className="col-span-full ops-card p-12 text-center">
                    <Package className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--ops-text-muted)', opacity: 0.3 }} />
                    <p className="text-sm" style={{ color: 'var(--ops-text-muted)' }}>No assets found.</p>
                  </div>
                ) : (
                  filtered.map((asset, idx) => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      idx={idx}
                      onClick={() => handleCardClick(asset)}
                    />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </PageShell>

    {/* Add Asset Drawer */}
    <DrawerForm
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      title="Add Asset"
      onSubmit={handleSubmit}
      submitLabel="Add Asset"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ops-text-secondary)' }}>Asset Name</label>
          <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder='e.g. MacBook Pro 16"' className="ops-input w-full px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ops-text-secondary)' }}>Type</label>
          <select value={formType} onChange={(e) => setFormType(e.target.value)} className="ops-input w-full px-3 py-2 text-sm">
            {assetTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ops-text-secondary)' }}>Serial Number</label>
          <input type="text" value={formSerial} onChange={(e) => setFormSerial(e.target.value)} placeholder="e.g. MBP-2024-001" className="ops-input w-full px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ops-text-secondary)' }}>Assigned To</label>
          <select value={formAssigned} onChange={(e) => setFormAssigned(e.target.value)} className="ops-input w-full px-3 py-2 text-sm">
            <option value="">Select employee</option>
            {mockEmployees.map(e => <option key={e.id} value={e.name}>{e.name} — {e.designation}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ops-text-secondary)' }}>Purchase Date</label>
            <input type="date" value={formPurchaseDate} onChange={(e) => setFormPurchaseDate(e.target.value)} className="ops-input w-full px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ops-text-secondary)' }}>Purchase Cost (₹)</label>
            <input type="number" value={formCost} onChange={(e) => setFormCost(e.target.value)} placeholder="0" className="ops-input w-full px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ops-text-secondary)' }}>Warranty End</label>
          <input type="date" value={formWarranty} onChange={(e) => setFormWarranty(e.target.value)} className="ops-input w-full px-3 py-2 text-sm" />
        </div>
      </div>
    </DrawerForm>

    {/* Asset Detail / Issue History Drawer */}
    <DrawerForm
      open={detailOpen}
      onClose={() => { setDetailOpen(false); setDetailAsset(null); }}
      title="Asset Details"
    >
      <AssetDetailContent asset={detailAsset} />
    </DrawerForm>
    </>
  );
}

export default memo(AssetsPageInner);
