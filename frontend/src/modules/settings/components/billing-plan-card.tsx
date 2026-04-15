'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Check, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BillingPlanCardProps {
  name: string;
  tier: string;
  price: number;
  features: string[];
  highlighted: boolean;
  isCurrentPlan?: boolean;
  onUpgrade?: () => void;
}

export default function BillingPlanCard({
  name,
  tier,
  price,
  features,
  highlighted,
  isCurrentPlan,
  onUpgrade,
}: BillingPlanCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative rounded-2xl border p-5 transition-all duration-200 flex flex-col',
        highlighted
          ? isDark
            ? 'bg-gradient-to-br from-violet-500/[0.08] to-purple-500/[0.05] border-violet-500/30'
            : 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-300/60'
          : isDark
            ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
            : 'bg-white border-black/[0.06] hover:bg-black/[0.02]'
      )}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="px-3 py-1 text-[10px] font-semibold bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0">
            <Star className="w-3 h-3 mr-1" /> Current Plan
          </Badge>
        </div>
      )}

      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-lg font-bold">{name}</h3>
        <Badge
          variant="secondary"
          className={cn(
            'text-[9px] px-1.5 py-0 capitalize',
            isDark ? 'bg-white/[0.08] text-white/50' : 'bg-black/[0.06] text-black/50'
          )}
        >
          {tier}
        </Badge>
      </div>

      <div className="mb-4">
        <span className="text-3xl font-bold tracking-tight">₹{price.toLocaleString('en-IN')}</span>
        <span className={cn('text-sm ml-1', isDark ? 'text-white/40' : 'text-black/40')}>/month</span>
      </div>

      <div className="space-y-2 flex-1 mb-5">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-2">
            <Check
              className={cn(
                'w-3.5 h-3.5 mt-0.5 shrink-0',
                highlighted ? 'text-violet-400' : isDark ? 'text-white/30' : 'text-black/30'
              )}
            />
            <span
              className={cn(
                'text-xs leading-relaxed',
                isDark ? 'text-white/60' : 'text-black/60'
              )}
            >
              {feature}
            </span>
          </div>
        ))}
      </div>

      {isCurrentPlan ? (
        <Button
          variant="outline"
          disabled
          className={cn(
            'w-full rounded-xl text-sm font-medium',
            isDark ? 'border-white/[0.08] text-white/30' : 'border-black/[0.08] text-black/30'
          )}
        >
          Current Plan
        </Button>
      ) : (
        <Button
          onClick={onUpgrade}
          className={cn(
            'w-full rounded-xl text-sm font-medium transition-colors',
            isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'
          )}
        >
          {price < 24999 ? 'Upgrade' : 'Contact Sales'}
        </Button>
      )}
    </motion.div>
  );
}
