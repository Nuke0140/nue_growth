'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Target, Mail, MessageCircle, Smartphone, Share2, Megaphone, Zap,
  Globe, Users, Clock, DollarSign, ArrowLeft, ArrowRight, Check,
  Sparkles, Send, FileText, Heart, Rocket, CheckCircle2, Circle,
  Calendar, Tag, Lightbulb, BookOpen, Shield
} from 'lucide-react';
import { useMarketingStore } from '@/modules/marketing/marketing-store';
import type { MarketingChannel } from '@/modules/marketing/types';

const steps = [
  { id: 1, label: 'Objective' },
  { id: 2, label: 'Channels' },
  { id: 3, label: 'Audience' },
  { id: 4, label: 'Budget & Schedule' },
  { id: 5, label: 'Content & CTA' },
];

const objectives = [
  { id: 'lead-gen', label: 'Lead Generation', desc: 'Capture new leads through multi-channel campaigns with landing pages and forms.', icon: Target, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  { id: 'nurturing', label: 'Nurturing', desc: 'Build relationships with existing leads through drip sequences and personalized content.', icon: Heart, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { id: 'retention', label: 'Retention', desc: 'Keep existing customers engaged with loyalty programs and exclusive content.', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'sales-push', label: 'Sales Push', desc: 'Drive immediate conversions with time-limited offers and promotional campaigns.', icon: Rocket, color: 'text-orange-400', bg: 'bg-orange-500/10' },
];

const channelOptions: { id: MarketingChannel; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'email', label: 'Email', icon: Mail, color: 'text-sky-400' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-400' },
  { id: 'sms', label: 'SMS', icon: Smartphone, color: 'text-violet-400' },
  { id: 'social', label: 'Social Media', icon: Share2, color: 'text-pink-400' },
  { id: 'ads', label: 'Paid Ads', icon: Megaphone, color: 'text-amber-400' },
  { id: 'landing-page', label: 'Landing Page', icon: Globe, color: 'text-cyan-400' },
];

const segments = ['All Contacts', 'Enterprise Leads', 'SMB Segment', 'Startup Leads', 'Dormant Users', 'High-Value Customers', 'Free Trial Users', 'Webinar Attendees'];
const lifecycleStages = ['Subscriber', 'Lead', 'MQL', 'SQL', 'Opportunity', 'Customer'];
const behaviorRules = ['Opened last email', 'Visited website', 'Clicked ad', 'Downloaded resource', 'Attended webinar', 'Abandoned cart', 'Inactive 30+ days', 'High engagement score'];

const contentTypes = [
  { id: 'promotional', label: 'Promotional', desc: 'Sales-focused content with offers and discounts', icon: Megaphone },
  { id: 'educational', label: 'Educational', desc: 'Value-driven content like guides and tutorials', icon: BookOpen },
  { id: 'transactional', label: 'Transactional', desc: 'Order confirmations and account updates', icon: FileText },
];

const toneOptions = [
  { id: 'professional', label: 'Professional' },
  { id: 'friendly', label: 'Friendly' },
  { id: 'urgent', label: 'Urgent / FOMO' },
  { id: 'casual', label: 'Casual' },
  { id: 'luxury', label: 'Premium / Luxury' },
];

export default function CampaignBuilderPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useMarketingStore((s) => s.navigateTo);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [selectedChannels, setSelectedChannels] = useState<MarketingChannel[]>([]);
  const [selectedSegment, setSelectedSegment] = useState('All Contacts');
  const [selectedLifecycle, setSelectedLifecycle] = useState('Lead');
  const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [dailyBudget, setDailyBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [selectedContentType, setSelectedContentType] = useState('promotional');
  const [selectedTone, setSelectedTone] = useState('professional');

  const toggleChannel = (ch: MarketingChannel) => {
    setSelectedChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
  };

  const toggleBehavior = (b: string) => {
    setSelectedBehaviors(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  };

  const canNext = () => {
    switch (currentStep) {
      case 1: return !!selectedObjective;
      case 2: return selectedChannels.length > 0;
      case 3: return true;
      case 4: return !!budget && !!startDate && !!endDate;
      case 5: return !!campaignName;
      default: return false;
    }
  };

  const budgetNum = parseInt(budget) || 0;
  const dailyBudgetSuggestion = budgetNum > 0 ? Math.round(budgetNum / 30) : 0;

  const daysDiff = startDate && endDate ? Math.max(Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)), 0) : 0;

  const goNext = () => { if (currentStep < 5) setCurrentStep(currentStep + 1); };
  const goBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const stepVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateTo('campaigns')}
              className={cn('h-9 w-9 rounded-xl', isDark ? 'hover:bg-white/[0.06] text-white/50' : 'hover:bg-black/[0.06] text-black/50')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Create Campaign</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Step-by-step campaign builder</p>
            </div>
          </div>
          <Badge variant="secondary" className={cn('text-xs', isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50')}>
            Step {currentStep} of 5
          </Badge>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 px-4">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    scale: currentStep === step.id ? 1.1 : 1,
                    backgroundColor: currentStep > step.id ? (isDark ? 'rgba(16,185,129,0.3)' : '#34d399') :
                      currentStep === step.id ? (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)') :
                      (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
                  }}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
                    currentStep > step.id ? 'border-emerald-500' :
                    currentStep === step.id ? (isDark ? 'border-white/30' : 'border-black/30') :
                    (isDark ? 'border-white/[0.08]' : 'border-black/[0.08]')
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className={cn(
                      'text-sm font-semibold',
                      currentStep === step.id ? (isDark ? 'text-white' : 'text-black') :
                      (isDark ? 'text-white/30' : 'text-black/30')
                    )}>{step.id}</span>
                  )}
                </motion.div>
                <span className={cn(
                  'text-[10px] mt-1.5 font-medium text-center max-w-[70px]',
                  currentStep >= step.id ? (isDark ? 'text-white/60' : 'text-black/60') :
                  (isDark ? 'text-white/25' : 'text-black/25')
                )}>{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn(
                  'w-12 sm:w-20 h-0.5 mx-2 mt-[-16px] transition-colors',
                  currentStep > step.id ? 'bg-emerald-500' : (isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]')
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className={cn('w-full h-1 rounded-full', isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]')}>
          <motion.div
            animate={{ width: `${(currentStep / 5) * 100}%` }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-emerald-500"
          />
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Step 1: Objective */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Choose Your Objective</h2>
                  <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>Select the primary goal for your campaign</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {objectives.map(obj => {
                    const isSelected = selectedObjective === obj.id;
                    return (
                      <button
                        key={obj.id}
                        onClick={() => setSelectedObjective(obj.id)}
                        className={cn(
                          'rounded-2xl border p-5 text-left transition-all duration-200',
                          isSelected
                            ? (isDark ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-emerald-500/50 bg-emerald-50')
                            : (isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]')
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', obj.bg)}>
                            <obj.icon className={cn('w-5 h-5', obj.color)} />
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold mb-1">{obj.label}</h3>
                        <p className={cn('text-xs leading-relaxed', isDark ? 'text-white/40' : 'text-black/40')}>{obj.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Channels */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">Select Channels</h2>
                    <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>Choose where to run your campaign (multi-select)</p>
                  </div>
                  {selectedChannels.length > 0 && (
                    <Badge variant="secondary" className={cn('text-xs', isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600')}>
                      {selectedChannels.length} selected
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {channelOptions.map(ch => {
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
                        <div className="flex items-center justify-between mb-2">
                          <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                            <ch.icon className={cn('w-4.5 h-4.5', ch.color)} />
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium">{ch.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Audience */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Define Your Audience</h2>
                  <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>Target the right audience for maximum impact</p>
                </div>

                {/* Segment */}
                <div className="space-y-2">
                  <label className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                    <Users className="w-3 h-3 inline mr-1.5" /> CRM Segment
                  </label>
                  <div className={cn('rounded-xl border p-1 flex flex-wrap gap-1', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
                    {segments.map(seg => (
                      <button
                        key={seg}
                        onClick={() => setSelectedSegment(seg)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                          selectedSegment === seg
                            ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
                            : (isDark ? 'text-white/50 hover:bg-white/[0.06]' : 'text-black/50 hover:bg-black/[0.06]')
                        )}
                      >{seg}</button>
                    ))}
                  </div>
                </div>

                {/* Lifecycle Stage */}
                <div className="space-y-2">
                  <label className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                    <Target className="w-3 h-3 inline mr-1.5" /> Lifecycle Stage
                  </label>
                  <div className={cn('rounded-xl border p-1 flex flex-wrap gap-1', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
                    {lifecycleStages.map(stage => (
                      <button
                        key={stage}
                        onClick={() => setSelectedLifecycle(stage)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                          selectedLifecycle === stage
                            ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
                            : (isDark ? 'text-white/50 hover:bg-white/[0.06]' : 'text-black/50 hover:bg-black/[0.06]')
                        )}
                      >{stage}</button>
                    ))}
                  </div>
                </div>

                {/* Behavior Rules */}
                <div className="space-y-2">
                  <label className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                    <Zap className="w-3 h-3 inline mr-1.5" /> Behavior Rules
                    {selectedBehaviors.length > 0 && <span className="ml-2 text-emerald-400">({selectedBehaviors.length} selected)</span>}
                  </label>
                  <div className={cn('rounded-xl border p-1 flex flex-wrap gap-1', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
                    {behaviorRules.map(rule => {
                      const isSelected = selectedBehaviors.includes(rule);
                      return (
                        <button
                          key={rule}
                          onClick={() => toggleBehavior(rule)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                            isSelected
                              ? (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
                              : (isDark ? 'text-white/50 hover:bg-white/[0.06]' : 'text-black/50 hover:bg-black/[0.06]')
                          )}
                        >
                          {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                          {rule}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Budget & Schedule */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Budget & Schedule</h2>
                  <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>Set your campaign budget and timeline</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Total Budget */}
                  <div className={cn('rounded-2xl border p-4 space-y-2', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
                    <label className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                      <DollarSign className="w-3 h-3 inline mr-1.5" /> Total Budget (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 500000"
                      value={budget}
                      onChange={(e) => {
                        setBudget(e.target.value);
                        if (!dailyBudget) setDailyBudget(String(Math.round(parseInt(e.target.value) / 30)));
                      }}
                      className={cn('w-full bg-transparent text-lg font-semibold focus:outline-none', isDark ? 'text-white placeholder:text-white/20' : 'text-black placeholder:text-black/20')}
                    />
                    {dailyBudgetSuggestion > 0 && (
                      <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
                        Suggested daily budget: ₹{dailyBudgetSuggestion.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Daily Budget */}
                  <div className={cn('rounded-2xl border p-4 space-y-2', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
                    <label className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                      <Clock className="w-3 h-3 inline mr-1.5" /> Daily Budget (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 16666"
                      value={dailyBudget}
                      onChange={(e) => setDailyBudget(e.target.value)}
                      className={cn('w-full bg-transparent text-lg font-semibold focus:outline-none', isDark ? 'text-white placeholder:text-white/20' : 'text-black placeholder:text-black/20')}
                    />
                  </div>

                  {/* Start Date */}
                  <div className={cn('rounded-2xl border p-4 space-y-2', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
                    <label className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                      <Calendar className="w-3 h-3 inline mr-1.5" /> Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={cn('w-full bg-transparent text-sm font-medium focus:outline-none', isDark ? 'text-white' : 'text-black')}
                    />
                  </div>

                  {/* End Date */}
                  <div className={cn('rounded-2xl border p-4 space-y-2', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
                    <label className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                      <Calendar className="w-3 h-3 inline mr-1.5" /> End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={cn('w-full bg-transparent text-sm font-medium focus:outline-none', isDark ? 'text-white' : 'text-black')}
                    />
                  </div>
                </div>

                {daysDiff > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn('rounded-2xl border p-4 flex items-center justify-between', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                      <span className="text-sm font-medium">Campaign Duration</span>
                    </div>
                    <span className="text-lg font-bold">{daysDiff} days</span>
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 5: Content & CTA */}
            {currentStep === 5 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Content & CTA</h2>
                  <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>Finalize your campaign content and call-to-action</p>
                </div>

                {/* Campaign Name */}
                <div className={cn('rounded-2xl border p-4 space-y-2', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
                  <label className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                    <Tag className="w-3 h-3 inline mr-1.5" /> Campaign Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Summer Lead Blitz 2026"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className={cn('w-full bg-transparent text-lg font-semibold focus:outline-none', isDark ? 'text-white placeholder:text-white/20' : 'text-black placeholder:text-black/20')}
                  />
                </div>

                {/* CTA Text */}
                <div className={cn('rounded-2xl border p-4 space-y-2', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
                  <label className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                    <Send className="w-3 h-3 inline mr-1.5" /> CTA Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Get Started Free"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className={cn('w-full bg-transparent text-sm font-medium focus:outline-none', isDark ? 'text-white placeholder:text-white/20' : 'text-black placeholder:text-black/20')}
                  />
                </div>

                {/* Content Type */}
                <div className="space-y-2">
                  <label className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                    <FileText className="w-3 h-3 inline mr-1.5" /> Content Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {contentTypes.map(ct => {
                      const isSelected = selectedContentType === ct.id;
                      return (
                        <button
                          key={ct.id}
                          onClick={() => setSelectedContentType(ct.id)}
                          className={cn(
                            'rounded-2xl border p-4 text-left transition-all',
                            isSelected
                              ? (isDark ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-emerald-500/50 bg-emerald-50')
                              : (isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]')
                          )}
                        >
                          <ct.icon className={cn('w-5 h-5 mb-2', isDark ? 'text-white/40' : 'text-black/40')} />
                          <p className="text-sm font-medium">{ct.label}</p>
                          <p className={cn('text-[10px] mt-1', isDark ? 'text-white/30' : 'text-black/30')}>{ct.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tone */}
                <div className="space-y-2">
                  <label className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                    <Lightbulb className="w-3 h-3 inline mr-1.5" /> Tone
                  </label>
                  <div className={cn('rounded-xl border p-1 flex flex-wrap gap-1', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
                    {toneOptions.map(tone => (
                      <button
                        key={tone.id}
                        onClick={() => setSelectedTone(tone.id)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                          selectedTone === tone.id
                            ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
                            : (isDark ? 'text-white/50 hover:bg-white/[0.06]' : 'text-black/50 hover:bg-black/[0.06]')
                        )}
                      >{tone.label}</button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
                  <h3 className={cn('text-sm font-semibold mb-3', isDark ? 'text-white/70' : 'text-black/70')}>Campaign Summary</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Objective</p>
                      <p className="text-sm font-medium capitalize">{selectedObjective?.replace('-', ' ') || '—'}</p>
                    </div>
                    <div>
                      <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Channels</p>
                      <p className="text-sm font-medium">{selectedChannels.length || 0} selected</p>
                    </div>
                    <div>
                      <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Budget</p>
                      <p className="text-sm font-medium">₹{parseInt(budget || '0').toLocaleString()}</p>
                    </div>
                    <div>
                      <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Duration</p>
                      <p className="text-sm font-medium">{daysDiff} days</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={currentStep === 1}
            className={cn(
              'gap-2 rounded-xl',
              currentStep === 1 ? 'opacity-30 cursor-not-allowed' : '',
              isDark ? 'text-white/50 hover:text-white hover:bg-white/[0.06]' : 'text-black/50 hover:text-black hover:bg-black/[0.06]'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          {currentStep < 5 ? (
            <Button
              onClick={goNext}
              disabled={!canNext()}
              className={cn(
                'px-6 py-2 text-sm font-medium rounded-xl gap-2',
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
              onClick={() => navigateTo('campaigns')}
              disabled={!canNext()}
              className={cn(
                'px-6 py-2 text-sm font-medium rounded-xl gap-2',
                canNext()
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'opacity-30 cursor-not-allowed'
              )}
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
