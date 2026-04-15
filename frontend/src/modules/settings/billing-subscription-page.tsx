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

const invoiceStatusConfig: Record<string, { label: string; bgDark: string; bgLight: string }> = {
  paid: { label: 'Paid', bgDark: 'bg-emerald-500/15 text-emerald-400', bgLight: 'bg-emerald-50 text-emerald-600' },
  pending: { label: 'Pending', bgDark: 'bg-amber-500/15 text-amber-400', bgLight: 'bg-amber-50 text-amber-600' },
  overdue: { label: 'Overdue', bgDark: 'bg-red-500/15 text-red-400', bgLight: 'bg-red-50 text-red-600' },
};

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

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
              <CreditCard className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Billing & Subscription</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Manage your plan and billing</p>
            </div>
          </div>
        </div>

        {/* Current Plan Card (Large, Prominent) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'rounded-2xl border p-6 relative overflow-hidden',
            isDark ? 'bg-gradient-to-br from-violet-500/[0.06] to-purple-500/[0.03] border-violet-500/20' : 'bg-gradient-to-br from-violet-50/80 to-purple-50/80 border-violet-200/60'
          )}
        >
          {/* Background glow */}
          <div className={cn('absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px]', isDark ? 'bg-violet-500/[0.06]' : 'bg-violet-400/[0.08]')} />

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
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
                  <span className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>/month</span>
                </div>

                {/* Usage Bars */}
                <div className="space-y-3">
                  {usageBars.map((bar) => (
                    <div key={bar.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className={cn('font-medium', isDark ? 'text-white/50' : 'text-black/50')}>{bar.label}</span>
                        <span className={cn('font-mono', isDark ? 'text-white/40' : 'text-black/40')}>
                          {bar.format ? formatAPI(bar.current) : bar.current}{bar.unit} / {bar.format ? formatAPI(bar.limit) : bar.limit}{bar.unit}
                        </span>
                      </div>
                      <div className={cn('w-full h-2 rounded-full', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
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
              <div className={cn('space-y-4 lg:w-72 p-4 rounded-xl border shrink-0', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white/60 border-black/[0.06]')}>
                <div className="flex items-center gap-2">
                  <Calendar className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                  <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>Next Billing</span>
                </div>
                <p className="text-sm font-semibold">
                  {new Date(billingPlan.nextBillingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>

                <div className={cn('border-t pt-3', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
                  <div className="flex items-center gap-2">
                    <Wallet className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                    <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>Payment Method</span>
                  </div>
                  <p className="text-sm font-semibold mt-1">{billingPlan.paymentMethod}</p>
                </div>

                <Button
                  className={cn('w-full rounded-xl text-sm font-medium gap-2 mt-2', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}
                >
                  Manage Subscription <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Features List */}
            <div className={cn('mt-5 pt-4 border-t', isDark ? 'border-white/[0.08]' : 'border-black/[0.08]')}>
              <p className={cn('text-[10px] font-medium uppercase tracking-wider mb-3', isDark ? 'text-white/30' : 'text-black/30')}>Plan Features</p>
              <div className="flex flex-wrap gap-2">
                {billingPlan.features.map((f) => (
                  <span key={f} className={cn('flex items-center gap-1.5 text-xs', isDark ? 'text-white/50' : 'text-black/50')}>
                    <Check className="w-3 h-3 text-emerald-500 shrink-0" /> {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Plan Comparison Grid */}
        <div>
          <h3 className={cn('text-sm font-semibold mb-4 flex items-center gap-2', isDark ? 'text-white/70' : 'text-black/70')}>
            <Star className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
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
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn('text-sm font-semibold flex items-center gap-2', isDark ? 'text-white/70' : 'text-black/70')}>
              <Download className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              Invoice History
            </h3>
            <Badge variant="secondary" className={cn('text-[10px]', isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40')}>
              {billingPlan.invoiceHistory.length} invoices
            </Badge>
          </div>
          <div className={cn('rounded-xl border overflow-hidden', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className={cn(isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]')}>
                    <th className={cn('text-left px-4 py-3 font-medium', isDark ? 'text-white/40' : 'text-black/40')}>Invoice No</th>
                    <th className={cn('text-left px-4 py-3 font-medium', isDark ? 'text-white/40' : 'text-black/40')}>Date</th>
                    <th className={cn('text-right px-4 py-3 font-medium', isDark ? 'text-white/40' : 'text-black/40')}>Amount</th>
                    <th className={cn('text-center px-4 py-3 font-medium', isDark ? 'text-white/40' : 'text-black/40')}>Status</th>
                    <th className={cn('text-right px-4 py-3 font-medium', isDark ? 'text-white/40' : 'text-black/40')}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {billingPlan.invoiceHistory.map((inv, i) => {
                    const sConf = invoiceStatusConfig[inv.status] || invoiceStatusConfig.pending;
                    return (
                      <tr key={i} className={cn('border-t transition-colors', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                        <td className={cn('px-4 py-3 font-mono font-medium', isDark ? 'text-white/70' : 'text-black/70')}>{inv.invoiceNo}</td>
                        <td className={cn('px-4 py-3', isDark ? 'text-white/50' : 'text-black/50')}>
                          {new Date(inv.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className={cn('px-4 py-3 text-right font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
                          ₹{inv.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant="secondary" className={cn('text-[9px] px-2 py-0.5 border-0', isDark ? sConf.bgDark : sConf.bgLight)}>
                            {sConf.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className={cn('p-1.5 rounded-lg transition-colors', isDark ? 'hover:bg-white/[0.06] text-white/30' : 'hover:bg-black/[0.06] text-black/30')}>
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn('text-sm font-semibold flex items-center gap-2', isDark ? 'text-white/70' : 'text-black/70')}>
              <Shield className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              Payment Methods
            </h3>
            <Button variant="outline" size="sm" className={cn('rounded-lg text-xs gap-1.5', isDark ? 'border-white/[0.08] text-white/50 hover:bg-white/[0.06]' : 'border-black/[0.08] text-black/50 hover:bg-black/[0.06]')}>
              <Plus className="w-3 h-3" /> Add Payment Method
            </Button>
          </div>
          <div className={cn('flex items-center gap-4 p-4 rounded-xl border', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
            <div className={cn('w-12 h-8 rounded-lg flex items-center justify-center', isDark ? 'bg-blue-500/15' : 'bg-blue-50')}>
              <span className="text-blue-500 font-bold text-[10px]">VISA</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Visa ending 4242</p>
              <p className={cn('text-[11px]', isDark ? 'text-white/30' : 'text-black/30')}>Expires 12/2027</p>
            </div>
            <Badge variant="secondary" className={cn('text-[9px] px-2 py-0.5 border-0 bg-emerald-500/15 text-emerald-400')}>Default</Badge>
          </div>
        </motion.div>

        {/* Add-ons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]')}
        >
          <h3 className={cn('text-sm font-semibold mb-4 flex items-center gap-2', isDark ? 'text-white/70' : 'text-black/70')}>
            <Plus className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
            Add-ons
          </h3>
          <div className="space-y-2">
            {billingPlan.addOns.map((addon) => (
              <div key={addon.name} className={cn('flex items-center justify-between p-3 rounded-xl border transition-colors', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => {}}
                    className={cn(
                      'relative w-10 h-5.5 rounded-full transition-colors duration-200 cursor-pointer',
                      addon.active ? 'bg-emerald-500' : isDark ? 'bg-white/[0.15]' : 'bg-black/[0.15]'
                    )}
                  >
                    <div
                      className={cn(
                        'absolute top-1 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform',
                        addon.active && 'translate-x-[18px]'
                      )}
                      style={{ left: 2 }}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium">{addon.name}</p>
                    <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>₹{addon.price.toLocaleString('en-IN')}/month</p>
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
