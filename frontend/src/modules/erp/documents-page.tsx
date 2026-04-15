'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Plus, Search, FileText, Download, AlertTriangle, Clock,
  CheckCircle2, Eye, MoreHorizontal, FolderOpen, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { mockDocuments, mockEmployees } from '@/modules/erp/data/mock-data';
import type { DocumentType } from '@/modules/erp/types';

type FilterKey = 'all' | DocumentType;

const typeConfig: Record<DocumentType, { label: string; className: string }> = {
  'offer-letter': { label: 'Offer Letter', className: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  'nda': { label: 'NDA', className: 'bg-purple-500/15 text-purple-400 border-purple-500/20' },
  'id-proof': { label: 'ID Proof', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  education: { label: 'Education', className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  experience: { label: 'Experience', className: 'bg-teal-500/15 text-teal-400 border-teal-500/20' },
  appraisal: { label: 'Appraisal', className: 'bg-orange-500/15 text-orange-400 border-orange-500/20' },
  tax: { label: 'Tax', className: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20' },
  'bank-details': { label: 'Bank Details', className: 'bg-pink-500/15 text-pink-400 border-pink-500/20' },
};

function getEmployee(id: string) {
  return mockEmployees.find(e => e.id === id);
}

function getExpiryStatus(expiresAt: string | null): { label: string; className: string } | null {
  if (!expiresAt) return null;
  const now = new Date();
  const expiry = new Date(expiresAt);
  const daysUntil = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntil < 0) return { label: 'Expired', className: 'bg-red-500/15 text-red-400 border-red-500/20' };
  if (daysUntil < 30) return { label: `${daysUntil}d left`, className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' };
  return null;
}

export default function DocumentsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() => {
    let result = [...mockDocuments];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.title.toLowerCase().includes(q) ||
        getEmployee(d.employeeId)?.name.toLowerCase().includes(q) ||
        d.type.includes(q)
      );
    }
    if (activeFilter !== 'all') result = result.filter(d => d.type === activeFilter);
    return result;
  }, [searchQuery, activeFilter]);

  const stats = useMemo(() => ({
    total: mockDocuments.length,
    pending: 3,
    expiringSoon: mockDocuments.filter(d => {
      if (!d.expiresAt) return false;
      const days = Math.ceil((new Date(d.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return days >= 0 && days < 30;
    }).length,
    totalEmployees: new Set(mockDocuments.map(d => d.employeeId)).size,
  }), []);

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: mockDocuments.length },
    ...Object.entries(typeConfig).map(([key, cfg]) => ({
      key: key as FilterKey,
      label: cfg.label,
      count: mockDocuments.filter(d => d.type === key).length,
    })),
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">Documents</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl border w-full sm:w-64 transition-colors',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}>
              <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'bg-transparent text-sm focus:outline-none w-full',
                  isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25'
                )}
              />
            </div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className={cn('h-9 rounded-xl gap-2', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}>
                    <Plus className="w-4 h-4" /> Upload Document
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Upload a new document</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit overflow-x-auto max-w-full" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap',
                  isActive ? (isDark ? 'bg-white/[0.08] text-white shadow-sm' : 'bg-black/[0.06] text-black shadow-sm') : (isDark ? 'text-white/40 hover:text-white/70' : 'text-black/40 hover:text-black/70')
                )}
              >
                <span>{filter.label}</span>
                <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold', isActive ? (isDark ? 'bg-white/[0.15]' : 'bg-black/[0.1]') : (isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]'))}>
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Documents', value: stats.total, icon: FileText, color: 'text-blue-400' },
            { label: 'Pending Uploads', value: stats.pending, icon: Clock, color: 'text-amber-400' },
            { label: 'Expiring Soon', value: stats.expiringSoon, icon: AlertTriangle, color: 'text-red-400' },
            { label: 'Total Employees', value: stats.totalEmployees, icon: Shield, color: 'text-emerald-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>{stat.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                  <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                </div>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className={cn('rounded-2xl border overflow-hidden', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/30">Employee</th>
                  <th className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/30">Type</th>
                  <th className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/30 hidden md:table-cell">Title</th>
                  <th className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/30 hidden lg:table-cell">Uploaded</th>
                  <th className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/30 hidden sm:table-cell">Expires</th>
                  <th className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/30">File</th>
                  <th className="w-[40px]" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc, idx) => {
                  const emp = getEmployee(doc.employeeId);
                  const type = typeConfig[doc.type];
                  const expiryStatus = getExpiryStatus(doc.expiresAt);
                  return (
                    <motion.tr
                      key={doc.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className={cn(
                        'border-b last:border-0 transition-colors',
                        isDark ? 'border-white/[0.03] hover:bg-white/[0.02]' : 'border-black/[0.03] hover:bg-black/[0.01]',
                        expiryStatus?.label === 'Expired' && (isDark ? 'bg-red-500/[0.03]' : 'bg-red-50/50')
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className={cn('text-[10px] font-semibold', isDark ? 'bg-white/[0.08] text-white/60' : 'bg-black/[0.08] text-black/60')}>
                              {emp?.avatar || '??'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{emp?.name || doc.employeeId}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn('inline-flex px-2 py-0.5 rounded text-[10px] font-medium border', type.className)}>
                          {type.label}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-3 py-3">
                        <span className={cn('text-sm max-w-[200px] truncate block', isDark ? 'text-white/60' : 'text-black/60')}>
                          {doc.title}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-3 py-3">
                        <span className={cn('text-sm', isDark ? 'text-white/50' : 'text-black/50')}>
                          {new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-3 py-3">
                        {expiryStatus ? (
                          <span className={cn('inline-flex px-2 py-0.5 rounded text-[10px] font-medium border', expiryStatus.className)}>
                            {expiryStatus.label}
                          </span>
                        ) : doc.expiresAt ? (
                          <span className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>
                            {new Date(doc.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        ) : (
                          <span className={cn('text-xs', isDark ? 'text-white/20' : 'text-black/20')}>Never</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
                                  <Eye className={cn('w-3.5 h-3.5', isDark ? 'text-white/40' : 'text-black/40')} />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent><p>View</p></TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
                                  <Download className={cn('w-3.5 h-3.5', isDark ? 'text-white/40' : 'text-black/40')} />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent><p>Download</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </td>
                      <td className="px-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
                              <MoreHorizontal className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View</DropdownMenuItem>
                            <DropdownMenuItem>Download</DropdownMenuItem>
                            <DropdownMenuItem>Replace</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="h-40 text-center">
                      <FolderOpen className={cn('w-10 h-10 mx-auto mb-2', isDark ? 'text-white/10' : 'text-black/10')} />
                      <p className={cn('text-sm', isDark ? 'text-white/30' : 'text-black/30')}>No documents found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
