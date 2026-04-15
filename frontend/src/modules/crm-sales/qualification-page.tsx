'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  DollarSign, Shield, Target, Clock, Sparkles, Brain,
  UserCheck, Zap, Activity, Gauge, BarChart3, TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { mockQualificationData, mockSalesLeads } from './data/mock-data';
import type { QualificationData } from '@/modules/crm-sales/types';

function AiCircularWidget({ label, value, isDark }: { label: string; value: number; isDark: boolean }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 80 ? '#10b981' : value >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-xl p-4 border text-center',
        isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06] shadow-sm'
      )}
    >
      <div className="relative w-18 h-18 mx-auto mb-2" style={{ width: 72, height: 72 }}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeWidth="5" />
          <motion.circle
            cx="40" cy="40" r={radius} fill="none"
            stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('text-base font-bold', isDark ? 'text-white' : 'text-black')}>{value}%</span>
        </div>
      </div>
      <p className={cn('text-[10px] font-medium leading-tight', isDark ? 'text-white/50' : 'text-black/50')}>{label}</p>
    </motion.div>
  );
}

function BantCard({
  label,
  icon: Icon,
  score,
  maxScore,
  notes,
  checklist,
  isDark,
}: {
  label: string;
  icon: React.ElementType;
  score: number;
  maxScore: number;
  notes?: string;
  checklist?: string[];
  isDark: boolean;
}) {
  const pct = Math.round((score / maxScore) * 100);
  const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
  const textColor = pct >= 80
    ? isDark ? 'text-emerald-400' : 'text-emerald-600'
    : pct >= 50
      ? isDark ? 'text-amber-400' : 'text-amber-600'
      : isDark ? 'text-red-400' : 'text-red-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl p-5 border',
        isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06] shadow-sm'
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center',
          isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]'
        )}>
          <Icon className={cn('w-4 h-4', textColor)} />
        </div>
        <span className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-black')}>{label}</span>
        <span className={cn('ml-auto text-sm font-bold', textColor)}>{pct}%</span>
      </div>

      {/* Progress Bar */}
      <div className={cn('h-2 rounded-full overflow-hidden mb-2', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={cn('h-full rounded-full', barColor)}
        />
      </div>

      <div className={cn('text-[10px] mb-3', isDark ? 'text-white/30' : 'text-black/30')}>
        {score} / {maxScore}
      </div>

      {/* Notes */}
      {notes && (
        <p className={cn('text-xs mb-3 leading-relaxed', isDark ? 'text-white/50' : 'text-black/50')}>
          {notes}
        </p>
      )}

      {/* Checklist */}
      {checklist && checklist.length > 0 && (
        <div className="space-y-1.5">
          {checklist.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={cn(
                'w-4 h-4 rounded border flex items-center justify-center',
                i < Math.round((score / maxScore) * checklist.length)
                  ? isDark ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-emerald-100 border-emerald-300'
                  : isDark ? 'border-white/[0.1]' : 'border-black/[0.1]'
              )}>
                {i < Math.round((score / maxScore) * checklist.length) && (
                  <span className="text-[8px] text-emerald-500">✓</span>
                )}
              </div>
              <span className={cn('text-[11px]', isDark ? 'text-white/50' : 'text-black/50')}>{item}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function QualificationPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const eligibleLeads = useMemo(
    () => mockSalesLeads.filter(l => l.score > 50),
    []
  );

  const [selectedLeadId, setSelectedLeadId] = useState<string>(
    mockQualificationData[0]?.leadId || ''
  );

  const qualification = useMemo(
    () => mockQualificationData.find(q => q.leadId === selectedLeadId),
    [selectedLeadId]
  );

  const [urgency, setUrgency] = useState(qualification?.urgency || 7);
  const [decisionMaker, setDecisionMaker] = useState(qualification?.decisionMaker ?? true);

  const handleLeadChange = (id: string) => {
    setSelectedLeadId(id);
    const q = mockQualificationData.find(q => q.leadId === id);
    if (q) {
      setUrgency(q.urgency);
      setDecisionMaker(q.decisionMaker);
    }
  };

  if (!qualification) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>Select a lead to qualify</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <h1 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-black')}>
              Lead Qualification
            </h1>
            <Badge variant="outline" className={cn(
              'text-xs px-2.5 gap-1',
              isDark ? 'border-amber-500/30 text-amber-400' : 'border-amber-400/50 text-amber-600'
            )}>
              <Sparkles className="w-3 h-3" /> AI + BANT
            </Badge>
          </div>

          <Select value={selectedLeadId} onValueChange={handleLeadChange}>
            <SelectTrigger className={cn('w-[240px] h-9 rounded-xl', isDark ? 'border-white/[0.06] bg-white/[0.03]' : 'border-black/[0.06] bg-black/[0.02]')}>
              <SelectValue placeholder="Select lead..." />
            </SelectTrigger>
            <SelectContent>
              {eligibleLeads.map(l => (
                <SelectItem key={l.id} value={l.id}>
                  {l.firstName} {l.lastName} (Score: {l.score})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Score Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'rounded-2xl border p-8 flex flex-col sm:flex-row items-center gap-8',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06] shadow-sm'
          )}
        >
          {/* Large Score Circle */}
          <div className="relative" style={{ width: 160, height: 160 }}>
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r={64} fill="none" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeWidth="10" />
              <motion.circle
                cx="80" cy="80" r={64} fill="none"
                stroke={qualification.overallScore >= 80 ? '#10b981' : qualification.overallScore >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 64}
                initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 64 * (1 - qualification.overallScore / 100) }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-black')}>
                {qualification.overallScore}
              </span>
              <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>/ 100</span>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <p className={cn('text-sm mb-1', isDark ? 'text-white/50' : 'text-black/50')}>
              Lead Score for
            </p>
            <h2 className={cn('text-xl font-bold mb-1', isDark ? 'text-white' : 'text-black')}>
              {qualification.leadName}
            </h2>
            <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>
              Confidence: <span className={cn('font-bold', qualification.confidence >= 85 ? 'text-emerald-400' : 'text-amber-400')}>
                {qualification.confidence}%
              </span>
            </p>
            <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start">
              {qualification.decisionMaker && (
                <Badge className={cn('text-[10px] px-2 py-0 h-5 bg-emerald-500/10 text-emerald-400 border-0')}>
                  <UserCheck className="w-3 h-3 mr-1" /> Decision Maker
                </Badge>
              )}
              <Badge variant="outline" className={cn('text-[10px] px-2 py-0 h-5', isDark ? 'border-white/[0.08] text-white/50' : 'border-black/[0.08] text-black/50')}>
                Urgency: {qualification.urgency}/10
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* BANT Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BantCard
            label="Budget"
            icon={DollarSign}
            score={qualification.budget.score}
            maxScore={qualification.budget.maxScore}
            notes={qualification.budget.notes}
            checklist={['Budget allocated', 'Approved by finance', 'Clear spend range']}
            isDark={isDark}
          />
          <BantCard
            label="Authority"
            icon={Shield}
            score={qualification.authority.score}
            maxScore={qualification.authority.maxScore}
            notes={qualification.authority.notes}
            checklist={['Decision maker', 'Budget authority', 'Stakeholder buy-in']}
            isDark={isDark}
          />
          <BantCard
            label="Need"
            icon={Target}
            score={qualification.need.score}
            maxScore={qualification.need.maxScore}
            notes={qualification.need.notes}
            checklist={['Pain points identified', 'Solution fit', 'Timeline pressure']}
            isDark={isDark}
          />
          <BantCard
            label="Timeline"
            icon={Clock}
            score={qualification.timeline.score}
            maxScore={qualification.timeline.maxScore}
            notes={qualification.timeline.notes}
            checklist={['Decision timeline', 'Implementation plan', 'Budget cycle aligned']}
            isDark={isDark}
          />
        </div>

        {/* AI Widgets Row */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Brain className={cn('w-4 h-4', isDark ? 'text-amber-400' : 'text-amber-600')} />
            <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-black')}>
              AI-Powered Scoring
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <AiCircularWidget label="Demographic Score" value={Math.round((qualification.budget.score + qualification.authority.score) / 2 * 10)} isDark={isDark} />
            <AiCircularWidget label="Behavior Score" value={Math.round((qualification.need.score + qualification.timeline.score) / 2 * 10)} isDark={isDark} />
            <AiCircularWidget label="Urgency Score" value={qualification.urgency * 10} isDark={isDark} />
            <AiCircularWidget label="AI Purchase Intent" value={qualification.aiPurchaseIntent} isDark={isDark} />
            <AiCircularWidget label="Budget Confidence" value={Math.round(qualification.budget.score / qualification.budget.maxScore * 100)} isDark={isDark} />
            <AiCircularWidget label="Product Fit" value={qualification.productFit} isDark={isDark} />
          </div>
        </div>

        {/* Additional Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Decision Maker Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'rounded-2xl p-5 border',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06] shadow-sm'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <UserCheck className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                <span className={cn('text-xs font-semibold', isDark ? 'text-white/60' : 'text-black/60')}>
                  Decision Maker
                </span>
              </div>
              <Switch checked={decisionMaker} onCheckedChange={setDecisionMaker} />
            </div>
            <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
              {decisionMaker ? 'Confirmed as decision maker' : 'Not confirmed'}
            </p>
          </motion.div>

          {/* Pain Points */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className={cn(
              'rounded-2xl p-5 border',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06] shadow-sm'
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              <span className={cn('text-xs font-semibold', isDark ? 'text-white/60' : 'text-black/60')}>
                Pain Points
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {qualification.painPoints.map((point, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className={cn('text-[10px] px-2 py-0 h-5', isDark ? 'border-white/[0.08] text-white/50' : 'border-black/[0.08] text-black/50')}
                >
                  {point}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Urgency Slider */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              'rounded-2xl p-5 border',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06] shadow-sm'
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                <span className={cn('text-xs font-semibold', isDark ? 'text-white/60' : 'text-black/60')}>
                  Urgency
                </span>
              </div>
              <span className={cn('text-xs font-bold', isDark ? 'text-white' : 'text-black')}>
                {urgency}/10
              </span>
            </div>
            <Slider
              value={[urgency]}
              onValueChange={([v]) => setUrgency(v)}
              min={1}
              max={10}
              step={1}
              className={cn('w-full', isDark ? '[&_[role=slider]]:bg-white' : '[&_[role=slider]]:bg-black')}
            />
          </motion.div>

          {/* Confidence Meter */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={cn(
              'rounded-2xl p-5 border',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06] shadow-sm'
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              <Gauge className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              <span className={cn('text-xs font-semibold', isDark ? 'text-white/60' : 'text-black/60')}>
                Confidence
              </span>
              <span className={cn('ml-auto text-xs font-bold', qualification.confidence >= 85 ? 'text-emerald-400' : 'text-amber-400')}>
                {qualification.confidence}%
              </span>
            </div>
            <div className={cn('h-3 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${qualification.confidence}%` }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'h-full rounded-full',
                  qualification.confidence >= 85 ? 'bg-emerald-500' : qualification.confidence >= 70 ? 'bg-amber-500' : 'bg-red-500'
                )}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
