'use client';

import React, { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import {
  Search,
  FileQuestion,
  AlertTriangle,
  Rocket,
  Check,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { ANIMATION } from '@/styles/design-tokens';

// ── Types ──────────────────────────────────────────────

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  illustration?: 'no-data' | 'no-results' | 'error' | 'getting-started';
  showDemoData?: boolean;
  demoDataPreview?: React.ReactNode;
  className?: string;
}

// ── SVG Illustrations ──────────────────────────────────

function NoDataIllustration() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      {/* Box */}
      <rect
        x="25"
        y="30"
        width="70"
        height="50"
        rx="6"
        stroke="var(--app-border-strong)"
        strokeWidth="1.5"
        fill="var(--app-hover-bg)"
      />
      {/* Box flap */}
      <path
        d="M25 36 L60 20 L95 36"
        stroke="var(--app-border-strong)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Magnifying glass */}
      <motion.circle
        cx="60"
        cy="52"
        r="12"
        stroke="var(--app-accent)"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ delay: 0.3 }}
      />
      <motion.line
        x1="69"
        y1="61"
        x2="76"
        y2="68"
        stroke="var(--app-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5 }}
      />
      {/* Floating dots */}
      {[{ x: 18, y: 22 }, { x: 100, y: 18 }, { x: 15, y: 70 }].map((dot, i) => (
        <motion.circle
          key={i}
          cx={dot.x}
          cy={dot.y}
          r="2"
          fill="var(--app-text-muted)"
          animate={{ y: [dot.y, dot.y - 4, dot.y] }}
          transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity }}
        />
      ))}
    </svg>
  );
}

function NoResultsIllustration() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      {/* Search circle */}
      <motion.circle
        cx="52"
        cy="45"
        r="20"
        stroke="var(--app-border-strong)"
        strokeWidth="2"
        fill="var(--app-hover-bg)"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      />
      {/* Handle */}
      <motion.line
        x1="66"
        y1="59"
        x2="80"
        y2="73"
        stroke="var(--app-border-strong)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4 }}
      />
      {/* Question mark */}
      <motion.text
        x="52"
        y="52"
        textAnchor="middle"
        fill="var(--app-accent)"
        fontSize="18"
        fontWeight="bold"
        opacity="0.5"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        ?
      </motion.text>
      {/* Scattered dots */}
      {[{ x: 30, y: 20 }, { x: 85, y: 25 }, { x: 25, y: 75 }].map((dot, i) => (
        <motion.circle
          key={i}
          cx={dot.x}
          cy={dot.y}
          r="2.5"
          fill="var(--app-text-disabled)"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
        />
      ))}
    </svg>
  );
}

function ErrorIllustration() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      {/* Warning triangle */}
      <motion.path
        d="M60 18 L98 82 H22 Z"
        stroke="var(--app-border-strong)"
        strokeWidth="2"
        fill="var(--app-hover-bg)"
        strokeLinejoin="round"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      />
      {/* Exclamation mark */}
      <motion.line
        x1="60"
        y1="40"
        x2="60"
        y2="60"
        stroke="#ef4444"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5 }}
      />
      <motion.circle
        cx="60"
        cy="70"
        r="2"
        fill="#ef4444"
        opacity="0.5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7 }}
      />
      {/* Gears */}
      <motion.g
        opacity="0.15"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '25px 85px' }}
      >
        <circle cx="25" cy="85" r="8" stroke="var(--app-text)" strokeWidth="1.5" fill="none" />
        <circle cx="25" cy="85" r="3" stroke="var(--app-text)" strokeWidth="1.5" fill="none" />
      </motion.g>
      <motion.g
        opacity="0.1"
        animate={{ rotate: -360 }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '100px 20px' }}
      >
        <circle cx="100" cy="20" r="6" stroke="var(--app-text)" strokeWidth="1.5" fill="none" />
        <circle cx="100" cy="20" r="2" stroke="var(--app-text)" strokeWidth="1.5" fill="none" />
      </motion.g>
    </svg>
  );
}

function GettingStartedIllustration() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      {/* Rocket body */}
      <motion.path
        d="M60 12 C60 12 48 30 48 55 L60 48 L72 55 C72 30 60 12 60 12 Z"
        stroke="var(--app-text-muted)"
        strokeWidth="1.5"
        fill="var(--app-accent-light)"
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' as const }}
      />
      {/* Window */}
      <motion.circle
        cx="60"
        cy="35"
        r="5"
        stroke="var(--app-text-muted)"
        strokeWidth="1.5"
        fill="var(--app-hover-bg)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      />
      {/* Fins */}
      <path d="M48 55 L40 65 L50 58 Z" stroke="var(--app-border)" strokeWidth="1" fill="var(--app-hover-bg)" />
      <path d="M72 55 L80 65 L70 58 Z" stroke="var(--app-border)" strokeWidth="1" fill="var(--app-hover-bg)" />
      {/* Flame */}
      <motion.path
        d="M54 52 L60 72 L66 52"
        stroke="var(--app-accent)"
        strokeWidth="1.5"
        fill="var(--app-accent-light)"
        animate={{ d: ['M54 52 L60 72 L66 52', 'M55 52 L60 68 L65 52', 'M54 52 L60 72 L66 52'] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
      {/* Stars */}
      {[
        { x: 20, y: 15 },
        { x: 95, y: 25 },
        { x: 15, y: 50 },
        { x: 105, y: 55 },
      ].map((star, i) => (
        <motion.circle
          key={i}
          cx={star.x}
          cy={star.y}
          r="1.5"
          fill="var(--app-text-disabled)"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
        />
      ))}
    </svg>
  );
}

const ILLUSTRATIONS: Record<string, () => React.JSX.Element> = {
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
              backgroundColor: isChecked
                ? 'rgba(34,197,94,0.06)'
                : 'var(--app-hover-bg)',
              border: `1px solid ${
                isChecked
                  ? 'rgba(34,197,94,0.15)'
                  : 'var(--app-border)'
              }`,
            }}
            whileHover={{ x: 2 }}
          >
            {/* Checkbox */}
            <motion.div
              className="flex items-center justify-center w-5 h-5 rounded-md shrink-0"
              style={{
                backgroundColor: isChecked
                  ? '#22c55e'
                  : 'var(--app-hover-bg)',
                border: isChecked
                  ? undefined
                  : '1.5px solid var(--app-border-strong)',
              }}
              animate={isChecked ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3, ...ANIMATION.springBounce }}
            >
              {isChecked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' as const, stiffness: 500, damping: 25 }}
                >
                  <Check className="w-3 h-3" style={{ color: '#fff' }} />
                </motion.div>
              )}
            </motion.div>

            <div className="min-w-0">
              <p
                className="text-xs font-medium"
                style={{
                  color: isChecked
                    ? 'var(--app-text-secondary)'
                    : 'var(--app-text)',
                  textDecoration: isChecked ? 'line-through' : undefined,
                }}
              >
                {step.label}
              </p>
              <p
                className="text-[10px] mt-0.5"
                style={{ color: 'var(--app-text-muted)' }}
              >
                {step.sublabel}
              </p>
            </div>

            {!isChecked && (
              <ChevronRight
                className="w-3.5 h-3.5 ml-auto shrink-0"
                style={{ color: 'var(--app-text-disabled)' }}
              />
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
  const IllustrationComponent = illustration
    ? ILLUSTRATIONS[illustration]
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: ANIMATION.durationSlow, ease: ANIMATION.easeOut }}
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center',
        className
      )}
      role="status"
    >
      {/* Icon or Illustration */}
      {IllustrationComponent ? (
        <motion.div
          className="mb-5"
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: ANIMATION.durationSlow, ease: ANIMATION.easeOut }}
        >
          <IllustrationComponent />
        </motion.div>
      ) : Icon ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION.durationSlow, ease: ANIMATION.easeOut }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
            style={{ backgroundColor: 'var(--app-hover-bg)' }}
          >
            <Icon
              className="w-7 h-7"
              style={{ color: 'var(--app-text-muted)' }}
            />
          </motion.div>
        </motion.div>
      ) : null}

      {/* Title */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIMATION.durationSlow, delay: 0.1 }}
        className="text-sm font-semibold"
        style={{ color: 'var(--app-text-secondary)' }}
      >
        {title}
      </motion.p>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIMATION.durationSlow, delay: 0.15 }}
        className="text-xs mt-1.5 max-w-xs leading-relaxed"
        style={{ color: 'var(--app-text-muted)' }}
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
          transition={{ duration: ANIMATION.durationSlow, delay: 0.25 }}
          className="mt-6 w-full max-w-sm"
        >
          <div className="flex items-center justify-center gap-1.5 mb-3">
            <Eye className="w-3.5 h-3.5" style={{ color: 'var(--app-text-muted)' }} />
            <span className="text-[11px]" style={{ color: 'var(--app-text-muted)' }}>
              Preview of what this will look like
            </span>
          </div>
          <div
            className="rounded-lg p-4 opacity-40"
            style={{
              backgroundColor: 'var(--app-hover-bg)',
              border: '1px solid var(--app-border)',
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
          transition={{ duration: ANIMATION.durationSlow, delay: 0.2 }}
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
                backgroundColor: 'var(--app-accent)',
                color: '#fff',
                boxShadow: '0 2px 8px var(--app-shadow-accent)',
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
                color: 'var(--app-text-secondary)',
                border: '1px solid var(--app-border-strong)',
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
