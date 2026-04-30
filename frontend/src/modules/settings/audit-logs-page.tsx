'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText, Filter, Download, Calendar,
  AlertTriangle, Info, AlertCircle, ChevronDown,
} from 'lucide-react';
import { auditLogs } from './data/mock-data';
import AuditLogCard from './components/audit-log-card';

const eventTypes = [...new Set(auditLogs.map((l) => l.eventType))];
const severityOptions = ['all', 'info', 'warning', 'critical'];
const moduleOptions = [...new Set(auditLogs.map((l) => l.module))];
const actorOptions = [...new Set(auditLogs.map((l) => l.actor))];

export default function AuditLogsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [actorFilter, setActorFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (eventTypeFilter !== 'all' && log.eventType !== eventTypeFilter) return false;
      if (severityFilter !== 'all' && log.severity !== severityFilter) return false;
      if (actorFilter !== 'all' && log.actor !== actorFilter) return false;
      if (moduleFilter !== 'all' && log.module !== moduleFilter) return false;
      return true;
    });
  }, [eventTypeFilter, severityFilter, actorFilter, moduleFilter]);

  const totalEvents = auditLogs.length;
  const criticalCount = auditLogs.filter((l) => l.severity === 'critical').length;
  const warningCount = auditLogs.filter((l) => l.severity === 'warning').length;
  const todayCount = auditLogs.filter((l) => {
    const logDate = new Date(log.timestamp);
    const today = new Date();
    return logDate.toDateString() === today.toDateString();
  }).length;

  const infoCount = auditLogs.filter((l) => l.severity === 'info').length;
  const severityTotal = totalEvents;

  const summaryKPIs = [
    { label: 'Total Events', value: totalEvents.toString(), color: 'text-violet-400', icon: FileText },
    { label: 'Critical', value: criticalCount.toString(), color: 'text-red-400', icon: AlertCircle },
    { label: 'Warnings', value: warningCount.toString(), color: 'text-amber-400', icon: AlertTriangle },
    { label: "Today's Events", value: todayCount.toString(), color: 'text-sky-400', icon: Calendar },
  ];

  const SelectFilter = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'pl-3 pr-8 py-2 rounded-xl text-xs border outline-none appearance-none transition-colors cursor-pointer',
          isDark
            ? 'bg-white/[0.03] border-white/[0.06] text-white/60 focus:border-violet-500/40'
            : 'bg-black/[0.02] border-black/[0.06] text-black/60 focus:border-violet-500/40'
        )}
      >
        <option value="all">All {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
        ))}
      </select>
      <ChevronDown className={cn('absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none', 'text-[var(--app-text-muted)]')} />
    </div>
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <FileText className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Audit Logs</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Complete action history</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className={cn('rounded-xl text-xs gap-1.5', isDark ? 'border-white/[0.08] text-white/50 hover:bg-white/[0.06]' : 'border-black/[0.08] text-black/50 hover:bg-black/[0.06]')}>
              <Download className="w-3.5 h-3.5" /> Export PDF
            </Button>
            <Button variant="outline" size="sm" className={cn('rounded-xl text-xs gap-1.5', isDark ? 'border-white/[0.08] text-white/50 hover:bg-white/[0.06]' : 'border-black/[0.08] text-black/50 hover:bg-black/[0.06]')}>
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryKPIs.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-2xl border p-4', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{kpi.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
                  <kpi.icon className={cn('w-3.5 h-3.5', kpi.color)} />
                </div>
              </div>
              <p className={cn('text-2xl font-bold tracking-tight', kpi.color)}>{kpi.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Severity Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn('rounded-2xl border p-4', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center gap-4 mb-3">
            <span className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Severity Distribution</span>
          </div>
          <div className="flex items-center gap-1 h-3 rounded-full overflow-hidden">
            {infoCount > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(infoCount / severityTotal) * 100}%` }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-full bg-sky-500 rounded-l-full"
              />
            )}
            {warningCount > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(warningCount / severityTotal) * 100}%` }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="h-full bg-amber-500"
              />
            )}
            {criticalCount > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(criticalCount / severityTotal) * 100}%` }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-full bg-red-500 rounded-r-full"
              />
            )}
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Info ({infoCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Warning ({warningCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Critical ({criticalCount})</span>
            </div>
          </div>
        </motion.div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-xs font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Filters</span>
          </div>
          <SelectFilter label="Event Type" value={eventTypeFilter} onChange={setEventTypeFilter} options={eventTypes} />
          <SelectFilter label="Severity" value={severityFilter} onChange={setSeverityFilter} options={severityOptions.filter(o => o !== 'all')} />
          <SelectFilter label="Actor" value={actorFilter} onChange={setActorFilter} options={actorOptions} />
          <SelectFilter label="Module" value={moduleFilter} onChange={setModuleFilter} options={moduleOptions} />
          <input
            type="date"
            className={cn(
              'px-3 py-2 rounded-xl text-xs border outline-none transition-colors',
              isDark
                ? 'bg-white/[0.03] border-white/[0.06] text-white/60 focus:border-violet-500/40'
                : 'bg-black/[0.02] border-black/[0.06] text-black/60 focus:border-violet-500/40'
            )}
          />
        </div>

        {/* Audit Log Cards */}
        <div className="space-y-3">
          {filteredLogs.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <AuditLogCard log={log} />
            </motion.div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className={cn('text-center py-12 rounded-2xl border', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
            <FileText className={cn('w-8 h-8 mx-auto mb-3', 'text-[var(--app-text-disabled)]')} />
            <p className={cn('text-sm', 'text-[var(--app-text-muted)]')}>No audit logs match your filters</p>
          </div>
        )}

        <Badge variant="secondary" className={cn('text-[10px] px-3 py-1 border-0 block w-fit', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
          Showing {filteredLogs.length} of {auditLogs.length} events
        </Badge>
      </div>
    </div>
  );
}
