'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Palette, Upload, Type, Globe, Mail, FileText, Layout,
  Monitor, Droplets, Save, Eye, Image, Check,
} from 'lucide-react';
import { useSettingsStore } from './settings-store';
import { brandingConfig as initialConfig } from './data/mock-data';

const presetColors = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Violet', value: '#8b5cf6' },
];

const accentPresets = [
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Orange', value: '#f97316' },
];

const typographyOptions = ['Inter', 'Roboto', 'Poppins', 'Open Sans'];

const toggleSections = [
  { key: 'loginBranding', label: 'Login Page Branding', icon: Monitor, description: 'Customize login screen with your brand' },
  { key: 'emailBranding', label: 'Email Branding', icon: Mail, description: 'Apply brand to transactional emails' },
  { key: 'pdfBranding', label: 'PDF Branding', icon: FileText, description: 'Branded headers and footers in PDFs' },
  { key: 'reportBranding', label: 'Report Branding', icon: Layout, description: 'Custom report themes and logos' },
  { key: 'clientPortalBranding', label: 'Client Portal Branding', icon: Eye, description: 'White-label client-facing portal' },
  { key: 'watermarkEnabled', label: 'Watermark', icon: Droplets, description: 'Add watermark to exported documents' },
] as const;

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function BrandingWhiteLabelPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const setUnsavedChanges = useSettingsStore((s) => s.setUnsavedChanges);

  const [config, setConfig] = useState(initialConfig);
  const [customPrimary, setCustomPrimary] = useState(config.primaryColor);
  const [customAccent, setCustomAccent] = useState(config.accentColor);

  const updateConfig = (key: string, value: boolean | string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const toggleBranding = (key: keyof typeof initialConfig) => {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
    setUnsavedChanges(true);
  };

  const labelClass = cn('text-xs font-medium', 'text-[var(--app-text-muted)]');

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
              <Palette className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Branding & White Label</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                Customize your brand presence
              </p>
            </div>
          </div>
        </div>

        {/* ── Brand Preview Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'rounded-2xl border p-5 md:p-6',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}
        >
          <h3 className={cn('text-sm font-semibold mb-4', 'text-[var(--app-text)]')}>
            Live Brand Preview
          </h3>
          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: config.primaryColor + '40' }}
          >
            {/* Preview Header */}
            <div
              className="px-4 py-3 flex items-center gap-3"
              style={{ backgroundColor: config.primaryColor + '15' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: config.primaryColor }}
              >
                A
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: config.primaryColor }}>
                  AgencyOS
                </p>
                <p className="text-[10px]" style={{ color: config.primaryColor + '99' }}>
                  Powered by AgencyOS Platform
                </p>
              </div>
            </div>
            {/* Preview Body */}
            <div className="p-4 space-y-3" style={{ backgroundColor: 'var(--app-hover-bg)' }}>
              <div className="flex gap-2">
                <div className="h-6 rounded-md px-3 flex items-center text-[10px] font-medium text-white" style={{ backgroundColor: config.primaryColor }}>
                  Dashboard
                </div>
                <div className="h-6 rounded-md px-3 flex items-center text-[10px] font-medium" style={{ backgroundColor: config.accentColor + '20', color: config.accentColor }}>
                  Reports
                </div>
                <div className="h-6 rounded-md px-3 flex items-center text-[10px] font-medium" style={{ backgroundColor: config.primaryColor + '15', color: config.primaryColor }}>
                  Settings
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-20 rounded-lg" style={{ backgroundColor: config.primaryColor + '10' }} />
                <div className="flex-1 h-20 rounded-lg" style={{ backgroundColor: config.accentColor + '10' }} />
              </div>
              <p className="text-[10px]" style={{ fontFamily: config.typography, color: 'var(--app-overlay)' }}>
                Typography: {config.typography}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Branding Settings Form ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className={cn(
            'rounded-2xl border p-5 md:p-6 space-y-6',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}
        >
          <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
            Brand Assets
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <motion.div variants={fadeUp} className="space-y-1.5">
              <label className={labelClass}>Logo</label>
              <div className={cn(
                'h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors',
                isDark ? 'border-white/[0.12] hover:border-white/[0.2] hover:bg-white/[0.02]' : 'border-black/[0.12] hover:border-black/[0.2] hover:bg-black/[0.02]',
              )}>
                <Upload className={cn('w-6 h-6', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                  Click to upload logo
                </span>
                <span className={cn('text-[10px]', 'text-[var(--app-text-disabled)]')}>
                  SVG, PNG, or JPG (max 2MB)
                </span>
              </div>
            </motion.div>

            {/* Favicon Upload */}
            <motion.div variants={fadeUp} className="space-y-1.5">
              <label className={labelClass}>Favicon</label>
              <div className={cn(
                'h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors',
                isDark ? 'border-white/[0.12] hover:border-white/[0.2] hover:bg-white/[0.02]' : 'border-black/[0.12] hover:border-black/[0.2] hover:bg-black/[0.02]',
              )}>
                <Image className={cn('w-6 h-6', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                  Click to upload favicon
                </span>
                <span className={cn('text-[10px]', 'text-[var(--app-text-disabled)]')}>
                  ICO or PNG (32×32, 64×64)
                </span>
              </div>
            </motion.div>
          </div>

          {/* Primary Color */}
          <motion.div variants={fadeUp} className="space-y-2">
            <label className={labelClass}>Primary Color</label>
            <div className="flex flex-wrap items-center gap-2">
              {presetColors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => updateConfig('primaryColor', c.value)}
                  className={cn(
                    'h-9 w-9 rounded-xl transition-all relative',
                    config.primaryColor === c.value && 'ring-2 ring-offset-2',
                    isDark && 'ring-offset-[#0a0a0a]',
                  )}
                  style={{ backgroundColor: c.value, ringColor: c.value }}
                  title={c.name}
                >
                  {config.primaryColor === c.value && (
                    <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                  )}
                </button>
              ))}
              <div className="flex items-center gap-2 ml-2">
                <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Custom:</span>
                <input
                  type="text"
                  value={customPrimary}
                  onChange={(e) => {
                    setCustomPrimary(e.target.value);
                    if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
                      updateConfig('primaryColor', e.target.value);
                    }
                  }}
                  className={cn(
                    'w-24 rounded-lg border px-2 py-1 text-xs font-mono',
                    'bg-[var(--app-input-bg)] border-[var(--app-border)] text-[var(--app-text)]',
                  )}
                  placeholder="#6366f1"
                />
                <div
                  className="h-7 w-7 rounded-lg border"
                  style={{ backgroundColor: customPrimary }}
                />
              </div>
            </div>
          </motion.div>

          {/* Accent Color */}
          <motion.div variants={fadeUp} className="space-y-2">
            <label className={labelClass}>Accent Color</label>
            <div className="flex flex-wrap items-center gap-2">
              {accentPresets.map((c) => (
                <button
                  key={c.value}
                  onClick={() => updateConfig('accentColor', c.value)}
                  className={cn(
                    'h-9 w-9 rounded-xl transition-all relative',
                    config.accentColor === c.value && 'ring-2 ring-offset-2',
                    isDark && 'ring-offset-[#0a0a0a]',
                  )}
                  style={{ backgroundColor: c.value, ringColor: c.value }}
                  title={c.name}
                >
                  {config.accentColor === c.value && (
                    <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                  )}
                </button>
              ))}
              <div className="flex items-center gap-2 ml-2">
                <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Custom:</span>
                <input
                  type="text"
                  value={customAccent}
                  onChange={(e) => {
                    setCustomAccent(e.target.value);
                    if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
                      updateConfig('accentColor', e.target.value);
                    }
                  }}
                  className={cn(
                    'w-24 rounded-lg border px-2 py-1 text-xs font-mono',
                    'bg-[var(--app-input-bg)] border-[var(--app-border)] text-[var(--app-text)]',
                  )}
                  placeholder="#f59e0b"
                />
                <div
                  className="h-7 w-7 rounded-lg border"
                  style={{ backgroundColor: customAccent }}
                />
              </div>
            </div>
          </motion.div>

          {/* Typography */}
          <motion.div variants={fadeUp} className="space-y-2">
            <label className={labelClass}>Typography</label>
            <div className="flex flex-wrap gap-2">
              {typographyOptions.map((font) => (
                <button
                  key={font}
                  onClick={() => updateConfig('typography', font)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-medium transition-colors',
                    config.typography === font
                      ? ('bg-[var(--app-info-bg)] text-[var(--app-info)] border border-[var(--app-info)]/30')
                      : (isDark ? 'bg-white/[0.04] text-zinc-400 border border-white/[0.08] hover:bg-white/[0.06]' : 'bg-black/[0.02] text-zinc-600 border border-black/[0.06] hover:bg-black/[0.04]'),
                  )}
                  style={{ fontFamily: font }}
                >
                  {font}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Toggle Sections ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className={cn(
            'rounded-2xl border p-5 md:p-6',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}
        >
          <h3 className={cn('text-sm font-semibold mb-4', 'text-[var(--app-text)]')}>
            Branding Toggles
          </h3>
          <div className="space-y-1">
            {toggleSections.map((section) => {
              const Icon = section.icon;
              const isOn = config[section.key] as boolean;
              return (
                <div
                  key={section.key}
                  className={cn(
                    'flex items-center justify-between gap-4 px-3 py-3 rounded-xl transition-colors',
                    'hover:bg-[var(--app-hover-bg)]',
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                      'bg-[var(--app-hover-bg)]',
                    )}>
                      <Icon className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                    </div>
                    <div className="min-w-0">
                      <p className={cn('text-xs font-medium', 'text-[var(--app-text)]')}>
                        {section.label}
                      </p>
                      <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBranding(section.key)}
                    className={cn(
                      'relative w-10 h-6 rounded-full transition-colors shrink-0',
                      isOn ? 'bg-emerald-500' : ('bg-[var(--app-hover-bg)]'),
                    )}
                  >
                    <motion.div
                      animate={{ x: isOn ? 20 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Custom Domain ── */}
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
            Custom Domain
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={config.customDomain || ''}
                onChange={(e) => updateConfig('customDomain', e.target.value)}
                className={cn(
                  'w-full rounded-xl border px-3 py-2.5 text-sm',
                  'bg-[var(--app-input-bg)] border-[var(--app-border)] text-[var(--app-text)]',
                )}
                placeholder="app.yourcompany.com"
              />
            </div>
            <span className={cn(
              'inline-flex items-center gap-1 rounded-xl px-3 py-2.5 text-xs font-medium shrink-0',
              'bg-[var(--app-warning-bg)] text-[var(--app-warning)]',
            )}>
              <Globe className="w-3.5 h-3.5" />
              DNS Pending
            </span>
          </div>
          <p className={cn('text-[10px] mt-2', 'text-[var(--app-text-muted)]')}>
            Add a CNAME record pointing to cname.agencyos.io. Verification may take up to 48 hours.
          </p>
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
            Save Branding
          </button>
        </motion.div>
      </div>
    </div>
  );
}
