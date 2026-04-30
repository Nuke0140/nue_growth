'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Plus,
  ListPlus,
  UserPlus,
  CalendarOff,
  CheckCircle2,
} from 'lucide-react';
import { useErpStore } from '../../erp-store';

interface FabAction {
  icon: typeof ListPlus;
  label: string;
  action: () => void;
  color: string;
  show: boolean;
}

export function MobileFab() {
  const { openCreateModal, navigateTo } = useErpStore();
  const [expanded, setExpanded] = useState(false);

  // Check for pending approvals count (mock)
  const pendingApprovals = 3;

  const actions: FabAction[] = [
    {
      icon: ListPlus,
      label: 'New Task',
      action: () => {
        openCreateModal('task');
        setExpanded(false);
      },
      color: 'bg-blue-500',
      show: true,
    },
    {
      icon: UserPlus,
      label: 'Add Employee',
      action: () => {
        openCreateModal('employee');
        setExpanded(false);
      },
      color: 'bg-emerald-500',
      show: true,
    },
    {
      icon: CalendarOff,
      label: 'Apply Leave',
      action: () => {
        openCreateModal('leave');
        setExpanded(false);
      },
      color: 'bg-amber-500',
      show: true,
    },
    {
      icon: CheckCircle2,
      label: 'Quick Approve',
      action: () => {
        navigateTo('approvals');
        setExpanded(false);
      },
      color: 'bg-red-500',
      show: pendingApprovals > 0,
    },
  ];

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const visibleActions = actions.filter((a) => a.show);

  return (
    <div className="md:hidden fixed bottom-4 right-4 z-50">
      {/* Backdrop overlay */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[var(--app-overlay)] backdrop-blur-sm"
            onClick={() => setExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Radial menu items */}
      <AnimatePresence>
        {expanded && (
          <div className="absolute bottom-16 right-2 flex flex-col items-end gap-3">
            {visibleActions.map((action, idx) => {
              const Icon = action.icon;
              const angle = -90 - (idx * (60 / visibleActions.length)) - 30;
              const rad = (angle * Math.PI) / 180;
              const radius = 80;
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;

              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                  animate={{ opacity: 1, scale: 1, x, y }}
                  exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                  transition={{
                    type: 'spring',
                    damping: 20,
                    stiffness: 300,
                    delay: idx * 0.05,
                  }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs font-medium text-[var(--app-text)] bg-[var(--app-card-bg)] border border-[var(--app-border)] px-2.5 py-1 rounded-[var(--app-radius-lg)] shadow-[var(--app-shadow-md)]-lg whitespace-nowrap">
                    {action.label}
                  </span>
                  <button
                    onClick={action.action}
                    className={cn(
                      'w-11 h-10  rounded-full flex items-center justify-center shadow-[var(--app-shadow-md)]-lg transition-transform hover:scale-110 active:scale-95',
                      action.color,
                      'text-white'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main FAB button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleExpanded}
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center shadow-[var(--app-shadow-md)]-xl transition-colors relative',
          expanded ? 'bg-[var(--app-card-bg)]' : 'bg-[var(--app-accent)]'
        )}
        style={{ border: expanded ? '2px solid var(--app-border-strong)' : 'none' }}
      >
        {/* Pending approvals badge */}
        {!expanded && pendingApprovals > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1">
            {pendingApprovals}
          </span>
        )}
        <motion.div
          animate={{ rotate: expanded ? 45 : 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <Plus
            className={cn('w-6 h-6', expanded ? 'text-[var(--app-text)]' : 'text-white')}
          />
        </motion.div>
      </motion.button>
    </div>
  );
}
