'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ElementType } from 'react';

// ── Types ──────────────────────────────────────────────

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  icon: ElementType;
  title: string;
  description: string;
  action?: EmptyStateAction;
  className?: string;
}

// ── Empty State ────────────────────────────────────────

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      {/* Floating icon */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}
        >
          <Icon className="w-7 h-7" style={{ color: 'var(--ops-text-muted)' }} />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-sm font-semibold"
        style={{ color: 'var(--ops-text-secondary)' }}
      >
        {title}
      </motion.p>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="text-xs mt-1.5 max-w-xs leading-relaxed"
        style={{ color: 'var(--ops-text-muted)' }}
      >
        {description}
      </motion.p>

      {/* CTA button */}
      {action && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          className="ops-btn-primary mt-6"
        >
          {action.label}
        </motion.button>
      )}
    </div>
  );
}
