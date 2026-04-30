'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Shield, ShieldCheck, ShieldAlert, Lock, Key, Clock,
  Globe, Smartphone, Fingerprint, ChevronRight,
  Check, X, Plus, Trash2,
} from 'lucide-react';
import { securityConfig } from './data/mock-data';
import SecurityAlertChip from './components/security-alert-chip';

export default function SecurityCompliancePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const securityScore = useMemo(() => {
    let score = 100;
    if (!securityConfig.mfaEnforced) score -= 15;
    if (!securityConfig.ssoEnabled) score -= 10;
    if (!securityConfig.suspiciousLoginAlerts) score -= 10;
    if (securityConfig.sessionTimeout > 60) score -= 10;
    if (securityConfig.ipAllowlist.length < 2) score -= 10;
    if (!securityConfig.soc2Compliant) score -= 20;
    if (!securityConfig.gdprCompliant) score -= 20;
    if (securityConfig.passwordPolicy.minLength < 10) score -= 5;
    return Math.max(score, 0);
  }, []);

  const scoreColor = securityScore >= 80 ? 'text-emerald-400' : securityScore >= 60 ? 'text-amber-400' : 'text-red-400';
  const scoreStroke = securityScore >= 80 ? '#34d399' : securityScore >= 60 ? '#fbbf24' : '#f87171';
  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference - (securityScore / 100) * circumference;

  const alerts = [
    {
      severity: 'critical' as const,
      title: 'API Key Expiring Soon',
      description: 'Production API Key expires in 3 days. Rotate it to prevent service disruption.',
      timestamp: 'Detected 2 hours ago',
    },
    {
      severity: 'warning' as const,
      title: 'Login from New Location',
      description: 'Admin login detected from Delhi, India — a new location for this account.',
      timestamp: 'Detected 6 hours ago',
    },
    {
      severity: 'info' as const,
      title: 'Security Audit Completed',
      description: 'Monthly automated security scan completed with no critical findings.',
      timestamp: 'Completed yesterday',
    },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <Shield className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Security & Compliance</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Enterprise security configuration</p>
            </div>
          </div>
        </div>

        {/* Security Alerts */}
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <SecurityAlertChip {...alert} />
            </motion.div>
          ))}
        </div>

        {/* Security Score + Config Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-app-2xl">
          {/* Security Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={cn('rounded-[var(--app-radius-xl)] border p-6 flex flex-col items-center justify-center', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
          >
            <h3 className={cn('text-xs font-medium uppercase tracking-wider mb-4', 'text-[var(--app-text-muted)]')}>Security Score</h3>
            <div className="relative w-28 h-28 mb-4">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" className={isDark ? 'stroke-white/[0.06]' : 'stroke-black/[0.06]'} strokeWidth="6" />
                <motion.circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke={scoreStroke}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn('text-3xl font-bold', scoreColor)}>{securityScore}</span>
              </div>
            </div>
            <p className={cn('text-sm font-medium', scoreColor)}>
              {securityScore >= 80 ? 'Excellent' : securityScore >= 60 ? 'Good' : 'Needs Improvement'}
            </p>
            <p className={cn('text-[11px] mt-1', 'text-[var(--app-text-muted)]')}>Based on current configuration</p>
          </motion.div>

          {/* Config Sections */}
          <div className="lg:col-span-2 space-y-4">
            {/* Authentication */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
            >
              <h3 className={cn('text-sm font-semibold mb-4 flex items-center gap-2', 'text-[var(--app-text)]')}>
                <Fingerprint className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                Authentication
              </h3>
              <div className="space-y-4">
                {/* MFA */}
                <div className={cn('flex items-center justify-between p-3 rounded-[var(--app-radius-lg)] border', 'border-[var(--app-border-light)]')}>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <div>
                      <p className="text-sm font-medium">MFA Enforcement</p>
                      <p className={cn('text-[11px]', 'text-[var(--app-text-muted)]')}>Require multi-factor authentication for all users</p>
                    </div>
                  </div>
                  <div className={cn('relative w-10 h-5.5 rounded-full cursor-pointer transition-colors', securityConfig.mfaEnforced ? 'bg-emerald-500' : 'bg-[var(--app-hover-bg)]')}>
                    <div className={cn('absolute top-1 w-4 h-4 rounded-full bg-white shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] transition-transform', securityConfig.mfaEnforced && 'translate-x-[18px]')} style={{ left: 2 }} />
                  </div>
                </div>

                {/* Password Policy */}
                <div className={cn('p-3 rounded-[var(--app-radius-lg)] border', 'border-[var(--app-border-light)]')}>
                  <div className="flex items-center gap-2 mb-3">
                    <Key className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                    <p className="text-sm font-medium">Password Policy</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {[
                      { label: 'Min Length', value: `${securityConfig.passwordPolicy.minLength} chars` },
                      { label: 'Uppercase', value: securityConfig.passwordPolicy.requireUppercase ? 'Required' : 'Optional' },
                      { label: 'Numbers', value: securityConfig.passwordPolicy.requireNumbers ? 'Required' : 'Optional' },
                      { label: 'Symbols', value: securityConfig.passwordPolicy.requireSymbols ? 'Required' : 'Optional' },
                      { label: 'Expiry', value: `${securityConfig.passwordPolicy.expiryDays} days` },
                    ].map((item) => (
                      <div key={item.label} className={cn('p-2 rounded-[var(--app-radius-lg)] text-center', 'bg-[var(--app-hover-bg)]')}>
                        <p className={cn('text-[10px] block mb-0.5', 'text-[var(--app-text-muted)]')}>{item.label}</p>
                        <p className="text-xs font-medium">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Session Timeout */}
                <div className={cn('flex items-center justify-between p-3 rounded-[var(--app-radius-lg)] border', 'border-[var(--app-border-light)]')}>
                  <div className="flex items-center gap-3">
                    <Clock className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                    <div>
                      <p className="text-sm font-medium">Session Timeout</p>
                      <p className={cn('text-[11px]', 'text-[var(--app-text-muted)]')}>Auto-logout after inactivity</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={5}
                      max={120}
                      step={5}
                      defaultValue={securityConfig.sessionTimeout}
                      className="w-32 h-1.5 rounded-full appearance-none cursor-pointer accent-violet-500"
                    />
                    <span className={cn('text-xs font-mono w-12 text-right', 'text-[var(--app-text-secondary)]')}>
                      {securityConfig.sessionTimeout} min
                    </span>
                  </div>
                </div>

                {/* SSO Status */}
                <div className={cn('flex items-center justify-between p-3 rounded-[var(--app-radius-lg)] border', 'border-[var(--app-border-light)]')}>
                  <div className="flex items-center gap-3">
                    <Lock className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                    <div>
                      <p className="text-sm font-medium">SSO / SAML</p>
                      <p className={cn('text-[11px]', 'text-[var(--app-text-muted)]')}>Single sign-on configuration</p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn('text-[10px] px-2.5 py-1 border-0', securityConfig.ssoEnabled ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400')}
                  >
                    {securityConfig.ssoEnabled ? '✓ Connected' : '✗ Not Connected'}
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Network Security */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
            >
              <h3 className={cn('text-sm font-semibold mb-4 flex items-center gap-2', 'text-[var(--app-text)]')}>
                <Globe className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                Network Security
              </h3>
              <div className="space-y-4">
                {/* IP Allowlist */}
                <div className={cn('p-3 rounded-[var(--app-radius-lg)] border', 'border-[var(--app-border-light)]')}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium">IP Allowlist</p>
                    <Button variant="ghost" size="sm" className={cn('rounded-[var(--app-radius-lg)] text-xs gap-1', isDark ? 'text-white/30 hover:bg-white/[0.06]' : 'text-black/30 hover:bg-black/[0.06]')}>
                      <Plus className="w-4 h-4" /> Add IP
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {securityConfig.ipAllowlist.map((ip, i) => (
                      <div key={i} className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--app-radius-lg)] border text-xs font-mono', 'border-[var(--app-border)] bg-[var(--app-hover-bg)]')}>
                        <span>{ip}</span>
                        <button className={cn('hover:text-red-400 transition-colors', 'text-[var(--app-text-disabled)]')}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suspicious Login Alerts */}
                <div className={cn('flex items-center justify-between p-3 rounded-[var(--app-radius-lg)] border', 'border-[var(--app-border-light)]')}>
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium">Suspicious Login Alerts</p>
                      <p className={cn('text-[11px]', 'text-[var(--app-text-muted)]')}>Alert on logins from unknown locations/devices</p>
                    </div>
                  </div>
                  <div className={cn('relative w-10 h-5.5 rounded-full cursor-pointer transition-colors', securityConfig.suspiciousLoginAlerts ? 'bg-emerald-500' : 'bg-[var(--app-hover-bg)]')}>
                    <div className={cn('absolute top-1 w-4 h-4 rounded-full bg-white shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] transition-transform', securityConfig.suspiciousLoginAlerts && 'translate-x-[18px]')} style={{ left: 2 }} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Device Management */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
            >
              <h3 className={cn('text-sm font-semibold mb-4 flex items-center gap-2', 'text-[var(--app-text)]')}>
                <Smartphone className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                Device Management
              </h3>
              <div className={cn('rounded-[var(--app-radius-lg)] border overflow-hidden', 'border-[var(--app-border-light)]')}>
                <table className="w-full text-xs">
                  <thead>
                    <tr className={cn('bg-[var(--app-hover-bg)]')}>
                      <th className={cn('text-left px-4 py-2.5 font-medium', 'text-[var(--app-text-muted)]')}>Device</th>
                      <th className={cn('text-left px-4 py-2.5 font-medium hidden md:table-cell', 'text-[var(--app-text-muted)]')}>Last Active</th>
                      <th className={cn('text-left px-4 py-2.5 font-medium hidden md:table-cell', 'text-[var(--app-text-muted)]')}>IP</th>
                      <th className={cn('text-right px-4 py-2.5 font-medium', 'text-[var(--app-text-muted)]')}>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {securityConfig.deviceLogs.map((device, i) => (
                      <tr key={i} className={cn('border-t', 'border-[var(--app-border-light)]')}>
                        <td className={cn('px-4 py-3 font-medium', 'text-[var(--app-text-secondary)]')}>{device.device}</td>
                        <td className={cn('px-4 py-3 hidden md:table-cell', 'text-[var(--app-text-muted)]')}>
                          {new Date(device.lastActive).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className={cn('px-4 py-3 font-mono hidden md:table-cell', 'text-[var(--app-text-muted)]')}>{device.ip}</td>
                        <td className={cn('px-4 py-3 text-right', 'text-[var(--app-text-muted)]')}>{device.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Compliance */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
            >
              <h3 className={cn('text-sm font-semibold mb-4 flex items-center gap-2', 'text-[var(--app-text)]')}>
                <ShieldCheck className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                Compliance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* SOC2 */}
                <div className={cn('p-4 rounded-[var(--app-radius-lg)] border text-center', 'border-[var(--app-border-light)]')}>
                  <ShieldCheck className={cn('w-6 h-6 mx-auto mb-2', securityConfig.soc2Compliant ? 'text-emerald-500' : 'text-red-500')} />
                  <p className="text-sm font-semibold">SOC 2</p>
                  <Badge variant="secondary" className={cn('text-[9px] px-2 py-0.5 border-0 mt-1', securityConfig.soc2Compliant ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400')}>
                    {securityConfig.soc2Compliant ? '✓ Compliant' : '✗ Non-compliant'}
                  </Badge>
                </div>

                {/* GDPR */}
                <div className={cn('p-4 rounded-[var(--app-radius-lg)] border text-center', 'border-[var(--app-border-light)]')}>
                  <ShieldCheck className={cn('w-6 h-6 mx-auto mb-2', securityConfig.gdprCompliant ? 'text-emerald-500' : 'text-red-500')} />
                  <p className="text-sm font-semibold">GDPR</p>
                  <Badge variant="secondary" className={cn('text-[9px] px-2 py-0.5 border-0 mt-1', securityConfig.gdprCompliant ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400')}>
                    {securityConfig.gdprCompliant ? '✓ Compliant' : '✗ Non-compliant'}
                  </Badge>
                </div>

                {/* Data Residency */}
                <div className={cn('p-4 rounded-[var(--app-radius-lg)] border text-center', 'border-[var(--app-border-light)]')}>
                  <Globe className={cn('w-6 h-6 mx-auto mb-2', 'text-[var(--app-text-muted)]')} />
                  <p className="text-sm font-semibold">Data Residency</p>
                  <div className="relative mt-2">
                    <select
                      defaultValue={securityConfig.dataResidency}
                      className={cn('w-full px-3 py-1.5 rounded-[var(--app-radius-lg)] text-xs border outline-none appearance-none transition-colors text-center', isDark ? 'bg-white/[0.06] border-white/[0.08] text-white/60' : 'bg-black/[0.04] border-black/[0.08] text-black/60')}
                    >
                      <option value="India">India</option>
                      <option value="US">United States</option>
                      <option value="EU">European Union</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
