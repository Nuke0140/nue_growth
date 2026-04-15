'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText, AlertTriangle, Clock, CheckCircle2, Download,
  Calendar, BarChart3, TrendingUp, ArrowUpRight, ArrowDownRight,
  Shield, Receipt, IndianRupee, AlertCircle,
} from 'lucide-react';
import { gstSummaries, taxFilings } from '@/modules/finance/data/mock-data';
import type { GSTSummary, TaxFiling } from '@/modules/finance/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const filingStatusConfig: Record<string, { color: string; bgDark: string; bgLight: string }> = {
  filed: { color: 'text-emerald-400', bgDark: 'bg-emerald-500/15', bgLight: 'bg-emerald-50 text-emerald-600' },
  pending: { color: 'text-amber-400', bgDark: 'bg-amber-500/15', bgLight: 'bg-amber-50 text-amber-600' },
  overdue: { color: 'text-red-400', bgDark: 'bg-red-500/15', bgLight: 'bg-red-50 text-red-600' },
};

const typeConfig: Record<string, { bgDark: string; bgLight: string }> = {
  'GSTR-1': { bgDark: 'bg-violet-500/15 text-violet-400', bgLight: 'bg-violet-50 text-violet-600' },
  'GSTR-3B': { bgDark: 'bg-sky-500/15 text-sky-400', bgLight: 'bg-sky-50 text-sky-600' },
  'TDS': { bgDark: 'bg-amber-500/15 text-amber-400', bgLight: 'bg-amber-50 text-amber-600' },
  'advance-tax': { bgDark: 'bg-emerald-500/15 text-emerald-400', bgLight: 'bg-emerald-50 text-emerald-600' },
};

const quarterNames = ['Q1 (Oct–Dec)', 'Q2 (Jan–Mar)', 'Q3 (Apr–Jun)', 'Q4 (Jul–Sep)'];

export default function GSTTaxPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const totalCollected = useMemo(() => gstSummaries.reduce((s, g) => s + g.gstCollected, 0), []);
  const totalPayable = useMemo(() => gstSummaries.reduce((s, g) => s + g.gstPayable, 0), []);
  const totalReceivable = useMemo(() => gstSummaries.reduce((s, g) => s + g.gstReceivable, 0), []);
  const totalTDSDeducted = useMemo(() => gstSummaries.reduce((s, g) => s + g.tdsDeducted, 0), []);
  const totalTaxLiability = useMemo(() => gstSummaries.reduce((s, g) => s + g.taxLiability, 0), []);
  const totalFiled = useMemo(() => taxFilings.filter(f => f.status === 'filed').length, []);

  const overdueFilings = useMemo(() => taxFilings.filter(f => f.status === 'overdue'), []);
  const upcomingFilings = useMemo(() => taxFilings.filter(f => f.status === 'pending'), []);
  const maxGSTCollected = useMemo(() => Math.max(...gstSummaries.map(g => g.gstCollected)), []);

  const quarterSummary = useMemo(() => {
    const quarters: { label: string; collected: number; payable: number; liability: number }[] = [];
    for (let q = 0; q < 3; q++) {
      const slice = gstSummaries.slice(q * 2, q * 2 + 2);
      quarters.push({
        label: quarterNames[q],
        collected: slice.reduce((s, g) => s + g.gstCollected, 0),
        payable: slice.reduce((s, g) => s + g.gstPayable, 0),
        liability: slice.reduce((s, g) => s + g.taxLiability, 0),
      });
    }
    return quarters;
  }, []);

  const kpiStats = [
    { label: 'GST Collected', value: formatINR(totalCollected), icon: TrendingUp, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', change: 12.4 },
    { label: 'GST Payable', value: formatINR(totalPayable), icon: IndianRupee, color: 'text-amber-400', bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50', change: 8.2 },
    { label: 'GST Receivable', value: formatINR(totalReceivable), icon: ArrowDownRight, color: 'text-sky-400', bg: isDark ? 'bg-sky-500/10' : 'bg-sky-50', change: 15.1 },
    { label: 'TDS Deducted', value: formatINR(totalTDSDeducted), icon: Shield, color: 'text-violet-400', bg: isDark ? 'bg-violet-500/10' : 'bg-violet-50', change: 6.8 },
    { label: 'Tax Liability', value: formatINR(totalTaxLiability), icon: AlertTriangle, color: 'text-red-400', bg: isDark ? 'bg-red-500/10' : 'bg-red-50', change: -3.2 },
    { label: 'Total Filed', value: `${totalFiled}/${taxFilings.length}`, icon: CheckCircle2, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', change: 10 },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
              <Receipt className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">GST & Tax</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>India GST & Tax Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className={cn('px-3 py-2 text-sm font-medium rounded-xl gap-2 border', isDark ? 'border-white/[0.1] text-white/60 hover:bg-white/[0.05]' : 'border-black/[0.1] text-black/60 hover:bg-black/[0.05]')}>
              <Download className="w-4 h-4" /> Export GST Report
            </Button>
            <Button className={cn('px-4 py-2 text-sm font-medium rounded-xl gap-2 transition-colors', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}>
              <FileText className="w-4 h-4" /> File GST
            </Button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {kpiStats.map((stat, i) => {
            const isPositive = stat.change > 0;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn('rounded-2xl border p-4 cursor-pointer transition-all duration-200', isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]')}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn('text-[11px] font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>{stat.label}</span>
                  <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', stat.bg)}>
                    <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-bold tracking-tight">{stat.value}</p>
                  <span className={cn('flex items-center gap-0.5 text-[10px] font-medium', isPositive ? 'text-emerald-500' : 'text-red-500')}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(stat.change)}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Monthly GST Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Monthly GST Trend</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Collected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Payable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Liability</span>
              </div>
            </div>
          </div>
          <div className="flex items-end gap-3 h-36">
            {gstSummaries.map((gst: GSTSummary, j) => {
              const periodShort = gst.period.split(' ')[0].slice(0, 3);
              return (
                <div key={gst.period} className="flex-1 flex flex-col items-center gap-1">
                  <div className="flex items-end gap-0.5 w-full h-28">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(gst.gstCollected / maxGSTCollected) * 100}%` }}
                      transition={{ delay: 0.4 + j * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="flex-1 rounded-t-sm bg-emerald-500/40"
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(gst.gstPayable / maxGSTCollected) * 100}%` }}
                      transition={{ delay: 0.4 + j * 0.05 + 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="flex-1 rounded-t-sm bg-amber-500/40"
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(gst.taxLiability / maxGSTCollected) * 100}%` }}
                      transition={{ delay: 0.4 + j * 0.05 + 0.16, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="flex-1 rounded-t-sm bg-red-500/40"
                    />
                  </div>
                  <span className={cn('text-[9px]', isDark ? 'text-white/30' : 'text-black/30')}>{periodShort}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Quarter Summary Cards */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
            <h2 className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Quarter Summary</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quarterSummary.map((q, i) => (
              <motion.div
                key={q.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn('rounded-2xl border p-4 transition-all duration-200 cursor-pointer', isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]')}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">{q.label}</span>
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                    <BarChart3 className={cn('w-4 h-4', isDark ? 'text-white/50' : 'text-black/50')} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>GST Collected</span>
                    <span className="text-sm font-semibold text-emerald-500">{formatINR(q.collected)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>GST Payable</span>
                    <span className="text-sm font-semibold text-amber-500">{formatINR(q.payable)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>Tax Liability</span>
                    <span className="text-sm font-semibold text-red-500">{formatINR(q.liability)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Filing Calendar Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Filing Calendar</span>
              <Badge variant="secondary" className={cn('text-[10px]', isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40')}>
                {taxFilings.length} filings
              </Badge>
            </div>
          </div>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className={cn('sticky top-0 z-10', isDark ? 'bg-[#1a1a1a]' : 'bg-white')}>
                <tr className={cn('border-b', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
                  {['Period', 'Type', 'Due Date', 'Filed Date', 'Status', 'Amount'].map(h => (
                    <th key={h} className={cn('text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-3 whitespace-nowrap', isDark ? 'text-white/40' : 'text-black/40')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {taxFilings.map((filing: TaxFiling, i) => {
                  const sConf = filingStatusConfig[filing.status];
                  const tConf = typeConfig[filing.type] || typeConfig['GSTR-1'];
                  return (
                    <motion.tr
                      key={filing.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.65 + i * 0.03 }}
                      className={cn(
                        'border-b transition-colors',
                        isDark ? 'border-white/[0.04] hover:bg-white/[0.02]' : 'border-black/[0.04] hover:bg-black/[0.02]',
                        filing.status === 'overdue' && (isDark ? 'bg-red-500/[0.03]' : 'bg-red-50/30'),
                      )}
                    >
                      <td className="py-3 px-3 text-sm whitespace-nowrap">{filing.period}</td>
                      <td className="py-3 px-3">
                        <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', isDark ? tConf.bgDark : tConf.bgLight)}>
                          {filing.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-sm whitespace-nowrap">{filing.dueDate}</td>
                      <td className="py-3 px-3 text-sm whitespace-nowrap">{filing.filedDate || '—'}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          {filing.status === 'filed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                          {filing.status === 'pending' && <Clock className="w-3.5 h-3.5 text-amber-500" />}
                          {filing.status === 'overdue' && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                          <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5 capitalize', isDark ? sConf.bgDark : sConf.bgLight)}>
                            {filing.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-sm font-semibold whitespace-nowrap">{formatINR(filing.amount)}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Overdue Filings Alert */}
        {overdueFilings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className={cn('rounded-2xl border p-5', isDark ? 'bg-red-500/[0.03] border-red-500/[0.12]' : 'bg-red-50/50 border-red-200/60')}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-red-500">Overdue Filings</span>
              <Badge variant="secondary" className="text-[10px] bg-red-500/15 text-red-400">{overdueFilings.length} overdue</Badge>
            </div>
            <div className="space-y-2">
              {overdueFilings.map((f, i) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.85 + i * 0.05, duration: 0.3 }}
                  className={cn('flex items-center justify-between p-3 rounded-xl border', isDark ? 'border-red-500/10 bg-red-500/[0.02]' : 'border-red-200/40 bg-white/60')}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{f.type} — {f.period}</p>
                      <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>Due: {f.dueDate} • {formatINR(f.amount)}</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg">
                    File Now
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Upcoming Filings */}
        {upcomingFilings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            className={cn('rounded-2xl border p-5', isDark ? 'bg-amber-500/[0.03] border-amber-500/[0.12]' : 'bg-amber-50/50 border-amber-200/60')}
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-500">Upcoming Filings</span>
              <Badge variant="secondary" className="text-[10px] bg-amber-500/15 text-amber-400">{upcomingFilings.length} pending</Badge>
            </div>
            <div className="space-y-2">
              {upcomingFilings.map((f, i) => {
                const dueDate = new Date(f.dueDate);
                const now = new Date();
                const daysLeft = Math.max(0, Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
                return (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.95 + i * 0.05, duration: 0.3 }}
                    className={cn('flex items-center justify-between p-3 rounded-xl border', isDark ? 'border-amber-500/10 bg-amber-500/[0.02]' : 'border-amber-200/40 bg-white/60')}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{f.type} — {f.period}</p>
                        <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>Due: {f.dueDate} • {formatINR(f.amount)}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={cn('text-xs px-3 py-1', isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-100 text-amber-700')}>
                      {daysLeft} days left
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
