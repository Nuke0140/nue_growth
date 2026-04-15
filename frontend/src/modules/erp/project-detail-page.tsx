'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  ArrowLeft, FolderKanban, Calendar, User, Target, CheckCircle2, Circle,
  FileText, DollarSign, Clock, AlertTriangle, Brain, TrendingUp, Shield,
  ChevronRight, MessageSquare, File, ThumbsUp, Package, GitBranch,
  Zap, Sparkles, Lightbulb, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { mockProjects, mockTasks } from '@/modules/erp/data/mock-data';
import { useErpStore } from '@/modules/erp/erp-store';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
  return `₹${num}`;
}

type DetailTab = 'milestones' | 'deliverables' | 'tasks' | 'files' | 'approvals' | 'comments';

const tabs: { key: DetailTab; label: string; icon: React.ElementType }[] = [
  { key: 'milestones', label: 'Milestones', icon: Target },
  { key: 'deliverables', label: 'Deliverables', icon: Package },
  { key: 'tasks', label: 'Tasks', icon: GitBranch },
  { key: 'files', label: 'Files', icon: File },
  { key: 'approvals', label: 'Approvals', icon: ThumbsUp },
  { key: 'comments', label: 'Comments', icon: MessageSquare },
];

const aiInsights = [
  { icon: Clock, title: 'Timeline Delay Risk', severity: 'amber' as const, description: 'UAT Sign-off milestone is behind schedule by 12 days. Recommend accelerating testing phase to meet Aug 15 deadline.', confidence: 87, color: 'border-amber-500/40', bg: 'bg-amber-500/5', dotColor: 'bg-amber-500', textColor: 'text-amber-400' },
  { icon: DollarSign, title: 'Budget Overrun Risk', severity: 'red' as const, description: 'Current spend rate projects ₹22.4L over budget. Actual ₹19.8L vs Budget ₹24L. 3 months remaining with 18% work left.', confidence: 92, color: 'border-red-500/40', bg: 'bg-red-500/5', dotColor: 'bg-red-500', textColor: 'text-red-400' },
  { icon: TrendingUp, title: 'Margin Risk', severity: 'orange' as const, description: 'Profitability dropped from 22% to 18.5% due to additional scope requests. Consider change order for Phase 3 features.', confidence: 78, color: 'border-orange-500/40', bg: 'bg-orange-500/5', dotColor: 'bg-orange-500', textColor: 'text-orange-400' },
  { icon: User, title: 'Resource Allocation', severity: 'blue' as const, description: 'Nikhil Das at 100% allocation across 2 projects. Consider redistributing work to Karthik for API gateway tasks.', confidence: 84, color: 'border-blue-500/40', bg: 'bg-blue-500/5', dotColor: 'bg-blue-500', textColor: 'text-blue-400' },
  { icon: AlertTriangle, title: 'Client Escalation Risk', severity: 'red' as const, description: '3 missed internal deadlines in last sprint. SLA dropped from 97% to 95%. NexaBank PM has flagged concern in last review.', confidence: 73, color: 'border-red-500/40', bg: 'bg-red-500/5', dotColor: 'bg-red-500', textColor: 'text-red-400' },
];

export default function ProjectDetailPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const selectedProjectId = useErpStore((s) => s.selectedProjectId);
  const goBack = useErpStore((s) => s.goBack);
  const [activeTab, setActiveTab] = useState<DetailTab>('milestones');

  const project = useMemo(() => mockProjects.find(p => p.id === selectedProjectId), [selectedProjectId]);
  const projectTasks = useMemo(() => mockTasks.filter(t => t.projectId === selectedProjectId), [selectedProjectId]);

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-3">
          <FolderKanban className={cn('w-12 h-12 mx-auto', isDark ? 'text-white/10' : 'text-black/10')} />
          <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>No project selected</p>
          <Button variant="ghost" onClick={goBack} className={cn(isDark ? 'text-white/50' : 'text-black/50')}>Go Back</Button>
        </div>
      </div>
    );
  }

  const margin = project.budget > 0 ? Math.round(((project.budget - project.actualSpend) / project.budget) * 100) : 0;
  const spentPct = project.budget > 0 ? Math.round((project.actualSpend / project.budget) * 100) : 0;

  const completedMilestones = project.milestones.filter(m => m.completed).length;
  const totalMilestones = project.milestones.length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <Button variant="ghost" size="sm" onClick={goBack} className={cn('gap-1.5 -ml-2 mb-4', isDark ? 'text-white/50 hover:text-white/80 hover:bg-white/[0.06]' : 'text-black/50 hover:text-black/80 hover:bg-black/[0.06]')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
        </motion.div>

        <div className="flex gap-6">
          {/* Left Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="w-80 shrink-0 space-y-4 hidden lg:block"
          >
            {/* Project Info Card */}
            <div className={cn('rounded-2xl border p-5 space-y-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FolderKanban className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                  <span className={cn('text-[10px] font-medium uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Project</span>
                </div>
                <h2 className="text-base font-bold leading-tight">{project.name}</h2>
                <p className={cn('text-xs mt-1', isDark ? 'text-white/40' : 'text-black/40')}>{project.client}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className={cn('rounded-xl p-3', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]')}>
                  <p className={cn('text-[10px] uppercase tracking-wider mb-1', isDark ? 'text-white/30' : 'text-black/30')}>Owner</p>
                  <div className="flex items-center gap-1.5">
                    <Avatar className="h-5 w-5"><AvatarFallback className="text-[9px] font-semibold bg-sky-500/15 text-sky-400">{project.accountManager.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                    <span className="text-xs font-medium">{project.accountManager.split(' ')[0]}</span>
                  </div>
                </div>
                <div className={cn('rounded-xl p-3', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]')}>
                  <p className={cn('text-[10px] uppercase tracking-wider mb-1', isDark ? 'text-white/30' : 'text-black/30')}>Status</p>
                  <Badge className={cn('text-[10px] font-medium capitalize border', isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200')}>{project.status}</Badge>
                </div>
                <div className={cn('rounded-xl p-3', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]')}>
                  <p className={cn('text-[10px] uppercase tracking-wider mb-1', isDark ? 'text-white/30' : 'text-black/30')}>SLA</p>
                  <span className={cn('text-sm font-bold', project.sla >= 90 ? 'text-emerald-400' : 'text-amber-400')}>{project.sla}%</span>
                </div>
                <div className={cn('rounded-xl p-3', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]')}>
                  <p className={cn('text-[10px] uppercase tracking-wider mb-1', isDark ? 'text-white/30' : 'text-black/30')}>Due Date</p>
                  <span className="text-xs font-medium">{new Date(project.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Budget Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Budget Utilization</p>
                  <span className="text-xs font-medium">{formatINR(project.actualSpend)} / {formatINR(project.budget)}</span>
                </div>
                <div className={cn('h-2 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(spentPct, 100)}%` }}
                    transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('h-full rounded-full', spentPct > 90 ? 'bg-red-500' : spentPct > 70 ? 'bg-amber-500' : 'bg-emerald-500')}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>{spentPct}% spent</span>
                  <span className={cn('text-[10px]', margin >= 0 ? 'text-emerald-400' : 'text-red-400')}>Margin: {margin}%</span>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Overall Progress</p>
                  <span className="text-sm font-bold">{project.progress}%</span>
                </div>
                <div className={cn('h-2 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
              <div className="flex items-center justify-between mb-4">
                <p className={cn('text-xs font-semibold', isDark ? 'text-white/60' : 'text-black/60')}>Milestones</p>
                <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{completedMilestones}/{totalMilestones}</span>
              </div>
              <div className="space-y-3">
                {project.milestones.map((ms, i) => (
                  <div key={ms.id} className="flex items-start gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                    >
                      {ms.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      ) : (
                        <Circle className={cn('w-4 h-4 mt-0.5 shrink-0', isDark ? 'text-white/20' : 'text-black/20')} />
                      )}
                    </motion.div>
                    <div className="min-w-0">
                      <p className={cn('text-xs font-medium', ms.completed ? '' : (isDark ? 'text-white/60' : 'text-black/60'))}>{ms.title}</p>
                      <p className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>{new Date(ms.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Linked Invoices */}
            {project.linkedInvoices.length > 0 && (
              <div className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
                <p className={cn('text-xs font-semibold mb-3', isDark ? 'text-white/60' : 'text-black/60')}>Linked Invoices</p>
                <div className="space-y-2">
                  {project.linkedInvoices.map((inv) => (
                    <div key={inv} className={cn('flex items-center gap-2 p-2 rounded-lg', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]')}>
                      <FileText className={cn('w-3.5 h-3.5 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
                      <span className="text-xs font-medium">{inv}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Center Panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex-1 min-w-0 space-y-4"
          >
            {/* Tabs */}
            <div className={cn('rounded-2xl border p-1.5 flex items-center gap-1 overflow-x-auto', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap',
                      isActive
                        ? isDark ? 'bg-white/[0.08] text-white shadow-sm' : 'bg-black/[0.06] text-black shadow-sm'
                        : isDark ? 'text-white/40 hover:text-white/60' : 'text-black/40 hover:text-black/60'
                    )}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
              {activeTab === 'milestones' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Project Milestones</h3>
                  <div className="relative space-y-0">
                    {project.milestones.map((ms, i) => (
                      <div key={ms.id} className="flex gap-4 pb-6 relative">
                        {i < project.milestones.length - 1 && (
                          <div className={cn('absolute left-[11px] top-6 w-px h-full', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')} />
                        )}
                        <div className={cn('w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5', ms.completed ? 'bg-emerald-500' : (isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]'))}>
                          {ms.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div className={cn('flex-1 rounded-xl p-4', isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]')}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium">{ms.title}</p>
                            <Badge className={cn('text-[9px] border', ms.completed ? (isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200') : (isDark ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200'))}>
                              {ms.completed ? 'Completed' : 'Pending'}
                            </Badge>
                          </div>
                          <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Due: {new Date(ms.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'deliverables' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Deliverables</h3>
                  {project.deliverables.map((d, i) => (
                    <motion.div
                      key={d}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn('flex items-center gap-3 p-3 rounded-xl', isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]')}
                    >
                      <Package className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
                      <span className="text-sm">{d}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Tasks</h3>
                    <Badge variant="secondary" className={cn('text-[10px]', isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50')}>{projectTasks.length} tasks</Badge>
                  </div>
                  {projectTasks.length === 0 ? (
                    <p className={cn('text-xs text-center py-8', isDark ? 'text-white/30' : 'text-black/30')}>No tasks linked to this project</p>
                  ) : (
                    projectTasks.map((task, i) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={cn('flex items-center gap-3 p-3 rounded-xl', isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]')}
                      >
                        <div className={cn('w-2 h-2 rounded-full shrink-0', task.isBlocked ? 'bg-red-500' : task.stage === 'done' ? 'bg-emerald-500' : 'bg-blue-500')} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{task.title}</p>
                          <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{task.assignee} · {task.storyPoints} pts</p>
                        </div>
                        <Badge className={cn('text-[9px] capitalize border shrink-0', isDark ? 'bg-white/[0.06] text-white/50 border-white/[0.08]' : 'bg-black/[0.04] text-black/50 border-black/[0.08]')}>{task.stage}</Badge>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'files' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Project Files</h3>
                  {['Project Proposal.pdf', 'SOW_Contract.pdf', 'Architecture_Diagram.png', 'API_Documentation.md', 'Sprint_Retro_Mar26.pdf'].map((f, i) => (
                    <motion.div
                      key={f}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn('flex items-center gap-3 p-3 rounded-xl', isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]')}
                    >
                      <File className={cn('w-4 h-4 shrink-0', f.endsWith('.pdf') ? 'text-red-400' : f.endsWith('.png') ? 'text-blue-400' : 'text-emerald-400')} />
                      <span className="text-sm flex-1">{f}</span>
                      <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>2.4 MB</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'approvals' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Pending Approvals</h3>
                  {[
                    { title: 'Q2 Milestone Invoice Approval', status: 'pending', by: 'Arjun Mehta' },
                    { title: 'Additional Dev Resources Budget', status: 'pending', by: 'CTO' },
                  ].map((a, i) => (
                    <motion.div
                      key={a.title}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn('flex items-center gap-3 p-3 rounded-xl', isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]')}
                    >
                      <ThumbsUp className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{a.title}</p>
                        <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Requested by {a.by}</p>
                      </div>
                      <Badge className={cn('text-[9px] border', isDark ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200')}>Pending</Badge>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Recent Comments</h3>
                  {[
                    { author: 'Arjun Mehta', text: 'API gateway migration completed ahead of schedule. Great work team!', time: '2 hours ago' },
                    { author: 'Nikhil Das', text: 'Risk module blocked — waiting on payment gateway integration from ShopVerse team.', time: '5 hours ago' },
                    { author: 'Priya Sharma', text: 'Client review meeting scheduled for next Thursday. Please prepare the demo.', time: '1 day ago' },
                  ].map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-3"
                    >
                      <Avatar className="h-7 w-7 shrink-0"><AvatarFallback className="text-[10px] font-semibold bg-sky-500/15 text-sky-400">{c.author.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold">{c.author}</span>
                          <span className={cn('text-[10px]', isDark ? 'text-white/20' : 'text-black/20')}>{c.time}</span>
                        </div>
                        <p className={cn('text-xs mt-0.5 leading-relaxed', isDark ? 'text-white/50' : 'text-black/50')}>{c.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Panel — AI Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="w-72 shrink-0 space-y-4 hidden xl:block"
          >
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-4 h-4 text-violet-400" />
              <span className={cn('text-xs font-semibold', isDark ? 'text-white/60' : 'text-black/60')}>AI Insights</span>
              <Sparkles className="w-3 h-3 text-violet-400" />
            </div>

            {aiInsights.map((insight, i) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className={cn(
                  'rounded-2xl border-2 border-l-4 p-4 space-y-3',
                  insight.color,
                  isDark ? 'bg-white/[0.01]' : 'bg-white'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center', insight.bg)}>
                      <insight.icon className={cn('w-3.5 h-3.5', insight.textColor)} />
                    </div>
                    <p className="text-xs font-semibold">{insight.title}</p>
                  </div>
                  <span className={cn('w-2 h-2 rounded-full', insight.dotColor)} />
                </div>
                <p className={cn('text-[11px] leading-relaxed', isDark ? 'text-white/45' : 'text-black/50')}>
                  {insight.description}
                </p>
                <div className="flex items-center gap-2">
                  <div className={cn('flex-1 h-1 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                    <div className={cn('h-full rounded-full', insight.dotColor)} style={{ width: `${insight.confidence}%` }} />
                  </div>
                  <span className={cn('text-[10px] font-medium', insight.textColor)}>{insight.confidence}%</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
