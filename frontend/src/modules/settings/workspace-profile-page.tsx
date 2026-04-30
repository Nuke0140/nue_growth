'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Building2, Check, CheckCircle2, Circle, ChevronDown, Globe, Save,
  Calendar, Briefcase, Users, MapPin, Clock,
} from 'lucide-react';
import { useSettingsStore } from './settings-store';
import { workspaceProfile as initialProfile } from './data/mock-data';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function WorkspaceProfilePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const setUnsavedChanges = useSettingsStore((s) => s.setUnsavedChanges);

  const [profile, setProfile] = useState(initialProfile);
  const [checklist, setChecklist] = useState(initialProfile.onboardingChecklist);

  const updateField = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const toggleChecklist = (index: number) => {
    setChecklist((prev) =>
      prev.map((item, i) => (i === index ? { ...item, completed: !item.completed } : item)),
    );
    setUnsavedChanges(true);
  };

  const completedCount = checklist.filter((c) => c.completed).length;
  const progressPct = Math.round((completedCount / checklist.length) * 100);

  const inputClass = cn(
    'w-full rounded-xl border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30',
    isDark
      ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-blue-500/50'
      : 'bg-black/[0.02] border-black/[0.08] text-black placeholder:text-black/25 focus:border-blue-500/50',
  );

  const selectClass = cn(
    'w-full rounded-xl border px-3 py-2.5 text-sm appearance-none transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer',
    isDark
      ? 'bg-white/[0.04] border-white/[0.08] text-white focus:border-blue-500/50'
      : 'bg-black/[0.02] border-black/[0.08] text-black focus:border-blue-500/50',
  );

  const labelClass = cn('text-xs font-medium', 'text-[var(--app-text-muted)]');

  const metadataItems = [
    { icon: Briefcase, label: 'Industry', value: profile.metadata.industry },
    { icon: Users, label: 'Team Size', value: profile.metadata.teamSize },
    { icon: Calendar, label: 'Founded', value: profile.metadata.founded },
    { icon: MapPin, label: 'Country', value: profile.metadata.country },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              'bg-[var(--app-hover-bg)]',
            )}>
              <Building2 className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Workspace Profile</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                Manage your workspace identity and defaults
              </p>
            </div>
          </div>
        </div>

        {/* ── Profile Form ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className={cn(
            'rounded-2xl border p-5 md:p-6',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}
        >
          <h3 className={cn('text-sm font-semibold mb-5', 'text-[var(--app-text)]')}>
            Workspace Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Workspace Name */}
            <div className="space-y-1.5">
              <label className={labelClass}>Workspace Name</label>
              <input
                type="text"
                value={profile.workspaceName}
                onChange={(e) => updateField('workspaceName', e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Company Legal Name */}
            <div className="space-y-1.5">
              <label className={labelClass}>Company Legal Name</label>
              <input
                type="text"
                value={profile.companyLegalName}
                onChange={(e) => updateField('companyLegalName', e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Domain */}
            <div className="space-y-1.5">
              <label className={labelClass}>Domain</label>
              <div className="relative">
                <input
                  type="text"
                  value={profile.domain}
                  onChange={(e) => updateField('domain', e.target.value)}
                  className={cn(inputClass, 'pr-20')}
                />
                <span className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                  'bg-[var(--app-success-bg)] text-[var(--app-success)]',
                )}>
                  <Globe className="w-3 h-3" />
                  Verified
                </span>
              </div>
            </div>

            {/* Timezone */}
            <div className="space-y-1.5">
              <label className={labelClass}>Timezone</label>
              <div className="relative">
                <select
                  value={profile.timezone}
                  onChange={(e) => updateField('timezone', e.target.value)}
                  className={selectClass}
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                  <option value="America/New_York">America/New_York (EST -5:00)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST -8:00)</option>
                  <option value="Europe/London">Europe/London (GMT +0:00)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
                  <option value="Asia/Singapore">Asia/Singapore (SGT +8:00)</option>
                  <option value="UTC">UTC</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--app-border-strong)' }} />
              </div>
            </div>

            {/* Currency */}
            <div className="space-y-1.5">
              <label className={labelClass}>Currency</label>
              <div className="relative">
                <select
                  value={profile.currency}
                  onChange={(e) => updateField('currency', e.target.value)}
                  className={selectClass}
                >
                  <option value="INR">INR (₹ Indian Rupee)</option>
                  <option value="USD">USD ($ US Dollar)</option>
                  <option value="EUR">EUR (€ Euro)</option>
                  <option value="GBP">GBP (£ British Pound)</option>
                  <option value="AED">AED (د.إ UAE Dirham)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--app-border-strong)' }} />
              </div>
            </div>

            {/* Locale */}
            <div className="space-y-1.5">
              <label className={labelClass}>Locale</label>
              <div className="relative">
                <select
                  value={profile.locale}
                  onChange={(e) => updateField('locale', e.target.value)}
                  className={selectClass}
                >
                  <option value="en-IN">English (India)</option>
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="hi-IN">Hindi (India)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--app-border-strong)' }} />
              </div>
            </div>

            {/* Date Format */}
            <div className="space-y-1.5">
              <label className={labelClass}>Date Format</label>
              <div className="relative">
                <select
                  value={profile.dateFormat}
                  onChange={(e) => updateField('dateFormat', e.target.value)}
                  className={selectClass}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--app-border-strong)' }} />
              </div>
            </div>

            {/* Default Dashboard */}
            <div className="space-y-1.5">
              <label className={labelClass}>Default Dashboard</label>
              <div className="relative">
                <select
                  value={profile.defaultDashboard}
                  onChange={(e) => updateField('defaultDashboard', e.target.value)}
                  className={selectClass}
                >
                  <option value="Executive Cockpit">Executive Cockpit</option>
                  <option value="Personal Overview">Personal Overview</option>
                  <option value="Team Performance">Team Performance</option>
                  <option value="Client Dashboard">Client Dashboard</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--app-border-strong)' }} />
              </div>
            </div>

            {/* Default Module Landing */}
            <div className="space-y-1.5 md:col-span-2">
              <label className={labelClass}>Default Module Landing</label>
              <div className="relative">
                <select
                  value={profile.defaultModuleLanding}
                  onChange={(e) => updateField('defaultModuleLanding', e.target.value)}
                  className={selectClass}
                >
                  <option value="analytics-dashboard">Analytics Dashboard</option>
                  <option value="crm-dashboard">CRM Dashboard</option>
                  <option value="project-board">Project Board</option>
                  <option value="billing-overview">Billing Overview</option>
                  <option value="ai-assistant">AI Assistant</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--app-border-strong)' }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Onboarding Checklist ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className={cn(
            'rounded-2xl border p-5 md:p-6',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                Onboarding Checklist
              </h3>
              <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-muted)]')}>
                {completedCount}/{checklist.length} completed
              </span>
            </div>
            <span className={cn('text-xs font-semibold', 'text-[var(--app-text-secondary)]')}>
              {progressPct}%
            </span>
          </div>

          {/* Progress bar */}
          <div className={cn('h-2 rounded-full mb-5 overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {checklist.map((item, i) => (
              <button
                key={i}
                onClick={() => toggleChecklist(i)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors w-full',
                  'hover:bg-[var(--app-hover-bg)]',
                )}
              >
                {item.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-disabled)]')} />
                )}
                <span className={cn(
                  'text-xs',
                  item.completed
                    ? (isDark ? 'text-white/40 line-through' : 'text-black/40 line-through')
                    : ('text-[var(--app-text)]'),
                )}>
                  {item.item}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Company Metadata ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className={cn(
            'rounded-2xl border p-5 md:p-6',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}
        >
          <h3 className={cn('text-sm font-semibold mb-4', 'text-[var(--app-text)]')}>
            Company Metadata
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metadataItems.map((meta) => (
              <div
                key={meta.label}
                className={cn(
                  'rounded-xl border p-3',
                  'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
                )}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <meta.icon className={cn('w-3.5 h-3.5', 'text-[var(--app-text-muted)]')} />
                  <span className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                    {meta.label}
                  </span>
                </div>
                <p className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                  {meta.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Save Button ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex justify-end"
        >
          <button
            onClick={() => setUnsavedChanges(true)}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors',
              isDark
                ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
            )}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </motion.div>
      </div>
    </div>
  );
}
