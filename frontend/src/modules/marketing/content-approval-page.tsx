'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ChevronRight, CheckCircle2, RotateCcw, XCircle, MessageSquare, Clock, Eye, GitBranch, Send, X, ArrowRight } from 'lucide-react';
import { mockContentItems } from '@/modules/marketing/data/mock-data';
import type { ContentItem, ApprovalStage } from '@/modules/marketing/types';

const PIPELINE_STAGES: { stage: ApprovalStage; label: string }[] = [
  { stage: 'draft', label: 'Draft' },
  { stage: 'in-review', label: 'Review' },
  { stage: 'manager-review', label: 'Manager' },
  { stage: 'client-review', label: 'Client' },
  { stage: 'approved', label: 'Approved' },
  { stage: 'published', label: 'Publish' },
  { stage: 'revision', label: 'Revision' },
];

const STAGE_COLORS: Record<ApprovalStage, string> = {
  'draft': '#6b7280',
  'in-review': '#3b82f6',
  'manager-review': '#f59e0b',
  'client-review': '#8b5cf6',
  'approved': '#10b981',
  'published': '#059669',
  'revision': '#ef4444',
};

const TYPE_COLORS: Record<string, string> = {
  'blog': '#3b82f6',
  'social-post': '#ec4899',
  'email': '#f59e0b',
  'ad-creative': '#8b5cf6',
  'landing-page': '#10b981',
  'video': '#ef4444',
};

export default function ContentApprovalPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<ApprovalStage | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = { all: mockContentItems.length };
    mockContentItems.forEach(item => {
      counts[item.stage] = (counts[item.stage] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return mockContentItems;
    return mockContentItems.filter(item => item.stage === activeTab);
  }, [activeTab]);

  const stageGroups = useMemo(() => {
    const groups: Record<string, ContentItem[]> = {};
    PIPELINE_STAGES.forEach(({ stage }) => {
      const items = mockContentItems.filter(item => item.stage === stage);
      if (items.length > 0) groups[stage] = items;
    });
    return groups;
  }, []);

  const completedStages = useMemo(() => {
    if (!selectedItem) return new Set<string>();
    const order = PIPELINE_STAGES.map(s => s.stage);
    const currentIdx = order.indexOf(selectedItem.stage);
    return new Set(order.slice(0, currentIdx + 1));
  }, [selectedItem]);

  const quickStats = useMemo(() => {
    const total = mockContentItems.length;
    const published = mockContentItems.filter(i => i.stage === 'published').length;
    const inReview = mockContentItems.filter(i => ['in-review', 'manager-review', 'client-review'].includes(i.stage)).length;
    const avgVersions = (mockContentItems.reduce((s, i) => s + i.version, 0) / total).toFixed(1);
    return [
      { label: 'Total Content', value: total.toString() },
      { label: 'Published', value: published.toString() },
      { label: 'In Review', value: inReview.toString() },
      { label: 'Avg. Versions', value: avgVersions },
    ];
  }, []);

  return (
    <div className="h-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isDark ? 'bg-blue-500/15' : 'bg-blue-50')}>
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h1 className={cn('text-xl font-semibold', 'text-[var(--app-text)]')}>Content Approval</h1>
            <p className={cn('text-sm', isDark ? 'text-white/50' : 'text-gray-500')}>Review, approve, and manage content pipeline</p>
          </div>
        </div>
      </motion.div>

      {/* Pipeline Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={cn('rounded-2xl border p-4 overflow-x-auto', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
      >
        <div className="flex items-center gap-1 min-w-[600px]">
          {PIPELINE_STAGES.map((stage, i) => (
            <div key={stage.stage} className="flex items-center gap-1 flex-1">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: STAGE_COLORS[stage.stage] }} />
                <span className={cn('text-xs font-medium truncate', 'text-[var(--app-text-secondary)]')}>{stage.label}</span>
                <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0', isDark ? 'bg-white/[0.06] text-white/40' : 'bg-gray-100 text-gray-500')}>
                  {stageCounts[stage.stage] || 0}
                </span>
              </div>
              {i < PIPELINE_STAGES.length - 1 && (
                <ChevronRight className={cn('w-3.5 h-3.5 shrink-0', isDark ? 'text-white/15' : 'text-gray-300')} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stage Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('all')}
          className={cn('px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
            activeTab === 'all'
              ? isDark ? 'bg-white/10 text-white' : 'bg-gray-900 text-white'
              : isDark ? 'text-white/50 hover:bg-white/[0.06]' : 'text-gray-500 hover:bg-gray-100'
          )}
        >
          All ({stageCounts.all})
        </button>
        {PIPELINE_STAGES.map(stage => (
          <button
            key={stage.stage}
            onClick={() => setActiveTab(stage.stage)}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5',
              activeTab === stage.stage
                ? 'text-white'
                : isDark ? 'text-white/50 hover:bg-white/[0.06]' : 'text-gray-500 hover:bg-gray-100'
            )}
            style={activeTab === stage.stage ? { backgroundColor: STAGE_COLORS[stage.stage] } : undefined}
          >
            {stage.label} ({stageCounts[stage.stage] || 0})
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Kanban Board */}
        <div className="flex-1 min-w-0">
          {activeTab === 'all' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(stageGroups).map(([stage, items]) => (
                <div key={stage}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STAGE_COLORS[stage as ApprovalStage] }} />
                    <span className={cn('text-xs font-medium', 'text-[var(--app-text-secondary)]')}>
                      {PIPELINE_STAGES.find(s => s.stage === stage)?.label}
                    </span>
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full', isDark ? 'bg-white/[0.06] text-white/40' : 'bg-gray-100 text-gray-500')}>{items.length}</span>
                  </div>
                  <div className="space-y-3">
                    {items.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        onClick={() => setSelectedItem(item)}
                        className={cn('rounded-xl border p-3 cursor-pointer transition-all hover:scale-[1.01]',
                          isDark ? 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]' : 'bg-white border-black/[0.06] hover:border-black/[0.12]',
                          selectedItem?.id === item.id && 'ring-2 ring-blue-500/40'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className={cn('text-sm font-medium line-clamp-1', 'text-[var(--app-text)]')}>{item.title}</h3>
                        </div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', isDark ? 'bg-white/[0.08] text-white/50' : 'bg-gray-100 text-gray-600')}
                            style={{ borderLeft: `2px solid ${TYPE_COLORS[item.type] || '#6b7280'}` }}>
                            {item.type}
                          </span>
                          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>v{item.version}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{item.author}</span>
                          <div className="flex items-center gap-2">
                            {item.comments.length > 0 && (
                              <div className="flex items-center gap-1">
                                <MessageSquare className={cn('w-3 h-3', 'text-[var(--app-text-muted)]')} />
                                <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{item.comments.length}</span>
                              </div>
                            )}
                            <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{item.createdAt}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setSelectedItem(item)}
                  className={cn('rounded-xl border p-4 cursor-pointer transition-all hover:scale-[1.005]',
                    isDark ? 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]' : 'bg-white border-black/[0.06] hover:border-black/[0.12]',
                    selectedItem?.id === item.id && 'ring-2 ring-blue-500/40'
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className={cn('text-sm font-medium mb-1', 'text-[var(--app-text)]')}>{item.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', isDark ? 'bg-white/[0.08] text-white/50' : 'bg-gray-100 text-gray-600')}
                          style={{ borderLeft: `2px solid ${TYPE_COLORS[item.type] || '#6b7280'}` }}>
                          {item.type}
                        </span>
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>by {item.author}</span>
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>v{item.version}</span>
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{item.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.comments.length > 0 && (
                        <div className="flex items-center gap-1">
                          <MessageSquare className={cn('w-3.5 h-3.5', 'text-[var(--app-text-muted)]')} />
                          <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>{item.comments.length}</span>
                        </div>
                      )}
                      <Eye className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={cn('w-80 shrink-0 rounded-2xl border p-4 space-y-4 self-start sticky top-6 max-h-[calc(100vh-12rem)] overflow-y-auto',
                'bg-[var(--app-card-bg)] border-[var(--app-border)]'
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Content Detail</h3>
                <button onClick={() => setSelectedItem(null)} className={cn('p-1 rounded-md', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-gray-100')}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Stage Progress */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {PIPELINE_STAGES.filter(s => s.stage !== 'revision').map((s, i) => (
                  <div key={s.stage} className="flex items-center gap-1 shrink-0">
                    <div className={cn('w-2 h-2 rounded-full', completedStages.has(s.stage) ? '' : isDark ? 'bg-white/10' : 'bg-gray-200')}
                      style={completedStages.has(s.stage) ? { backgroundColor: STAGE_COLORS[s.stage] } : undefined}
                    />
                    <span className={cn('text-[9px]', completedStages.has(s.stage) ? ('text-[var(--app-text-secondary)]') : (isDark ? 'text-white/20' : 'text-gray-300'))}>
                      {s.label}
                    </span>
                    {i < PIPELINE_STAGES.length - 2 && <ArrowRight className={cn('w-2.5 h-2.5', isDark ? 'text-white/10' : 'text-gray-200')} />}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h4 className={cn('text-sm font-medium', 'text-[var(--app-text)]')}>{selectedItem.title}</h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', isDark ? 'bg-white/[0.08] text-white/50' : 'bg-gray-100 text-gray-600')}
                    style={{ borderLeft: `2px solid ${TYPE_COLORS[selectedItem.type] || '#6b7280'}` }}>
                    {selectedItem.type}
                  </span>
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full', 'text-[var(--app-text-muted)]')}
                    style={{ backgroundColor: STAGE_COLORS[selectedItem.stage] + '22', color: STAGE_COLORS[selectedItem.stage] }}>
                    {selectedItem.stage.replace(/-/g, ' ')}
                  </span>
                </div>
                <div className={cn('text-xs space-y-1 pt-1', 'text-[var(--app-text-muted)]')}>
                  <p>Author: <span className="font-medium">{selectedItem.author}</span></p>
                  {selectedItem.reviewer && <p>Reviewer: <span className="font-medium">{selectedItem.reviewer}</span></p>}
                  <p>Version: <span className="font-medium">v{selectedItem.version}</span></p>
                  <p>Created: <span className="font-medium">{selectedItem.createdAt}</span></p>
                </div>
              </div>

              {/* Comments Thread */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <MessageSquare className={cn('w-3.5 h-3.5', isDark ? 'text-white/40' : 'text-gray-400')} />
                  <span className={cn('text-xs font-medium', 'text-[var(--app-text-secondary)]')}>
                    Comments ({selectedItem.comments.length})
                  </span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedItem.comments.map(comment => (
                    <div key={comment.id} className={cn('rounded-lg p-2.5 space-y-1', isDark ? 'bg-white/[0.03]' : 'bg-gray-50')}>
                      <div className="flex items-center justify-between">
                        <span className={cn('text-[10px] font-semibold', isDark ? 'text-white/60' : 'text-gray-700')}>{comment.author}</span>
                        <span className={cn('text-[9px]', isDark ? 'text-white/20' : 'text-gray-400')}>
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={cn('text-[11px] leading-relaxed', isDark ? 'text-white/50' : 'text-gray-600')}>{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {selectedItem.stage !== 'published' && selectedItem.stage !== 'approved' && (
                  <>
                    <Button className="w-full gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs h-8">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve
                    </Button>
                    <Button className="w-full gap-2 text-xs h-8" variant="outline"
                      style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>
                      <RotateCcw className="w-3.5 h-3.5" />
                      Request Revision
                    </Button>
                    <Button className="w-full gap-2 text-xs h-8" variant="outline"
                      style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </Button>
                  </>
                )}
                {selectedItem.stage === 'approved' && (
                  <Button className="w-full gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs h-8">
                    <Send className="w-3.5 h-3.5" />
                    Publish
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
          >
            <p className={cn('text-2xl font-bold', 'text-[var(--app-text)]')}>{stat.value}</p>
            <p className={cn('text-xs mt-1', 'text-[var(--app-text-muted)]')}>{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
