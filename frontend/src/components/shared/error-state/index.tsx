'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ANIMATION, CSS } from '@/styles/design-tokens';
import type { LucideIcon } from 'lucide-react';
import { RefreshCw } from 'lucide-react';

// ── Types ──────────────────────────────────────────────

export interface ErrorStateProps {
  /** Headline text shown below the illustration */
  title?: string;
  /** Short error message (takes priority over description) */
  message?: string;
  /** Longer descriptive text */
  description?: string;
  /** Callback invoked when the retry button is clicked */
  onRetry?: () => void;
  /** Label for the retry button */
  retryLabel?: string;
  /** Optional Lucide icon rendered inside a floating container */
  icon?: LucideIcon;
  /** Additional CSS classes */
  className?: string;
}

// ── Error Illustration ─────────────────────────────────
// Dashed warning triangle with exclamation, floating dots,
// and subtle gear-like accents — mirrors the EmptyState style.

function ErrorIllustration() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      {/* Dashed triangle */}
      <motion.path
        d="M60 16 L100 84 H20 Z"
        stroke={CSS.borderStrong}
        strokeWidth="2"
        strokeDasharray="6 4"
        fill={CSS.hoverBg}
        strokeLinejoin="round"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      />

      {/* Exclamation line */}
      <motion.line
        x1="60"
        y1="40"
        x2="60"
        y2="58"
        stroke={CSS.danger}
        strokeWidth="3"
        strokeLinecap="round"
        opacity={0.6}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5 }}
      />

      {/* Exclamation dot */}
      <motion.circle
        cx="60"
        cy="68"
        r="2"
        fill={CSS.danger}
        opacity={0.6}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7 }}
      />

      {/* Rotating gear accent — bottom left */}
      <motion.g
        opacity={0.12}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '22px 88px' }}
      >
        <circle cx="22" cy="88" r="8" stroke={CSS.text} strokeWidth="1.5" fill="none" />
        <circle cx="22" cy="88" r="3" stroke={CSS.text} strokeWidth="1.5" fill="none" />
      </motion.g>

      {/* Counter-rotating gear accent — top right */}
      <motion.g
        opacity={0.1}
        animate={{ rotate: -360 }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '102px 18px' }}
      >
        <circle cx="102" cy="18" r="6" stroke={CSS.text} strokeWidth="1.5" fill="none" />
        <circle cx="102" cy="18" r="2" stroke={CSS.text} strokeWidth="1.5" fill="none" />
      </motion.g>

      {/* Floating dots */}
      {[
        { x: 14, y: 30 },
        { x: 106, y: 50 },
        { x: 18, y: 68 },
        { x: 98, y: 82 },
      ].map((dot, i) => (
        <motion.circle
          key={i}
          cx={dot.x}
          cy={dot.y}
          r="2"
          fill={CSS.textMuted}
          animate={{ y: [dot.y, dot.y - 5, dot.y] }}
          transition={{ duration: 2.8, delay: i * 0.35, repeat: Infinity }}
        />
      ))}
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────

const ErrorStateInner = memo(function ErrorStateInner({
  title = 'Something went wrong',
  message,
  description,
  onRetry,
  retryLabel = 'Try Again',
  icon: Icon,
  className,
}: ErrorStateProps) {
  const bodyText = message ?? description;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: ANIMATION.duration.slow, ease: 'easeOut' as const }}
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center',
        className,
      )}
      role="alert"
    >
      {/* Illustration or custom icon */}
      {Icon ? (
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
      ) : (
        <motion.div
          className="mb-5"
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: ANIMATION.duration.slow, ease: 'easeOut' as const }}
        >
          <ErrorIllustration />
        </motion.div>
      )}

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

      {/* Body text */}
      {bodyText && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION.duration.slow, delay: 0.15 }}
          className="text-xs mt-1.5 max-w-xs leading-relaxed"
          style={{ color: CSS.textMuted }}
        >
          {bodyText}
        </motion.p>
      )}

      {/* Retry button */}
      {onRetry && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION.duration.slow, delay: 0.2 }}
          className="mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onRetry();
              }
            }}
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
            style={{
              backgroundColor: CSS.accent,
              color: '#fff',
              boxShadow: `0 2px 8px ${CSS.accent}40`,
            }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {retryLabel}
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
});

export const ErrorState = ErrorStateInner;
