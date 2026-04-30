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
  Building2,
  MapPin,
  Globe,
  Tag,
  Clock,
  Activity as ActivityIcon,
  FileText,
  Sparkles,
  Pin,
  Lock,
  MessageSquare,
  PhoneCall,
  Video,
  FileCheck,
  Share2,
  Eye,
  CreditCard,
  StickyNote,
  Zap,
  TrendingUp,
  TrendingDown,
  Heart,
  Target,
  ChevronRight,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  mockContacts,
  mockCompanies,
  mockActivities,
  mockNotes,
  mockAiInsights,
} from '@/modules/crm-sales/data/mock-data';
import type { Contact, Activity, CrmNote, AiInsight } from '@/modules/crm-sales/system/types';

// ── Types ──────────────────────────────────────────────

interface ContactSidebarProps {
  contactId: string;
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

function getLifecycleColor(stage: string): { color: string; bg: string } {
  const map: Record<string, { color: string; bg: string }> = {
    lead: { color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)' },
    mql: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    sql: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    opportunity: { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    customer: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    retained: { color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
    advocate: { color: '#cc5c37', bg: 'rgba(204, 92, 55, 0.1)' },
  };
  return map[stage] || { color: CSS.textMuted, bg: CSS.hoverBg };
}

function getIntentColor(intent: string): { color: string; bg: string } {
  const map: Record<string, { color: string; bg: string }> = {
    high: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    medium: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    low: { color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)' },
    inactive: { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' },
  };
  return map[intent] || { color: CSS.textMuted, bg: CSS.hoverBg };
}

function getHealthColor(score: number): string {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'call': return <PhoneCall className="w-4 h-4" />;
    case 'email': return <Mail className="w-4 h-4" />;
    case 'meeting': return <Video className="w-4 h-4" />;
    case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
    case 'demo': return <FileCheck className="w-4 h-4" />;
    case 'proposal': return <FileText className="w-4 h-4" />;
    case 'file_share': return <Share2 className="w-4 h-4" />;
    case 'website_visit': return <Eye className="w-4 h-4" />;
    case 'payment': return <CreditCard className="w-4 h-4" />;
    case 'note': return <StickyNote className="w-4 h-4" />;
    default: return <ActivityIcon className="w-4 h-4" />;
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

// ── Tab Content Components (memoized) ──────────────────

const OverviewTab = React.memo(function OverviewTab({ contact, company }: { contact: Contact; company?: { name: string; industry: string } | null }) {
  const lifecycleColor = getLifecycleColor(contact.lifecycleStage);
  const intentColor = getIntentColor(contact.aiIntent);
  const healthColor = getHealthColor(contact.healthScore);

  return (
    <div className="space-y-4">
      {/* Contact Info Card */}
      <div className="rounded-[var(--app-radius-lg)] p-4 space-y-3" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>Contact Information</h3>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 shrink-0" style={{ color: CSS.textMuted }} />
            <span className="text-sm truncate" style={{ color: CSS.text }}>{contact.email}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 shrink-0" style={{ color: CSS.textMuted }} />
            <span className="text-sm" style={{ color: CSS.text }}>{contact.phone}</span>
          </div>
          {contact.address && (
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 shrink-0" style={{ color: CSS.textMuted }} />
              <span className="text-sm" style={{ color: CSS.text }}>
                {contact.address.city}, {contact.address.state}, {contact.address.country}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Company Card */}
      {company && (
        <div className="rounded-[var(--app-radius-lg)] p-4 space-y-2" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>Company</h3>
          <div className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 shrink-0" style={{ color: CSS.textMuted }} />
            <span className="text-sm font-medium" style={{ color: CSS.text }}>{company.name}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 shrink-0" style={{ color: CSS.textMuted }} />
            <span className="text-sm" style={{ color: CSS.textSecondary }}>{company.industry}</span>
          </div>
        </div>
      )}

      {/* Health Score */}
      <div className="rounded-[var(--app-radius-lg)] p-4 space-y-2" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>Health Score</h3>
          <span className="text-sm font-bold" style={{ color: healthColor }}>{contact.healthScore}/100</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: CSS.hoverBg }}>
          <div className="h-full rounded-full transition-colors" style={{ width: `${contact.healthScore}%`, backgroundColor: healthColor }} />
        </div>
      </div>

      {/* AI Intent & Lifecycle */}
      <div className="rounded-[var(--app-radius-lg)] p-4 space-y-3" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>Status</h3>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: CSS.textSecondary }}>AI Intent</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--app-radius-md)] text-xs font-medium" style={{ color: intentColor.color, backgroundColor: intentColor.bg }}>
            {contact.aiIntent === 'high' ? <Zap className="w-4 h-4" /> : contact.aiIntent === 'medium' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {contact.aiIntent.charAt(0).toUpperCase() + contact.aiIntent.slice(1)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: CSS.textSecondary }}>Lifecycle Stage</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-[var(--app-radius-md)] text-xs font-medium" style={{ color: lifecycleColor.color, backgroundColor: lifecycleColor.bg }}>
            {contact.lifecycleStage.charAt(0).toUpperCase() + contact.lifecycleStage.slice(1)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: CSS.textSecondary }}>Last Interaction</span>
          <span className="text-xs flex items-center gap-1" style={{ color: CSS.text }}>
            <Clock className="w-4 h-4" />
            {contact.lastInteraction}
          </span>
        </div>
      </div>

      {/* Tags */}
      {contact.tags.length > 0 && (
        <div className="rounded-[var(--app-radius-lg)] p-4 space-y-2" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>Tags</h3>
          <div className="flex flex-wrap gap-1.5">
            {contact.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--app-radius-md)] text-xs" style={{ backgroundColor: CSS.hoverBg, color: CSS.textSecondary }}>
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
      <div className="flex flex-col items-center justify-center py-app-4xl space-y-2">
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
            <div className="flex items-center justify-center w-8 h-8 rounded-full shrink-0" style={{ backgroundColor: CSS.hoverBg, color: CSS.accent }}>
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
              <Clock className="w-4 h-4" />
              {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {activity.duration && <span> - {activity.duration}</span>}
            </div>
            {activity.outcome && (
              <p className="text-xs italic" style={{ color: CSS.textMuted }}>{activity.outcome}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

const NotesTab = React.memo(function NotesTab({ notes }: { notes: CrmNote[] }) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-app-4xl space-y-2">
        <StickyNote className="w-8 h-8" style={{ color: CSS.textDisabled }} />
        <p className="text-sm" style={{ color: CSS.textMuted }}>No notes yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div key={note.id} className="rounded-[var(--app-radius-lg)] p-4 space-y-2" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 shrink-0" style={{ color: CSS.accent }} />
              <h4 className="text-sm font-medium" style={{ color: CSS.text }}>{note.title}</h4>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {note.isPinned && <Pin className="w-4 h-4" style={{ color: CSS.accent }} />}
              {note.isPrivate && <Lock className="w-4 h-4" style={{ color: CSS.textMuted }} />}
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

const AiInsightsTab = React.memo(function AiInsightsTab({ insights }: { insights: AiInsight[] }) {
  if (insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-app-4xl space-y-2">
        <Sparkles className="w-8 h-8" style={{ color: CSS.textDisabled }} />
        <p className="text-sm" style={{ color: CSS.textMuted }}>No AI insights available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {insights.map((insight) => (
        <div key={insight.id} className="rounded-[var(--app-radius-lg)] p-4 space-y-2" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-[var(--app-radius-lg)] shrink-0" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-medium" style={{ color: CSS.text }}>{insight.title}</h4>
            </div>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {insight.confidence}% confidence
            </Badge>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: CSS.textSecondary }}>{insight.description}</p>
          {insight.actionText && (
            <Button variant="outline" size="sm" className="mt-1 text-xs h-8">
              {insight.actionText}
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
});

// ── Main Component ─────────────────────────────────────

export function ContactSidebar({
  contactId,
  open,
  onClose,
  activeTab: controlledTab,
  onTabChange,
}: ContactSidebarProps) {
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
  const contact = useMemo(() => mockContacts.find((c) => c.id === contactId), [contactId]);
  const company = useMemo(
    () =>
      contact?.companyId
        ? mockCompanies.find((c) => c.id === contact.companyId)
        : null,
    [contact],
  );
  const activities = useMemo(
    () => mockActivities.filter((a) => a.contactId === contactId),
    [contactId],
  );
  const notes = useMemo(
    () => mockNotes.filter((n) => n.contactId === contactId),
    [contactId],
  );
  const insights = useMemo(
    () => mockAiInsights.filter((ai) => ai.contactId === contactId),
    [contactId],
  );

  if (!contact) return null;

  const fullName = `${contact.firstName} ${contact.lastName}`;

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
            className="fixed top-0 right-0 z-50 h-full flex flex-col shadow-[var(--app-shadow-md)]-2xl w-[440px] max-w-[90vw]"
            style={{
              backgroundColor: CSS.bg,
              borderLeft: `1px solid ${CSS.border}`,
            }}
            role="dialog"
            aria-modal="true"
            aria-label={`Contact: ${fullName}`}
          >
            {/* ── Sticky Header ── */}
            <div
              className="shrink-0 px-app-xl pt-5 pb-4"
              style={{ borderBottom: `1px solid ${CSS.border}` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <Avatar className="w-11 h-10  shrink-0">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback className="text-sm font-semibold" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                      {getInitials(contact.firstName, contact.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold truncate" style={{ color: CSS.text }}>
                      {fullName}
                    </h2>
                    {contact.title && (
                      <p className="text-xs truncate" style={{ color: CSS.textSecondary }}>
                        {contact.title}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-[var(--app-radius-md)] text-[10px] font-medium"
                        style={{
                          color: getLifecycleColor(contact.lifecycleStage).color,
                          backgroundColor: getLifecycleColor(contact.lifecycleStage).bg,
                        }}
                      >
                        {contact.lifecycleStage.charAt(0).toUpperCase() + contact.lifecycleStage.slice(1)}
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
                    onClick={() => console.log('Call', contact.phone)}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    style={{ color: CSS.textMuted }}
                    onClick={() => console.log('Email', contact.email)}
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
                    onClick={onClose}
                    aria-label="Close panel"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* ── Tab Bar ── */}
            <div
              className="shrink-0 px-app-xl relative"
              style={{ borderBottom: `1px solid ${CSS.border}` }}
            >
              <div className="flex gap-1">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={cn(
                      'relative px-3 py-2.5 text-xs font-medium transition-colors',
                    )}
                    style={{
                      color: activeTab === tab ? CSS.accent : CSS.textMuted,
                    }}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="contact-tab-indicator"
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
            <div className="flex-1 overflow-y-auto custom-scrollbar px-app-xl py-4">
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
                      contact={contact}
                      company={company ? { name: company.name, industry: company.industry } : null}
                    />
                  )}
                  {activeTab === 'Activity' && <ActivityTab activities={activities} />}
                  {activeTab === 'Notes' && <NotesTab notes={notes} />}
                  {activeTab === 'AI Insights' && <AiInsightsTab insights={insights} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Footer ── */}
            <div className="shrink-0 px-app-xl py-4 flex items-center gap-2" style={{ borderTop: `1px solid ${CSS.border}` }}>
              <Button variant="outline" size="sm" onClick={onClose} className="flex-1">
                Close
              </Button>
              <Button size="sm" className="flex-1" style={{ backgroundColor: CSS.accent, color: '#fff' }}>
                Edit Contact
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
