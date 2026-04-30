'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OpsCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  badge?: string | React.ReactNode;
  hoverable?: boolean;
}

export function OpsCard({
  title,
  subtitle,
  children,
  className,
  onClick,
  icon: Icon,
  badge,
  hoverable = false,
}: OpsCardProps) {
  const Component = hoverable ? motion.div : 'div';
  const hoverProps = hoverable
    ? {
        whileHover: { y: -2 },
        transition: { type: 'tween', duration: 0.2 },
      }
    : {};

  return (
    <Component
      className={cn(
        'ops-card ops-glow p-6',
        onClick && 'cursor-pointer',
        hoverable && 'ops-card-hover',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
      {...hoverProps}
    >
      {(title || Icon || badge) && (
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {Icon && (
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                style={{ backgroundColor: 'var(--ops-accent-light)' }}
              >
                <Icon className="w-5 h-5" style={{ color: 'var(--ops-accent)' }} />
              </div>
            )}
            {(title || subtitle) && (
              <div className="min-w-0">
                {title && (
                  <h3
                    className="text-sm font-semibold truncate"
                    style={{ color: 'var(--ops-text)' }}
                  >
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p
                    className="text-xs mt-0.5 truncate"
                    style={{ color: 'var(--ops-text-muted)' }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
          {badge && (
            typeof badge === 'string' ? (
              <Badge
                variant="secondary"
                className="ops-badge shrink-0"
                style={{
                  backgroundColor: 'var(--ops-card-bg-light)',
                  color: 'var(--ops-text-secondary)',
                }}
              >
                {badge}
              </Badge>
            ) : (
              badge
            )
          )}
        </div>
      )}
      {children}
    </Component>
  );
}
