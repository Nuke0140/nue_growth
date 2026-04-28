'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  X,
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Eye,
  Trash2,
  BellRing,
} from 'lucide-react';
import type { Notification } from '../../types';
import { useErpStore } from '../../erp-store';

interface SmartNotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabKey = 'all' | 'alerts' | 'activity';

const priorityMap: Record<string, { icon: typeof Bell; color: string; bg: string; dotColor: string }> = {
  error: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', dotColor: 'bg-red-500' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', dotColor: 'bg-amber-500' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10', dotColor: 'bg-blue-500' },
  success: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', dotColor: 'bg-emerald-500' },
};

const priorityGroupOrder: Record<string, number> = {
  error: 0,
  warning: 1,
  info: 2,
  success: 3,
};

function relativeTime(ts: string): string {
  const now = Date.now();
  const then = new Date(ts).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function SmartNotificationPanel({ isOpen, onClose }: SmartNotificationPanelProps) {
  const { navigateTo } = useErpStore();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Use mock data-like structure for demo
    return [
      { id: 'n1', title: 'Critical: MediCare project over budget by ₹30,000', message: 'The MediCare Patient Portal has exceeded its allocated budget. Immediate review required.', type: 'error', read: false, timestamp: new Date(Date.now() - 1800000).toISOString(), actionUrl: 'projects' },
      { id: 'n2', title: 'New leave request from Sneha Reddy', message: '3 days casual leave requested from Apr 20-22. Pending your approval.', type: 'warning', read: false, timestamp: new Date(Date.now() - 3600000).toISOString(), actionUrl: 'approvals' },
      { id: 'n3', title: 'Task blocked: Risk management algorithm', message: 'Nikhil Das has flagged the risk management module as blocked. Dependencies not resolved.', type: 'error', read: false, timestamp: new Date(Date.now() - 7200000).toISOString(), actionUrl: 'tasks-board' },
      { id: 'n4', title: 'Invoice INV-2026-007 is overdue', message: 'MediCare Global invoice for ₹4.8L was due on Mar 31. Payment not received.', type: 'warning', read: false, timestamp: new Date(Date.now() - 14400000).toISOString(), actionUrl: 'projects' },
      { id: 'n5', title: 'Sprint review completed successfully', message: 'NexaBank project sprint 14 review completed. 8 story points delivered.', type: 'success', read: true, timestamp: new Date(Date.now() - 28800000).toISOString() },
      { id: 'n6', title: 'New employee onboarded: Rahul Sharma', message: 'Rahul Sharma has completed onboarding and is now active in Engineering.', type: 'info', read: true, timestamp: new Date(Date.now() - 43200000).toISOString(), actionUrl: 'employees' },
      { id: 'n7', title: 'SLA breach alert: FinEdge project', message: 'FinEdge Trading Platform SLA dropped below 85%. Client notification sent.', type: 'error', read: false, timestamp: new Date(Date.now() - 57600000).toISOString(), actionUrl: 'ai-ops' },
      { id: 'n8', title: 'Payroll processing started', message: 'April 2026 payroll batch processing has started. 12 records pending.', type: 'info', read: true, timestamp: new Date(Date.now() - 86400000).toISOString(), actionUrl: 'payroll' },
      { id: 'n9', title: 'Design review approved for ShopVerse', message: 'Homepage redesign V3 has been approved by the design lead.', type: 'success', read: true, timestamp: new Date(Date.now() - 172800000).toISOString() },
      { id: 'n10', title: 'System maintenance scheduled', message: 'Infrastructure maintenance window: Apr 15, 2:00 AM - 4:00 AM IST.', type: 'info', read: true, timestamp: new Date(Date.now() - 259200000).toISOString() },
    ];
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter((n) => !n.read && n.type === 'error').length;

  const filtered = useMemo(() => {
    let list = notifications;
    if (activeTab === 'alerts') {
      list = list.filter((n) => n.type === 'error' || n.type === 'warning');
    } else if (activeTab === 'activity') {
      list = list.filter((n) => n.type === 'info' || n.type === 'success');
    }
    return [...list].sort((a, b) => priorityGroupOrder[a.type] - priorityGroupOrder[b.type]);
  }, [notifications, activeTab]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleAction = useCallback(
    (notif: Notification) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
      if (notif.actionUrl) {
        navigateTo(notif.actionUrl as never);
        onClose();
      }
    },
    [navigateTo, onClose]
  );

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'alerts', label: 'Alerts', count: notifications.filter((n) => n.type === 'error' || n.type === 'warning').length },
    { key: 'activity', label: 'Activity', count: notifications.filter((n) => n.type === 'info' || n.type === 'success').length },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 h-full w-[420px] max-w-[90vw] flex flex-col shadow-2xl"
            style={{
              backgroundColor: '#1b1c1e',
              borderLeft: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-xl"
                  style={{ backgroundColor: 'rgba(204,92,55,0.1)' }}
                >
                  <Bell className="w-[18px] h-[18px]" style={{ color: '#cc5c37' }} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#f5f5f5]">Notifications</h2>
                  <p className="text-[11px] text-[rgba(245,245,245,0.35)]">
                    {unreadCount} unread
                    {criticalCount > 0 && (
                      <span className="text-red-400 ml-1.5">· {criticalCount} critical</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-medium text-[#cc5c37] hover:text-[#d46a44] transition-colors px-2 py-1 rounded-lg hover:bg-[rgba(204,92,55,0.08)]"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors text-[rgba(245,245,245,0.35)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 px-5 py-3 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    activeTab === tab.key
                      ? 'bg-[rgba(204,92,55,0.1)] text-[#cc5c37]'
                      : 'text-[rgba(245,245,245,0.4)] hover:text-[rgba(245,245,245,0.7)] hover:bg-[rgba(255,255,255,0.04)]'
                  )}
                >
                  {tab.label}
                  <span className={cn(
                    'text-[10px] min-w-[16px] h-4 flex items-center justify-center rounded-full px-1',
                    activeTab === tab.key
                      ? 'bg-[#cc5c37] text-white'
                      : 'bg-[rgba(255,255,255,0.06)] text-[rgba(245,245,245,0.5)]'
                  )}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Notification list */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
                  <BellRing className="w-8 h-8 text-[rgba(245,245,245,0.15)]" />
                  <p className="text-sm text-[rgba(245,245,245,0.4)]">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                  {filtered.map((notif, idx) => {
                    const config = priorityMap[notif.type] || priorityMap.info;
                    const NotifIcon = config.icon;
                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.2 }}
                        className={cn(
                          'flex items-start gap-3 px-5 py-3.5 transition-colors cursor-pointer group',
                          !notif.read
                            ? 'bg-[rgba(204,92,55,0.03)] hover:bg-[rgba(204,92,55,0.06)]'
                            : 'hover:bg-[rgba(255,255,255,0.02)]'
                        )}
                        onClick={() => handleAction(notif)}
                      >
                        {/* Icon */}
                        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5', config.bg)}>
                          <NotifIcon className={cn('w-4 h-4', config.color)} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={cn(
                              'text-[13px] leading-snug',
                              notif.read ? 'text-[rgba(245,245,245,0.5)]' : 'text-[#f5f5f5] font-medium'
                            )}>
                              {notif.title}
                            </span>
                            {!notif.read && (
                              <span className={cn('w-2 h-2 rounded-full shrink-0', config.dotColor)} />
                            )}
                          </div>
                          <p className="text-[12px] text-[rgba(245,245,245,0.3)] line-clamp-2 leading-relaxed">
                            {notif.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[11px] text-[rgba(245,245,245,0.2)]">
                              {relativeTime(notif.timestamp)}
                            </span>
                            {notif.actionUrl && (
                              <span className="text-[11px] font-medium text-[#cc5c37] opacity-0 group-hover:opacity-100 transition-opacity">
                                {notif.type === 'error' || notif.type === 'warning' ? 'Review' : 'View'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Dismiss */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(notif.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-lg text-[rgba(245,245,245,0.25)] hover:text-[rgba(245,245,245,0.5)] hover:bg-[rgba(255,255,255,0.06)] transition-all shrink-0 mt-0.5"
                          aria-label="Dismiss"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                onClick={() => {
                  navigateTo('ai-ops');
                  onClose();
                }}
                className="w-full text-center text-xs font-medium text-[#cc5c37] hover:text-[#d46a44] transition-colors py-1"
              >
                View alerts dashboard
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
