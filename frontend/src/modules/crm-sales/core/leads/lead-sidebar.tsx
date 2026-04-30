'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CSS } from '@/styles/design-tokens';
import {
  X,
  Phone,
  Mail,
  CalendarPlus,
  Flame,
  Sun,
  Snowflake,
  AlertTriangle,
  Handshake,
  Target,
  TrendingUp,
  DollarSign,
  User,
  Clock,
  Activity as ActivityIcon,
  FileText,
  Sparkles,
  Pin,
  Lock,
  MessageSquare,
  PhoneCall,
  Video,
  ChevronRight,
  Zap,
  CheckCircle2,
  Circle,
  Timer,
  BarChart3,
  Globe,
  Megaphone,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  mockLeads,
  mockActivities,
  mockNotes,
  mockAiInsights,
} from '@/modules/crm-sales/data/mock-data';
import type { Lead, Activity, CrmNote, AiInsight, LeadIntent } from '@/modules/crm-sales/system/types';

// ── Types ──────────────────────────────────────────────

interface LeadSidebarProps {
  leadId: string;
  open: boolean;
  onClose: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const TABS = ['Overview', 'Activity', 'Notes', 'AI Insights'] as const;
type TabType = (typeof TABS)[number];

// ── Helpers ────────────────────────────────────────────

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function getIntentConfig(intent: LeadIntent): { icon: React.ReactNode; color: string; bg: string; label: string } {
  const map: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
    hot: { icon: <Flame className="w-3.5 h-3.5" />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', label: 'Hot' },
    warm: { icon: <Sun className="w-3.5 h-3.5" />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', label: 'Warm' },
    cold: { icon: <Snowflake className="w-3.5 h-3.5" />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', label: 'Cold' },
    stale: { icon: <AlertTriangle className="w-3.5 h-3.5" />, color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)', label: 'Stale' },
  };
  return map[intent] || map.cold;
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

function getStatusColor(status: string): { color: string; bg: string } {
  const map: Record<string, { color: string; bg: string }> = {
    new: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    contacted: { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    qualified: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    unqualified: { color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)' },
    converted: { color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
    lost: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  };
  return map[status] || { color: CSS.textMuted, bg: CSS.hoverBg };
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'call': return <PhoneCall className="w-3.5 h-3.5" />;
    case 'email': return <Mail className="w-3.5 h-3.5" />;
    case 'meeting': return <Video className="w-3.5 h-3.5" />;
    case 'whatsapp': return <MessageSquare className="w-3.5 h-3.5" />;
    case 'demo': return <FileText className="w-3.5 h-3.5" />;
    case 'proposal': return <FileText className="w-3.5 h-3.5" />;
    default: return <ActivityIcon className="w-3.5 h-3.5" />;
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

// ── Tab Content Components (memoized) ──────────────────

const OverviewTab = React.memo(function OverviewTab({ lead }: { lead: Lead }) {
  const intentConfig = getIntentConfig(lead.intent);
  const scoreColor = getScoreColor(lead.score);
  const statusColor = getStatusColor(lead.status);

  return (
    <div className="space-y-4">
      {/* Score Card */}
      <div className="rounded-xl p-4 text-center space-y-1" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>Lead Score</h3>
        <span className="text-4xl font-bold" style={{ color: scoreColor }}>{lead.score}</span>
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium" style={{ color: intentConfig.color, backgroundColor: intentConfig.bg }}>
            {intentConfig.icon}
            {intentConfig.label}
          </span>
        </div>
      </div>

      {/* Status & Revenue */}
      <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: CSS.textSecondary }}>Status</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium" style={{ color: statusColor.color, backgroundColor: statusColor.bg }}>
            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: CSS.textSecondary }}>Estimated Revenue</span>
          <span className="text-sm font-semibold flex items-center gap-1" style={{ color: CSS.text }}>
            <DollarSign className="w-3.5 h-3.5" />
            {formatCurrency(lead.expectedRevenue)}
          </span>
        </div>
      </div>

      {/* Assigned Rep & Next Action */}
      <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>Assignment</h3>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-full shrink-0" style={{ backgroundColor: CSS.hoverBg }}>
            <User className="w-3.5 h-3.5" style={{ color: CSS.textMuted }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: CSS.text }}>{lead.assignedRep}</p>
          </div>
        </div>
        {lead.nextAction && (
          <div className="flex items-start gap-2.5 mt-2">
            <Target className="w-4 h-4 shrink-0 mt-0.5" style={{ color: CSS.accent }} />
            <div>
              <p className="text-sm font-medium" style={{ color: CSS.text }}>{lead.nextAction}</p>
              {lead.nextActionDate && (
                <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: CSS.textMuted }}>
                  <Clock className="w-3 h-3" />
                  {new Date(lead.nextActionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Source & Campaign */}
      <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>Source</h3>
        <div className="flex items-center gap-2.5">
          <Globe className="w-4 h-4 shrink-0" style={{ color: CSS.textMuted }} />
          <span className="text-sm" style={{ color: CSS.text }}>
            {lead.source.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
        </div>
        {lead.campaign && (
          <div className="flex items-center gap-2.5">
            <Megaphone className="w-4 h-4 shrink-0" style={{ color: CSS.textMuted }} />
            <span className="text-sm" style={{ color: CSS.textSecondary }}>{lead.campaign}</span>
          </div>
        )}
      </div>

      {/* SLA Indicator */}
      {lead.slaDeadline && (
        <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4" style={{ color: '#f59e0b' }} />
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>SLA</h3>
            </div>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {(() => {
                const remaining = new Date(lead.slaDeadline).getTime() - Date.now();
                if (remaining < 0) return 'Breached';
                const hours = Math.floor(remaining / (1000 * 60 * 60));
                if (hours < 24) return `${hours}h left`;
                const days = Math.floor(hours / 24);
                return `${days}d left`;
              })()}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
});

const ActivityTab = React.memo(function ActivityTab({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-2">
        <ActivityIcon className="w-8 h-8" style={{ color: CSS.textDisabled }} />
        <p className="text-sm" style={{ color: CSS.textMuted }}>No activity recorded</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {activities.map((activity, i) => (
        <div key={activity.id} className="flex gap-3 pb-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-7 h-7 rounded-full shrink-0" style={{ backgroundColor: CSS.hoverBg, color: CSS.accent }}>
              {getActivityIcon(activity.type)}
            </div>
            {i < activities.length - 1 && <div className="w-px flex-1 mt-1" style={{ backgroundColor: CSS.borderLight }} />}
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-sm font-medium leading-tight" style={{ color: CSS.text }}>{activity.subject}</p>
            {activity.description && (
              <p className="text-xs leading-relaxed" style={{ color: CSS.textSecondary }}>{activity.description}</p>
            )}
            <div className="flex items-center gap-2 text-xs" style={{ color: CSS.textMuted }}>
              <Clock className="w-3 h-3" />
              {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {activity.duration && <span> - {activity.duration}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

const NotesTab = React.memo(function NotesTab({ notes }: { notes: CrmNote[] }) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-2">
        <FileText className="w-8 h-8" style={{ color: CSS.textDisabled }} />
        <p className="text-sm" style={{ color: CSS.textMuted }}>No notes yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div key={note.id} className="rounded-xl p-4 space-y-2" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 shrink-0" style={{ color: CSS.accent }} />
              <h4 className="text-sm font-medium" style={{ color: CSS.text }}>{note.title}</h4>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {note.isPinned && <Pin className="w-3 h-3" style={{ color: CSS.accent }} />}
              {note.isPrivate && <Lock className="w-3 h-3" style={{ color: CSS.textMuted }} />}
            </div>
          </div>
          <p className="text-xs leading-relaxed line-clamp-3" style={{ color: CSS.textSecondary }}>{note.content}</p>
          <div className="flex items-center justify-between text-xs" style={{ color: CSS.textMuted }}>
            <span>{note.author}</span>
            <span>{new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      ))}
    </div>
  );
});

const AiInsightsTab = React.memo(function AiInsightsTab({ lead, insights }: { lead: Lead; insights: AiInsight[] }) {
  const scoreColor = getScoreColor(lead.score);

  // BANT framework mock
  const bant = useMemo(() => {
    const budget = lead.score > 70 ? 85 : lead.score > 40 ? 50 : 25;
    const authority = lead.score > 70 ? 80 : lead.score > 40 ? 55 : 30;
    const need = lead.score > 70 ? 90 : lead.score > 40 ? 60 : 35;
    const timeline = lead.score > 70 ? 75 : lead.score > 40 ? 45 : 20;
    return [
      { label: 'Budget', score: budget, maxScore: 100 },
      { label: 'Authority', score: authority, maxScore: 100 },
      { label: 'Need', score: need, maxScore: 100 },
      { label: 'Timeline', score: timeline, maxScore: 100 },
    ];
  }, [lead.score]);

  return (
    <div className="space-y-3">
      {/* Score Explanation */}
      <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
            <BarChart3 className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-sm font-medium" style={{ color: CSS.text }}>Score Explanation</h4>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: CSS.textSecondary }}>
          This lead scored {lead.score}/100 based on engagement signals, company fit, and buying intent.{' '}
          {lead.intent === 'hot' && 'Strong indicators of immediate purchase intent detected from recent interactions.'}
          {lead.intent === 'warm' && 'Moderate interest level with potential for conversion with proper nurturing.'}
          {lead.intent === 'cold' && 'Early-stage engagement. Requires more qualification before investing significant resources.'}
          {lead.intent === 'stale' && 'Engagement has dropped. Consider re-engagement strategies or deprioritization.'}
        </p>
      </div>

      {/* BANT Qualification */}
      <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <Target className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-sm font-medium" style={{ color: CSS.text }}>Qualification Suggestion (BANT)</h4>
        </div>
        <div className="space-y-2.5">
          {bant.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: CSS.textSecondary }}>{item.label}</span>
                <span className="text-xs font-semibold" style={{ color: getScoreColor(item.score) }}>{item.score}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: CSS.hoverBg }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${item.score}%`, backgroundColor: getScoreColor(item.score) }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* General AI Insights */}
      {insights.length > 0 ? (
        insights.map((insight) => (
          <div key={insight.id} className="rounded-xl p-4 space-y-2" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-sm font-medium" style={{ color: CSS.text }}>{insight.title}</h4>
              </div>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {insight.confidence}%
              </Badge>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: CSS.textSecondary }}>{insight.description}</p>
            {insight.actionText && (
              <Button variant="outline" size="sm" className="mt-1 text-xs h-7">
                {insight.actionText}
                <ChevronRight className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-8 space-y-2">
          <Sparkles className="w-8 h-8" style={{ color: CSS.textDisabled }} />
          <p className="text-sm" style={{ color: CSS.textMuted }}>No additional AI insights</p>
        </div>
      )}
    </div>
  );
});

// ── Main Component ─────────────────────────────────────

export function LeadSidebar({
  leadId,
  open,
  onClose,
  activeTab: controlledTab,
  onTabChange,
}: LeadSidebarProps) {
  const [internalTab, setInternalTab] = useState<TabType>('Overview');
  const activeTab = (controlledTab as TabType) || internalTab;

  const handleTabChange = useCallback(
    (tab: string) => {
      if (onTabChange) {
        onTabChange(tab);
      } else {
        setInternalTab(tab as TabType);
      }
    },
    [onTabChange],
  );

  // Escape key & scroll lock
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // Data lookups
  const lead = useMemo(() => mockLeads.find((l) => l.id === leadId), [leadId]);
  const activities = useMemo(
    () => {
      if (!lead) return [];
      return mockActivities.filter(
        (a) =>
          a.companyName === lead.company ||
          a.contactName === `${lead.firstName} ${lead.lastName}`,
      );
    },
    [lead],
  );
  const notes = useMemo(
    () => {
      if (!lead) return [];
      return mockNotes.filter(
        (n) =>
          n.contactName === `${lead.firstName} ${lead.lastName}` ||
          (n.contactName === '' && lead.company && n.content.toLowerCase().includes(lead.company.toLowerCase())),
      );
    },
    [lead],
  );
  const insights = useMemo(
    () => {
      if (!lead) return [];
      return mockAiInsights.filter(
        (ai) =>
          ai.contactName === `${lead.firstName} ${lead.lastName}` ||
          (lead.company && ai.description.toLowerCase().includes(lead.company.toLowerCase())),
      );
    },
    [lead],
  );

  if (!lead) return null;

  const fullName = `${lead.firstName} ${lead.lastName}`;
  const intentConfig = getIntentConfig(lead.intent);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 backdrop-blur-sm"
            style={{ backgroundColor: CSS.overlay }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 h-full flex flex-col shadow-2xl w-[440px] max-w-[90vw]"
            style={{
              backgroundColor: CSS.bg,
              borderLeft: `1px solid ${CSS.border}`,
            }}
            role="dialog"
            aria-modal="true"
            aria-label={`Lead: ${fullName}`}
          >
            {/* ── Sticky Header ── */}
            <div className="shrink-0 px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${CSS.border}` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <Avatar className="w-11 h-11 shrink-0">
                    <AvatarFallback className="text-sm font-semibold" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                      {getInitials(lead.firstName, lead.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold truncate" style={{ color: CSS.text }}>
                      {fullName}
                    </h2>
                    {lead.company && (
                      <p className="text-xs truncate" style={{ color: CSS.textSecondary }}>
                        {lead.company}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium"
                        style={{ color: intentConfig.color, backgroundColor: intentConfig.bg }}
                      >
                        {intentConfig.icon}
                        {intentConfig.label}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: getScoreColor(lead.score) }}>
                        {lead.score}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    style={{ color: CSS.textMuted }}
                    onClick={() => console.log('Call', lead.phone)}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    style={{ color: CSS.textMuted }}
                    onClick={() => console.log('Email', lead.email)}
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    style={{ color: CSS.textMuted }}
                    onClick={() => console.log('Schedule', fullName)}
                  >
                    <CalendarPlus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    style={{ color: '#10b981' }}
                    onClick={() => console.log('Convert to Deal', leadId)}
                  >
                    <Handshake className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} aria-label="Close">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* ── Tab Bar ── */}
            <div className="shrink-0 px-5 relative" style={{ borderBottom: `1px solid ${CSS.border}` }}>
              <div className="flex gap-1">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className="relative px-3 py-2.5 text-xs font-medium transition-colors"
                    style={{ color: activeTab === tab ? CSS.accent : CSS.textMuted }}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="lead-tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                        style={{ backgroundColor: CSS.accent }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Tab Content ── */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'Overview' && <OverviewTab lead={lead} />}
                  {activeTab === 'Activity' && <ActivityTab activities={activities} />}
                  {activeTab === 'Notes' && <NotesTab notes={notes} />}
                  {activeTab === 'AI Insights' && <AiInsightsTab lead={lead} insights={insights} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Footer ── */}
            <div className="shrink-0 px-5 py-4 flex items-center gap-2" style={{ borderTop: `1px solid ${CSS.border}` }}>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button size="sm" style={{ backgroundColor: '#10b981', color: '#fff' }} onClick={() => console.log('Convert to Deal', leadId)}>
                <Handshake className="w-3.5 h-3.5" />
                Convert
              </Button>
              <Button size="sm" className="ml-auto" style={{ backgroundColor: CSS.accent, color: '#fff' }}>
                Edit Lead
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
