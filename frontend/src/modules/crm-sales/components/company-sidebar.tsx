'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CSS } from '@/styles/design-tokens';
import {
  X,
  Building2,
  Users,
  Plus,
  Globe,
  MapPin,
  DollarSign,
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
  Handshake,
  Target,
  Zap,
  Tag,
  Briefcase,
  TrendingUp,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  mockCompanies,
  mockContacts,
  mockDeals,
  mockActivities,
  mockNotes,
  mockAiInsights,
} from '../data/mock-data';
import type { Company, Activity, CrmNote, AiInsight } from '../types';

// ── Types ──────────────────────────────────────────────

interface CompanySidebarProps {
  companyId: string;
  open: boolean;
  onClose: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const TABS = ['Overview', 'Activity', 'Notes', 'AI Insights'] as const;
type TabType = (typeof TABS)[number];

// ── Helpers ────────────────────────────────────────────

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function formatArr(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'call': return <PhoneCall className="w-3.5 h-3.5" />;
    case 'email': return <MessageSquare className="w-3.5 h-3.5" />;
    case 'meeting': return <Video className="w-3.5 h-3.5" />;
    case 'whatsapp': return <MessageSquare className="w-3.5 h-3.5" />;
    case 'demo': return <FileText className="w-3.5 h-3.5" />;
    case 'proposal': return <FileText className="w-3.5 h-3.5" />;
    case 'file_share': return <FileText className="w-3.5 h-3.5" />;
    case 'website_visit': return <ActivityIcon className="w-3.5 h-3.5" />;
    case 'payment': return <DollarSign className="w-3.5 h-3.5" />;
    default: return <ActivityIcon className="w-3.5 h-3.5" />;
  }
}

// ── Tab Content Components (memoized) ──────────────────

const OverviewTab = React.memo(function OverviewTab({
  company,
  contactCount,
  activeDeals,
  pipelineValue,
  tags,
}: {
  company: Company;
  contactCount: number;
  activeDeals: number;
  pipelineValue: number;
  tags: string[];
}) {
  return (
    <div className="space-y-4">
      {/* Company Info */}
      <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>Company Information</h3>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 shrink-0" style={{ color: CSS.textMuted }} />
            <span className="text-sm" style={{ color: CSS.text }}>{company.website || 'No website'}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-4 h-4 shrink-0" style={{ color: CSS.textMuted }} />
            <span className="text-sm" style={{ color: CSS.text }}>{company.industry}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 shrink-0" style={{ color: CSS.textMuted }} />
            <span className="text-sm" style={{ color: CSS.text }}>{company.employeeCount} employees</span>
          </div>
          {company.arr > 0 && (
            <div className="flex items-center gap-2.5">
              <DollarSign className="w-4 h-4 shrink-0" style={{ color: CSS.textMuted }} />
              <span className="text-sm" style={{ color: CSS.text }}>ARR: {formatCurrency(company.arr)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>Metrics</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: CSS.hoverBg }}>
            <Users className="w-4 h-4 mx-auto mb-1" style={{ color: CSS.accent }} />
            <p className="text-lg font-bold" style={{ color: CSS.text }}>{contactCount}</p>
            <p className="text-[10px]" style={{ color: CSS.textMuted }}>Contacts</p>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: CSS.hoverBg }}>
            <Handshake className="w-4 h-4 mx-auto mb-1" style={{ color: '#10b981' }} />
            <p className="text-lg font-bold" style={{ color: CSS.text }}>{activeDeals}</p>
            <p className="text-[10px]" style={{ color: CSS.textMuted }}>Active Deals</p>
          </div>
        </div>
        {activeDeals > 0 && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs" style={{ color: CSS.textSecondary }}>Total Pipeline</span>
            <span className="text-sm font-semibold" style={{ color: CSS.text }}>{formatCurrency(pipelineValue)}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>Tags</h3>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs" style={{ backgroundColor: CSS.hoverBg, color: CSS.textSecondary }}>
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
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

const AiInsightsTab = React.memo(function AiInsightsTab({
  company,
  activeDeals,
  pipelineValue,
  insights,
}: {
  company: Company;
  activeDeals: number;
  pipelineValue: number;
  insights: AiInsight[];
}) {
  // Next Best Action
  const nextAction = useMemo(() => {
    if (activeDeals > 3) {
      return {
        title: 'Expand Relationship',
        description: `Multiple active deals (${activeDeals}) indicate strong engagement. Consider proposing cross-sell and upsell opportunities across departments.`,
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.1)',
        icon: <TrendingUp className="w-4 h-4" />,
      };
    }
    if (activeDeals > 0) {
      return {
        title: 'Nurture Pipeline',
        description: `${activeDeals} active deal${activeDeals > 1 ? 's' : ''} worth ${formatCurrency(pipelineValue)}. Focus on progressing existing opportunities and removing blockers.`,
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.1)',
        icon: <BarChart3 className="w-4 h-4" />,
      };
    }
    return {
      title: 'Schedule Discovery Call',
      description: 'No active deals in pipeline. Consider scheduling a discovery call to explore new opportunities and understand current challenges.',
      color: '#64748b',
      bg: 'rgba(100, 116, 139, 0.1)',
      icon: <AlertTriangle className="w-4 h-4" />,
    };
  }, [activeDeals, pipelineValue]);

  return (
    <div className="space-y-3">
      {/* Next Best Action */}
      <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
            style={{ backgroundColor: nextAction.bg, color: nextAction.color }}
          >
            {nextAction.icon}
          </div>
          <h4 className="text-sm font-medium" style={{ color: CSS.text }}>Next Best Action</h4>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: CSS.textSecondary }}>{nextAction.description}</p>
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

export function CompanySidebar({
  companyId,
  open,
  onClose,
  activeTab: controlledTab,
  onTabChange,
}: CompanySidebarProps) {
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
  const company = useMemo(() => mockCompanies.find((c) => c.id === companyId), [companyId]);
  const contactCount = useMemo(
    () => (company ? mockContacts.filter((c) => c.companyId === companyId).length : 0),
    [company, companyId],
  );
  const companyDeals = useMemo(
    () => (company ? mockDeals.filter((d) => d.companyId === companyId && d.stage !== 'won' && d.stage !== 'lost') : []),
    [company, companyId],
  );
  const activeDeals = companyDeals.length;
  const pipelineValue = useMemo(() => companyDeals.reduce((sum, d) => sum + d.value, 0), [companyDeals]);

  const activities = useMemo(
    () => {
      if (!company) return [];
      return mockActivities.filter((a) => a.companyName === company.name);
    },
    [company],
  );
  const notes = useMemo(
    () => {
      if (!company) return [];
      return mockNotes.filter(
        (n) =>
          mockContacts
            .filter((c) => c.companyId === companyId)
            .map((c) => c.id)
            .includes(n.contactId ?? ''),
      );
    },
    [company, companyId],
  );
  const insights = useMemo(
    () => {
      if (!company) return [];
      const contactIds = mockContacts
        .filter((c) => c.companyId === companyId)
        .map((c) => c.id);
      return mockAiInsights.filter((ai) => ai.contactId && contactIds.includes(ai.contactId));
    },
    [company, companyId],
  );
  const companyTags = useMemo(() => {
    if (!company) return [];
    const contacts = mockContacts.filter((c) => c.companyId === companyId);
    const tagSet = new Set<string>();
    contacts.forEach((c) => c.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [company, companyId]);

  if (!company) return null;

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
            aria-label={`Company: ${company.name}`}
          >
            {/* ── Sticky Header ── */}
            <div className="shrink-0 px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${CSS.border}` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
                    style={{ backgroundColor: CSS.accentLight, color: CSS.accent }}
                  >
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold truncate" style={{ color: CSS.text }}>
                      {company.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      {company.website && (
                        <span className="text-xs flex items-center gap-1" style={{ color: CSS.textMuted }}>
                          <Globe className="w-3 h-3" />
                          {company.website}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium"
                        style={{ color: CSS.accent, backgroundColor: CSS.accentLight }}
                      >
                        {company.industry}
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
                    onClick={() => console.log('View Contacts', company.name)}
                  >
                    <Users className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    style={{ color: CSS.textMuted }}
                    onClick={() => console.log('Create Deal', company.name)}
                  >
                    <Plus className="w-4 h-4" />
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
                        layoutId="company-tab-indicator"
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
                  {activeTab === 'Overview' && (
                    <OverviewTab
                      company={company}
                      contactCount={contactCount}
                      activeDeals={activeDeals}
                      pipelineValue={pipelineValue}
                      tags={companyTags}
                    />
                  )}
                  {activeTab === 'Activity' && <ActivityTab activities={activities} />}
                  {activeTab === 'Notes' && <NotesTab notes={notes} />}
                  {activeTab === 'AI Insights' && (
                    <AiInsightsTab
                      company={company}
                      activeDeals={activeDeals}
                      pipelineValue={pipelineValue}
                      insights={insights}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Footer ── */}
            <div className="shrink-0 px-5 py-4 flex items-center gap-2" style={{ borderTop: `1px solid ${CSS.border}` }}>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log('View Contacts', company.name)}
              >
                <Users className="w-3.5 h-3.5" />
                Contacts
              </Button>
              <Button
                size="sm"
                className="ml-auto"
                style={{ backgroundColor: CSS.accent, color: '#fff' }}
                onClick={() => console.log('Create Deal', company.name)}
              >
                <Plus className="w-3.5 h-3.5" />
                Create Deal
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
