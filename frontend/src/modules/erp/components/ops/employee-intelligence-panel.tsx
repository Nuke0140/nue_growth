'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Activity,
  Flame,
  TrendingUp,
  TrendingDown,
  User,
  Briefcase,
  Brain,
  Sparkles,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────

interface EmployeeIntelligence {
  employeeId: string;
  name: string;
  workloadPercent: number;
  burnoutRisk: 'low' | 'medium' | 'high' | 'critical';
  performanceTrend: number[]; // last 6 months
  skills: string[];
  availability: string;
  activeProjects: number;
}

interface EmployeeIntelligencePanelProps {
  data: EmployeeIntelligence;
}

// ── Helpers ────────────────────────────────────────────

const BURNOUT_CONFIG: Record<
  string,
  { color: string; bg: string; label: string; icon: typeof ShieldCheck; recommendation: string; percent: number }
> = {
  low: {
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.1)',
    label: 'Low Risk',
    icon: ShieldCheck,
    recommendation: 'Employee is in a healthy state. Maintain current workload balance.',
    percent: 15,
  },
  medium: {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    label: 'Medium Risk',
    icon: ShieldAlert,
    recommendation: 'Consider redistributing tasks or providing additional support.',
    percent: 45,
  },
  high: {
    color: '#ef4444',
    bg: 'var(--app-danger-bg)',
    label: 'High Risk',
    icon: ShieldAlert,
    recommendation: 'Immediate action needed. Reduce workload and schedule check-in.',
    percent: 75,
  },
  critical: {
    color: '#dc2626',
    bg: 'rgba(220,38,38,0.12)',
    label: 'Critical',
    icon: ShieldX,
    recommendation: 'Escalate to manager. Mandatory break and workload reassessment.',
    percent: 92,
  },
};

const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

function generateHeatmapData(): number[][] {
  // Generate 7 days x 24 hours of workload data
  const data: number[][] = [];
  for (let d = 0; d < 7; d++) {
    const row: number[] = [];
    for (let h = 0; h < 24; h++) {
      if (h < 6 || h > 21) {
        row.push(0);
      } else if (h >= 9 && h <= 17) {
        // Work hours: higher intensity
        row.push(Math.floor(Math.random() * 60) + 30 + (h === 12 ? -20 : 0));
      } else {
        // Off hours
        row.push(Math.floor(Math.random() * 20));
      }
    }
    data.push(row);
  }
  return data;
}

function getHeatmapColor(value: number): string {
  if (value === 0) return 'var(--app-hover-bg)';
  if (value < 20) return 'rgba(34,197,94,0.2)';
  if (value < 40) return 'rgba(34,197,94,0.4)';
  if (value < 60) return 'rgba(245,158,11,0.4)';
  if (value < 80) return 'rgba(245,158,11,0.7)';
  return 'rgba(239,68,68,0.6)';
}

// ── Sub-components ─────────────────────────────────────

function WorkloadHeatmap() {
  const [tooltip, setTooltip] = useState<{
    day: number;
    hour: number;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  const data = useMemo(() => generateHeatmapData(), []);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4" style={{ color: 'var(--app-text-secondary)' }} />
        <span className="text-xs font-medium" style={{ color: 'var(--app-text)' }}>
          Workload Heatmap
        </span>
        <span className="text-[10px]" style={{ color: 'var(--app-text-muted)' }}>
          7-day view
        </span>
      </div>

      {/* Hour labels (top) */}
      <div className="flex gap-[3px] mb-1" style={{ paddingLeft: 32 }}>
        {Array.from({ length: 24 }, (_, h) => (
          <div
            key={h}
            className="text-[8px] text-center shrink-0"
            style={{
              width: 14,
              color: h % 3 === 0 ? 'var(--app-text-muted)' : 'transparent',
            }}
          >
            {h % 3 === 0 ? `${h}` : ''}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex flex-col gap-[3px]">
        {data.map((row, dayIdx) => (
          <div key={dayIdx} className="flex items-center gap-[3px]">
            {/* Day label */}
            <div
              className="text-[9px] w-8 shrink-0 text-right pr-2 font-medium"
              style={{
                color:
                  dayIdx === todayIdx
                    ? 'var(--app-accent)'
                    : 'var(--app-text-muted)',
              }}
            >
              {days[dayIdx]}
            </div>

            {/* Cells */}
            {row.map((value, hourIdx) => (
              <div
                key={hourIdx}
                className="shrink-0 rounded-[var(--app-radius-sm)] cursor-pointer transition-transform hover:scale-150 hover:z-10 relative"
                style={{
                  width: 14,
                  height: 14,
                  backgroundColor: getHeatmapColor(value),
                  outline:
                    dayIdx === todayIdx
                      ? '1px solid var(--app-selection-bg)'
                      : undefined,
                }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltip({
                    day: dayIdx,
                    hour: hourIdx,
                    value,
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[9px]" style={{ color: 'var(--app-text-muted)' }}>
          Low
        </span>
        <div className="flex gap-[2px]">
          {[
            'rgba(34,197,94,0.2)',
            'rgba(34,197,94,0.4)',
            'rgba(245,158,11,0.4)',
            'rgba(245,158,11,0.7)',
            'rgba(239,68,68,0.6)',
          ].map((c, i) => (
            <div
              key={i}
              className="rounded-[var(--app-radius-sm)]"
              style={{ width: 10, height: 10, backgroundColor: c }}
            />
          ))}
        </div>
        <span className="text-[9px]" style={{ color: 'var(--app-text-muted)' }}>
          High
        </span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed z-50 pointer-events-none px-2 py-1.5 rounded-[var(--app-radius-md)] text-[10px]"
          style={{
            left: tooltip.x,
            top: tooltip.y - 36,
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--app-elevated)',
            border: '1px solid var(--app-border-strong)',
            color: 'var(--app-text)',
          }}
        >
          {days[tooltip.day]} {tooltip.hour}:00 — {tooltip.value}% load
        </motion.div>
      )}
    </div>
  );
}

function BurnoutIndicator({ risk }: { risk: string }) {
  const config = BURNOUT_CONFIG[risk] || BURNOUT_CONFIG.low;
  const Icon = config.icon;
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference - (config.percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="var(--app-border)"
            strokeWidth="8"
          />
          {/* Progress arc */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={config.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            transform="rotate(-90 50 50)"
            style={{
              filter: `drop-shadow(0 0 6px ${config.color}40)`,
            }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <Icon className="w-5 h-5" style={{ color: config.color }} />
          </motion.div>
          <span
            className="text-lg font-bold mt-0.5"
            style={{ color: config.color }}
          >
            {config.percent}%
          </span>
        </div>
      </div>
      <p className="text-[11px] font-medium mt-2" style={{ color: 'var(--app-text)' }}>
        Burnout Risk
      </p>
      <span
        className="text-[10px] font-medium px-2 py-0.5 rounded-full mt-1"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        {config.label}
      </span>
      <p
        className="text-[10px] mt-2 text-center max-w-[200px] leading-relaxed"
        style={{ color: 'var(--app-text-muted)' }}
      >
        {config.recommendation}
      </p>
    </div>
  );
}

function PerformanceTrend({ data }: { data: number[] }) {
  const isTrendingUp = data[data.length - 1] > data[0];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const width = 200;
  const height = 60;
  const padding = 4;

  const points = data.map((v, i) => ({
    x: padding + (i / (data.length - 1)) * (width - padding * 2),
    y: padding + (1 - (v - min) / range) * (height - padding * 2),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" style={{ color: 'var(--app-text-secondary)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--app-text)' }}>
            Performance Trend
          </span>
        </div>
        <div className="flex items-center gap-1">
          {isTrendingUp ? (
            <TrendingUp className="w-4 h-4" style={{ color: '#22c55e' }} />
          ) : (
            <TrendingDown className="w-4 h-4" style={{ color: '#ef4444' }} />
          )}
          <span
            className="text-[10px] font-medium"
            style={{ color: isTrendingUp ? '#22c55e' : '#ef4444' }}
          >
            {isTrendingUp ? 'Improving' : 'Declining'}
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: 60 }}>
        {/* Grid lines */}
        {[0, 0.5, 1].map((pct) => (
          <line
            key={pct}
            x1={0}
            y1={padding + pct * (height - padding * 2)}
            x2={width}
            y2={padding + pct * (height - padding * 2)}
            stroke="var(--app-border)"
            strokeWidth="1"
          />
        ))}

        {/* Area */}
        <motion.path
          d={areaPath}
          fill={isTrendingUp ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke={isTrendingUp ? '#22c55e' : '#ef4444'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 4px ${isTrendingUp ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'})`,
          }}
        />

        {/* Dots */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill={isTrendingUp ? '#22c55e' : '#ef4444'}
            stroke="#1b1c1e"
            strokeWidth="1.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
          />
        ))}
      </svg>

      {/* Month labels */}
      <div className="flex justify-between mt-1">
        {MONTHS.map((m, i) => (
          <span
            key={m}
            className="text-[8px]"
            style={{ color: 'var(--app-text-muted)' }}
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

function SkillTags({ skills }: { skills: string[] }) {
  const levels = ['beginner', 'intermediate', 'expert'] as const;
  const levelColors: Record<string, { bg: string; text: string }> = {
    beginner: { bg: 'var(--app-hover-bg)', text: 'var(--app-text-secondary)' },
    intermediate: { bg: 'var(--app-info-bg)', text: '#60a5fa' },
    expert: { bg: 'var(--app-accent-light)', text: 'var(--app-accent)' },
  };

  const skillData = skills.map((s) => {
    const level = levels[Math.floor(Math.random() * levels.length)];
    return { name: s, level };
  });

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4" style={{ color: 'var(--app-text-secondary)' }} />
        <span className="text-xs font-medium" style={{ color: 'var(--app-text)' }}>
          Skills
        </span>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
        {skillData.map((skill) => {
          const lc = levelColors[skill.level];
          return (
            <motion.button
              key={skill.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="shrink-0 px-2.5 py-1 rounded-[var(--app-radius-lg)] text-[10px] font-medium transition-colors"
              style={{
                backgroundColor: lc.bg,
                color: lc.text,
                border: '1px solid var(--app-border)',
              }}
            >
              {skill.name}
              <span className="ml-1 opacity-60">· {skill.level}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────

export function EmployeeIntelligencePanel({
  data,
}: EmployeeIntelligencePanelProps) {
  return (
    <div className="app-card p-0 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-app-xl py-4"
        style={{ borderBottom: '1px solid var(--app-border)' }}
      >
        <div
          className="flex items-center justify-center w-9 h-10  rounded-[var(--app-radius-lg)]"
          style={{ backgroundColor: 'var(--app-accent-light)' }}
        >
          <Brain className="w-5 h-5" style={{ color: 'var(--app-accent)' }} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>
            Employee Intelligence
          </h3>
          <p className="text-[11px]" style={{ color: 'var(--app-text-muted)' }}>
            {data.name} · {data.availability}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px]" style={{ color: 'var(--app-text-muted)' }}>
              Active Projects
            </p>
            <p className="text-lg font-bold" style={{ color: 'var(--app-text)' }}>
              {data.activeProjects}
            </p>
          </div>
          <div
            className="text-right"
          >
            <p className="text-[10px]" style={{ color: 'var(--app-text-muted)' }}>
              Workload
            </p>
            <div className="flex items-center gap-2">
              <p
                className="text-lg font-bold"
                style={{
                  color:
                    data.workloadPercent > 90
                      ? '#ef4444'
                      : data.workloadPercent > 70
                      ? '#f59e0b'
                      : '#22c55e',
                }}
              >
                {data.workloadPercent}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="p-app-xl grid grid-cols-1 lg:grid-cols-2 gap-app-2xl">
        {/* Workload Heatmap */}
        <WorkloadHeatmap />

        {/* Burnout Indicator */}
        <div className="flex items-start justify-center pt-2">
          <BurnoutIndicator risk={data.burnoutRisk} />
        </div>

        {/* Performance Trend */}
        <PerformanceTrend data={data.performanceTrend} />

        {/* Skill Tags */}
        <SkillTags skills={data.skills} />
      </div>
    </div>
  );
}
