'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Network,
  Clock,
  CalendarOff,
  Banknote,
  Wallet,
  BarChart3,
  FolderOpen,
  User,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useErpStore } from './erp-store';
import type { ErpPage } from './types';

// ---- Tab definitions ----
interface HrmSubPage {
  id: ErpPage;
  label: string;
  description: string;
  badge: string;
  icon: typeof Users;
}

interface HrmTab {
  key: string;
  label: string;
  icons: [typeof Users, ...typeof Users[]];
  pages: HrmSubPage[];
}

const hrmTabs: HrmTab[] = [
  {
    key: 'core',
    label: 'Core',
    icons: [Users, Network],
    pages: [
      { id: 'employees', label: 'Employees', description: '12 team members', badge: '12', icon: Users },
      { id: 'departments', label: 'Departments', description: '5 departments', badge: '5', icon: Network },
    ],
  },
  {
    key: 'time',
    label: 'Time',
    icons: [Clock, CalendarOff],
    pages: [
      { id: 'attendance', label: 'Attendance', description: 'Track time & presence', badge: '', icon: Clock },
      { id: 'leaves', label: 'Leaves', description: '5 pending requests', badge: '5', icon: CalendarOff },
    ],
  },
  {
    key: 'money',
    label: 'Money',
    icons: [Banknote, Wallet],
    pages: [
      { id: 'payroll', label: 'Payroll', description: '₹22.5L this month', badge: '', icon: Banknote },
      { id: 'compensation', label: 'Compensation', description: 'Salary bands', badge: '', icon: Wallet },
    ],
  },
  {
    key: 'growth',
    label: 'Growth',
    icons: [BarChart3],
    pages: [
      { id: 'performance', label: 'Performance', description: 'Review cycles', badge: '', icon: BarChart3 },
      { id: 'documents', label: 'Documents', description: 'Employee files', badge: '', icon: FolderOpen },
    ],
  },
  {
    key: 'docs',
    label: 'Docs',
    icons: [FolderOpen],
    pages: [
      { id: 'documents', label: 'All Documents', description: 'Centralized document hub', badge: '', icon: FolderOpen },
    ],
  },
];

// ---- Page Card ----
function PageCard({ page, index }: { page: HrmSubPage; index: number }) {
  const navigateTo = useErpStore((s) => s.navigateTo);
  const PageIcon = page.icon;

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => navigateTo(page.id)}
      className={cn(
        'ops-card group rounded-2xl border border-[rgba(255,255,255,0.06)] p-5 text-left',
        'transition-all duration-200 hover:border-[rgba(204,92,55,0.25)] hover:scale-[1.01]',
        'hover:shadow-lg hover:shadow-[rgba(204,92,55,0.06)]'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-xl bg-[rgba(255,255,255,0.04)] flex items-center justify-center group-hover:bg-[rgba(204,92,55,0.1)] transition-colors">
          <PageIcon className="w-5 h-5 text-[rgba(245,245,245,0.4)] group-hover:text-[#cc5c37] transition-colors" />
        </div>
        {page.badge && (
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[rgba(204,92,55,0.12)] text-[#cc5c37]">
            {page.badge}
          </span>
        )}
      </div>
      <h3 className="text-sm font-semibold text-[#f5f5f5] mb-1">{page.label}</h3>
      <p className="text-[12px] text-[rgba(245,245,245,0.4)]">{page.description}</p>
      <div className="flex items-center gap-1 mt-3 text-[11px] font-medium text-[rgba(245,245,245,0.3)] group-hover:text-[#cc5c37] transition-colors">
        <span>Open</span>
        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </motion.button>
  );
}

// ---- Main Page ----
export default function HrmPage() {
  const [activeTab, setActiveTab] = useState('core');
  const currentTab = hrmTabs.find((t) => t.key === activeTab) || hrmTabs[0];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
        {/* ---- Header ---- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-[#cc5c37]/15 flex items-center justify-center">
            <Users className="w-5 h-5 text-[#cc5c37]" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#f5f5f5]">
              Human Resources Management
            </h1>
            <p className="text-[13px] text-[rgba(245,245,245,0.4)]">
              Manage your team, attendance, payroll, and performance
            </p>
          </div>
        </motion.div>

        {/* ---- Tab Buttons ---- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex items-center gap-1 p-1 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] w-fit"
        >
          {hrmTabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200',
                  isActive
                    ? 'bg-[rgba(255,255,255,0.08)] text-[#f5f5f5] shadow-sm'
                    : 'text-[rgba(245,245,245,0.4)] hover:text-[rgba(245,245,245,0.7)]'
                )}
              >
                {tab.icons.map((Icon, i) => (
                  <Icon key={i} className={cn(
                    'w-3.5 h-3.5',
                    isActive ? 'text-[#cc5c37]' : ''
                  )} />
                ))}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* ---- Cards Grid ---- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {currentTab.pages.map((page, idx) => (
              <PageCard key={page.id} page={page} index={idx} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
