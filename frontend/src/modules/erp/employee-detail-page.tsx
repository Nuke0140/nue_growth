'use client';

import { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Mail, Phone, Calendar, Briefcase, DollarSign, UserCircle,
  Pencil, FolderKanban, Clock, FileText, Activity, CreditCard,
  Laptop, Download, ChevronRight, Users, Package, CheckCircle2,
  AlertTriangle, BarChart3, Send, Award, CalendarPlus, MessageSquare,
  StickyNote, Plus, FolderPlus, DollarSign as DollarIcon, CalendarClock,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  mockEmployees, mockAttendance, mockLeaveRequests, mockPayroll, mockAssets,
} from '@/modules/erp/data/mock-data';
import { useErpStore } from '@/modules/erp/erp-store';
import { StatusBadge } from '@/modules/erp/components/ops/status-badge';
import { PageShell } from './components/ops/page-shell';
import { OpsCard } from '@/modules/erp/components/ops/app-card';
import { Timeline } from '@/modules/erp/components/ops/timeline';
import type { TimelineItem as TimelineItemType } from '@/modules/erp/components/ops/timeline';

// ---- Helpers ----
type TabKey = 'overview' | 'attendance' | 'leaves' | 'payroll' | 'assets' | 'activity' | 'timeline' | 'notes';

interface Note {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  type: 'quick' | 'manager';
}

function formatStatusLabel(status: string): string {
  const map: Record<string, string> = {
    active: 'Active',
    'on-leave': 'On Leave',
    'notice-period': 'Notice Period',
    inactive: 'Inactive',
    probation: 'Probation',
  };
  return map[status] || status;
}

function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

function getAttendanceStatusColor(status: string): string {
  switch (status) {
    case 'present': return 'var(--app-success)';
    case 'absent': return 'var(--app-danger)';
    case 'half-day': return 'var(--app-warning)';
    case 'wfh': return 'var(--app-info)';
    case 'on-leave': return '#a78bfa';
    default: return 'var(--app-text-muted)';
  }
}

function getAssetStatusColor(status: string): string {
  switch (status) {
    case 'active': return 'var(--app-success)';
    case 'in-repair': return 'var(--app-warning)';
    case 'disposed': return 'var(--app-danger)';
    case 'retired': return 'var(--app-text-muted)';
    default: return 'var(--app-text-muted)';
  }
}

// ---- Main Component ----
function EmployeeDetailPageInner() {
  const { selectedEmployeeId, goBack } = useErpStore();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  // Notes state
  const [quickNote, setQuickNote] = useState('');
  const [managerNotes, setManagerNotes] = useState('');
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 'n1',
      author: 'Arjun Mehta',
      content: 'Excellent performance on the NexaBank project. Client specifically mentioned Deepika\'s wireframe quality in the last feedback session. Recommended for Q1 spot award.',
      timestamp: '2026-04-08 14:30',
      type: 'manager',
    },
    {
      id: 'n2',
      author: 'Ritika Gupta',
      content: 'Probation review completed — all onboarding tasks cleared. Strong communication skills noted by team members. Ready for full-time confirmation.',
      timestamp: '2026-04-05 11:15',
      type: 'quick',
    },
    {
      id: 'n3',
      author: 'Nikhil Das',
      content: 'Technical assessment score: 88/100. Solid understanding of design systems and component architecture. Suggested for design system ownership role.',
      timestamp: '2026-04-02 16:45',
      type: 'manager',
    },
  ]);

  const employee = useMemo(() => {
    if (!selectedEmployeeId) return null;
    return mockEmployees.find((e) => e.id === selectedEmployeeId) || null;
  }, [selectedEmployeeId]);

  const employeeAttendance = useMemo(() => {
    if (!employee) return [];
    return mockAttendance.filter((a) => a.employeeId === employee.id);
  }, [employee]);

  const employeeLeaves = useMemo(() => {
    if (!employee) return [];
    return mockLeaveRequests.filter((l) => l.employeeId === employee.id);
  }, [employee]);

  const employeePayroll = useMemo(() => {
    if (!employee) return [];
    return mockPayroll.filter((p) => p.employeeId === employee.id);
  }, [employee]);

  const employeeAssets = useMemo(() => {
    if (!employee) return [];
    return mockAssets.filter((a) => a.assignedTo === employee.name);
  }, [employee]);

  // Mock activity data
  const activities = useMemo(() => {
    if (!employee) return [];
    return [
      { id: 'act1', date: '2026-04-10', text: 'Logged in at 09:05 AM', type: 'attendance' },
      { id: 'act2', date: '2026-04-09', text: 'Completed task: Design banking dashboard wireframes', type: 'task' },
      { id: 'act3', date: '2026-04-08', text: 'Submitted leave request (Apr 11–13)', type: 'leave' },
      { id: 'act4', date: '2026-04-07', text: 'Updated profile information', type: 'profile' },
      { id: 'act5', date: '2026-04-05', text: 'Received spot award from manager', type: 'reward' },
      { id: 'act6', date: '2026-04-03', text: 'Completed code review for PR #847', type: 'task' },
    ];
  }, [employee]);

  // Timeline mock data
  const timelineItems = useMemo((): TimelineItemType[] => {
    if (!employee) return [];
    return [
      {
        id: 'tl1',
        icon: FolderPlus,
        title: 'Assigned to NexaBank Digital Transformation',
        description: 'Joined as lead UI/UX designer for the banking dashboard module',
        timestamp: '2025-11-20',
        accentColor: '#60a5fa',
      },
      {
        id: 'tl2',
        icon: Award,
        title: 'Q1 Performance Review — Rating: 4.2/5',
        description: 'Exceeded KPI targets. Promoted to Senior UI/UX Designer.',
        timestamp: '2026-01-15',
        accentColor: '#34d399',
      },
      {
        id: 'tl3',
        icon: UserCircle,
        title: 'Status changed: Probation → Active',
        description: 'Successfully completed 6-month probation period with excellent ratings',
        timestamp: '2025-12-01',
        accentColor: '#a78bfa',
      },
      {
        id: 'tl4',
        icon: FolderPlus,
        title: 'Assigned to TravelWise Booking Engine',
        description: 'Onboarded as design lead for the new travel platform project',
        timestamp: '2026-04-01',
        accentColor: '#60a5fa',
      },
      {
        id: 'tl5',
        icon: CalendarClock,
        title: 'Leave Approved: Apr 11–13 (Casual Leave)',
        description: '3-day casual leave approved by manager for personal work',
        timestamp: '2026-04-08',
        accentColor: '#fbbf24',
      },
      {
        id: 'tl6',
        icon: Award,
        title: 'Q4 2025 Performance Review — Rating: 3.8/5',
        description: 'Consistent delivery, good client feedback. Area for improvement: estimation accuracy.',
        timestamp: '2025-10-15',
        accentColor: '#34d399',
      },
      {
        id: 'tl7',
        icon: UserCircle,
        title: 'Status changed: On Leave → Active',
        description: 'Returned from 5-day earned leave',
        timestamp: '2025-09-10',
        accentColor: '#a78bfa',
      },
      {
        id: 'tl8',
        icon: FolderPlus,
        title: 'Assigned to EduSpark LMS Platform',
        description: 'Contributed to course builder and assessment engine UI design',
        timestamp: '2025-08-15',
        accentColor: '#60a5fa',
      },
    ];
  }, [employee]);

  const handleAddNote = () => {
    if (!quickNote.trim()) return;
    const newNote: Note = {
      id: `n-${Date.now()}`,
      author: 'Current User',
      content: quickNote.trim(),
      timestamp: new Date().toLocaleString('en-IN', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }),
      type: 'quick',
    };
    setNotes((prev) => [newNote, ...prev]);
    setQuickNote('');
  };

  // ---- Not found state ----
  if (!employee) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--app-elevated)' }}
      >
        <div className="text-center space-y-3">
          <UserCircle
            className="w-12 h-12 mx-auto"
            style={{ color: 'var(--app-text-muted)' }}
          />
          <p style={{ color: 'var(--app-text-secondary)' }}>
            Employee not found
          </p>
          <button onClick={goBack} className="app-btn-ghost gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  // ---- Tabs config ----
  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: 'Overview', icon: UserCircle },
    { key: 'attendance', label: 'Attendance', icon: Clock },
    { key: 'leaves', label: 'Leaves', icon: Calendar },
    { key: 'payroll', label: 'Payroll', icon: CreditCard },
    { key: 'assets', label: 'Assets', icon: Laptop },
    { key: 'activity', label: 'Activity', icon: Activity },
    { key: 'timeline', label: 'Timeline', icon: FileText },
    { key: 'notes', label: 'Notes', icon: StickyNote },
  ];

  // ---- Productivity color ----
  const prodColor =
    employee.productivityScore >= 85
      ? 'var(--app-success)'
      : employee.productivityScore >= 70
        ? 'var(--app-warning)'
        : 'var(--app-danger)';

  // ---- Quick actions config ----
  const quickActions = [
    { label: 'Assign to Project', icon: FolderPlus, color: '#60a5fa', bg: 'var(--app-info-bg)' },
    { label: 'Give Bonus', icon: DollarIcon, color: '#34d399', bg: 'var(--app-success-bg)' },
    { label: 'Send Message', icon: MessageSquare, color: '#a78bfa', bg: 'var(--app-purple-light)' },
    { label: 'Schedule Review', icon: CalendarPlus, color: '#fbbf24', bg: 'var(--app-warning-bg)' },
  ];

  return (
    <PageShell title={employee.name} icon={Users} padded={false} headerRight={
      <StatusBadge status={formatStatusLabel(employee.status)} variant="pill" />
    }>
      <div className="p-6 space-y-6">
        {/* ---- Back Button ---- */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button onClick={goBack} className="app-btn-ghost gap-2 -ml-2 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </motion.div>

        {/* ---- Header Card ---- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
        >
          <div className="app-card p-6">
            <div className="flex flex-col sm:flex-row gap-5">
              <Avatar className="h-20 w-20 shrink-0">
                <AvatarFallback
                  className="text-2xl font-bold"
                  style={{
                    backgroundColor: 'var(--app-accent)',
                    color: '#ffffff',
                  }}
                >
                  {employee.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm mb-3" style={{ color: 'var(--app-text-secondary)' }}>
                  {employee.designation} · {employee.department}
                </p>
                <div className="flex items-center gap-3">
                  <button className="app-btn-ghost gap-2 text-xs">
                    <Pencil className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---- Quick Stats ---- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Projects', value: employee.activeProjects, icon: FolderKanban, color: 'var(--app-accent)' },
            { label: 'Productivity Score', value: `${employee.productivityScore}%`, icon: BarChart3, color: prodColor },
            { label: 'Salary Band', value: employee.salaryBand, icon: DollarSign, color: 'var(--app-text)' },
            { label: 'Join Date', value: formatDate(employee.joinDate), icon: Calendar, color: 'var(--app-info)' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.08 + i * 0.04,
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <OpsCard hoverable className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: 'var(--app-text-muted)' }}>
                    {stat.label}
                  </span>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--app-hover-bg)' }}>
                    <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                  </div>
                </div>
                <p className="text-lg font-bold truncate" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </OpsCard>
            </motion.div>
          ))}
        </div>

        {/* ---- Tabs ---- */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabKey)}
          className="w-full"
        >
          <TabsList
            className="w-full flex overflow-x-auto gap-1 p-1 rounded-xl h-auto"
            style={{ backgroundColor: 'var(--app-hover-bg)' }}
          >
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors data-[state=active]:text-white data-[state=active]:shadow-sm"
                style={{
                  backgroundColor:
                    activeTab === tab.key ? 'var(--app-hover-bg)' : 'transparent',
                  color:
                    activeTab === tab.key ? 'var(--app-text)' : 'var(--app-text-muted)',
                }}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ---- Overview Tab ---- */}
          <TabsContent value="overview" className="mt-5 space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left column — Personal Info + Contact + Performance */}
              <div className="lg:col-span-2 space-y-5">
                {/* Personal Info */}
                <div className="app-card p-5 space-y-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--app-text)' }}>
                    <UserCircle className="w-4 h-4" style={{ color: 'var(--app-accent)' }} />
                    Personal Information
                  </h3>
                  <Separator style={{ backgroundColor: 'var(--app-border)' }} />
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Full Name', value: employee.name },
                      { label: 'Employee ID', value: employee.id.toUpperCase() },
                      { label: 'Department', value: employee.department },
                      { label: 'Designation', value: employee.designation },
                      { label: 'Manager', value: employee.manager },
                      { label: 'Join Date', value: formatDate(employee.joinDate) },
                      { label: 'Status', value: formatStatusLabel(employee.status) },
                      { label: 'Salary Band', value: employee.salaryBand },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="text-[11px] mb-0.5" style={{ color: 'var(--app-text-muted)' }}>
                          {item.label}
                        </p>
                        <p className="text-sm font-medium" style={{ color: 'var(--app-text-secondary)' }}>
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info + Performance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Contact Info */}
                  <div className="app-card p-5 space-y-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--app-text)' }}>
                      <Mail className="w-4 h-4" style={{ color: 'var(--app-accent)' }} />
                      Contact Information
                    </h3>
                    <Separator style={{ backgroundColor: 'var(--app-border)' }} />
                    <div className="space-y-4">
                      {[
                        { icon: Mail, label: 'Email', value: employee.email },
                        { icon: Phone, label: 'Phone', value: employee.phone },
                        { icon: Briefcase, label: 'Department', value: employee.department },
                      ].map((item) => (
                        <div key={item.label} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'var(--app-hover-bg)' }}>
                            <item.icon className="w-4 h-4" style={{ color: 'var(--app-text-muted)' }} />
                          </div>
                          <div>
                            <p className="text-[11px]" style={{ color: 'var(--app-text-muted)' }}>{item.label}</p>
                            <p className="text-sm font-medium" style={{ color: 'var(--app-text-secondary)' }}>{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="app-card p-5 space-y-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--app-text)' }}>
                      <BarChart3 className="w-4 h-4" style={{ color: 'var(--app-accent)' }} />
                      Performance
                    </h3>
                    <Separator style={{ backgroundColor: 'var(--app-border)' }} />
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs" style={{ color: 'var(--app-text-muted)' }}>Productivity Score</span>
                        <span className="text-xs font-bold" style={{ color: prodColor }}>{employee.productivityScore}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--app-hover-bg)' }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${employee.productivityScore}%`, backgroundColor: prodColor }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--app-hover-bg)', border: '1px solid var(--app-border)' }}>
                        <p className="text-[10px] mb-1" style={{ color: 'var(--app-text-muted)' }}>SLA Score</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--app-info)' }}>96%</p>
                      </div>
                      <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--app-hover-bg)', border: '1px solid var(--app-border)' }}>
                        <p className="text-[10px] mb-1" style={{ color: 'var(--app-text-muted)' }}>Task Completion</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--app-success)' }}>95%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Assignments */}
                <div className="app-card p-5 space-y-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--app-text)' }}>
                    <FolderKanban className="w-4 h-4" style={{ color: 'var(--app-accent)' }} />
                    Project Assignments
                  </h3>
                  <Separator style={{ backgroundColor: 'var(--app-border)' }} />
                  {employee.activeProjects > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[1, 2].slice(0, employee.activeProjects).map((i) => {
                        const projectNames: Record<number, { name: string; progress: number }> = {
                          1: { name: 'NexaBank Digital Transformation', progress: 82 },
                          2: { name: 'ShopVerse E-Commerce Platform', progress: 68 },
                          3: { name: 'MediCare Patient Portal', progress: 90 },
                          4: { name: 'FinEdge Trading Platform', progress: 75 },
                        };
                        const proj = projectNames[i] || { name: `Project ${i}`, progress: 0 };
                        return (
                          <div
                            key={i}
                            className="rounded-xl p-3 space-y-2"
                            style={{
                              backgroundColor: 'var(--app-hover-bg)',
                              border: '1px solid var(--app-border)',
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium truncate" style={{ color: 'var(--app-text)' }}>
                                {proj.name}
                              </span>
                              <span className="text-xs font-bold" style={{ color: 'var(--app-info)' }}>
                                {proj.progress}%
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--app-hover-bg)' }}>
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${proj.progress}%`, backgroundColor: 'var(--app-accent)' }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-center py-6" style={{ color: 'var(--app-text-muted)' }}>
                      No active project assignments
                    </p>
                  )}
                </div>
              </div>

              {/* Right column — Quick Actions Panel */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  className="lg:sticky lg:top-6 space-y-5"
                >
                  {/* Quick Actions */}
                  <div className="app-card p-5 space-y-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--app-text)' }}>
                      <Zap className="w-4 h-4" style={{ color: 'var(--app-accent)' }} />
                      Quick Actions
                    </h3>
                    <Separator style={{ backgroundColor: 'var(--app-border)' }} />
                    <div className="space-y-2">
                      {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <motion.button
                            key={action.label}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3 w-full p-3 rounded-xl text-left transition-colors cursor-pointer"
                            style={{
                              backgroundColor: 'transparent',
                              border: '1px solid var(--app-border)',
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.backgroundColor = action.bg;
                              (e.currentTarget as HTMLElement).style.borderColor = `${action.color}30`;
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                              (e.currentTarget as HTMLElement).style.borderColor = 'var(--app-border)';
                            }}
                          >
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                              style={{ backgroundColor: action.bg }}
                            >
                              <Icon className="w-4 h-4" style={{ color: action.color }} />
                            </div>
                            <span className="text-sm font-medium" style={{ color: 'var(--app-text-secondary)' }}>
                              {action.label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Manager Info */}
                  <div className="app-card p-5 space-y-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--app-text)' }}>
                      <UserCircle className="w-4 h-4" style={{ color: 'var(--app-accent)' }} />
                      Reporting To
                    </h3>
                    <Separator style={{ backgroundColor: 'var(--app-border)' }} />
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback
                          className="text-xs font-semibold"
                          style={{ backgroundColor: 'var(--app-accent-light)', color: 'var(--app-accent)' }}
                        >
                          {employee.manager.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--app-text)' }}>
                          {employee.manager}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                          Direct Manager
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </TabsContent>

          {/* ---- Attendance Tab ---- */}
          <TabsContent value="attendance" className="mt-5">
            <div className="app-card overflow-hidden !p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--app-border)' }}>
                      {['Date', 'Check In', 'Check Out', 'Hours', 'Status'].map((h) => (
                        <th
                          key={h}
                          className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--app-text-muted)' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {employeeAttendance.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="h-32 text-center text-sm" style={{ color: 'var(--app-text-muted)' }}>
                          No attendance records found
                        </td>
                      </tr>
                    ) : (
                      employeeAttendance.map((record) => (
                        <tr key={record.id} style={{ borderBottom: '1px solid var(--app-border)' }}>
                          <td className="px-5 py-3 text-sm" style={{ color: 'var(--app-text-secondary)' }}>
                            {formatDate(record.date)}
                          </td>
                          <td className="px-5 py-3 text-sm" style={{ color: 'var(--app-text-secondary)' }}>
                            {record.checkIn || '—'}
                          </td>
                          <td className="px-5 py-3 text-sm" style={{ color: 'var(--app-text-secondary)' }}>
                            {record.checkOut || '—'}
                          </td>
                          <td className="px-5 py-3 text-sm font-medium" style={{ color: 'var(--app-text)' }}>
                            {record.hours > 0 ? `${record.hours}h` : '—'}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: getAttendanceStatusColor(record.status) }}
                              />
                              <span
                                className="text-sm capitalize"
                                style={{ color: getAttendanceStatusColor(record.status) }}
                              >
                                {record.status.replace('-', ' ')}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* ---- Leaves Tab ---- */}
          <TabsContent value="leaves" className="mt-5">
            <div className="app-card overflow-hidden !p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--app-border)' }}>
                      {['Type', 'Period', 'Days', 'Reason', 'Status'].map((h) => (
                        <th
                          key={h}
                          className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--app-text-muted)' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {employeeLeaves.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="h-32 text-center text-sm" style={{ color: 'var(--app-text-muted)' }}>
                          No leave requests found
                        </td>
                      </tr>
                    ) : (
                      employeeLeaves.map((leave) => (
                        <tr key={leave.id} style={{ borderBottom: '1px solid var(--app-border)' }}>
                          <td className="px-5 py-3 text-sm font-medium capitalize" style={{ color: 'var(--app-text)' }}>
                            {leave.type.replace('-', ' ')}
                          </td>
                          <td className="px-5 py-3 text-sm" style={{ color: 'var(--app-text-secondary)' }}>
                            {leave.startDate} — {leave.endDate}
                          </td>
                          <td className="px-5 py-3 text-sm font-medium" style={{ color: 'var(--app-text)' }}>
                            {leave.days}
                          </td>
                          <td className="px-5 py-3 text-sm max-w-[200px] truncate" style={{ color: 'var(--app-text-muted)' }}>
                            {leave.reason}
                          </td>
                          <td className="px-5 py-3">
                            <StatusBadge status={leave.status} variant="pill" />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* ---- Payroll Tab ---- */}
          <TabsContent value="payroll" className="mt-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>
                Recent Payslips
              </h3>
              <button className="app-btn-primary gap-2 text-xs">
                <Download className="w-3.5 h-3.5" /> Download Payslip
              </button>
            </div>
            <div className="app-card overflow-hidden !p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--app-border)' }}>
                      {['Month', 'Base Salary', 'Incentives', 'Deductions', 'Net Pay', 'Status'].map((h) => (
                        <th
                          key={h}
                          className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--app-text-muted)' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {employeePayroll.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="h-32 text-center text-sm" style={{ color: 'var(--app-text-muted)' }}>
                          No payroll records found
                        </td>
                      </tr>
                    ) : (
                      employeePayroll.map((record) => (
                        <tr key={record.id} style={{ borderBottom: '1px solid var(--app-border)' }}>
                          <td className="px-5 py-3 text-sm font-medium" style={{ color: 'var(--app-text)' }}>
                            {formatMonth(record.month)}
                          </td>
                          <td className="px-5 py-3 text-sm" style={{ color: 'var(--app-text-secondary)' }}>
                            {formatCurrency(record.baseSalary)}
                          </td>
                          <td className="px-5 py-3 text-sm" style={{ color: 'var(--app-success)' }}>
                            +{formatCurrency(record.incentives)}
                          </td>
                          <td className="px-5 py-3 text-sm" style={{ color: 'var(--app-danger)' }}>
                            -{formatCurrency(record.deductions)}
                          </td>
                          <td className="px-5 py-3 text-sm font-bold" style={{ color: 'var(--app-text)' }}>
                            {formatCurrency(record.netPay)}
                          </td>
                          <td className="px-5 py-3">
                            <StatusBadge status={record.status} variant="pill" />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* ---- Assets Tab ---- */}
          <TabsContent value="assets" className="mt-5">
            {employeeAssets.length === 0 ? (
              <div className="app-card p-12 text-center">
                <Package className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--app-text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
                  No assets assigned to this employee
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {employeeAssets.map((asset) => (
                  <OpsCard key={asset.id} hoverable className="p-5">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: 'var(--app-accent-light)' }}
                      >
                        <Laptop className="w-5 h-5" style={{ color: 'var(--app-accent)' }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--app-text)' }}>
                          {asset.name}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--app-text-muted)' }}>
                          {asset.type} · {asset.serialNo}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: getAssetStatusColor(asset.status) }}
                          />
                          <span className="text-xs capitalize font-medium" style={{ color: getAssetStatusColor(asset.status) }}>
                            {asset.status.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="mt-3 pt-3 space-y-1" style={{ borderTop: '1px solid var(--app-border)' }}>
                          <p className="text-[11px]" style={{ color: 'var(--app-text-muted)' }}>
                            Purchase: {formatDate(asset.purchaseDate)}
                          </p>
                          <p className="text-[11px]" style={{ color: 'var(--app-text-muted)' }}>
                            Warranty: {formatDate(asset.warrantyEnd)}
                          </p>
                          <p className="text-[11px] font-medium" style={{ color: 'var(--app-text-secondary)' }}>
                            Cost: {formatCurrency(asset.purchaseCost)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </OpsCard>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ---- Activity Tab ---- */}
          <TabsContent value="activity" className="mt-5">
            <div className="app-card p-5">
              <div className="space-y-0">
                {activities.length === 0 ? (
                  <p className="text-sm text-center py-6" style={{ color: 'var(--app-text-muted)' }}>
                    No activity recorded
                  </p>
                ) : (
                  activities.map((item, idx) => (
                    <div key={item.id}>
                      <div className="flex items-start gap-3 py-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: 'var(--app-accent-light)' }}
                        >
                          <Activity className="w-4 h-4" style={{ color: 'var(--app-accent)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm" style={{ color: 'var(--app-text-secondary)' }}>
                            {item.text}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--app-text-muted)' }}>
                            {formatDate(item.date)}
                          </p>
                        </div>
                      </div>
                      {idx < activities.length - 1 && (
                        <div
                          className="ml-4 h-px"
                          style={{
                            backgroundColor: 'var(--app-border)',
                            width: 'calc(100% - 2rem)',
                            marginLeft: '2rem',
                          }}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* ---- Timeline Tab ---- */}
          <TabsContent value="timeline" className="mt-5">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="app-card p-5"
            >
              <div className="flex items-center gap-2 mb-5">
                <FileText className="w-4 h-4" style={{ color: 'var(--app-accent)' }} />
                <h3 className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>
                  Employee Timeline
                </h3>
                <div className="ml-auto flex items-center gap-3">
                  {[
                    { label: 'Project', color: '#60a5fa' },
                    { label: 'Review', color: '#34d399' },
                    { label: 'Status', color: '#a78bfa' },
                    { label: 'Leave', color: '#fbbf24' },
                  ].map((legend) => (
                    <div key={legend.label} className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: legend.color }}
                      />
                      <span className="text-[10px]" style={{ color: 'var(--app-text-muted)' }}>
                        {legend.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <Timeline items={timelineItems} />
            </motion.div>
          </TabsContent>

          {/* ---- Notes Tab ---- */}
          <TabsContent value="notes" className="mt-5">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              {/* Quick Note Input */}
              <div className="app-card p-5 space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--app-text)' }}>
                  <Plus className="w-4 h-4" style={{ color: 'var(--app-accent)' }} />
                  Add a Note
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={quickNote}
                    onChange={(e) => setQuickNote(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddNote();
                    }}
                    placeholder="Type a quick note about this employee..."
                    className="app-input flex-1 px-3 py-2 text-sm"
                    style={{
                      backgroundColor: 'var(--app-hover-bg)',
                      border: '1px solid var(--app-border)',
                      color: 'var(--app-text)',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLElement).style.borderColor = 'var(--app-accent)';
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLElement).style.borderColor = 'var(--app-border)';
                    }}
                  />
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddNote}
                    className="app-btn-primary gap-2 text-xs px-4 shrink-0"
                    disabled={!quickNote.trim()}
                    style={{
                      opacity: quickNote.trim() ? 1 : 0.5,
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Note
                  </motion.button>
                </div>
              </div>

              {/* Manager Notes */}
              <div className="app-card p-5 space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--app-text)' }}>
                  <Pencil className="w-4 h-4" style={{ color: 'var(--app-accent)' }} />
                  Manager Notes
                </h3>
                <Separator style={{ backgroundColor: 'var(--app-border)' }} />
                <textarea
                  value={managerNotes}
                  onChange={(e) => setManagerNotes(e.target.value)}
                  placeholder="Add private manager notes about this employee..."
                  rows={4}
                  className="app-input w-full px-3 py-2 text-sm resize-none"
                  style={{
                    backgroundColor: 'var(--app-hover-bg)',
                    border: '1px solid var(--app-border)',
                    color: 'var(--app-text)',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLElement).style.borderColor = 'var(--app-accent)';
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLElement).style.borderColor = 'var(--app-border)';
                  }}
                />
                <div className="flex justify-end">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="app-btn-ghost gap-2 text-xs px-3"
                    style={{ border: '1px solid var(--app-border)' }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Save Notes
                  </motion.button>
                </div>
              </div>

              {/* Notes List */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 px-1" style={{ color: 'var(--app-text)' }}>
                  <StickyNote className="w-4 h-4" style={{ color: 'var(--app-accent)' }} />
                  All Notes
                  <span
                    className="app-badge text-[10px]"
                    style={{ backgroundColor: 'var(--app-accent-light)', color: 'var(--app-accent)' }}
                  >
                    {notes.length}
                  </span>
                </h3>
                <AnimatePresence>
                  {notes.map((note, idx) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ delay: idx * 0.04, duration: 0.2 }}
                    >
                      <div
                        className="app-card p-4 space-y-2"
                        style={{
                          borderLeft: `3px solid ${
                            note.type === 'manager' ? 'var(--app-accent)' : 'var(--app-hover-bg)'
                          }`,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback
                                className="text-[9px] font-semibold"
                                style={{
                                  backgroundColor: note.type === 'manager'
                                    ? 'var(--app-accent-light)'
                                    : 'var(--app-hover-bg)',
                                  color: note.type === 'manager'
                                    ? 'var(--app-accent)'
                                    : 'var(--app-text-muted)',
                                }}
                              >
                                {note.author.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-semibold" style={{ color: 'var(--app-text)' }}>
                              {note.author}
                            </span>
                            {note.type === 'manager' && (
                              <span
                                className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: 'var(--app-accent-light)',
                                  color: 'var(--app-accent)',
                                }}
                              >
                                Manager
                              </span>
                            )}
                          </div>
                          <span className="text-[10px]" style={{ color: 'var(--app-text-muted)' }}>
                            {note.timestamp}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--app-text-secondary)' }}>
                          {note.content}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}

export default memo(EmployeeDetailPageInner);


