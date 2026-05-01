'use client';

import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Brain, AlertTriangle, TrendingUp, TrendingDown, Users, Flame,
  Target, BarChart3, BarChart2, Clock, GraduationCap, Heart, UserPlus,
  Building2, ChevronRight, Zap, Shield
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { PageShell } from './components/ops/page-shell';
import { mockEmployees, mockPerformanceReviews, mockAttendance } from '@/modules/erp/data/mock-data';

function EmployeeAnalyticsPageInner() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // ---- Derived KPI data ----
  const kpis = useMemo(() => {
    const avgProductivity = Math.round(mockEmployees.reduce((s, e) => s + e.productivityScore, 0) / mockEmployees.length);
    const burnoutRisk = mockEmployees.filter(e => e.productivityScore < 80 || mockAttendance.filter(a => a.employeeId === e.id && a.overtime >= 2).length >= 2).length;
    const hiringForecast = 3;
    const engagementScore = 82;
    const trainingCompletion = 68;
    return {
      attritionRisk: 2,
      avgProductivity,
      burnoutRisk,
      hiringForecast,
      engagementScore,
      trainingCompletion,
    };
  }, []);

  // ---- Attrition Risk Table ----
  const attritionData = useMemo(() => {
    return [
      { employeeId: 'e4', risk: 'medium' as const, tenure: '2y 3m', lastRating: 79, recommendation: 'Schedule career development discussion; assign challenging project' },
      { employeeId: 'e8', risk: 'low' as const, tenure: '0y 0m', lastRating: 74, recommendation: 'Monitor during probation; ensure mentor support' },
      { employeeId: 'e11', risk: 'high' as const, tenure: '2y 5m', lastRating: 91, recommendation: 'Top performer — discuss retention incentives; consider promotion track' },
    ].map(d => ({
      ...d,
      employee: mockEmployees.find(e => e.id === d.employeeId)!,
    }));
  }, []);

  // ---- Productivity Trend ----
  const productivityTrend = useMemo(() => {
    return [
      { month: 'Oct', score: 78 },
      { month: 'Nov', score: 82 },
      { month: 'Dec', score: 80 },
      { month: 'Jan', score: 85 },
      { month: 'Feb', score: 83 },
      { month: 'Mar', score: 87 },
      { month: 'Apr', score: kpis.avgProductivity },
    ];
  }, [kpis.avgProductivity]);

  // ---- Burnout Risk Cards ----
  const burnoutData = useMemo(() => {
    return [
      { employeeId: 'e5', department: 'Engineering', overtimeHours: 15, consecutiveDays: 12, action: 'Mandatory 2-day break recommended; redistribute tasks' },
      { employeeId: 'e2', department: 'Engineering', overtimeHours: 8, consecutiveDays: 8, action: 'Schedule weekly check-in; reduce project load by 10%' },
      { employeeId: 'e9', department: 'Engineering', overtimeHours: 5, consecutiveDays: 7, action: 'Monitor closely; consider workload adjustment' },
    ].map(d => ({
      ...d,
      employee: mockEmployees.find(e => e.id === d.employeeId)!,
    }));
  }, []);

  // ---- Hiring Forecast ----
  const hiringForecast = useMemo(() => {
    return [
      { department: 'Engineering', current: 6, required: 9, priority: 'high' as const, timeline: 'Q2 2026', reason: 'New projects scaling up' },
      { department: 'QA', current: 1, required: 3, priority: 'medium' as const, timeline: 'Q3 2026', reason: 'Testing capacity increase' },
      { department: 'Design', current: 1, required: 2, priority: 'medium' as const, timeline: 'Q3 2026', reason: 'Product expansion needs' },
    ];
  }, []);

  const riskConfig: Record<string, { label: string; className: string; dotClass: string }> = {
    low: { label: 'Low', className: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border-emerald-500/20', dotClass: 'bg-emerald-500' },
    medium: { label: 'Medium', className: 'bg-amber-500/15 text-amber-500 dark:text-amber-400 border-amber-500/20', dotClass: 'bg-amber-500' },
    high: { label: 'High', className: 'bg-red-500/15 text-red-500 dark:text-red-400 border-red-500/20', dotClass: 'bg-red-500' },
    critical: { label: 'Critical', className: 'bg-red-600/15 text-red-500 border-red-600/20', dotClass: 'bg-red-600' },
  };

  const priorityConfig: Record<string, { label: string; className: string }> = {
    low: { label: 'Low', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' },
    medium: { label: 'Medium', className: 'bg-amber-500/15 text-amber-500 dark:text-amber-400 border-amber-500/20' },
    high: { label: 'High', className: 'bg-red-500/15 text-red-500 dark:text-red-400 border-red-500/20' },
  };

  const maxTrend = Math.max(...productivityTrend.map(p => p.score));

  return (
    <PageShell title="Employee Analytics" icon={BarChart2} subtitle="AI-Powered" headerRight={
      <Badge className={cn(
        'gap-1 px-2 py-0.5 text-[11px] font-medium border',
        isDark ? 'bg-purple-500/15 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-700 border-purple-200'
      )}>
        <Brain className="w-3 h-3" /> AI-Powered
      </Badge>
    }>

        {/* 6 KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {[
            { label: 'Attrition Risk', value: kpis.attritionRisk, icon: AlertTriangle, color: 'text-red-500 dark:text-red-400', sub: 'employees flagged' },
            { label: 'Avg Productivity', value: `${kpis.avgProductivity}%`, icon: Target, color: 'text-emerald-500 dark:text-emerald-400', sub: 'across company' },
            { label: 'Burnout Risk', value: kpis.burnoutRisk, icon: Flame, color: 'text-amber-500 dark:text-amber-400', sub: 'need attention' },
            { label: 'Hiring Forecast', value: kpis.hiringForecast, icon: UserPlus, color: 'text-blue-400', sub: 'open positions' },
            { label: 'Engagement Score', value: `${kpis.engagementScore}%`, icon: Heart, color: 'text-pink-400', sub: 'employee survey' },
            { label: 'Training Done', value: `${kpis.trainingCompletion}%`, icon: GraduationCap, color: 'text-teal-400', sub: 'completion rate' },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>{kpi.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                  <kpi.icon className={cn('w-3.5 h-3.5', kpi.color)} />
                </div>
              </div>
              <p className="text-xl font-bold">{kpi.value}</p>
              <p className={cn('text-[10px] mt-0.5', isDark ? 'text-white/25' : 'text-black/25')}>{kpi.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Attrition Risk Table */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className={cn('rounded-2xl border overflow-hidden', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
            >
              <div className={cn('px-5 py-3 border-b flex items-center justify-between', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-500 dark:text-red-400" /> Attrition Risk Analysis
                </h3>
                <Badge variant="outline" className="text-[10px]">{attritionData.length} flagged</Badge>
              </div>
              <div className="divide-y" style={{ borderColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}>
                {attritionData.map((d) => {
                  const risk = riskConfig[d.risk];
                  return (
                    <div key={d.employeeId} className={cn('p-4', isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.01]')}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className={cn('text-xs font-semibold', isDark ? 'bg-white/[0.08] text-white/60' : 'bg-black/[0.08] text-black/60')}>
                              {d.employee.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{d.employee.name}</p>
                            <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{d.employee.department} · Tenure: {d.tenure}</p>
                          </div>
                        </div>
                        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border', risk.className)}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', risk.dotClass)} />
                          {risk.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mb-2">
                        <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>
                          Last Rating: <span className={cn('font-medium', d.lastRating >= 85 ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400')}>{d.lastRating}%</span>
                        </span>
                      </div>
                      <div className={cn('rounded-lg p-2.5', isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]')}>
                        <div className="flex items-start gap-2">
                          <Brain className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                          <p className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>{d.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Burnout Risk Cards */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className={cn('rounded-2xl border overflow-hidden', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
            >
              <div className={cn('px-5 py-3 border-b flex items-center justify-between', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Burnout Risk Assessment
                </h3>
                <Badge variant="outline" className="text-[10px]">{burnoutData.length} at risk</Badge>
              </div>
              <div className="p-5 space-y-3">
                {burnoutData.map((d) => (
                  <div key={d.employeeId} className={cn('rounded-xl border p-4', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className={cn('text-[10px] font-semibold', isDark ? 'bg-white/[0.08] text-white/60' : 'bg-black/[0.08] text-black/60')}>
                            {d.employee.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{d.employee.name}</p>
                          <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{d.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <p className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>OT Hours</p>
                          <p className={cn('text-sm font-bold', d.overtimeHours >= 10 ? 'text-red-500 dark:text-red-400' : 'text-amber-500 dark:text-amber-400')}>{d.overtimeHours}h</p>
                        </div>
                        <div className="text-center">
                          <p className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>Consec. Days</p>
                          <p className={cn('text-sm font-bold', d.consecutiveDays >= 10 ? 'text-red-500 dark:text-red-400' : 'text-amber-500 dark:text-amber-400')}>{d.consecutiveDays}</p>
                        </div>
                      </div>
                    </div>
                    <div className={cn('rounded-lg p-2.5', isDark ? 'bg-purple-500/[0.05]' : 'bg-purple-50/50')}>
                      <div className="flex items-start gap-2">
                        <Zap className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                        <p className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>
                          <span className="font-medium text-purple-400">AI Suggestion:</span> {d.action}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Productivity Trend Chart */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
            >
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Productivity Trend
              </h3>
              <div className="flex items-end gap-3 h-36">
                {productivityTrend.map((pt, i) => (
                  <div key={pt.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end" style={{ height: 100 }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(pt.score / maxTrend) * 100}%` }}
                        transition={{ delay: i * 0.08 + 0.2, duration: 0.2 }}
                        className={cn('w-full rounded-t', pt.score >= 85 ? 'bg-emerald-500/60' : 'bg-amber-500/60')}
                        style={{ height: `${(pt.score / maxTrend) * 100}%` }}
                      />
                    </div>
                    <span className={cn('text-[10px] font-medium', isDark ? 'text-white/30' : 'text-black/30')}>{pt.month}</span>
                    <span className={cn('text-[10px] font-bold', pt.score >= 85 ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400')}>{pt.score}%</span>
                  </div>
                ))}
              </div>
              <div className={cn('flex items-center justify-between mt-4 pt-3 border-t', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>
                    +{kpis.avgProductivity - productivityTrend[0].score}% from Oct
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded bg-emerald-500/60" />
                  <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>≥ 85%</span>
                  <div className="w-2 h-2 rounded bg-amber-500/60 ml-2" />
                  <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>&lt; 85%</span>
                </div>
              </div>
            </motion.div>

            {/* Hiring Forecast */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className={cn('rounded-2xl border overflow-hidden', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
            >
              <div className={cn('px-5 py-3 border-b flex items-center justify-between', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-blue-400" /> Hiring Forecast
                </h3>
                <Badge variant="outline" className="text-[10px]">{hiringForecast.reduce((s, h) => s + h.required - h.current, 0)} positions</Badge>
              </div>
              <div className="p-5 space-y-3">
                {hiringForecast.map((hf) => {
                  const priority = priorityConfig[hf.priority];
                  const gap = hf.required - hf.current;
                  return (
                    <div key={hf.department} className={cn('rounded-xl border p-4', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                            <Building2 className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{hf.department}</p>
                            <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{hf.reason}</p>
                          </div>
                        </div>
                        <span className={cn('inline-flex px-2 py-0.5 rounded text-[10px] font-medium border', priority.className)}>
                          {priority.label} Priority
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Current: {hf.current}</span>
                            <span className={cn('text-xs font-medium', isDark ? 'text-white/60' : 'text-black/60')}>Required: {hf.required}</span>
                          </div>
                          <div className={cn('h-2 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                            <div className={cn('h-full rounded-full', hf.current / hf.required >= 0.7 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${(hf.current / hf.required) * 100}%` }} />
                          </div>
                        </div>
                        <div className="text-center min-w-[60px]">
                          <p className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>Gap</p>
                          <p className={cn('text-lg font-bold', gap >= 3 ? 'text-red-500 dark:text-red-400' : 'text-amber-500 dark:text-amber-400')}>+{gap}</p>
                        </div>
                        <div className="text-center min-w-[60px]">
                          <p className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>Timeline</p>
                          <p className={cn('text-xs font-medium', isDark ? 'text-white/60' : 'text-black/60')}>{hf.timeline}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* AI Insights Summary */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className={cn('rounded-2xl border-2 border-purple-500/30 p-5', isDark ? 'bg-purple-500/[0.03]' : 'bg-purple-50/30')}
            >
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" /> AI Summary
              </h3>
              <div className="space-y-2">
                {[
                  { icon: TrendingUp, text: 'Productivity improved by 9% over the last 7 months', color: 'text-emerald-500 dark:text-emerald-400' },
                  { icon: AlertTriangle, text: `${kpis.burnoutRisk} employees show signs of burnout — proactive intervention recommended`, color: 'text-amber-500 dark:text-amber-400' },
                  { icon: UserPlus, text: `${kpis.hiringForecast} new hires needed in Q2-Q3 to meet project demands`, color: 'text-blue-400' },
                  { icon: Heart, text: 'Employee engagement stable at 82% — focus on recognition programs', color: 'text-pink-400' },
                ].map((insight, i) => (
                  <div key={i} className={cn('flex items-start gap-2.5 p-2 rounded-lg', isDark ? 'bg-white/[0.02]' : 'bg-white/50')}>
                    <insight.icon className={cn('w-4 h-4 mt-0.5 shrink-0', insight.color)} />
                    <p className={cn('text-xs', isDark ? 'text-white/60' : 'text-black/60')}>{insight.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
    </PageShell>
  );
}

export default memo(EmployeeAnalyticsPageInner);
