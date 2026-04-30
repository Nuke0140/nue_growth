'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FileText, Eye, Download, AlertTriangle, Clock, Shield } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DataTable, type Column } from './components/ops/data-table';
import { FilterBar } from './components/ops/filter-bar';
import { SearchInput } from './components/ops/search-input';
import { KpiWidget } from './components/ops/kpi-widget';
import { mockDocuments, mockEmployees } from './data/mock-data';
import type { Document, DocumentType } from './types';
import { PageShell } from './components/ops/page-shell';

type FilterKey = 'all' | DocumentType;

function getEmployee(id: string) {
  return mockEmployees.find(e => e.id === id);
}

const typeConfig: Record<DocumentType, { label: string; color: string }> = {
  'offer-letter': { label: 'Offer Letter', color: '#60a5fa' },
  'nda': { label: 'NDA', color: '#a855f7' },
  'id-proof': { label: 'ID Proof', color: '#34d399' },
  education: { label: 'Education', color: '#fbbf24' },
  experience: { label: 'Experience', color: '#06b6d4' },
  appraisal: { label: 'Appraisal', color: '#f97316' },
  tax: { label: 'Tax', color: '#06b6d4' },
  'bank-details': { label: 'Bank Details', color: '#f472b6' },
};

function getExpiryStatus(expiresAt: string | null): { label: string; color: string } | null {
  if (!expiresAt) return null;
  const now = new Date();
  const expiry = new Date(expiresAt);
  const daysUntil = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntil < 0) return { label: 'Expired', color: '#f87171' };
  if (daysUntil < 30) return { label: `${daysUntil}d left`, color: '#fbbf24' };
  return null;
}

function DocumentsPageInner() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() => {
    let result = [...mockDocuments];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.title.toLowerCase().includes(q) ||
        getEmployee(d.employeeId)?.name.toLowerCase().includes(q) ||
        d.type.includes(q)
      );
    }
    if (activeFilter !== 'all') result = result.filter(d => d.type === activeFilter);
    return result;
  }, [search, activeFilter]);

  const stats = useMemo(() => ({
    total: mockDocuments.length,
    types: new Set(mockDocuments.map(d => d.type)).size,
    expiringSoon: mockDocuments.filter(d => {
      if (!d.expiresAt) return false;
      const days = Math.ceil((new Date(d.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return days >= 0 && days < 30;
    }).length,
    employees: new Set(mockDocuments.map(d => d.employeeId)).size,
  }), []);

  const filterOptions = [
    { key: 'all' as FilterKey, label: 'All', count: mockDocuments.length },
    ...Object.entries(typeConfig).map(([key, cfg]) => ({
      key: key as FilterKey,
      label: cfg.label,
      count: mockDocuments.filter(d => d.type === key).length,
    })),
  ];

  const columns: Column<Document & Record<string, unknown>>[] = [
    {
      key: 'title',
      label: 'Document Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-[var(--app-radius-lg)] shrink-0" style={{ backgroundColor: 'var(--app-info-bg)' }}>
            <FileText className="w-4 h-4" style={{ color: '#60a5fa' }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--app-text)' }}>{row.title}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (row) => {
        const cfg = typeConfig[row.type as DocumentType];
        return (
          <span className="app-badge" style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}>
            {cfg.label}
          </span>
        );
      },
    },
    {
      key: 'employeeId',
      label: 'Employee',
      sortable: true,
      hiddenMobile: true,
      render: (row) => {
        const emp = getEmployee(row.employeeId as string);
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[8px] font-semibold" style={{ backgroundColor: 'var(--app-accent-light)', color: 'var(--app-accent)' }}>
                {emp?.avatar || '??'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm" style={{ color: 'var(--app-text-secondary)' }}>{emp?.name || row.employeeId}</span>
          </div>
        );
      },
    },
    {
      key: 'uploadedAt',
      label: 'Uploaded',
      sortable: true,
      hiddenMobile: true,
      render: (row) => (
        <span className="text-sm" style={{ color: 'var(--app-text-secondary)' }}>
          {new Date(row.uploadedAt as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'expiresAt',
      label: 'Expires',
      sortable: true,
      hiddenMobile: true,
      render: (row) => {
        const exp = getExpiryStatus(row.expiresAt as string | null);
        if (exp) {
          return <span className="app-badge" style={{ backgroundColor: `${exp.color}15`, color: exp.color }}>{exp.label}</span>;
        }
        return <span className="text-xs" style={{ color: 'var(--app-text-muted)' }}>Never</span>;
      },
    },
    {
      key: 'actions',
      label: '',
      render: () => (
        <div className="flex items-center gap-1">
          <button className="app-btn-ghost p-1.5" onClick={(e) => e.stopPropagation()}>
            <Eye className="w-4 h-4" style={{ color: 'var(--app-text-muted)' }} />
          </button>
          <button className="app-btn-ghost p-1.5" onClick={(e) => e.stopPropagation()}>
            <Download className="w-4 h-4" style={{ color: 'var(--app-text-muted)' }} />
          </button>
        </div>
      ),
    },
  ];

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <PageShell title="Documents" icon={FileText}>
      <motion.div className="space-y-app-2xl" variants={stagger} initial="hidden" animate="show">
        {/* Search + Filter */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search documents..." className="max-w-sm" />
        </motion.div>

        {/* Filter Tabs */}
        <motion.div variants={fadeUp}>
          <FilterBar filters={filterOptions} activeFilter={activeFilter} onFilterChange={(key) => setActiveFilter(key as FilterKey)} />
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiWidget label="Total Documents" value={stats.total} icon={FileText} color="accent" />
          <KpiWidget label="Doc Types" value={stats.types} icon={Shield} color="info" />
          <KpiWidget label="Expiring Soon" value={stats.expiringSoon} icon={AlertTriangle} color="warning" />
          <KpiWidget label="Employees" value={stats.employees} icon={Clock} color="success" />
        </motion.div>

        {/* Table */}
        <motion.div variants={fadeUp}>
          <DataTable
            columns={columns}
            data={filtered as (Document & Record<string, unknown>)[]}
            emptyMessage="No documents found."
          />
        </motion.div>
      </motion.div>
    </PageShell>
  );
}

export default memo(DocumentsPageInner);
