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
  Handshake,
  Package,
  ExternalLink,
  Building2,
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
  DollarSign,
  Target,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  mockDeals,
  mockActivities,
  mockNotes,
  mockAiInsights,
} from '../data/mock-data';
import type { Deal, Activity, CrmNote, AiInsight, DealStage } from '../types';

// ── Types ──────────────────────────────────────────────

interface DealSidebarProps {
  dealId: string;
  open: boolean;
  onClose: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const TABS = ['Overview', 'Activity', 'Notes', 'AI Insights'] as const;
type TabType = (typeof TABS)[number];

// ── Helpers ────────────────────────────────────────────

function getStageConfig(stage: DealStage): { color: string; bg: string; label: string } {
  const map: Record<string, { color: string; bg: string; label: string }> = {
    new: { color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)', label: 'New' },
    qualified: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', label: 'Qualified' },
    discovery: { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', label: 'Discovery' },
    demo: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', label: 'Demo' },
    proposal: { color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)', label: 'Proposal' },
    negotiation: { color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', label: 'Negotiation' },
    won: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', label: 'Won' },
    lost: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', label: 'Lost' },
  };
  return map[stage] || map.new;
}

function getProbabilityColor(probability: number): string {
  if (probability >= 80) return '#10b981';
  if (probability >= 60) return '#f59e0b';
  if (probability >= 40) return '#f97316';
  return '#ef4444';
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'call': return <PhoneCall className="w-3.5 h-3.5" />;
    case 'email': return <Mail className="w-3.5 h-3.5" />;
    case 'meeting': return <Video className="w-3.5 h-3.5" />;
    case 'whatsapp': return <MessageSquare className="w-3.5 h-3.5" />;
    case 'demo': return <FileText className="w-3.5 h-3.5" />;
    case 'proposal': return <FileText className="w-3.5 h-3.5" />;
    case 'file_share': return <FileText className="w-3.5 h-3.5" />;
    case 'website_visit': return <ActivityIcon className="w-3.5 h-3.5" />;
    case 'payment': return <DollarSign className="w-3.5 h-3.5" />;
    case 'note': return <FileText className="w-3.5 h-3.5" />;
    default: return <ActivityIcon className="w-3.5 h-3.5" />;
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

// ── Tab Content Components (memoized) ──────────────────

const OverviewTab = React.memo(function OverviewTab({ deal }: { deal: Deal }) {
  const stageConfig = getStageConfig(deal.stage);
  const probColor = getProbabilityColor(deal.probability);
  const weightedValue = deal.value * deal.probability / 100;

  return (
    <div className="space-y-4">
      {/* Deal Value */}
      <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs" style={{ color: CSS.textMuted }}>Deal Value</p>
            <p className="text-2xl font-bold" style={{ color: CSS.text }}>{formatCurrency(deal.value)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: CSS.textMuted }}>Weighted Value</p>
            <p className="text-lg font-semibold" style={{ color: probColor }}>{formatCurrency(weightedValue)}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs" style={{ color: CSS.textMuted }}>
          <span>{deal.value} x {deal.probability}%</span>
        </div>
      </div>

      {/* Stage & Probability */}
      <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: CSS.textSecondary }}>Stage</span>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
            style={{ color: stageConfig.color, backgroundColor: stageConfig.bg }}
          >
            {stageConfig.label}
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: CSS.textSecondary }}>Close Probability</span>
            <span className="text-xs font-semibold" style={{ color: probColor }}>{deal.probability}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: CSS.hoverBg }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${deal.probability}%`, backgroundColor: probColor }}
            />
          </div>
        </div>
      </div>

      {/* Company & Contact */}
      <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>Parties</h3>
        <div className="flex items-center gap-2.5">
          <Building2 className="w-4 h-4 shrink-0" style={{ color: CSS.textMuted }} />
          <span className="text-sm" style={{ color: CSS.text }}>{deal.company}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <User className="w-4 h-4 shrink-0" style={{ color: CSS.textMuted }} />
          <span className="text-sm" style={{ color: CSS.text }}>{deal.contactName}</span>
        </div>
      </div>

      {/* Dates & Owner */}
      <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: CSS.textSecondary }}>Expected Close</span>
          <span className="text-xs flex items-center gap-1" style={{ color: CSS.text }}>
            <Clock className="w-3 h-3" />
            {new Date(deal.expectedClose).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: CSS.textSecondary }}>Owner</span>
          <span className="text-xs font-medium" style={{ color: CSS.text }}>{deal.owner}</span>
        </div>
        {deal.daysInStage !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: CSS.textSecondary }}>Days in Stage</span>
            <span className="text-xs" style={{ color: deal.daysInStage > 14 ? '#f97316' : CSS.text }}>{deal.daysInStage}</span>
          </div>
        )}
      </div>

      {/* ERP Integration */}
      <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>ERP Integration</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs h-8"
            onClick={() => console.log('Convert to Project', deal.id)}
          >
            <Package className="w-3.5 h-3.5" />
            Convert to Project
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs h-8"
            onClick={() => console.log('View in ERP', deal.id)}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View in ERP
          </Button>
        </div>
      </div>
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

const AiInsightsTab = React.memo(function AiInsightsTab({ deal, insights }: { deal: Deal; insights: AiInsight[] }) {
  // Next Best Action
  const nextAction = useMemo(() => {
    if (deal.probability >= 70) {
      return {
        title: 'Push for Close',
        description: 'High probability deal -- schedule final review and push for close. Consider offering early-bird incentives to accelerate decision.',
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.1)',
        icon: <Target className="w-4 h-4" />,
      };
    }
    if (deal.probability >= 40) {
      return {
        title: 'Send Proposal',
        description: 'Deal is progressing well. Send a detailed proposal and schedule a follow-up demo to address remaining questions.',
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.1)',
        icon: <FileText className="w-4 h-4" />,
      };
    }
    return {
      title: 'Schedule Review',
      description: 'Deal needs attention. Probability is below 40%. Schedule a review meeting to understand blockers and re-qualify the opportunity.',
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      icon: <AlertTriangle className="w-4 h-4" />,
    };
  }, [deal.probability]);

  // Risk Factors
  const riskFactors = useMemo(() => {
    const risks: string[] = [];
    if ((deal.daysInStage ?? 0) > 14) {
      risks.push('Stale stage: deal has been in current stage for over 14 days');
    }
    if (deal.probability < 30 && deal.probability > 0) {
      risks.push('Low close probability -- consider re-qualifying');
    }
    if (deal.competitors && deal.competitors.length > 0) {
      risks.push(`Active competitors: ${deal.competitors.join(', ')}`);
    }
    if (deal.discountPercent && deal.discountPercent > 15) {
      risks.push(`High discount (${deal.discountPercent}%) -- margin pressure`);
    }
    return risks;
  }, [deal]);

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

      {/* Risk Factors */}
      {riskFactors.length > 0 && (
        <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}` }}>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-sm font-medium" style={{ color: CSS.text }}>Risk Factors</h4>
          </div>
          <ul className="space-y-1.5">
            {riskFactors.map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-xs" style={{ color: CSS.textSecondary }}>
                <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" style={{ color: '#f97316' }} />
                {risk}
              </li>
            ))}
          </ul>
        </div>
      )}

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

export function DealSidebar({
  dealId,
  open,
  onClose,
  activeTab: controlledTab,
  onTabChange,
}: DealSidebarProps) {
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
  const deal = useMemo(() => mockDeals.find((d) => d.id === dealId), [dealId]);
  const activities = useMemo(
    () => {
      if (!deal) return [];
      return mockActivities.filter(
        (a) => a.contactId === deal.contactId || a.companyName === deal.company,
      );
    },
    [deal],
  );
  const notes = useMemo(
    () => {
      if (!deal) return [];
      return mockNotes.filter(
        (n) => n.contactId === deal.contactId || n.contactName === deal.contactName,
      );
    },
    [deal],
  );
  const insights = useMemo(
    () => {
      if (!deal) return [];
      return mockAiInsights.filter(
        (ai) => ai.contactId === deal.contactId || ai.contactName === deal.contactName,
      );
    },
    [deal],
  );

  if (!deal) return null;

  const stageConfig = getStageConfig(deal.stage);

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
            aria-label={`Deal: ${deal.name}`}
          >
            {/* ── Sticky Header ── */}
            <div className="shrink-0 px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${CSS.border}` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
                    style={{ backgroundColor: stageConfig.bg, color: stageConfig.color }}
                  >
                    <Handshake className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold truncate" style={{ color: CSS.text }}>
                      {deal.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium"
                        style={{ color: stageConfig.color, backgroundColor: stageConfig.bg }}
                      >
                        {stageConfig.label}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: getProbabilityColor(deal.probability) }}>
                        {deal.probability}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" style={{ color: CSS.textMuted }}>
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" style={{ color: CSS.textMuted }}>
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" style={{ color: CSS.textMuted }}>
                    <CalendarPlus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    style={{ color: '#10b981' }}
                    onClick={() => console.log('Convert to Project', deal.id)}
                  >
                    <Package className="w-4 h-4" />
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
                        layoutId="deal-tab-indicator"
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
                  {activeTab === 'Overview' && <OverviewTab deal={deal} />}
                  {activeTab === 'Activity' && <ActivityTab activities={activities} />}
                  {activeTab === 'Notes' && <NotesTab notes={notes} />}
                  {activeTab === 'AI Insights' && <AiInsightsTab deal={deal} insights={insights} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Footer ── */}
            <div className="shrink-0 px-5 py-4 flex items-center gap-2" style={{ borderTop: `1px solid ${CSS.border}` }}>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button
                size="sm"
                style={{ backgroundColor: '#10b981', color: '#fff' }}
                onClick={() => console.log('Convert to Project', deal.id)}
              >
                <Package className="w-3.5 h-3.5" />
                Convert
              </Button>
              <Button size="sm" className="ml-auto" style={{ backgroundColor: CSS.accent, color: '#fff' }}>
                Edit Deal
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
