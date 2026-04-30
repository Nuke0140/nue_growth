'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  DollarSign,
  Calendar,
  CalendarClock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Users,
  CircleDot,
  ChevronRight,
  Activity,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────

interface ProjectIntelligence {
  projectId: string;
  name: string;
  health: 'excellent' | 'good' | 'at-risk' | 'critical';
  budget: number;
  actualSpend: number;
  progress: number;
  delayPrediction: number; // days predicted delay (0 = on time)
  teamSize: number;
  riskFactors: string[];
}

interface ProjectIntelligencePanelProps {
  data: ProjectIntelligence;
}

// ── Helpers ────────────────────────────────────────────

const HEALTH_CONFIG: Record<
  string,
  {
    color: string;
    bg: string;
    glow: string;
    label: string;
    icon: typeof ShieldCheck;
    pulse: boolean;
  }
> = {
  excellent: {
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.1)',
    glow: 'rgba(34,197,94,0.3)',
    label: 'Excellent',
    icon: ShieldCheck,
    pulse: false,
  },
  good: {
    color: '#3b82f6',
    bg: 'var(--app-info-bg)',
    glow: 'rgba(59,130,246,0.3)',
    label: 'Good',
    icon: ShieldCheck,
    pulse: false,
  },
  'at-risk': {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    glow: 'rgba(245,158,11,0.3)',
    label: 'At Risk',
    icon: ShieldAlert,
    pulse: true,
  },
  critical: {
    color: '#ef4444',
    bg: 'var(--app-danger-bg)',
    glow: 'rgba(239,68,68,0.4)',
    label: 'Critical',
    icon: ShieldX,
    pulse: true,
  },
};

function formatCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

function getRiskSeverity(factor: string): 'critical' | 'warning' {
  const criticalKeywords = ['budget', 'overdue', 'critical', 'blocked', 'resource', 'staffing'];
  return criticalKeywords.some((k) => factor.toLowerCase().includes(k))
    ? 'critical'
    : 'warning';
}

// ── Sub-components ─────────────────────────────────────

function HealthBadge({ health }: { health: string }) {
  const config = HEALTH_CONFIG[health] || HEALTH_CONFIG.good;
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="relative"
        animate={config.pulse ? { scale: [1, 1.04, 1] } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-[-6px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
          }}
          animate={
            config.pulse
              ? { opacity: [0.3, 0.6, 0.3] }
              : { opacity: 0.3 }
          }
          transition={{ duration: 2, repeat: Infinity }}
        />

        <div
          className="relative w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: config.bg,
            border: `2px solid ${config.color}40`,
          }}
        >
          <Icon className="w-8 h-8" style={{ color: config.color }} />
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm font-semibold mt-3"
        style={{ color: config.color }}
      >
        {config.label}
      </motion.p>
    </div>
  );
}

function BudgetBar({ budget, actualSpend }: { budget: number; actualSpend: number }) {
  const percentage = Math.min((actualSpend / budget) * 100, 100);
  const isOverBudget = actualSpend > budget;
  const isNearBudget = percentage >= 80 && !isOverBudget;

  const barColor = isOverBudget
    ? '#ef4444'
    : isNearBudget
    ? '#f59e0b'
    : '#22c55e';

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" style={{ color: 'var(--app-text-secondary)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--app-text)' }}>
            Budget vs Actual
          </span>
        </div>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${barColor}18`,
            color: barColor,
          }}
        >
          {percentage.toFixed(0)}% used
        </span>
      </div>

      {/* Budget bar */}
      <div
        className="h-3 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--app-hover-bg)' }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{
            backgroundColor: barColor,
            boxShadow: `0 0 8px ${barColor}40`,
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between mt-2">
        <div>
          <span className="text-[10px]" style={{ color: 'var(--app-text-muted)' }}>
            Budget
          </span>
          <p className="text-xs font-semibold" style={{ color: 'var(--app-text)' }}>
            {formatCurrency(budget)}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px]" style={{ color: 'var(--app-text-muted)' }}>
            Actual Spend
          </span>
          <p className="text-xs font-semibold" style={{ color: barColor }}>
            {formatCurrency(actualSpend)}
            {isOverBudget && (
              <span className="ml-1">(+{formatCurrency(actualSpend - budget)})</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function DelayPrediction({
  delayDays,
  progress,
}: {
  delayDays: number;
  progress: number;
}) {
  const isOnTime = delayDays === 0;

  // Generate milestone data
  const milestones = useMemo(() => {
    const total = 5;
    const completed = Math.floor((progress / 100) * total);
    const current = completed < total ? completed + 1 : null;
    return Array.from({ length: total }, (_, i) => ({
      id: i,
      completed: i < completed,
      current: i + 1 === current,
    }));
  }, [progress]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" style={{ color: 'var(--app-text-secondary)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--app-text)' }}>
            Timeline
          </span>
        </div>

        {isOnTime ? (
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
            <span className="text-[11px] font-medium" style={{ color: '#22c55e' }}>
              On Track
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <CalendarClock className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
            <span className="text-[11px] font-medium" style={{ color: '#ef4444' }}>
              {delayDays} days late expected
            </span>
          </div>
        )}
      </div>

      {/* Progress bar with milestones */}
      <div className="relative">
        {/* Track */}
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--app-hover-bg)' }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              backgroundColor: isOnTime ? '#22c55e' : '#f59e0b',
              boxShadow: isOnTime
                ? '0 0 8px rgba(34,197,94,0.3)'
                : '0 0 8px rgba(245,158,11,0.3)',
            }}
          />
        </div>

        {/* Milestone dots */}
        <div className="relative h-6 -mt-2">
          {milestones.map((m) => {
            const left = (m.id / (milestones.length - 1)) * 100;
            return (
              <motion.div
                key={m.id}
                className="absolute top-0 -translate-x-1/2"
                style={{ left: `${left}%` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: m.id * 0.15, type: 'spring' }}
              >
                {m.current ? (
                  <motion.div
                    className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: '#f59e0b',
                      boxShadow: '0 0 8px rgba(245,158,11,0.5)',
                    }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <CircleDot
                      className="w-2 h-2"
                      style={{ color: '#1b1c1e' }}
                    />
                  </motion.div>
                ) : m.completed ? (
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: '#22c55e',
                      boxShadow: '0 0 4px rgba(34,197,94,0.4)',
                    }}
                  />
                ) : (
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: 'var(--app-border-strong)',
                      border: '1.5px solid rgba(255,255,255,0.2)',
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Progress label */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px]" style={{ color: 'var(--app-text-muted)' }}>
          Progress
        </span>
        <span className="text-[10px] font-semibold" style={{ color: isOnTime ? '#22c55e' : '#f59e0b' }}>
          {progress}%
        </span>
      </div>

      {/* Delay calendar visualization */}
      {!isOnTime && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 p-2.5 rounded-lg flex items-center gap-3"
          style={{
            backgroundColor: 'rgba(239,68,68,0.06)',
            border: '1px solid var(--app-danger-bg)',
          }}
        >
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: 'var(--app-danger-bg)' }}
          >
            <AlertCircle className="w-4 h-4" style={{ color: '#ef4444' }} />
          </div>
          <div>
            <p className="text-[11px] font-medium" style={{ color: '#ef4444' }}>
              Delay Prediction
            </p>
            <p className="text-[10px]" style={{ color: 'var(--app-text-muted)' }}>
              AI predicts {delayDays} day delay. Consider resource reallocation.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function RiskFactors({ risks }: { risks: string[] }) {
  if (risks.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" style={{ color: 'var(--app-text-secondary)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--app-text)' }}>
            Risk Factors
          </span>
        </div>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: 'var(--app-danger-bg)',
            color: '#ef4444',
          }}
        >
          {risks.length} {risks.length === 1 ? 'risk' : 'risks'}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {risks.map((risk, idx) => {
          const severity = getRiskSeverity(risk);
          return (
            <motion.button
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors hover:bg-[var(--app-hover-bg)] w-full"
              style={{
                border: '1px solid var(--app-border)',
              }}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor:
                    severity === 'critical' ? '#ef4444' : '#f59e0b',
                  boxShadow:
                    severity === 'critical'
                      ? '0 0 6px rgba(239,68,68,0.4)'
                      : '0 0 6px rgba(245,158,11,0.4)',
                }}
              />
              <span className="text-[11px] flex-1" style={{ color: 'var(--app-text-secondary)' }}>
                {risk}
              </span>
              <ChevronRight
                className="w-3 h-3 shrink-0"
                style={{ color: 'var(--app-text-muted)' }}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────

export function ProjectIntelligencePanel({
  data,
}: ProjectIntelligencePanelProps) {
  const config = HEALTH_CONFIG[data.health] || HEALTH_CONFIG.good;

  return (
    <div className="app-card p-0 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: '1px solid var(--app-border)' }}
      >
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl"
          style={{ backgroundColor: config.bg }}
        >
          <Activity className="w-4.5 h-4.5" style={{ color: config.color }} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--app-text)' }}>
            Project Intelligence
          </h3>
          <p className="text-[11px] truncate" style={{ color: 'var(--app-text-muted)' }}>
            {data.name}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Users className="w-3.5 h-3.5" style={{ color: 'var(--app-text-muted)' }} />
          <span className="text-[11px]" style={{ color: 'var(--app-text-secondary)' }}>
            {data.teamSize} members
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Health Badge */}
        <div className="flex items-center justify-center">
          <HealthBadge health={data.health} />
        </div>

        {/* Budget Bar */}
        <BudgetBar budget={data.budget} actualSpend={data.actualSpend} />

        {/* Delay Prediction / Timeline */}
        <DelayPrediction delayDays={data.delayPrediction} progress={data.progress} />

        {/* Risk Factors */}
        <RiskFactors risks={data.riskFactors} />
      </div>
    </div>
  );
}
