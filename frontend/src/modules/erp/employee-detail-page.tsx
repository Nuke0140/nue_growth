'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  ArrowLeft, Mail, Phone, Calendar, Briefcase, DollarSign, UserCircle,
  MessageSquare, FolderKanban, ClipboardCheck, FileText, Clock,
  CheckCircle2, Circle, AlertTriangle, TrendingUp, Brain,
  ChevronRight, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { mockEmployees, mockAttendance, mockLeaveRequests, mockPerformanceReviews } from '@/modules/erp/data/mock-data';
import { useErpStore } from '@/modules/erp/erp-store';

type TabKey = 'work-logs' | 'projects' | 'attendance' | 'leaves' | 'documents';

const statusConfig: Record<string, { label: string; className: string; dotClass: string }> = {
  active: { label: 'Active', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', dotClass: 'bg-emerald-500' },
  'on-leave': { label: 'On Leave', className: 'bg-amber-500/15 text-amber-400 border-amber-500/20', dotClass: 'bg-amber-500' },
  probation: { label: 'Probation', className: 'bg-blue-500/15 text-blue-400 border-blue-500/20', dotClass: 'bg-blue-500' },
  'notice-period': { label: 'Notice Period', className: 'bg-red-500/15 text-red-400 border-red-500/20', dotClass: 'bg-red-500' },
  inactive: { label: 'Inactive', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20', dotClass: 'bg-zinc-500' },
};

const attendanceColors: Record<string, string> = {
  present: 'bg-emerald-500',
  absent: 'bg-red-500',
  'half-day': 'bg-amber-500',
  wfh: 'bg-blue-500',
  'on-leave': 'bg-purple-500',
};

export default function EmployeeDetailPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { selectedEmployeeId, goBack } = useErpStore();
  const [activeTab, setActiveTab] = useState<TabKey>('work-logs');

  const employee = useMemo(() => {
    if (!selectedEmployeeId) return null;
    return mockEmployees.find(e => e.id === selectedEmployeeId) || null;
  }, [selectedEmployeeId]);

  const employeeAttendance = useMemo(() => {
    if (!employee) return [];
    return mockAttendance.filter(a => a.employeeId === employee.id);
  }, [employee]);

  const employeeLeaves = useMemo(() => {
    if (!employee) return [];
    return mockLeaveRequests.filter(l => l.employeeId === employee.id);
  }, [employee]);

  const employeePerformance = useMemo(() => {
    if (!employee) return null;
    return mockPerformanceReviews.find(p => p.employeeId === employee.id) || null;
  }, [employee]);

  // Generate mock work logs
  const workLogs = useMemo(() => {
    if (!employee) return [];
    return [
      { id: 'wl1', date: '2026-04-10', hours: 8.5, project: 'NexaBank Digital Transformation', description: 'Finalized dashboard wireframes and handed off to dev team' },
      { id: 'wl2', date: '2026-04-09', hours: 9.0, project: 'TravelWise Booking Engine', description: 'Created initial UI concepts for booking flow' },
      { id: 'wl3', date: '2026-04-08', hours: 7.5, project: 'NexaBank Digital Transformation', description: 'Stakeholder review meeting and feedback incorporation' },
      { id: 'wl4', date: '2026-04-07', hours: 8.0, project: 'NexaBank Digital Transformation', description: 'Designed notification center components' },
      { id: 'wl5', date: '2026-04-04', hours: 10.0, project: 'TravelWise Booking Engine', description: 'Competitive analysis and UX research documentation' },
      { id: 'wl6', date: '2026-04-03', hours: 8.0, project: 'NexaBank Digital Transformation', description: 'Design system component library updates' },
    ];
  }, [employee]);

  // Mock projects
  const projects = useMemo(() => {
    if (!employee) return [];
    return [
      { name: 'NexaBank Digital Transformation', role: 'UI/UX Lead', allocation: 55 },
      { name: 'TravelWise Booking Engine', role: 'Design Consultant', allocation: 30 },
    ];
  }, [employee]);

  // Generate attendance calendar data
  const calendarDays = useMemo(() => {
    const days: { date: number; status: string }[] = [];
    const statuses = ['present', 'present', 'present', 'wfh', 'present', 'present', 'present', 'half-day', 'present', 'on-leave', 'present', 'present', 'present', 'present', 'wfh', 'present', 'present', 'present', 'absent', 'present', 'present', 'present', 'present', 'present', 'present', 'present', 'present', 'wfh', 'present', 'present'];
    for (let i = 0; i < 30; i++) {
      days.push({ date: i + 1, status: statuses[i] });
    }
    return days;
  }, []);

  // Productivity trend data
  const productivityTrend = useMemo(() => {
    return [
      { day: 'W1', score: 82 }, { day: 'W2', score: 88 }, { day: 'W3', score: 85 },
      { day: 'W4', score: 91 }, { day: 'W5', score: 87 }, { day: 'W6', score: 93 },
    ];
  }, []);

  if (!employee) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-3">
          <UserCircle className={cn('w-12 h-12 mx-auto', isDark ? 'text-white/15' : 'text-black/15')} />
          <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>No employee selected</p>
          <Button variant="ghost" onClick={goBack} className={cn('gap-2', isDark ? 'text-white/60' : 'text-black/60')}>
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  const status = statusConfig[employee.status];

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'work-logs', label: 'Work Logs', icon: ClipboardCheck },
    { key: 'projects', label: 'Projects', icon: FolderKanban },
    { key: 'attendance', label: 'Attendance', icon: Clock },
    { key: 'leaves', label: 'Leaves', icon: Calendar },
    { key: 'documents', label: 'Documents', icon: FileText },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
          <Button
            variant="ghost"
            onClick={goBack}
            className={cn('gap-2 mb-4 -ml-2', isDark ? 'text-white/50 hover:text-white/80 hover:bg-white/[0.06]' : 'text-black/50 hover:text-black/80 hover:bg-black/[0.06]')}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel - Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
            className="w-full lg:w-72 shrink-0"
          >
            <div className={cn(
              'rounded-2xl border p-6 sticky top-6',
              isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}>
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarFallback className={cn(
                    'text-xl font-bold',
                    isDark ? 'bg-white/[0.08] text-white/80' : 'bg-black/[0.08] text-black/80'
                  )}>
                    {employee.avatar}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-lg font-bold">{employee.name}</h2>
                <p className={cn('text-sm mt-0.5', isDark ? 'text-white/50' : 'text-black/50')}>{employee.designation}</p>
                <span className={cn(
                  'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border mt-2',
                  status.className
                )}>
                  <span className={cn('w-1.5 h-1.5 rounded-full', status.dotClass)} />
                  {status.label}
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Briefcase, label: 'Department', value: employee.department },
                  { icon: Mail, label: 'Email', value: employee.email },
                  { icon: Phone, label: 'Phone', value: employee.phone },
                  { icon: UserCircle, label: 'Manager', value: employee.manager },
                  { icon: Calendar, label: 'Joined', value: new Date(employee.joinDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric', day: 'numeric' }) },
                  { icon: DollarSign, label: 'Salary Band', value: employee.salaryBand },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <item.icon className={cn('w-4 h-4 mt-0.5 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
                    <div className="min-w-0">
                      <p className={cn('text-[11px]', isDark ? 'text-white/30' : 'text-black/30')}>{item.label}</p>
                      <p className={cn('text-sm truncate', isDark ? 'text-white/70' : 'text-black/70')}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 mt-6">
                <Button className={cn(
                  'w-full gap-2 rounded-xl',
                  isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'
                )}>
                  <MessageSquare className="w-4 h-4" /> Message
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="rounded-xl gap-2 text-xs">
                    <FolderKanban className="w-3.5 h-3.5" /> Assign
                  </Button>
                  <Button variant="outline" className="rounded-xl gap-2 text-xs">
                    <ClipboardCheck className="w-3.5 h-3.5" /> Review
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Center Panel - Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex-1 min-w-0"
          >
            <div className={cn(
              'rounded-2xl border overflow-hidden',
              isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}>
              {/* Tab Headers */}
              <div className={cn('flex border-b overflow-x-auto', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2',
                      activeTab === tab.key
                        ? isDark
                          ? 'text-white border-white'
                          : 'text-black border-black'
                        : isDark
                          ? 'text-white/40 border-transparent hover:text-white/70'
                          : 'text-black/40 border-transparent hover:text-black/70'
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Work Logs Tab */}
                {activeTab === 'work-logs' && (
                  <div className="space-y-4">
                    {workLogs.map((log) => (
                      <div key={log.id} className={cn(
                        'rounded-xl border p-4',
                        isDark ? 'border-white/[0.04]' : 'border-black/[0.04]'
                      )}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={cn('text-xs font-medium px-2 py-0.5 rounded', isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50')}>
                              {log.project}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{log.date}</span>
                            <span className={cn('text-xs font-medium', isDark ? 'text-white/60' : 'text-black/60')}>{log.hours}h</span>
                          </div>
                        </div>
                        <p className={cn('text-sm', isDark ? 'text-white/70' : 'text-black/70')}>{log.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                  <div className="space-y-4">
                    {projects.map((proj, i) => (
                      <div key={i} className={cn(
                        'rounded-xl border p-4',
                        isDark ? 'border-white/[0.04]' : 'border-black/[0.04]'
                      )}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold">{proj.name}</h3>
                          <Badge variant="outline" className="text-[11px]">{proj.allocation}%</Badge>
                        </div>
                        <p className={cn('text-sm', isDark ? 'text-white/50' : 'text-black/50')}>
                          Role: <span className="font-medium">{proj.role}</span>
                        </p>
                        <div className={cn('mt-3 h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${proj.allocation}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Attendance Tab */}
                {activeTab === 'attendance' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-semibold">Last 30 Days</h3>
                    <div className="grid grid-cols-7 md:grid-cols-10 gap-1.5">
                      {calendarDays.map((day) => (
                        <div key={day.date} className="flex flex-col items-center gap-1">
                          <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{day.date}</span>
                          <div className={cn(
                            'w-6 h-6 md:w-7 md:h-7 rounded-lg',
                            attendanceColors[day.status] || (isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')
                          )} />
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(attendanceColors).map(([key, color]) => (
                        <div key={key} className="flex items-center gap-1.5">
                          <div className={cn('w-3 h-3 rounded', color)} />
                          <span className={cn('text-[11px]', isDark ? 'text-white/40' : 'text-black/40')}>{key.replace('-', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Leaves Tab */}
                {activeTab === 'leaves' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: 'Casual', value: 3, total: 12 },
                        { label: 'Sick', value: 2, total: 10 },
                        { label: 'Earned', value: 5, total: 15 },
                        { label: 'Comp-off', value: 1, total: 3 },
                      ].map((b) => (
                        <div key={b.label} className={cn('rounded-xl border p-3 text-center', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                          <p className={cn('text-[10px] mb-1', isDark ? 'text-white/30' : 'text-black/30')}>{b.label}</p>
                          <p className="text-lg font-bold">{b.value}<span className={cn('text-xs font-normal', isDark ? 'text-white/30' : 'text-black/30')}>/{b.total}</span></p>
                        </div>
                      ))}
                    </div>
                    <h3 className="text-sm font-semibold">Recent Requests</h3>
                    <div className="space-y-2">
                      {employeeLeaves.map((leave) => {
                        const leaveStatusColor = leave.status === 'approved' ? 'text-emerald-400' : leave.status === 'pending' ? 'text-amber-400' : leave.status === 'rejected' ? 'text-red-400' : 'text-zinc-400';
                        return (
                          <div key={leave.id} className={cn('rounded-xl border p-3 flex items-center justify-between', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                            <div>
                              <p className="text-sm font-medium">{leave.type.replace('-', ' ')}</p>
                              <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>
                                {leave.startDate} — {leave.endDate} ({leave.days}d)
                              </p>
                            </div>
                            <span className={cn('text-xs font-medium capitalize', leaveStatusColor)}>{leave.status}</span>
                          </div>
                        );
                      })}
                      {employeeLeaves.length === 0 && (
                        <p className={cn('text-sm text-center py-6', isDark ? 'text-white/30' : 'text-black/30')}>No leave requests found</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <div className="space-y-2">
                    {[
                      { name: 'Offer Letter', type: 'offer-letter', date: '2023-03-01' },
                      { name: 'NDA Agreement', type: 'nda', date: '2023-03-01' },
                      { name: 'Aadhaar Card', type: 'id-proof', date: '2023-03-01' },
                      { name: 'B.Tech Certificate', type: 'education', date: '2023-03-01' },
                      { name: 'Annual Appraisal 2025', type: 'appraisal', date: '2026-01-15' },
                    ].map((doc) => (
                      <div key={doc.name} className={cn('rounded-xl border p-3 flex items-center justify-between', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                        <div className="flex items-center gap-3">
                          <FileText className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>{doc.date}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px]">{doc.type.replace('-', ' ')}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Panel - AI Productivity Insight */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="w-full lg:w-72 shrink-0"
          >
            <div className={cn(
              'rounded-2xl border-2 border-purple-500/30 p-5 sticky top-6',
              isDark ? 'bg-white/[0.02]' : 'bg-white'
            )}>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold">AI Productivity Insight</h3>
              </div>

              {/* Productivity Trend */}
              <div className="mb-5">
                <p className={cn('text-xs font-medium mb-3', isDark ? 'text-white/50' : 'text-black/50')}>Productivity Trend (30d)</p>
                <div className="flex items-end gap-1.5 h-20">
                  {productivityTrend.map((pt, i) => (
                    <div key={pt.day} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex items-end" style={{ height: 60 }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${pt.score}%` }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                          className="w-full rounded-t bg-purple-500/60"
                          style={{ height: `${pt.score}%` }}
                        />
                      </div>
                      <span className={cn('text-[9px]', isDark ? 'text-white/25' : 'text-black/25')}>{pt.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Burnout Risk */}
              <div className={cn('rounded-xl border p-3 mb-4', isDark ? 'border-white/[0.04] bg-white/[0.02]' : 'border-black/[0.04] bg-black/[0.01]')}>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-medium">Burnout Risk</span>
                </div>
                <div className={cn('flex items-center gap-2', isDark ? 'text-white/60' : 'text-black/60')}>
                  <div className={cn('flex-1 h-2 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                    <div className="h-full rounded-full bg-amber-500" style={{ width: '25%' }} />
                  </div>
                  <span className="text-xs font-medium text-amber-400">Low</span>
                </div>
              </div>

              {/* Suggested Actions */}
              <div>
                <p className={cn('text-xs font-medium mb-2', isDark ? 'text-white/50' : 'text-black/50')}>Suggested Actions</p>
                <div className="space-y-2">
                  {[
                    { text: 'Consider for team lead role', icon: ChevronRight },
                    { text: 'Assign stretch project', icon: ChevronRight },
                    { text: 'Schedule 1-on-1 review', icon: ChevronRight },
                  ].map((action, i) => (
                    <button key={i} className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-left transition-colors',
                      isDark ? 'hover:bg-white/[0.04] text-white/60' : 'hover:bg-black/[0.04] text-black/60'
                    )}>
                      <action.icon className="w-3 h-3" />
                      {action.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* KPI Summary */}
              {employeePerformance && (
                <div className="mt-5 pt-4 border-t" style={{ borderColor: isDark ? 'rgba(168,85,247,0.15)' : 'rgba(168,85,247,0.2)' }}>
                  <p className={cn('text-xs font-medium mb-3', isDark ? 'text-white/50' : 'text-black/50')}>Latest Review ({employeePerformance.period})</p>
                  <div className="space-y-2">
                    {[
                      { label: 'KPI Score', value: employeePerformance.kpiScore },
                      { label: 'SLA Score', value: employeePerformance.slaScore },
                      { label: 'Task Completion', value: employeePerformance.taskCompletion },
                      { label: 'Client Feedback', value: employeePerformance.clientFeedback || 'N/A' },
                    ].map((metric) => (
                      <div key={metric.label} className="flex items-center justify-between">
                        <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{metric.label}</span>
                        <span className={cn('text-xs font-semibold', typeof metric.value === 'number' && metric.value >= 85 ? 'text-emerald-400' : typeof metric.value === 'number' ? 'text-amber-400' : isDark ? 'text-white/40' : 'text-black/40')}>
                          {typeof metric.value === 'number' ? `${metric.value}%` : metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
