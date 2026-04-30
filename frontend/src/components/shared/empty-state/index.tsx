'use client';

import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ANIMATION, CSS } from '@/styles/design-tokens';
import type { LucideIcon } from 'lucide-react';
import {
  Check,
  ChevronRight,
  Eye,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

export type EmptyStateIllustration = 'no-data' | 'no-results' | 'error' | 'getting-started';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  illustration?: EmptyStateIllustration;
  showDemoData?: boolean;
  demoDataPreview?: React.ReactNode;
  className?: string;
}

// ── SVG Illustrations ──────────────────────────────────

function NoDataIllustration() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <rect x="25" y="30" width="70" height="50" rx="6" stroke={CSS.borderStrong} strokeWidth="1.5" fill={CSS.hoverBg} />
      <path d="M25 36 L60 20 L95 36" stroke={CSS.borderStrong} strokeWidth="1.5" fill="none" />
      <motion.circle cx="60" cy="52" r="12" stroke={CSS.accent} strokeWidth="2" fill="none" opacity="0.6" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 0.6 }} transition={{ delay: 0.3 }} />
      <motion.line x1="69" y1="61" x2="76" y2="68" stroke={CSS.accent} strokeWidth="2" strokeLinecap="round" opacity="0.6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      {[{ x: 18, y: 22 }, { x: 100, y: 18 }, { x: 15, y: 70 }].map((dot, i) => (
        <motion.circle key={i} cx={dot.x} cy={dot.y} r="2" fill={CSS.textMuted} animate={{ y: [dot.y, dot.y - 4, dot.y] }} transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity }} />
      ))}
    </svg>
  );
}

function NoResultsIllustration() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <motion.circle cx="52" cy="45" r="20" stroke={CSS.borderStrong} strokeWidth="2" fill={CSS.hoverBg} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} />
      <motion.line x1="66" y1="59" x2="80" y2="73" stroke={CSS.borderStrong} strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
      <motion.text x="52" y="52" textAnchor="middle" fill={CSS.accent} fontSize="18" fontWeight="bold" opacity="0.5" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 0.5, y: 0 }} transition={{ delay: 0.6 }}>?</motion.text>
      {[{ x: 30, y: 20 }, { x: 85, y: 25 }, { x: 25, y: 75 }].map((dot, i) => (
        <motion.circle key={i} cx={dot.x} cy={dot.y} r="2.5" fill={CSS.textDisabled} animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }} />
      ))}
    </svg>
  );
}

function ErrorIllustration() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <motion.path d="M60 18 L98 82 H22 Z" stroke={CSS.borderStrong} strokeWidth="2" fill={CSS.hoverBg} strokeLinejoin="round" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} />
      <motion.line x1="60" y1="40" x2="60" y2="60" stroke={CSS.danger} strokeWidth="3" strokeLinecap="round" opacity="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <motion.circle cx="60" cy="70" r="2" fill={CSS.danger} opacity="0.5" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }} />
      <motion.g opacity="0.15" animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '25px 85px' }}>
        <circle cx="25" cy="85" r="8" stroke={CSS.text} strokeWidth="1.5" fill="none" />
        <circle cx="25" cy="85" r="3" stroke={CSS.text} strokeWidth="1.5" fill="none" />
      </motion.g>
      <motion.g opacity="0.1" animate={{ rotate: -360 }} transition={{ duration: 9, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '100px 20px' }}>
        <circle cx="100" cy="20" r="6" stroke={CSS.text} strokeWidth="1.5" fill="none" />
        <circle cx="100" cy="20" r="2" stroke={CSS.text} strokeWidth="1.5" fill="none" />
      </motion.g>
    </svg>
  );
}

function GettingStartedIllustration() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <motion.path d="M60 12 C60 12 48 30 48 55 L60 48 L72 55 C72 30 60 12 60 12 Z" stroke={CSS.textMuted} strokeWidth="1.5" fill={CSS.accentLight} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' as const }} />
      <motion.circle cx="60" cy="35" r="5" stroke={CSS.textMuted} strokeWidth="1.5" fill={CSS.hoverBg} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
      <path d="M48 55 L40 65 L50 58 Z" stroke={CSS.border} strokeWidth="1" fill={CSS.hoverBg} />
      <path d="M72 55 L80 65 L70 58 Z" stroke={CSS.border} strokeWidth="1" fill={CSS.hoverBg} />
      <motion.path d="M54 52 L60 72 L66 52" stroke={CSS.accent} strokeWidth="1.5" fill={CSS.accentLight} animate={{ d: ['M54 52 L60 72 L66 52', 'M55 52 L60 68 L65 52', 'M54 52 L60 72 L66 52'] }} transition={{ duration: 0.6, repeat: Infinity }} />
      {[
        { x: 20, y: 15 },
        { x: 95, y: 25 },
        { x: 15, y: 50 },
        { x: 105, y: 55 },
      ].map((star, i) => (
        <motion.circle key={i} cx={star.x} cy={star.y} r="1.5" fill={CSS.textDisabled} animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }} />
      ))}
    </svg>
  );
}

const ILLUSTRATIONS: Record<EmptyStateIllustration, () => React.JSX.Element> = {
  'no-data': NoDataIllustration,
  'no-results': NoResultsIllustration,
  error: ErrorIllustration,
  'getting-started': GettingStartedIllustration,
};

// ── Getting Started Checklist ──────────────────────────

function GettingStartedChecklist() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const steps = [
    { label: 'Create your first entity', sublabel: 'Set up the foundation' },
    { label: 'Invite team members', sublabel: 'Collaborate together' },
    { label: 'Set up your workflow', sublabel: 'Automate processes' },
  ];

  const toggle = (idx: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      {steps.map((step, idx) => {
        const isChecked = checked.has(idx);
        return (
          <motion.button
            key={idx}
            onClick={() => toggle(idx)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors w-full"
            style={{
              backgroundColor: isChecked ? CSS.successBg : CSS.hoverBg,
              border: `1px solid ${isChecked ? CSS.successBg : CSS.border}`,
            }}
            whileHover={{ x: 2 }}
          >
            <motion.div
              className="flex items-center justify-center w-5 h-5 rounded-md shrink-0"
              style={{
                backgroundColor: isChecked ? CSS.success : CSS.hoverBg,
                border: isChecked ? undefined : `1.5px solid ${CSS.borderStrong}`,
              }}
              animate={isChecked ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3, ...ANIMATION.springGentle }}
            >
              {isChecked && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' as const, stiffness: 500, damping: 25 }}>
                  <Check className="w-3 h-3" style={{ color: '#fff' }} />
                </motion.div>
              )}
            </motion.div>
            <div className="min-w-0">
              <p
                className="text-xs font-medium"
                style={{
                  color: isChecked ? CSS.textSecondary : CSS.text,
                  textDecoration: isChecked ? 'line-through' : undefined,
                }}
              >
                {step.label}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: CSS.textMuted }}>
                {step.sublabel}
              </p>
            </div>
            {!isChecked && (
              <ChevronRight className="w-3.5 h-3.5 ml-auto shrink-0" style={{ color: CSS.textDisabled }} />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────

const EmptyStateInner = memo(function EmptyStateInner({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  illustration,
  showDemoData,
  demoDataPreview,
  className,
}: EmptyStateProps) {
  const IllustrationComponent = illustration ? ILLUSTRATIONS[illustration] : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: ANIMATION.duration.slow, ease: 'easeOut' as const }}
      className={cn('flex flex-col items-center justify-center py-12 px-6 text-center', className)}
      role="status"
    >
      {/* Icon or Illustration */}
      {IllustrationComponent ? (
        <motion.div
          className="mb-5"
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: ANIMATION.duration.slow, ease: 'easeOut' as const }}
        >
          <IllustrationComponent />
        </motion.div>
      ) : Icon ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION.duration.slow, ease: 'easeOut' as const }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
            style={{ backgroundColor: CSS.hoverBg }}
          >
            <Icon className="w-7 h-7" style={{ color: CSS.textMuted }} />
          </motion.div>
        </motion.div>
      ) : null}

      {/* Title */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIMATION.duration.slow, delay: 0.1 }}
        className="text-sm font-semibold"
        style={{ color: CSS.textSecondary }}
      >
        {title}
      </motion.p>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIMATION.duration.slow, delay: 0.15 }}
        className="text-xs mt-1.5 max-w-xs leading-relaxed"
        style={{ color: CSS.textMuted }}
      >
        {description}
      </motion.p>

      {/* Getting Started Checklist */}
      {illustration === 'getting-started' && <GettingStartedChecklist />}

      {/* Demo Data Preview */}
      {showDemoData && demoDataPreview && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION.duration.slow, delay: 0.25 }}
          className="mt-6 w-full max-w-sm"
        >
          <div className="flex items-center justify-center gap-1.5 mb-3">
            <Eye className="w-3.5 h-3.5" style={{ color: CSS.textMuted }} />
            <span className="text-[11px]" style={{ color: CSS.textMuted }}>
              Preview of what this will look like
            </span>
          </div>
          <div
            className="rounded-lg p-4 opacity-40"
            style={{
              backgroundColor: CSS.hoverBg,
              border: `1px solid ${CSS.border}`,
            }}
          >
            {demoDataPreview}
          </div>
        </motion.div>
      )}

      {/* CTA Buttons */}
      {(primaryAction || secondaryAction) && illustration !== 'getting-started' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION.duration.slow, delay: 0.2 }}
          className="flex items-center gap-3 mt-6"
        >
          {primaryAction && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={primaryAction.onClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  primaryAction.onClick();
                }
              }}
              type="button"
              className="px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
              style={{
                backgroundColor: CSS.accent,
                color: '#fff',
                boxShadow: `0 2px 8px ${CSS.accent}40`,
              }}
            >
              {primaryAction.label}
            </motion.button>
          )}
          {secondaryAction && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={secondaryAction.onClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  secondaryAction.onClick();
                }
              }}
              type="button"
              className="px-4 py-2 rounded-lg text-xs font-medium transition-colors"
              style={{
                backgroundColor: 'transparent',
                color: CSS.textSecondary,
                border: `1px solid ${CSS.borderStrong}`,
              }}
            >
              {secondaryAction.label}
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
});

export const EmptyState = EmptyStateInner;
