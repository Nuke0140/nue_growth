'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Plus, ExternalLink, Eye, Pencil, Users, TrendingUp,
  Share2, Lock, MessageSquare, Globe,
} from 'lucide-react';
import { whiteLabelReports } from './data/mock-data';

export default function WhiteLabelClientReportsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const card = cn(
    'rounded-2xl border shadow-sm',
    'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
  );

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>
              White Label Reports
            </h1>
            <p className={cn('text-sm mt-1', 'text-[var(--app-text-muted)]')}>
              Branded client dashboards
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
              isDark
                ? 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/30'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200',
            )}
          >
            <Plus className="w-4 h-4" />
            Create New Client Report
          </motion.button>
        </div>

        {/* Client Report Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {whiteLabelReports.map((client, i) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              whileHover={{ y: -2 }}
              className={cn(card, 'overflow-hidden')}
            >
              {/* Client Header with accent */}
              <div className="p-4 sm:p-5" style={{ borderLeft: `4px solid ${client.primaryColor}` }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Logo placeholder */}
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white font-bold text-lg"
                      style={{ backgroundColor: client.primaryColor }}
                    >
                      {client.clientName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                          {client.clientName}
                        </h3>
                        {client.isLive && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                            <Globe className="w-2.5 h-2.5" />
                            Live
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Share2 className={cn('w-3 h-3', 'text-[var(--app-text-muted)]')} />
                        <span className={cn('text-[10px] truncate', 'text-[var(--app-text-muted)]')}>
                          {client.shareableLink}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KPI Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {client.kpis.map((kpi) => (
                    <div
                      key={kpi.label}
                      className={cn(
                        'rounded-lg border p-2',
                        'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
                      )}
                    >
                      <p className={cn('text-[10px] truncate', 'text-[var(--app-text-muted)]')}>
                        {kpi.label}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className={cn('text-xs font-bold', 'text-[var(--app-text)]')}>
                          {kpi.value}
                        </span>
                        <span
                          className={cn(
                            'text-[10px] font-semibold',
                            kpi.change >= 0
                              ? 'text-emerald-400'
                              : 'text-red-400',
                          )}
                        >
                          {kpi.change >= 0 ? '+' : ''}{kpi.change}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ROI Summary */}
                <div
                  className={cn(
                    'rounded-xl border p-3 mb-4',
                    'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
                  )}
                >
                  <p className={cn('text-[10px] font-medium uppercase tracking-wider mb-2', 'text-[var(--app-text-muted)]')}>
                    ROI Summary
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Invested</p>
                      <p className={cn('text-xs font-bold', 'text-[var(--app-text)]')}>
                        ₹{(client.roiSummary.invested / 100000).toFixed(1)}L
                      </p>
                    </div>
                    <div>
                      <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Generated</p>
                      <p className={cn('text-xs font-bold', 'text-[var(--app-text)]')}>
                        ₹{(client.roiSummary.generated / 100000).toFixed(1)}L
                      </p>
                    </div>
                    <div>
                      <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>ROI</p>
                      <p className="text-xs font-bold text-emerald-400">{client.roiSummary.roi}%</p>
                    </div>
                  </div>
                  {/* ROI Progress bar */}
                  <div className={cn('mt-2 h-1.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(client.roiSummary.roi / 4, 100)}%` }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
                      className="h-full rounded-full bg-emerald-500"
                    />
                  </div>
                </div>

                {/* Access Permissions */}
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lock className={cn('w-3 h-3', 'text-[var(--app-text-muted)]')} />
                    <p className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                      Access
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {client.accessPermissions.map((perm) => (
                      <span
                        key={perm.email}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px]',
                          isDark ? 'bg-white/[0.04] text-zinc-400' : 'bg-black/[0.03] text-zinc-600',
                        )}
                      >
                        <Users className="w-2.5 h-2.5" />
                        {perm.name}
                        <span className={cn('font-semibold', perm.role === 'Admin' ? 'text-amber-400' : '')}>
                          ({perm.role})
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <MessageSquare className={cn('w-3 h-3', 'text-[var(--app-text-muted)]')} />
                    <p className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                      Recent Comments
                    </p>
                  </div>
                  <div className="space-y-2">
                    {client.comments.slice(0, 2).map((comment, ci) => (
                      <div
                        key={ci}
                        className={cn(
                          'rounded-lg border p-2',
                          'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn('text-[10px] font-semibold', 'text-[var(--app-text-secondary)]')}>
                            {comment.author}
                          </span>
                          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                            {comment.date}
                          </span>
                        </div>
                        <p className={cn('text-[11px] leading-relaxed', 'text-[var(--app-text-secondary)]')}>
                          {comment.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: 'var(--app-border)' }}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      'flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors',
                      isDark
                        ? 'text-white bg-white/[0.06] hover:bg-white/[0.1]'
                        : 'text-zinc-900 bg-black/[0.04] hover:bg-black/[0.08]',
                    )}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Report
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      'inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors',
                      isDark
                        ? 'bg-white/[0.06] text-zinc-300 hover:bg-white/[0.1]'
                        : 'bg-black/[0.04] text-zinc-600 hover:bg-black/[0.08]',
                    )}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      'inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-medium transition-colors',
                      isDark
                        ? 'bg-white/[0.06] text-zinc-300 hover:bg-white/[0.1]'
                        : 'bg-black/[0.04] text-zinc-600 hover:bg-black/[0.08]',
                    )}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Create New Client Report CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: whiteLabelReports.length * 0.06 + 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={cn(
              'rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center min-h-[300px] cursor-pointer',
              isDark ? 'border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]' : 'border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02]',
            )}
          >
            <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl mb-3', 'bg-[var(--app-hover-bg)]')}>
              <Plus className={cn('w-6 h-6', 'text-[var(--app-text-muted)]')} />
            </div>
            <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
              Create New Client Report
            </h3>
            <p className={cn('text-xs mt-1 text-center max-w-[200px]', 'text-[var(--app-text-muted)]')}>
              Set up a white-label report for a new client with custom branding
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
