'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CreditCard, Download, Plus, Star, Calendar, Wallet,
  Check, ChevronRight, Shield,
} from 'lucide-react';
import { billingPlan, availablePlans } from './data/mock-data';
import BillingPlanCard from './components/billing-plan-card';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { CSS } from '@/styles/design-tokens';

export default function BillingSubscriptionPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const usagePercent = useMemo(() => ({
    users: ((billingPlan.currentUsage.users / billingPlan.limits.users) * 100).toFixed(0),
    storage: ((billingPlan.currentUsage.storage / billingPlan.limits.storage) * 100).toFixed(0),
    apiCalls: ((billingPlan.currentUsage.apiCalls / billingPlan.limits.apiCalls) * 100).toFixed(0),
  }), []);

  const formatAPI = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  const usageBars = [
    { label: 'Users', current: billingPlan.currentUsage.users, limit: billingPlan.limits.users, percent: usagePercent.users, unit: '', color: 'bg-violet-500' },
    { label: 'Storage', current: billingPlan.currentUsage.storage, limit: billingPlan.limits.storage, percent: usagePercent.storage, unit: ' GB', color: 'bg-sky-500' },
    { label: 'API Calls', current: billingPlan.currentUsage.apiCalls, limit: billingPlan.limits.apiCalls, percent: usagePercent.apiCalls, unit: '', color: 'bg-emerald-500', format: true },
  ];

  // ── Invoice columns ──
  const invoiceColumns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'invoiceNo',
      label: 'Invoice No',
      render: (row) => <span className="font-mono font-medium" style={{ color: CSS.text }}>{row.invoiceNo as string}</span>,
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (row) => (
        <span style={{ color: CSS.textSecondary }}>
          {new Date(row.date as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (row) => (
        <span className="text-right font-semibold block" style={{ color: CSS.text }}>
          ₹{(row.amount as number).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status as string} />,
    },
    {
      key: 'id',
      label: 'Action',
      render: () => (
        <button className="p-1.5 rounded-lg transition-colors" style={{ color: CSS.textDisabled }}>
          <Download className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ], []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <CreditCard className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Billing & Subscription</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Manage your plan and billing</p>
            </div>
          </div>
        </div>

        {/* Current Plan Card (Large, Prominent) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'rounded-[var(--app-radius-xl)] border p-6 relative overflow-hidden',
            isDark ? 'bg-gradient-to-br from-violet-500/[0.06] to-purple-500/[0.03] border-violet-500/20' : 'bg-gradient-to-br from-violet-50/80 to-purple-50/80 border-violet-200/60'
          )}
        >
          {/* Background glow */}
          <div className={cn('absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px]', isDark ? 'bg-violet-500/[0.06]' : 'bg-violet-400/[0.08]')} />

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-app-2xl">
              {/* Left: Plan info */}
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{billingPlan.name}</h2>
                  <Badge className="px-3 py-1 text-[10px] font-semibold bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0 capitalize">
                    {billingPlan.tier}
                  </Badge>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">₹{billingPlan.price.toLocaleString('en-IN')}</span>
                  <span className={cn('text-sm', 'text-[var(--app-text-muted)]')}>/month</span>
                </div>

                {/* Usage Bars */}
                <div className="space-y-3">
                  {usageBars.map((bar) => (
                    <div key={bar.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className={cn('font-medium', 'text-[var(--app-text-secondary)]')}>{bar.label}</span>
                        <span className={cn('font-mono', 'text-[var(--app-text-muted)]')}>
                          {bar.format ? formatAPI(bar.current) : bar.current}{bar.unit} / {bar.format ? formatAPI(bar.limit) : bar.limit}{bar.unit}
                        </span>
                      </div>
                      <div className={cn('w-full h-2 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${bar.percent}%` }}
                          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          className={cn('h-full rounded-full', bar.color)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Details */}
              <div className={cn('space-y-4 lg:w-72 p-4 rounded-[var(--app-radius-lg)] border shrink-0', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white/60 border-black/[0.06]')}>
                <div className="flex items-center gap-2">
                  <Calendar className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                  <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Next Billing</span>
                </div>
                <p className="text-sm font-semibold">
                  {new Date(billingPlan.nextBillingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>

                <div className={cn('border-t pt-3', 'border-[var(--app-border)]')}>
                  <div className="flex items-center gap-2">
                    <Wallet className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                    <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Payment Method</span>
                  </div>
                  <p className="text-sm font-semibold mt-1">{billingPlan.paymentMethod}</p>
                </div>

                <Button
                  className={cn('w-full rounded-[var(--app-radius-lg)] text-sm font-medium gap-2 mt-2', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}
                >
                  Manage Subscription <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Features List */}
            <div className={cn('mt-app-xl pt-4 border-t', 'border-[var(--app-border)]')}>
              <p className={cn('text-[10px] font-medium uppercase tracking-wider mb-3', 'text-[var(--app-text-muted)]')}>Plan Features</p>
              <div className="flex flex-wrap gap-2">
                {billingPlan.features.map((f) => (
                  <span key={f} className={cn('flex items-center gap-1.5 text-xs', 'text-[var(--app-text-secondary)]')}>
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" /> {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Plan Comparison Grid */}
        <div>
          <h3 className={cn('text-sm font-semibold mb-4 flex items-center gap-2', 'text-[var(--app-text)]')}>
            <Star className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            Plan Comparison
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availablePlans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.4 }}
              >
                <BillingPlanCard
                  name={plan.name}
                  tier={plan.tier}
                  price={plan.price}
                  features={plan.features}
                  highlighted={plan.highlighted}
                  isCurrentPlan={plan.tier === billingPlan.tier}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Invoice History */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn('text-sm font-semibold flex items-center gap-2', 'text-[var(--app-text)]')}>
              <Download className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              Invoice History
            </h3>
            <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
              {billingPlan.invoiceHistory.length} invoices
            </Badge>
          </div>
<<<<<<< HEAD
          <SmartDataTable
            data={billingPlan.invoiceHistory as unknown as Record<string, unknown>[]}
            columns={invoiceColumns}
            searchable
            searchPlaceholder="Search invoices..."
            enableExport
            pageSize={10}
          />
=======
          <div className={cn('rounded-[var(--app-radius-lg)] border overflow-hidden', 'border-[var(--app-border-light)]')}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className={cn('bg-[var(--app-hover-bg)]')}>
                    <th className={cn('text-left px-4 py-3 font-medium', 'text-[var(--app-text-muted)]')}>Invoice No</th>
                    <th className={cn('text-left px-4 py-3 font-medium', 'text-[var(--app-text-muted)]')}>Date</th>
                    <th className={cn('text-right px-4 py-3 font-medium', 'text-[var(--app-text-muted)]')}>Amount</th>
                    <th className={cn('text-center px-4 py-3 font-medium', 'text-[var(--app-text-muted)]')}>Status</th>
                    <th className={cn('text-right px-4 py-3 font-medium', 'text-[var(--app-text-muted)]')}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {billingPlan.invoiceHistory.map((inv, i) => {
                    const sConf = invoiceStatusConfig[inv.status] || invoiceStatusConfig.pending;
                    return (
                      <tr key={i} className={cn('border-t transition-colors', 'border-[var(--app-border-light)]')}>
                        <td className={cn('px-4 py-3 font-mono font-medium', 'text-[var(--app-text)]')}>{inv.invoiceNo}</td>
                        <td className={cn('px-4 py-3', 'text-[var(--app-text-secondary)]')}>
                          {new Date(inv.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className={cn('px-4 py-3 text-right font-semibold', 'text-[var(--app-text)]')}>
                          ₹{inv.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant="secondary" className={cn('text-[9px] px-2 py-0.5 border-0', isDark ? sConf.bgDark : sConf.bgLight)}>
                            {sConf.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className={cn('p-1.5 rounded-[var(--app-radius-lg)] transition-colors', isDark ? 'hover:bg-white/[0.06] text-white/30' : 'hover:bg-black/[0.06] text-black/30')}>
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn('text-sm font-semibold flex items-center gap-2', 'text-[var(--app-text)]')}>
              <Shield className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              Payment Methods
            </h3>
            <Button variant="outline" size="sm" className={cn('rounded-[var(--app-radius-lg)] text-xs gap-1.5', isDark ? 'border-white/[0.08] text-white/50 hover:bg-white/[0.06]' : 'border-black/[0.08] text-black/50 hover:bg-black/[0.06]')}>
              <Plus className="w-4 h-4" /> Add Payment Method
            </Button>
          </div>
          <div className={cn('flex items-center gap-4 p-4 rounded-[var(--app-radius-lg)] border', 'border-[var(--app-border-light)]')}>
            <div className={cn('w-12 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', isDark ? 'bg-blue-500/15' : 'bg-blue-50')}>
              <span className="text-blue-500 font-bold text-[10px]">VISA</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Visa ending 4242</p>
              <p className={cn('text-[11px]', 'text-[var(--app-text-muted)]')}>Expires 12/2027</p>
            </div>
            <Badge variant="secondary" className={cn('text-[9px] px-2 py-0.5 border-0 bg-emerald-500/15 text-emerald-400')}>Default</Badge>
          </div>
        </motion.div>

        {/* Add-ons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
        >
          <h3 className={cn('text-sm font-semibold mb-4 flex items-center gap-2', 'text-[var(--app-text)]')}>
            <Plus className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            Add-ons
          </h3>
          <div className="space-y-2">
            {billingPlan.addOns.map((addon) => (
              <div key={addon.name} className={cn('flex items-center justify-between p-3 rounded-[var(--app-radius-lg)] border transition-colors', 'border-[var(--app-border-light)]')}>
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => {}}
                    className={cn(
                      'relative w-10 h-5.5 rounded-full transition-colors duration-200 cursor-pointer',
                      addon.active ? 'bg-emerald-500' : 'bg-[var(--app-hover-bg)]'
                    )}
                  >
                    <div
                      className={cn(
                        'absolute top-1 w-4 h-4 rounded-full bg-white shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] transition-transform',
                        addon.active && 'translate-x-[18px]'
                      )}
                      style={{ left: 2 }}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium">{addon.name}</p>
                    <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>₹{addon.price.toLocaleString('en-IN')}/month</p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    'text-[9px] px-2 py-0.5 border-0',
                    addon.active
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : isDark
                        ? 'bg-white/[0.06] text-white/30'
                        : 'bg-black/[0.06] text-black/30'
                  )}
                >
                  {addon.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
