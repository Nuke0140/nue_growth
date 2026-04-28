'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Plus, Monitor, Shield, Wrench, Archive, IndianRupee, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataTable, type Column } from './components/ops/data-table';
import { DrawerForm } from './components/ops/drawer-form';
import { StatusBadge } from './components/ops/status-badge';
import { FilterBar } from './components/ops/filter-bar';
import { SearchInput } from './components/ops/search-input';
import { KpiWidget } from './components/ops/kpi-widget';
import { mockAssets, mockEmployees } from './data/mock-data';
import type { Asset } from './types';

function formatINR(num: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
}

const statusLabels: Record<string, string> = {
  active: 'Active', 'in-repair': 'In Repair', disposed: 'Disposed', retired: 'Retired',
};

const assetTypes = ['Laptop', 'Monitor', 'Mobile', 'Tablet', 'Printer', 'Server', 'AV Equipment'];

export default function AssetsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

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
  ];

  const columns: Column<Asset & Record<string, unknown>>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--ops-text)' }}>{row.name}</p>
          <p className="text-[11px]" style={{ color: 'var(--ops-text-muted)' }}>{row.type}</p>
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

  const handleSubmit = () => {
    setDrawerOpen(false);
    setFormName(''); setFormType('Laptop'); setFormSerial('');
    setFormAssigned(''); setFormPurchaseDate(''); setFormCost(''); setFormWarranty('');
  };

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <div className="h-full overflow-y-auto">
      <motion.div className="p-6 space-y-6" variants={stagger} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold" style={{ color: 'var(--ops-text)' }}>Assets</h1>
            <Badge variant="secondary" className="ops-badge">{filtered.length}</Badge>
          </div>
          <button className="ops-btn-primary" onClick={() => setDrawerOpen(true)}>
            <Plus className="w-4 h-4" /> Add Asset
          </button>
        </motion.div>

        {/* Search + Filter */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search assets by name, type, serial..." className="max-w-sm" />
          <FilterBar filters={filterOptions} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiWidget label="Total Assets" value={stats.total} icon={Monitor} color="accent" />
          <KpiWidget label="Active" value={stats.active} icon={Shield} color="success" />
          <KpiWidget label="In Repair" value={stats.inRepair} icon={Wrench} color="warning" />
          <KpiWidget label="Total Value" value={formatINR(stats.totalValue)} icon={IndianRupee} color="info" />
        </motion.div>

        {/* Table */}
        <motion.div variants={fadeUp}>
          <DataTable
            columns={columns}
            data={filtered as (Asset & Record<string, unknown>)[]}
            emptyMessage="No assets found."
          />
        </motion.div>
      </motion.div>

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
            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. MacBook Pro 16&quot;" className="ops-input w-full px-3 py-2 text-sm" />
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
    </div>
  );
}
