'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2,
  Target, Users, Megaphone, FileText, Tag, Zap, Calendar,
  Sparkles, Mail, MessageCircle, Smartphone, Share2, Globe,
  Bell, DollarSign, Clock, Rocket, Plus, Trash2,
  Gift, Percent, Ticket, Package, Banknote, Truck,
  LayoutGrid, AlertCircle, TrendingUp, Brain,
  Repeat, Timer,
} from 'lucide-react';
import { useMarketingStore, BUILDER_STEPS } from '@/modules/marketing/marketing-store';
import { mockSegments } from '@/modules/marketing/data/mock-data';
import { useFeedbackStore } from '@/hooks/use-action-feedback';
import type {
  CampaignBuilderStep, CampaignObjective,
  CampaignOffer,
  AIOptimizationSuggestion, MarketingChannel,
  AutomationTrigger, AutomationAction,
} from '@/modules/marketing/types';

// ── Step metadata ──────────────────────────────────────
const STEP_META: { id: CampaignBuilderStep; label: string; icon: React.ElementType }[] = [
  { id: 'objective', label: 'Objective', icon: Target },
  { id: 'audience', label: 'Audience', icon: Users },
  { id: 'channels', label: 'Channels', icon: Megaphone },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'offer', label: 'Offer', icon: Tag },
  { id: 'automation', label: 'Automation', icon: Zap },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'ai-optimization', label: 'AI Optimize', icon: Sparkles },
];

// ── Objective goals ────────────────────────────────────
const GOAL_CARDS: { id: CampaignObjective['primaryGoal']; label: string; desc: string; icon: React.ElementType; color: string; bg: string }[] = [
  { id: 'leads', label: 'Generate Leads', desc: 'Capture new leads through multi-channel outreach with forms and landing pages.', icon: Target, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  { id: 'conversions', label: 'Drive Conversions', desc: 'Turn prospects into paying customers with targeted offers and nurturing.', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'awareness', label: 'Build Awareness', desc: 'Increase brand visibility and reach across social, ads, and content.', icon: Megaphone, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { id: 'retention', label: 'Improve Retention', desc: 'Keep existing customers engaged with loyalty programs and win-back campaigns.', icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'revenue', label: 'Boost Revenue', desc: 'Maximize revenue with upselling, cross-selling, and promotional pushes.', icon: DollarSign, color: 'text-rose-400', bg: 'bg-rose-500/10' },
];

const SECONDARY_GOALS = ['pipeline', 'engagement', 'activation', 'upsell', 'cross-sell', 'referral', 'brand-affinity', 'nps'];

const METRIC_UNITS = ['leads', 'conversions', 'impressions', 'revenue', 'clicks', 'reactivated users', 'signups'];

// ── Channel options ────────────────────────────────────
const CHANNEL_OPTIONS: { id: MarketingChannel; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'email', label: 'Email', icon: Mail, color: 'text-sky-400' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-400' },
  { id: 'sms', label: 'SMS', icon: Smartphone, color: 'text-violet-400' },
  { id: 'social', label: 'Social Media', icon: Share2, color: 'text-pink-400' },
  { id: 'ads', label: 'Paid Ads', icon: Megaphone, color: 'text-amber-400' },
  { id: 'landing-page', label: 'Landing Page', icon: Globe, color: 'text-cyan-400' },
  { id: 'push', label: 'Push Notification', icon: Bell, color: 'text-orange-400' },
];

// ── Offer types ────────────────────────────────────────
const OFFER_TYPES: { id: CampaignOffer['type']; label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { id: 'discount', label: 'Discount', icon: Percent, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'coupon', label: 'Coupon Code', icon: Ticket, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  { id: 'free-trial', label: 'Free Trial', icon: Gift, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { id: 'bundle', label: 'Bundle', icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'cashback', label: 'Cashback', icon: Banknote, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  { id: 'free-shipping', label: 'Free Shipping', icon: Truck, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
];

// ── Automation triggers / actions ──────────────────────
const TRIGGER_OPTIONS: { id: AutomationTrigger; label: string }[] = [
  { id: 'campaign-sent', label: 'Campaign Sent' },
  { id: 'link-clicked', label: 'Link Clicked' },
  { id: 'form-submitted', label: 'Form Submitted' },
  { id: 'purchase-completed', label: 'Purchase Completed' },
  { id: 'cart-abandoned', label: 'Cart Abandoned' },
  { id: 'email-opened', label: 'Email Opened' },
  { id: 'whatsapp-replied', label: 'WhatsApp Replied' },
  { id: 'sms-delivered', label: 'SMS Delivered' },
  { id: 'lead-score-threshold', label: 'Lead Score Threshold' },
  { id: 'custom-event', label: 'Custom Event' },
];

const ACTION_OPTIONS: { id: AutomationAction; label: string }[] = [
  { id: 'send-email', label: 'Send Email' },
  { id: 'send-whatsapp', label: 'Send WhatsApp' },
  { id: 'send-sms', label: 'Send SMS' },
  { id: 'add-tag', label: 'Add Tag' },
  { id: 'remove-tag', label: 'Remove Tag' },
  { id: 'move-lifecycle', label: 'Move Lifecycle Stage' },
  { id: 'assign-to-sdr', label: 'Assign to SDR' },
  { id: 'create-task', label: 'Create Task' },
  { id: 'notify-team', label: 'Notify Team' },
  { id: 'webhook', label: 'Trigger Webhook' },
  { id: 'add-to-segment', label: 'Add to Segment' },
  { id: 'wait', label: 'Wait / Delay' },
];

const CONDITION_OPERATORS = ['equals', 'not-equals', 'contains', 'greater-than', 'less-than', 'in'] as const;

// ── AI Suggestions (mock) ──────────────────────────────
const MOCK_AI_SUGGESTIONS: AIOptimizationSuggestion[] = [
  { id: 'ai-opt-1', type: 'timing', title: 'Optimize Send Time', description: 'Your audience is most active at 10:30 AM IST on Tuesdays. Shifting send time could improve open rates by 18%.', impact: 'medium', confidence: 92, potentialImprovement: 18, applied: false },
  { id: 'ai-opt-2', type: 'audience', title: 'Expand to Similar Lookalikes', description: 'Based on your top-converting segment, we identified 2,340 similar profiles with 87% match confidence.', impact: 'high', confidence: 87, potentialImprovement: 24, applied: false },
  { id: 'ai-opt-3', type: 'content', title: 'Personalize Subject Lines', description: 'A/B test data shows personalized subject lines increase open rates by 22%. AI can auto-generate variants.', impact: 'high', confidence: 84, potentialImprovement: 22, applied: false },
  { id: 'ai-opt-4', type: 'budget', title: 'Redistribute Budget to WhatsApp', description: 'WhatsApp shows 6.4x ROAS vs 3.1x on LinkedIn. Reallocating 15% budget could unlock ₹12L more revenue.', impact: 'critical', confidence: 91, potentialImprovement: 32, applied: false },
];

// ── Timezones ──────────────────────────────────────────
const TIMEZONES = ['Asia/Kolkata', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Berlin', 'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney'];

// ── Platform options for social ────────────────────────
const SOCIAL_PLATFORMS = ['instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok'] as const;
const SOCIAL_POST_TYPES = ['post', 'story', 'reel', 'carousel'] as const;
const ADS_MEDIA_TYPES = ['text', 'image', 'video', 'document', 'carousel'] as const;

// ── Easing ─────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ── Content form per channel ───────────────────────────
interface ChannelContentForm {
  // Email
  subject?: string;
  previewText?: string;
  bodyHtml?: string;
  ctaText?: string;
  ctaUrl?: string;
  // WhatsApp
  templateId?: string;
  bodyText?: string;
  mediaType?: string;
  mediaUrl?: string;
  quickReplies?: string;
  // SMS
  smsBody?: string;
  smsCta?: string;
  // Social
  platform?: string;
  postType?: string;
  caption?: string;
  hashtags?: string;
  // Ads
  adsCta?: string;
  adsMediaType?: string;
  // Landing Page
  lpHeadline?: string;
  lpBody?: string;
  lpCta?: string;
  // Push
  pushTitle?: string;
  pushBody?: string;
  pushCta?: string;
}

// ── Automation rule form ───────────────────────────────
interface AutomationRuleForm {
  id: string;
  name: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  conditions: { field: string; operator: typeof CONDITION_OPERATORS[number]; value: string }[];
  actions: { type: AutomationAction; config: string; delay: number }[];
}

// ══════════════════════════════════════════════════════
// Component
// ══════════════════════════════════════════════════════

export default function CampaignBuilderPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useMarketingStore((s) => s.navigateTo);

  // ── Step index ─────────────────────────────────────
  const [stepIdx, setStepIdx] = useState(0);
  const currentStepId = BUILDER_STEPS[stepIdx];

  // ── Step 1: Objective ─────────────────────────────
  const [selectedGoal, setSelectedGoal] = useState<CampaignObjective['primaryGoal'] | null>(null);
  const [targetMetric, setTargetMetric] = useState('');
  const [targetUnit, setTargetUnit] = useState('leads');
  const [secondaryGoals, setSecondaryGoals] = useState<string[]>([]);

  // ── Step 2: Audience ──────────────────────────────
  const [selectedSegmentId, setSelectedSegmentId] = useState('');
  const [excludeSegmentIds, setExcludeSegmentIds] = useState<string[]>([]);

  // ── Step 3: Channels ──────────────────────────────
  const [selectedChannels, setSelectedChannels] = useState<MarketingChannel[]>([]);

  // ── Step 4: Content ───────────────────────────────
  const [contentTab, setContentTab] = useState<MarketingChannel>('email');
  const [channelContent, setChannelContent] = useState<Record<MarketingChannel, ChannelContentForm>>({
    email: { subject: '', previewText: '', bodyHtml: '', ctaText: '', ctaUrl: '' },
    whatsapp: { templateId: '', bodyText: '', mediaType: 'text', quickReplies: '', ctaText: '' },
    sms: { smsBody: '', smsCta: '' },
    social: { platform: 'instagram', postType: 'post', caption: '', hashtags: '' },
    ads: { adsCta: '', adsMediaType: 'image' },
    'landing-page': { lpHeadline: '', lpBody: '', lpCta: '' },
    push: { pushTitle: '', pushBody: '', pushCta: '' },
  });

  // ── Step 5: Offer ─────────────────────────────────
  const [offerType, setOfferType] = useState<CampaignOffer['type'] | null>(null);
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponValue, setCouponValue] = useState('');
  const [couponExpiry, setCouponExpiry] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [perUserLimit, setPerUserLimit] = useState('');
  const [autoApply, setAutoApply] = useState(false);

  // ── Step 6: Automation ────────────────────────────
  const [automationRules, setAutomationRules] = useState<AutomationRuleForm[]>([]);

  // ── Step 7: Schedule ──────────────────────────────
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [sendTime, setSendTime] = useState('10:00');
  const [pacing, setPacing] = useState<'even' | 'accelerated' | 'front-loaded'>('even');
  const [dailyCap, setDailyCap] = useState('');
  const [recurring, setRecurring] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('once');

  // ── Step 8: AI Optimization ───────────────────────
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());

  // ── Helpers ────────────────────────────────────────
  const toggleChannel = useCallback((ch: MarketingChannel) => {
    setSelectedChannels(prev => {
      const next = prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch];
      if (next.length > 0 && !next.includes(contentTab)) setContentTab(next[0]);
      return next;
    });
  }, [contentTab]);

  const toggleSecondaryGoal = useCallback((g: string) => {
    setSecondaryGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  }, []);

  const toggleExcludeSegment = useCallback((id: string) => {
    setExcludeSegmentIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const updateContent = useCallback((channel: MarketingChannel, field: keyof ChannelContentForm, value: string) => {
    setChannelContent(prev => ({ ...prev, [channel]: { ...prev[channel], [field]: value } }));
  }, []);

  const addAutomationRule = useCallback(() => {
    setAutomationRules(prev => [...prev, {
      id: `rule-${Date.now()}`,
      name: '',
      enabled: true,
      trigger: 'campaign-sent',
      conditions: [{ field: '', operator: 'equals', value: '' }],
      actions: [{ type: 'send-email', config: '', delay: 0 }],
    }]);
  }, []);

  const removeAutomationRule = useCallback((ruleId: string) => {
    setAutomationRules(prev => prev.filter(r => r.id !== ruleId));
  }, []);

  const updateRule = useCallback((ruleId: string, updates: Partial<AutomationRuleForm>) => {
    setAutomationRules(prev => prev.map(r => r.id === ruleId ? { ...r, ...updates } : r));
  }, []);

  const addCondition = useCallback((ruleId: string) => {
    setAutomationRules(prev => prev.map(r => r.id === ruleId ? { ...r, conditions: [...r.conditions, { field: '', operator: 'equals', value: '' }] } : r));
  }, []);

  const removeCondition = useCallback((ruleId: string, idx: number) => {
    setAutomationRules(prev => prev.map(r => r.id === ruleId ? { ...r, conditions: r.conditions.filter((_, i) => i !== idx) } : r));
  }, []);

  const updateCondition = useCallback((ruleId: string, idx: number, updates: Partial<{ field: string; operator: typeof CONDITION_OPERATORS[number]; value: string }>) => {
    setAutomationRules(prev => prev.map(r => r.id === ruleId ? { ...r, conditions: r.conditions.map((c, i) => i === idx ? { ...c, ...updates } : c) } : r));
  }, []);

  const addAction = useCallback((ruleId: string) => {
    setAutomationRules(prev => prev.map(r => r.id === ruleId ? { ...r, actions: [...r.actions, { type: 'send-email' as AutomationAction, config: '', delay: 0 }] } : r));
  }, []);

  const removeAction = useCallback((ruleId: string, idx: number) => {
    setAutomationRules(prev => prev.map(r => r.id === ruleId ? { ...r, actions: r.actions.filter((_, i) => i !== idx) } : r));
  }, []);

  const updateAction = useCallback((ruleId: string, idx: number, updates: Partial<{ type: AutomationAction; config: string; delay: number }>) => {
    setAutomationRules(prev => prev.map(r => r.id === ruleId ? { ...r, actions: r.actions.map((a, i) => i === idx ? { ...a, ...updates } : a) } : r));
  }, []);

  const applySuggestion = useCallback((id: string) => {
    setAppliedSuggestions(prev => new Set([...prev, id]));
  }, []);

  // ── Validation ─────────────────────────────────────
  const canNext = (): boolean => {
    switch (currentStepId) {
      case 'objective': return !!selectedGoal && !!targetMetric;
      case 'audience': return !!selectedSegmentId;
      case 'channels': return selectedChannels.length > 0;
      case 'content': return true;
      case 'offer': return true;
      case 'automation': return true;
      case 'schedule': return !!startDate && !!endDate;
      case 'ai-optimization': return true;
      default: return false;
    }
  };

  const goNext = () => { if (stepIdx < BUILDER_STEPS.length - 1) setStepIdx(stepIdx + 1); };
  const goBack = () => { if (stepIdx > 0) setStepIdx(stepIdx - 1); };

  const handleLaunch = () => {
    useFeedbackStore.getState().addToast('success', {
      title: 'Campaign Launched!',
      message: 'Your campaign has been created and is now active.',
    });
    navigateTo('campaigns');
  };

  const handleSaveDraft = () => {
    useFeedbackStore.getState().addToast('success', {
      title: 'Draft Saved',
      message: 'Your campaign draft has been saved.',
    });
  };

  // ── Step completion tracking ───────────────────────
  const isStepComplete = (stepId: CampaignBuilderStep): boolean => {
    const idx = BUILDER_STEPS.indexOf(stepId);
    if (idx > stepIdx) return false;
    switch (stepId) {
      case 'objective': return !!selectedGoal && !!targetMetric;
      case 'audience': return !!selectedSegmentId;
      case 'channels': return selectedChannels.length > 0;
      case 'content': return selectedChannels.length > 0;
      case 'offer': return true;
      case 'automation': return true;
      case 'schedule': return !!startDate && !!endDate;
      case 'ai-optimization': return true;
      default: return false;
    }
  };

  // ── Estimated reach ────────────────────────────────
  const selectedSegment = mockSegments.find(s => s.id === selectedSegmentId);
  const excludedCount = mockSegments.filter(s => excludeSegmentIds.includes(s.id)).reduce((acc, s) => acc + s.audienceCount, 0);
  const estimatedReach = selectedSegment ? Math.max(selectedSegment.audienceCount - excludedCount, 0) : 0;

  // ── Shared input classes ───────────────────────────
  const inputCls = cn(
    'w-full bg-transparent text-sm font-medium focus:outline-none rounded-lg px-3 py-2 border',
    isDark
      ? 'border-white/[0.08] text-white placeholder:text-white/20 focus:border-white/20'
      : 'border-black/[0.08] text-black placeholder:text-black/20 focus:border-black/20'
  );

  const cardCls = cn(
    'rounded-2xl border p-5 transition-all duration-200',
    isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
  );

  const labelCls = cn(
    'text-[10px] font-semibold uppercase tracking-widest mb-1.5 block',
    isDark ? 'text-white/40' : 'text-black/40'
  );

  // ═══════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════

  return (
    <div className={cn('h-screen flex flex-col overflow-hidden', isDark ? 'bg-[#0a0a0a]' : 'bg-[#fafafa]')}>
      {/* ── Top bar ────────────────────────────────── */}
      <div className={cn('shrink-0 flex items-center justify-between px-6 h-14 border-b', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateTo('campaigns')}
            className={cn('h-8 w-8 rounded-lg', isDark ? 'hover:bg-white/[0.06] text-white/50' : 'hover:bg-black/[0.06] text-black/50')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-base font-semibold">Create Campaign</h1>
        </div>
        <Badge variant="secondary" className={cn('text-[10px] font-semibold', isDark ? 'bg-white/[0.06] text-white/50 border-white/[0.06]' : 'bg-black/[0.06] text-black/50 border-black/[0.06]')}>
          Step {stepIdx + 1} of 8
        </Badge>
      </div>

      {/* ── Body: Sidebar + Content ─────────────────── */}
      <div className="flex flex-1 min-h-0">
        {/* Left sidebar */}
        <div className={cn('shrink-0 w-60 border-r overflow-y-auto py-4 px-3', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
          <div className="space-y-1">
            {STEP_META.map((step, i) => {
              const isActive = i === stepIdx;
              const isComplete = isStepComplete(step.id);
              const isFuture = i > stepIdx;
              return (
                <button
                  key={step.id}
                  onClick={() => { if (i <= stepIdx || isStepComplete(step.id)) setStepIdx(i); }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200',
                    isActive
                      ? (isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]')
                      : (isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-black/[0.02]'),
                    isFuture && !isComplete && 'opacity-40'
                  )}
                >
                  {/* Step circle */}
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors',
                    isComplete && i < stepIdx
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : isActive
                        ? (isDark ? 'border-emerald-400 bg-emerald-500/10' : 'border-emerald-500 bg-emerald-50')
                        : (isDark ? 'border-white/[0.1] bg-white/[0.02]' : 'border-black/[0.1] bg-black/[0.02]')
                  )}>
                    {isComplete && i < stepIdx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <span className={cn(
                        'text-xs font-bold',
                        isActive ? 'text-emerald-500' : (isDark ? 'text-white/30' : 'text-black/30')
                      )}>{i + 1}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={cn(
                      'text-sm font-medium truncate',
                      isActive ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-white/50' : 'text-black/50')
                    )}>{step.label}</p>
                  </div>
                  {isComplete && i < stepIdx && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepId}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {/* ── Step 1: Objective ─────────────── */}
                {currentStepId === 'objective' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-1">Choose Your Objective</h2>
                      <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>Select the primary goal for your campaign</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {GOAL_CARDS.map(goal => {
                        const isSelected = selectedGoal === goal.id;
                        return (
                          <button
                            key={goal.id}
                            onClick={() => setSelectedGoal(goal.id)}
                            className={cn(
                              'rounded-2xl border p-4 text-left transition-all duration-200',
                              isSelected
                                ? (isDark ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-emerald-500/50 bg-emerald-50')
                                : (isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]')
                            )}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', goal.bg)}>
                                <goal.icon className={cn('w-4.5 h-4.5', goal.color)} />
                              </div>
                              {isSelected && (
                                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <h3 className="text-sm font-semibold mb-1">{goal.label}</h3>
                            <p className={cn('text-[11px] leading-relaxed', isDark ? 'text-white/40' : 'text-black/40')}>{goal.desc}</p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Target metric */}
                    <div className={cardCls}>
                      <label className={labelCls}>Target Metric</label>
                      <div className="flex gap-3">
                        <input
                          type="number"
                          placeholder="e.g. 5000"
                          value={targetMetric}
                          onChange={(e) => setTargetMetric(e.target.value)}
                          className={cn(inputCls, 'flex-1')}
                        />
                        <select
                          value={targetUnit}
                          onChange={(e) => setTargetUnit(e.target.value)}
                          className={cn(inputCls, 'w-40')}
                        >
                          {METRIC_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Secondary goals */}
                    <div className={cardCls}>
                      <label className={labelCls}>Secondary Goals</label>
                      <div className="flex flex-wrap gap-2">
                        {SECONDARY_GOALS.map(g => {
                          const isSelected = secondaryGoals.includes(g);
                          return (
                            <button
                              key={g}
                              onClick={() => toggleSecondaryGoal(g)}
                              className={cn(
                                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                                isSelected
                                  ? (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
                                  : (isDark ? 'bg-white/[0.04] text-white/50 hover:bg-white/[0.06]' : 'bg-black/[0.04] text-black/50 hover:bg-black/[0.06]')
                              )}
                            >
                              {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                              {g}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Step 2: Audience ─────────────── */}
                {currentStepId === 'audience' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-1">Define Your Audience</h2>
                      <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>Target the right segment for maximum impact</p>
                    </div>

                    {/* Segment selector */}
                    <div className={cardCls}>
                      <label className={labelCls}>
                        <Users className="w-3 h-3 inline mr-1.5" /> Target Segment
                      </label>
                      <select
                        value={selectedSegmentId}
                        onChange={(e) => setSelectedSegmentId(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">Select a segment...</option>
                        {mockSegments.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.audienceCount.toLocaleString()})</option>
                        ))}
                      </select>
                    </div>

                    {/* Estimated reach */}
                    {selectedSegment && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(cardCls, 'flex items-center justify-between')}
                      >
                        <div>
                          <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>Estimated Reach</p>
                          <p className="text-2xl font-bold">{estimatedReach.toLocaleString()}</p>
                          <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
                            {selectedSegment.name} {excludeSegmentIds.length > 0 ? `— ${excludeSegmentIds.length} segment(s) excluded` : ''}
                          </p>
                        </div>
                        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', isDark ? 'bg-emerald-500/10' : 'bg-emerald-50')}>
                          <Users className="w-5 h-5 text-emerald-500" />
                        </div>
                      </motion.div>
                    )}

                    {/* Exclude segments */}
                    <div className={cardCls}>
                      <label className={labelCls}>Exclude Segments</label>
                      <div className="flex flex-wrap gap-2">
                        {mockSegments.filter(s => s.id !== selectedSegmentId).map(s => {
                          const isExcluded = excludeSegmentIds.includes(s.id);
                          return (
                            <button
                              key={s.id}
                              onClick={() => toggleExcludeSegment(s.id)}
                              className={cn(
                                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                                isExcluded
                                  ? (isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-50 text-rose-600')
                                  : (isDark ? 'bg-white/[0.04] text-white/50 hover:bg-white/[0.06]' : 'bg-black/[0.04] text-black/50 hover:bg-black/[0.06]')
                              )}
                            >
                              {isExcluded && <Check className="w-3 h-3 inline mr-1" />}
                              {s.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Rules summary */}
                    {selectedSegment && (
                      <div className={cardCls}>
                        <label className={labelCls}>Segment Rules Preview</label>
                        <div className="space-y-2">
                          {selectedSegment.rules.map((rule, i) => (
                            <div key={rule.id} className={cn('flex items-center gap-2 text-xs', isDark ? 'text-white/60' : 'text-black/60')}>
                              {i > 0 && <span className={cn('font-bold text-emerald-500', isDark ? 'text-emerald-400' : 'text-emerald-600')}>{selectedSegment.operator}</span>}
                              <code className={cn('px-2 py-1 rounded-md font-mono text-[11px]', isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]')}>
                                {rule.field} <span className="text-amber-500">{rule.operator}</span> {rule.value}
                              </code>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Step 3: Channels ──────────────── */}
                {currentStepId === 'channels' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold mb-1">Select Channels</h2>
                        <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>Choose where to run your campaign. At least 1 required.</p>
                      </div>
                      {selectedChannels.length > 0 && (
                        <Badge variant="secondary" className={cn('text-xs', isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600')}>
                          {selectedChannels.length} selected
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {CHANNEL_OPTIONS.map(ch => {
                        const isSelected = selectedChannels.includes(ch.id);
                        return (
                          <button
                            key={ch.id}
                            onClick={() => toggleChannel(ch.id)}
                            className={cn(
                              'rounded-2xl border p-4 text-left transition-all duration-200',
                              isSelected
                                ? (isDark ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-emerald-500/50 bg-emerald-50')
                                : (isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]')
                            )}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]')}>
                                <ch.icon className={cn('w-4.5 h-4.5', ch.color)} />
                              </div>
                              <div className={cn(
                                'w-10 h-5 rounded-full transition-colors relative',
                                isSelected ? 'bg-emerald-500' : (isDark ? 'bg-white/[0.1]' : 'bg-black/[0.1]')
                              )}>
                                <div className={cn(
                                  'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
                                  isSelected ? 'translate-x-5' : 'translate-x-0.5'
                                )} />
                              </div>
                            </div>
                            <p className="text-sm font-medium">{ch.label}</p>
                          </button>
                        );
                      })}
                    </div>
                    {selectedChannels.length === 0 && (
                      <div className={cn('flex items-center gap-2 text-xs', isDark ? 'text-rose-400' : 'text-rose-600')}>
                        <AlertCircle className="w-3.5 h-3.5" />
                        Please select at least one channel to continue.
                      </div>
                    )}
                  </div>
                )}

                {/* ── Step 4: Content ───────────────── */}
                {currentStepId === 'content' && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-lg font-semibold mb-1">Channel Content</h2>
                      <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>Create content for each selected channel</p>
                    </div>

                    {/* Channel tabs */}
                    {selectedChannels.length > 0 ? (
                      <>
                        <div className={cn('flex gap-1 p-1 rounded-xl overflow-x-auto', isDark ? 'bg-white/[0.02] border border-white/[0.06]' : 'bg-black/[0.02] border border-black/[0.06]')}>
                          {selectedChannels.map(ch => {
                            const meta = CHANNEL_OPTIONS.find(c => c.id === ch);
                            const isActive = contentTab === ch;
                            return (
                              <button
                                key={ch}
                                onClick={() => setContentTab(ch)}
                                className={cn(
                                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
                                  isActive
                                    ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
                                    : (isDark ? 'text-white/50 hover:bg-white/[0.06]' : 'text-black/50 hover:bg-black/[0.06]')
                                )}
                              >
                                {meta && <meta.icon className="w-3.5 h-3.5" />}
                                {meta?.label || ch}
                              </button>
                            );
                          })}
                        </div>

                        {/* Per-channel content */}
                        <div className="space-y-4">
                          {/* Email */}
                          {contentTab === 'email' && (
                            <div className="space-y-4">
                              <div className={cardCls}>
                                <label className={labelCls}>Subject Line</label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="e.g. Transform Your Marketing Today"
                                    value={channelContent.email.subject || ''}
                                    onChange={(e) => updateContent('email', 'subject', e.target.value)}
                                    className={cn(inputCls, 'flex-1')}
                                  />
                                  <Button variant="ghost" size="sm" className={cn('shrink-0 gap-1 text-xs', isDark ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-500')}>
                                    <Sparkles className="w-3 h-3" /> AI Assist
                                  </Button>
                                </div>
                              </div>
                              <div className={cardCls}>
                                <label className={labelCls}>Preview Text</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Discover AI-powered marketing..."
                                  value={channelContent.email.previewText || ''}
                                  onChange={(e) => updateContent('email', 'previewText', e.target.value)}
                                  className={inputCls}
                                />
                              </div>
                              <div className={cardCls}>
                                <label className={labelCls}>Email Body</label>
                                <textarea
                                  placeholder="Write your email content here..."
                                  value={channelContent.email.bodyHtml || ''}
                                  onChange={(e) => updateContent('email', 'bodyHtml', e.target.value)}
                                  rows={6}
                                  className={cn(inputCls, 'resize-y')}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className={cardCls}>
                                  <label className={labelCls}>CTA Text</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Get Started"
                                    value={channelContent.email.ctaText || ''}
                                    onChange={(e) => updateContent('email', 'ctaText', e.target.value)}
                                    className={inputCls}
                                  />
                                </div>
                                <div className={cardCls}>
                                  <label className={labelCls}>CTA URL</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. /demo"
                                    value={channelContent.email.ctaUrl || ''}
                                    onChange={(e) => updateContent('email', 'ctaUrl', e.target.value)}
                                    className={inputCls}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* WhatsApp */}
                          {contentTab === 'whatsapp' && (
                            <div className="space-y-4">
                              <div className={cardCls}>
                                <label className={labelCls}>Template ID</label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="e.g. tpl-welcome"
                                    value={channelContent.whatsapp.templateId || ''}
                                    onChange={(e) => updateContent('whatsapp', 'templateId', e.target.value)}
                                    className={cn(inputCls, 'flex-1')}
                                  />
                                  <Button variant="ghost" size="sm" className={cn('shrink-0 gap-1 text-xs', isDark ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-500')}>
                                    <Sparkles className="w-3 h-3" /> AI Assist
                                  </Button>
                                </div>
                              </div>
                              <div className={cardCls}>
                                <label className={labelCls}>Message Body</label>
                                <textarea
                                  placeholder="e.g. Hi {{name}}! Check out our latest offer..."
                                  value={channelContent.whatsapp.bodyText || ''}
                                  onChange={(e) => updateContent('whatsapp', 'bodyText', e.target.value)}
                                  rows={4}
                                  className={cn(inputCls, 'resize-y')}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className={cardCls}>
                                  <label className={labelCls}>Media Type</label>
                                  <select
                                    value={channelContent.whatsapp.mediaType || 'text'}
                                    onChange={(e) => updateContent('whatsapp', 'mediaType', e.target.value)}
                                    className={inputCls}
                                  >
                                    <option value="text">Text Only</option>
                                    <option value="image">Image</option>
                                    <option value="video">Video</option>
                                    <option value="document">Document</option>
                                  </select>
                                </div>
                                <div className={cardCls}>
                                  <label className={labelCls}>CTA Text</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Learn More"
                                    value={channelContent.whatsapp.ctaText || ''}
                                    onChange={(e) => updateContent('whatsapp', 'ctaText', e.target.value)}
                                    className={inputCls}
                                  />
                                </div>
                              </div>
                              <div className={cardCls}>
                                <label className={labelCls}>Quick Replies (comma-separated)</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Book Demo, Get Pricing, Need Help"
                                  value={channelContent.whatsapp.quickReplies || ''}
                                  onChange={(e) => updateContent('whatsapp', 'quickReplies', e.target.value)}
                                  className={inputCls}
                                />
                              </div>
                            </div>
                          )}

                          {/* SMS */}
                          {contentTab === 'sms' && (
                            <div className="space-y-4">
                              <div className={cardCls}>
                                <div className="flex items-center justify-between mb-1.5">
                                  <label className={cn(labelCls, 'mb-0')}>Message Body</label>
                                  <span className={cn('text-[10px] font-mono', (channelContent.sms.smsBody || '').length > 160 ? 'text-rose-400' : (isDark ? 'text-white/30' : 'text-black/30'))}>
                                    {(channelContent.sms.smsBody || '').length}/160
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <textarea
                                    placeholder="e.g. DigiNue SALE! Flat 30% off. Code: SAVE30."
                                    value={channelContent.sms.smsBody || ''}
                                    onChange={(e) => updateContent('sms', 'smsBody', e.target.value)}
                                    rows={3}
                                    maxLength={160}
                                    className={cn(inputCls, 'resize-none flex-1')}
                                  />
                                  <Button variant="ghost" size="sm" className={cn('shrink-0 gap-1 text-xs self-start', isDark ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-500')}>
                                    <Sparkles className="w-3 h-3" /> AI Assist
                                  </Button>
                                </div>
                              </div>
                              <div className={cardCls}>
                                <label className={labelCls}>CTA Text</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Shop Now"
                                  value={channelContent.sms.smsCta || ''}
                                  onChange={(e) => updateContent('sms', 'smsCta', e.target.value)}
                                  className={inputCls}
                                />
                              </div>
                            </div>
                          )}

                          {/* Social */}
                          {contentTab === 'social' && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-3">
                                <div className={cardCls}>
                                  <label className={labelCls}>Platform</label>
                                  <select
                                    value={channelContent.social.platform || 'instagram'}
                                    onChange={(e) => updateContent('social', 'platform', e.target.value)}
                                    className={inputCls}
                                  >
                                    {SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                                  </select>
                                </div>
                                <div className={cardCls}>
                                  <label className={labelCls}>Post Type</label>
                                  <select
                                    value={channelContent.social.postType || 'post'}
                                    onChange={(e) => updateContent('social', 'postType', e.target.value)}
                                    className={inputCls}
                                  >
                                    {SOCIAL_POST_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                                  </select>
                                </div>
                              </div>
                              <div className={cardCls}>
                                <label className={labelCls}>Caption</label>
                                <div className="flex gap-2">
                                  <textarea
                                    placeholder="Write your social media caption..."
                                    value={channelContent.social.caption || ''}
                                    onChange={(e) => updateContent('social', 'caption', e.target.value)}
                                    rows={4}
                                    className={cn(inputCls, 'resize-y flex-1')}
                                  />
                                  <Button variant="ghost" size="sm" className={cn('shrink-0 gap-1 text-xs self-start', isDark ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-500')}>
                                    <Sparkles className="w-3 h-3" /> AI Assist
                                  </Button>
                                </div>
                              </div>
                              <div className={cardCls}>
                                <label className={labelCls}>Hashtags (comma-separated)</label>
                                <input
                                  type="text"
                                  placeholder="e.g. #Marketing, #SaaS, #Growth"
                                  value={channelContent.social.hashtags || ''}
                                  onChange={(e) => updateContent('social', 'hashtags', e.target.value)}
                                  className={inputCls}
                                />
                              </div>
                            </div>
                          )}

                          {/* Ads */}
                          {contentTab === 'ads' && (
                            <div className="space-y-4">
                              <div className={cardCls}>
                                <label className={labelCls}>CTA Text</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Start Free Trial"
                                  value={channelContent.ads.adsCta || ''}
                                  onChange={(e) => updateContent('ads', 'adsCta', e.target.value)}
                                  className={inputCls}
                                />
                              </div>
                              <div className={cardCls}>
                                <label className={labelCls}>Media Type</label>
                                <select
                                  value={channelContent.ads.adsMediaType || 'image'}
                                  onChange={(e) => updateContent('ads', 'adsMediaType', e.target.value)}
                                  className={inputCls}
                                >
                                  {ADS_MEDIA_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                                </select>
                              </div>
                              <Button variant="ghost" size="sm" className={cn('gap-1 text-xs', isDark ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-500')}>
                                <Sparkles className="w-3 h-3" /> AI Generate Ad Copy
                              </Button>
                            </div>
                          )}

                          {/* Landing Page */}
                          {contentTab === 'landing-page' && (
                            <div className="space-y-4">
                              <div className={cardCls}>
                                <label className={labelCls}>Headline</label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="e.g. Transform Your Marketing"
                                    value={channelContent['landing-page'].lpHeadline || ''}
                                    onChange={(e) => updateContent('landing-page', 'lpHeadline', e.target.value)}
                                    className={cn(inputCls, 'flex-1')}
                                  />
                                  <Button variant="ghost" size="sm" className={cn('shrink-0 gap-1 text-xs', isDark ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-500')}>
                                    <Sparkles className="w-3 h-3" /> AI Assist
                                  </Button>
                                </div>
                              </div>
                              <div className={cardCls}>
                                <label className={labelCls}>Body Copy</label>
                                <textarea
                                  placeholder="Describe your value proposition..."
                                  value={channelContent['landing-page'].lpBody || ''}
                                  onChange={(e) => updateContent('landing-page', 'lpBody', e.target.value)}
                                  rows={4}
                                  className={cn(inputCls, 'resize-y')}
                                />
                              </div>
                              <div className={cardCls}>
                                <label className={labelCls}>CTA Text</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Get Started Free"
                                  value={channelContent['landing-page'].lpCta || ''}
                                  onChange={(e) => updateContent('landing-page', 'lpCta', e.target.value)}
                                  className={inputCls}
                                />
                              </div>
                            </div>
                          )}

                          {/* Push */}
                          {contentTab === 'push' && (
                            <div className="space-y-4">
                              <div className={cardCls}>
                                <label className={labelCls}>Push Title</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Limited Time Offer!"
                                  value={channelContent.push.pushTitle || ''}
                                  onChange={(e) => updateContent('push', 'pushTitle', e.target.value)}
                                  className={inputCls}
                                />
                              </div>
                              <div className={cardCls}>
                                <label className={labelCls}>Push Body</label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="e.g. Get 40% off on Annual Plans"
                                    value={channelContent.push.pushBody || ''}
                                    onChange={(e) => updateContent('push', 'pushBody', e.target.value)}
                                    className={cn(inputCls, 'flex-1')}
                                  />
                                  <Button variant="ghost" size="sm" className={cn('shrink-0 gap-1 text-xs', isDark ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-500')}>
                                    <Sparkles className="w-3 h-3" /> AI Assist
                                  </Button>
                                </div>
                              </div>
                              <div className={cardCls}>
                                <label className={labelCls}>CTA Text</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Claim Now"
                                  value={channelContent.push.pushCta || ''}
                                  onChange={(e) => updateContent('push', 'pushCta', e.target.value)}
                                  className={inputCls}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className={cn(cardCls, 'text-center py-12')}>
                        <Megaphone className={cn('w-8 h-8 mx-auto mb-3', isDark ? 'text-white/20' : 'text-black/20')} />
                        <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>No channels selected. Go back to Step 3 to select channels first.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Step 5: Offer ─────────────────── */}
                {currentStepId === 'offer' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-1">Set Your Offer</h2>
                      <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>Choose the type of offer for your campaign (optional)</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {OFFER_TYPES.map(ot => {
                        const isSelected = offerType === ot.id;
                        return (
                          <button
                            key={ot.id}
                            onClick={() => setOfferType(isSelected ? null : ot.id)}
                            className={cn(
                              'rounded-2xl border p-4 text-left transition-all duration-200',
                              isSelected
                                ? (isDark ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-emerald-500/50 bg-emerald-50')
                                : (isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]')
                            )}
                          >
                            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-2', ot.bg)}>
                              <ot.icon className={cn('w-4.5 h-4.5', ot.color)} />
                            </div>
                            <p className="text-sm font-medium">{ot.label}</p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Conditional fields */}
                    {offerType && (
                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }} className="space-y-4">
                        {/* Discount fields */}
                        {(offerType === 'discount' || offerType === 'cashback') && (
                          <>
                            <div className="grid grid-cols-2 gap-3">
                              <div className={cardCls}>
                                <label className={labelCls}>Discount Type</label>
                                <select
                                  value={discountType}
                                  onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'flat')}
                                  className={inputCls}
                                >
                                  <option value="percentage">Percentage (%)</option>
                                  <option value="flat">Flat Amount</option>
                                </select>
                              </div>
                              <div className={cardCls}>
                                <label className={labelCls}>{discountType === 'percentage' ? 'Discount %' : 'Discount Amount'}</label>
                                <input
                                  type="number"
                                  placeholder={discountType === 'percentage' ? 'e.g. 30' : 'e.g. 500'}
                                  value={discountValue}
                                  onChange={(e) => setDiscountValue(e.target.value)}
                                  className={inputCls}
                                />
                              </div>
                            </div>
                            <div className={cardCls}>
                              <label className={labelCls}>Max Discount Amount (optional)</label>
                              <input
                                type="number"
                                placeholder="e.g. 2000"
                                value={maxDiscount}
                                onChange={(e) => setMaxDiscount(e.target.value)}
                                className={inputCls}
                              />
                            </div>
                          </>
                        )}

                        {/* Coupon fields */}
                        {offerType === 'coupon' && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className={cardCls}>
                              <label className={labelCls}>Coupon Code</label>
                              <input
                                type="text"
                                placeholder="e.g. SUMMER40"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                className={inputCls}
                              />
                            </div>
                            <div className={cardCls}>
                              <label className={labelCls}>Coupon Value</label>
                              <input
                                type="number"
                                placeholder="e.g. 500"
                                value={couponValue}
                                onChange={(e) => setCouponValue(e.target.value)}
                                className={inputCls}
                              />
                            </div>
                            <div className={cardCls}>
                              <label className={labelCls}>Expiry Date</label>
                              <input
                                type="date"
                                value={couponExpiry}
                                onChange={(e) => setCouponExpiry(e.target.value)}
                                className={inputCls}
                              />
                            </div>
                          </div>
                        )}

                        {/* Common fields */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className={cardCls}>
                            <label className={labelCls}>Usage Limit</label>
                            <input
                              type="number"
                              placeholder="e.g. 5000"
                              value={usageLimit}
                              onChange={(e) => setUsageLimit(e.target.value)}
                              className={inputCls}
                            />
                          </div>
                          <div className={cardCls}>
                            <label className={labelCls}>Per-User Limit</label>
                            <input
                              type="number"
                              placeholder="e.g. 1"
                              value={perUserLimit}
                              onChange={(e) => setPerUserLimit(e.target.value)}
                              className={inputCls}
                            />
                          </div>
                        </div>
                        <div className={cardCls}>
                          <div className="flex items-center justify-between">
                            <div>
                              <label className={cn(labelCls, 'mb-0')}>Auto-Apply Offer</label>
                              <p className={cn('text-[10px] mt-0.5', isDark ? 'text-white/30' : 'text-black/30')}>Automatically apply this offer at checkout</p>
                            </div>
                            <button
                              onClick={() => setAutoApply(!autoApply)}
                              className={cn(
                                'w-11 h-6 rounded-full transition-colors relative',
                                autoApply ? 'bg-emerald-500' : (isDark ? 'bg-white/[0.1]' : 'bg-black/[0.1]')
                              )}
                            >
                              <div className={cn(
                                'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform',
                                autoApply ? 'translate-x-5' : 'translate-x-0.5'
                              )} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* ── Step 6: Automation ────────────── */}
                {currentStepId === 'automation' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold mb-1">Automation Rules</h2>
                        <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>Set up automated actions based on triggers</p>
                      </div>
                      <Button
                        onClick={addAutomationRule}
                        className={cn('gap-1.5 text-xs rounded-xl', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Rule
                      </Button>
                    </div>

                    {automationRules.length === 0 && (
                      <div className={cn(cardCls, 'text-center py-12')}>
                        <Zap className={cn('w-8 h-8 mx-auto mb-3', isDark ? 'text-white/20' : 'text-black/20')} />
                        <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>No automation rules yet. Click "Add Rule" to create one.</p>
                      </div>
                    )}

                    {automationRules.map((rule, ruleIdx) => (
                      <motion.div
                        key={rule.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className={cn(cardCls, 'space-y-4')}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold">Rule {ruleIdx + 1}</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAutomationRule(rule.id)}
                            className={cn('h-7 w-7 rounded-lg', isDark ? 'hover:bg-rose-500/10 text-rose-400' : 'hover:bg-rose-50 text-rose-600')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>

                        {/* Rule name */}
                        <div>
                          <label className={labelCls}>Rule Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Welcome Sequence"
                            value={rule.name}
                            onChange={(e) => updateRule(rule.id, { name: e.target.value })}
                            className={inputCls}
                          />
                        </div>

                        {/* Trigger */}
                        <div>
                          <label className={labelCls}>Trigger</label>
                          <select
                            value={rule.trigger}
                            onChange={(e) => updateRule(rule.id, { trigger: e.target.value as AutomationTrigger })}
                            className={inputCls}
                          >
                            {TRIGGER_OPTIONS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                          </select>
                        </div>

                        {/* Conditions */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className={cn(labelCls, 'mb-0')}>Conditions</label>
                            <button
                              onClick={() => addCondition(rule.id)}
                              className={cn('text-[10px] font-medium flex items-center gap-1', isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500')}
                            >
                              <Plus className="w-3 h-3" /> Add Condition
                            </button>
                          </div>
                          <div className="space-y-2">
                            {rule.conditions.map((cond, ci) => (
                              <div key={ci} className="flex gap-2 items-start">
                                <input
                                  type="text"
                                  placeholder="Field"
                                  value={cond.field}
                                  onChange={(e) => updateCondition(rule.id, ci, { field: e.target.value })}
                                  className={cn(inputCls, 'flex-1')}
                                />
                                <select
                                  value={cond.operator}
                                  onChange={(e) => updateCondition(rule.id, ci, { operator: e.target.value as typeof CONDITION_OPERATORS[number] })}
                                  className={cn(inputCls, 'w-32')}
                                >
                                  {CONDITION_OPERATORS.map(op => <option key={op} value={op}>{op}</option>)}
                                </select>
                                <input
                                  type="text"
                                  placeholder="Value"
                                  value={cond.value}
                                  onChange={(e) => updateCondition(rule.id, ci, { value: e.target.value })}
                                  className={cn(inputCls, 'flex-1')}
                                />
                                {rule.conditions.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeCondition(rule.id, ci)}
                                    className={cn('h-8 w-8 shrink-0', isDark ? 'text-rose-400' : 'text-rose-600')}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className={cn(labelCls, 'mb-0')}>Actions</label>
                            <button
                              onClick={() => addAction(rule.id)}
                              className={cn('text-[10px] font-medium flex items-center gap-1', isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500')}
                            >
                              <Plus className="w-3 h-3" /> Add Action
                            </button>
                          </div>
                          <div className="space-y-2">
                            {rule.actions.map((act, ai) => (
                              <div key={ai} className="flex gap-2 items-start">
                                <select
                                  value={act.type}
                                  onChange={(e) => updateAction(rule.id, ai, { type: e.target.value as AutomationAction })}
                                  className={cn(inputCls, 'flex-1')}
                                >
                                  {ACTION_OPTIONS.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                                </select>
                                <input
                                  type="text"
                                  placeholder="Config"
                                  value={act.config}
                                  onChange={(e) => updateAction(rule.id, ai, { config: e.target.value })}
                                  className={cn(inputCls, 'flex-1')}
                                />
                                <div className="relative shrink-0">
                                  <input
                                    type="number"
                                    placeholder="Delay (min)"
                                    value={act.delay || ''}
                                    onChange={(e) => updateAction(rule.id, ai, { delay: parseInt(e.target.value) || 0 })}
                                    className={cn(inputCls, 'w-28')}
                                  />
                                </div>
                                {rule.actions.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeAction(rule.id, ai)}
                                    className={cn('h-8 w-8 shrink-0', isDark ? 'text-rose-400' : 'text-rose-600')}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* ── Step 7: Budget & Schedule ─────── */}
                {currentStepId === 'schedule' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-1">Budget & Schedule</h2>
                      <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>Set campaign timeline, pacing, and budget allocation</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className={cardCls}>
                        <label className={labelCls}>
                          <Calendar className="w-3 h-3 inline mr-1.5" /> Start Date
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className={inputCls}
                        />
                      </div>
                      <div className={cardCls}>
                        <label className={labelCls}>
                          <Calendar className="w-3 h-3 inline mr-1.5" /> End Date
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className={cardCls}>
                        <label className={labelCls}>Timezone</label>
                        <select
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className={inputCls}
                        >
                          {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                        </select>
                      </div>
                      <div className={cardCls}>
                        <label className={labelCls}>
                          <Clock className="w-3 h-3 inline mr-1.5" /> Send Time
                        </label>
                        <input
                          type="time"
                          value={sendTime}
                          onChange={(e) => setSendTime(e.target.value)}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    {/* Budget pacing */}
                    <div>
                      <label className={labelCls}>Budget Pacing</label>
                      <div className="grid grid-cols-3 gap-3">
                        {([
                          { id: 'even' as const, label: 'Even', desc: 'Distribute budget evenly across the campaign', icon: LayoutGrid },
                          { id: 'accelerated' as const, label: 'Accelerated', desc: 'Spend faster to reach audience quickly', icon: Rocket },
                          { id: 'front-loaded' as const, label: 'Front-Loaded', desc: 'Concentrate spend in the first half', icon: TrendingUp },
                        ]).map(p => {
                          const isSelected = pacing === p.id;
                          return (
                            <button
                              key={p.id}
                              onClick={() => setPacing(p.id)}
                              className={cn(
                                'rounded-2xl border p-4 text-left transition-all duration-200',
                                isSelected
                                  ? (isDark ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-emerald-500/50 bg-emerald-50')
                                  : (isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]')
                              )}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className={cn(
                                  'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                                  isSelected ? 'border-emerald-500' : (isDark ? 'border-white/[0.2]' : 'border-black/[0.2]')
                                )}>
                                  {isSelected && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                                </div>
                                <p.icon className={cn('w-4 h-4', isSelected ? 'text-emerald-500' : (isDark ? 'text-white/30' : 'text-black/30'))} />
                              </div>
                              <p className="text-sm font-medium">{p.label}</p>
                              <p className={cn('text-[10px] mt-1', isDark ? 'text-white/30' : 'text-black/30')}>{p.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className={cardCls}>
                        <label className={labelCls}>
                          <DollarSign className="w-3 h-3 inline mr-1.5" /> Daily Budget Cap
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 50000"
                          value={dailyCap}
                          onChange={(e) => setDailyCap(e.target.value)}
                          className={inputCls}
                        />
                      </div>
                      <div className={cardCls}>
                        <label className={labelCls}>
                          <Repeat className="w-3 h-3 inline mr-1.5" /> Recurring Type
                        </label>
                        <select
                          value={recurring}
                          onChange={(e) => setRecurring(e.target.value as 'once' | 'daily' | 'weekly' | 'monthly')}
                          className={inputCls}
                        >
                          <option value="once">One-time</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    </div>

                    {startDate && endDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(cardCls, 'flex items-center justify-between')}
                      >
                        <div className="flex items-center gap-2">
                          <Timer className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                          <span className="text-sm font-medium">Campaign Duration</span>
                        </div>
                        <span className="text-lg font-bold">
                          {Math.max(Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)), 0)} days
                        </span>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* ── Step 8: AI Optimization ───────── */}
                {currentStepId === 'ai-optimization' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold mb-1">AI Optimization</h2>
                        <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>AI-powered suggestions to improve campaign performance</p>
                      </div>
                      <Button
                        className={cn('gap-1.5 text-xs rounded-xl', isDark ? 'bg-violet-500/80 text-white hover:bg-violet-500' : 'bg-violet-600 text-white hover:bg-violet-700')}
                      >
                        <Brain className="w-3.5 h-3.5" /> Run AI Analysis
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {MOCK_AI_SUGGESTIONS.map(suggestion => {
                        const isApplied = appliedSuggestions.has(suggestion.id);
                        const impactColor = {
                          low: isDark ? 'text-sky-400 bg-sky-500/10' : 'text-sky-600 bg-sky-50',
                          medium: isDark ? 'text-amber-400 bg-amber-500/10' : 'text-amber-600 bg-amber-50',
                          high: isDark ? 'text-orange-400 bg-orange-500/10' : 'text-orange-600 bg-orange-50',
                          critical: isDark ? 'text-rose-400 bg-rose-500/10' : 'text-rose-600 bg-rose-50',
                        }[suggestion.impact];
                        return (
                          <motion.div
                            key={suggestion.id}
                            layout
                            className={cn(
                              'rounded-2xl border p-5 transition-all duration-200',
                              isApplied
                                ? (isDark ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200')
                                : (isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')
                            )}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Badge className={cn('text-[10px] font-semibold border-0', impactColor)}>
                                  {suggestion.type}
                                </Badge>
                                <Badge variant="outline" className={cn('text-[10px]', isDark ? 'border-white/[0.1] text-white/40' : 'border-black/[0.1] text-black/40')}>
                                  {suggestion.impact} impact
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className={cn('text-[10px] font-mono', isDark ? 'text-white/30' : 'text-black/30')}>{suggestion.confidence}% confidence</span>
                              </div>
                            </div>
                            <h3 className="text-sm font-semibold mb-1">{suggestion.title}</h3>
                            <p className={cn('text-xs leading-relaxed mb-3', isDark ? 'text-white/50' : 'text-black/50')}>{suggestion.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <TrendingUp className={cn('w-3.5 h-3.5', isDark ? 'text-emerald-400' : 'text-emerald-600')} />
                                <span className={cn('text-xs font-semibold', isDark ? 'text-emerald-400' : 'text-emerald-600')}>
                                  +{suggestion.potentialImprovement}% improvement
                                </span>
                              </div>
                              {isApplied ? (
                                <Badge className="bg-emerald-500/10 text-emerald-500 border-0 text-[10px]">
                                  <Check className="w-3 h-3 mr-1" /> Applied
                                </Badge>
                              ) : (
                                <Button
                                  onClick={() => applySuggestion(suggestion.id)}
                                  size="sm"
                                  className={cn('text-xs rounded-lg gap-1', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}
                                >
                                  <Sparkles className="w-3 h-3" /> Apply Suggestion
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────── */}
      <div className={cn('shrink-0 border-t px-6 h-16 flex items-center justify-between', isDark ? 'border-white/[0.06] bg-[#0a0a0a]' : 'border-black/[0.06] bg-[#fafafa]')}>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={stepIdx === 0}
            className={cn(
              'gap-2 rounded-xl text-sm',
              stepIdx === 0 ? 'opacity-30 cursor-not-allowed' : '',
              isDark ? 'text-white/50 hover:text-white hover:bg-white/[0.06]' : 'text-black/50 hover:text-black hover:bg-black/[0.06]'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <span className={cn('text-xs font-medium', isDark ? 'text-white/30' : 'text-black/30')}>
            Step {stepIdx + 1} of 8
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handleSaveDraft}
            className={cn('rounded-xl text-sm', isDark ? 'text-white/40 hover:text-white/60 hover:bg-white/[0.06]' : 'text-black/40 hover:text-black/60 hover:bg-black/[0.06]')}
          >
            Save Draft
          </Button>
          {stepIdx < BUILDER_STEPS.length - 1 ? (
            <Button
              onClick={goNext}
              disabled={!canNext()}
              className={cn(
                'px-5 py-2 text-sm font-medium rounded-xl gap-2',
                canNext()
                  ? (isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')
                  : 'opacity-30 cursor-not-allowed'
              )}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleLaunch}
              className="px-5 py-2 text-sm font-medium rounded-xl gap-2 bg-emerald-500 text-white hover:bg-emerald-600"
            >
              <Rocket className="w-4 h-4" />
              Launch Campaign
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
