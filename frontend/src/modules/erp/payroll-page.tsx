'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Search, Play, Wallet, Clock, CheckCircle2, FileText, Calculator,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, IndianRupee,
  TrendingUp, Users, Building2, BarChart3
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { mockPayroll } from '@/modules/erp/data/mock-data';
import type { PayrollStatus } from '@/modules/erp/types';

const ITEMS_PER_PAGE = 8;
const MONTHS = ['2026-01', '2026-02', '2026-03', '2026-04'];

function getStatusConfig(status: PayrollStatus, isDark: boolean) {
  switch (status) {
    case 'pending': return isDark ? 'bg-amber-500/15 text-amber-300 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200';
    case 'processed': return isDark ? 'bg-sky-500/15 text-sky-300 border-sky-500/20' : 'bg-sky-50 text-sky-700 border-sky-200';
    case 'paid': return isDark ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
}

function getStatusLabel(status: PayrollStatus) {
  const map: Record<PayrollStatus, string> = { pending: 'Pending', processed: 'Processed', paid: 'Paid' };
  return map[status];
}

function getStatusIcon(status: PayrollStatus) {
  switch (status) {
    case 'pending': return Clock;
    case 'processed': return CheckCircle2;
    case 'paid': return CheckCircle2;
  }
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
}

function getMonthLabel(month: string) {
  const [year, m] = month.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(m) - 1]} ${year}`;
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const avatarColors = [
  'bg-emerald-500/15 text-emerald-400',
  'bg-sky-500/15 text-sky-400',
  'bg-violet-500/15 text-violet-400',
  'bg-pink-500/15 text-pink-400',
  'bg-amber-500/15 text-amber-400',
  'bg-teal-500/15 text-teal-400',
];

export default function PayrollPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedMonth, setSelectedMonth] = useState('2026-04');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [bonusBase, setBonusBase] = useState(200000);
  const [bonusPerf, setBonusPerf] = useState(95);

  const filtered = useMemo(() => {
    let result = mockPayroll.filter(p => p.month === selectedMonth);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.employeeName.toLowerCase().includes(q) || p.department.toLowerCase().includes(q));
    }
    return result;
  }, [selectedMonth, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = useMemo(() => {
    const monthData = mockPayroll.filter(p => p.month === selectedMonth);
    return {
      totalPayroll: monthData.reduce((s, p) => s + p.netPay, 0),
      pending: monthData.filter(p => p.status === 'pending').length,
      incentives: monthData.reduce((s, p) => s + p.incentives, 0),
      processed: monthData.filter(p => p.status === 'processed' || p.status === 'paid').length,
    };
  }, [selectedMonth]);

  const deptBreakdown = useMemo(() => {
    const monthData = mockPayroll.filter(p => p.month === selectedMonth);
    const deptMap: Record<string, number> = {};
    monthData.forEach(p => { deptMap[p.department] = (deptMap[p.department] || 0) + p.netPay; });
    return Object.entries(deptMap).sort((a, b) => b[1] - a[1]);
  }, [selectedMonth]);

  const maxDeptPay = Math.max(...deptBreakdown.map(([, v]) => v));

  const bonusResult = useMemo(() => {
    const hra = bonusBase * 0.5;
    const special = bonusBase * (bonusPerf / 100) * 0.2;
    const total = bonusBase + hra + special;
    const tax = total * 0.3;
    return { hra, special, total, tax, net: total - tax };
  }, [bonusBase, bonusPerf]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">Payroll</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn('flex items-center gap-2 px-3 py-2 rounded-xl border w-full sm:w-64 transition-colors', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
              <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
              <input type="text" placeholder="Search employees..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className={cn('bg-transparent text-sm focus:outline-none w-full', isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25')} />
            </div>
            <div className={cn('flex items-center gap-1 px-3 py-2 rounded-xl border', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
              {MONTHS.map(m => (
                <button key={m} onClick={() => { setSelectedMonth(m); setCurrentPage(1); }} className={cn('px-2 py-1 rounded-md text-xs font-medium transition-all', selectedMonth === m ? (isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black') : (isDark ? 'text-white/40 hover:text-white/70' : 'text-black/40 hover:text-black/70'))}>
                  {getMonthLabel(m)}
                </button>
              ))}
            </div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className={cn('h-9 px-4 rounded-xl flex items-center gap-2 text-xs font-medium shrink-0', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}>
                    <Play className="w-3.5 h-3.5" /> Run Payroll
                  </button>
                </TooltipTrigger>
                <TooltipContent><p>Process payroll for {getMonthLabel(selectedMonth)}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Payroll', value: formatCurrency(stats.totalPayroll), icon: Wallet, sub: getMonthLabel(selectedMonth) },
            { label: 'Pending Salaries', value: stats.pending, icon: Clock, sub: 'Awaiting processing' },
            { label: 'Incentives', value: formatCurrency(stats.incentives), icon: TrendingUp, sub: 'This month' },
            { label: 'Processed', value: stats.processed, icon: CheckCircle2, sub: `of ${filtered.length} total` },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>{stat.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                  <stat.icon className={cn('w-3.5 h-3.5', isDark ? 'text-white/40' : 'text-black/40')} />
                </div>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
              <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{stat.sub}</span>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Payroll List */}
          <div className="xl:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className={cn('text-sm font-semibold', isDark ? 'text-white/60' : 'text-black/60')}>Employee Payroll — {getMonthLabel(selectedMonth)}</h2>
              <span className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>{filtered.length} employees</span>
            </div>
            {paginated.map((record, idx) => {
              const StatusIcon = getStatusIcon(record.status);
              return (
                <motion.div key={record.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03, duration: 0.3 }} className={cn('rounded-2xl border p-4 flex items-center gap-4 transition-colors', isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:bg-gray-50')}>
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0', avatarColors[idx % avatarColors.length])}>
                    {getInitials(record.employeeName)}
                  </div>
                  <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{record.employeeName}</p>
                      <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{record.department}</p>
                    </div>
                    <div>
                      <p className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Base</p>
                      <p className="text-xs">{formatCurrency(record.baseSalary)}</p>
                    </div>
                    <div>
                      <p className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Incentives</p>
                      <p className="text-xs text-emerald-400">+{formatCurrency(record.incentives)}</p>
                    </div>
                    <div>
                      <p className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Deductions</p>
                      <p className="text-xs text-red-400">-{formatCurrency(record.deductions)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Net Pay</p>
                      <p className="text-sm font-bold">{formatCurrency(record.netPay)}</p>
                    </div>
                    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border', getStatusConfig(record.status, isDark))}>
                      <StatusIcon className="w-3 h-3" />
                      {getStatusLabel(record.status)}
                    </span>
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
                            <FileText className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent><p>Payslip Preview</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </motion.div>
              );
            })}
            {/* Pagination */}
            {filtered.length > ITEMS_PER_PAGE && (
              <div className={cn('flex items-center justify-between px-4 py-3 rounded-2xl border', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
                <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}><ChevronsLeft className="w-4 h-4" /></button>
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}><ChevronLeft className="w-4 h-4" /></button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}><ChevronRight className="w-4 h-4" /></button>
                  <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}><ChevronsRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Bonus Calculator */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={cn('rounded-2xl border p-4 space-y-4', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
              <div className="flex items-center gap-2">
                <Calculator className={cn('w-4 h-4', isDark ? 'text-white/60' : 'text-black/60')} />
                <h3 className="text-sm font-semibold">Bonus Calculator</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Base CTC (₹)</label>
                  <input type="number" value={bonusBase} onChange={(e) => setBonusBase(Number(e.target.value))} className={cn('w-full mt-1 px-3 py-2 rounded-xl border text-sm bg-transparent focus:outline-none focus:ring-1', isDark ? 'border-white/[0.06] focus:ring-white/20 text-white' : 'border-black/[0.06] focus:ring-black/20 text-black')} />
                </div>
                <div>
                  <label className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Performance Rating (%)</label>
                  <input type="range" min="50" max="100" value={bonusPerf} onChange={(e) => setBonusPerf(Number(e.target.value))} className="w-full mt-1 accent-emerald-500" />
                  <span className="text-xs font-medium">{bonusPerf}%</span>
                </div>
              </div>
              <div className={cn('rounded-xl border p-3 space-y-2', isDark ? 'bg-white/[0.03] border-white/[0.04]' : 'bg-black/[0.02] border-black/[0.04]')}>
                <div className="flex justify-between text-xs"><span className={cn(isDark ? 'text-white/40' : 'text-black/40')}>HRA Component</span><span>{formatCurrency(bonusResult.hra)}</span></div>
                <div className="flex justify-between text-xs"><span className={cn(isDark ? 'text-white/40' : 'text-black/40')}>Special Allowance</span><span>{formatCurrency(bonusResult.special)}</span></div>
                <div className="flex justify-between text-xs"><span className={cn(isDark ? 'text-white/40' : 'text-black/40')}>Gross Total</span><span className="font-semibold">{formatCurrency(bonusResult.total)}</span></div>
                <div className={cn('h-px', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')} />
                <div className="flex justify-between text-xs"><span className={cn(isDark ? 'text-white/40' : 'text-black/40')}>Tax (30%)</span><span className="text-red-400">-{formatCurrency(bonusResult.tax)}</span></div>
                <div className="flex justify-between text-sm"><span className="font-semibold">Net Bonus</span><span className="font-bold text-emerald-400">{formatCurrency(bonusResult.net)}</span></div>
              </div>
            </motion.div>

            {/* Department Breakdown */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={cn('rounded-2xl border p-4 space-y-3', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
              <div className="flex items-center gap-2">
                <BarChart3 className={cn('w-4 h-4', isDark ? 'text-white/60' : 'text-black/60')} />
                <h3 className="text-sm font-semibold">Dept. Payroll Breakdown</h3>
              </div>
              {deptBreakdown.map(([dept, pay], i) => (
                <div key={dept} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{dept}</span>
                    <span className={cn('text-xs font-medium', isDark ? 'text-white/50' : 'text-black/50')}>{formatCurrency(pay)}</span>
                  </div>
                  <div className={cn('h-2 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(pay / maxDeptPay) * 100}%` }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                      className={cn('h-full rounded-full', ['bg-emerald-500', 'bg-sky-500', 'bg-violet-500', 'bg-pink-500', 'bg-amber-500'][i % 5])}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
