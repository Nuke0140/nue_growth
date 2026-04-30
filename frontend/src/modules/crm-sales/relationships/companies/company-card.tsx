'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Globe, Users, DollarSign, Building2, User, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useCrmSalesStore } from '@/modules/crm-sales/system/store';
import type { Company } from '@/modules/crm-sales/system/types';

function formatARR(arr: number): string {
  if (arr >= 1_000_000) return `$${(arr / 1_000_000).toFixed(1)}M`;
  if (arr >= 1_000) return `$${(arr / 1_000).toFixed(0)}K`;
  return `$${arr}`;
}

function getHealthColor(score: number, isDark: boolean) {
  if (score > 75) return isDark ? 'text-emerald-400 stroke-emerald-400' : 'text-emerald-600 stroke-emerald-600';
  if (score > 50) return isDark ? 'text-yellow-400 stroke-yellow-400' : 'text-yellow-600 stroke-yellow-600';
  return isDark ? 'text-red-400 stroke-red-400' : 'text-red-600 stroke-red-600';
}

function getHealthBg(score: number, isDark: boolean) {
  if (score > 75) return isDark ? 'bg-emerald-500/15' : 'bg-emerald-500/15';
  if (score > 50) return isDark ? 'bg-yellow-500/15' : 'bg-yellow-500/15';
  return isDark ? 'bg-red-500/15' : 'bg-red-500/15';
}

function getIndustryIcon(industry: string): string {
  const map: Record<string, string> = {
    Technology: '💻',
    SaaS: '☁️',
    Logistics: '🚛',
    Fintech: '💳',
    Retail: '🛒',
    'E-Commerce': '🌐',
    Consulting: '💼',
    Investment: '📊',
    'Digital Media': '📱',
    'Developer Tools': '🛠️',
    Analytics: '📈',
  };
  return map[industry] || '🏢';
}

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const selectCompany = useCrmSalesStore((s) => s.selectCompany);
  const [isHovered, setIsHovered] = useState(false);

  const initials = company.name.split(' ').map(w => w.charAt(0)).join('').slice(0, 2).toUpperCase();
  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (company.healthScore / 100) * circumference;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => selectCompany(company.id)}
      className={cn(
        'relative rounded-2xl border p-5 cursor-pointer transition-colors duration-200 shadow-sm',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]'
          : 'bg-white border-black/[0.06] hover:bg-black/[0.02] hover:border-black/[0.1]'
      )}
    >
      {/* Top Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={company.logo} alt={company.name} />
            <AvatarFallback className={cn(
              'text-sm font-bold',
              isDark ? 'bg-white/[0.08] text-white/70' : 'bg-black/[0.08] text-black/70'
            )}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate">{company.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm">{getIndustryIcon(company.industry)}</span>
              <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>
                {company.industry}
              </span>
            </div>
          </div>
        </div>

        {/* Health Score Ring */}
        <div className="relative w-11 h-11 shrink-0">
          <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
            <circle
              cx="22" cy="22" r="20"
              className={cn('fill-none', isDark ? 'stroke-white/[0.06]' : 'stroke-black/[0.06]')}
              strokeWidth="3"
            />
            <circle
              cx="22" cy="22" r="20"
              className={cn('fill-none transition-all duration-700', getHealthColor(company.healthScore, isDark))}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn(
              'text-[10px] font-bold',
              getHealthColor(company.healthScore, isDark).replace('stroke-', 'text-')
            )}>
              {company.healthScore}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className={cn(
          'rounded-xl p-2.5',
          'bg-[var(--app-hover-bg)]'
        )}>
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign className={cn('w-3 h-3', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>ARR</span>
          </div>
          <p className="text-sm font-bold">{formatARR(company.arr)}</p>
        </div>

        <div className={cn(
          'rounded-xl p-2.5',
          'bg-[var(--app-hover-bg)]'
        )}>
          <div className="flex items-center gap-1.5 mb-1">
            <Users className={cn('w-3 h-3', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Contacts</span>
          </div>
          <p className="text-sm font-bold">{company.linkedContacts}</p>
        </div>

        <div className={cn(
          'rounded-xl p-2.5',
          'bg-[var(--app-hover-bg)]'
        )}>
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className={cn('w-3 h-3', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Deals</span>
          </div>
          <p className="text-sm font-bold">{company.activeDeals}</p>
        </div>

        <div className={cn(
          'rounded-xl p-2.5',
          'bg-[var(--app-hover-bg)]'
        )}>
          <div className="flex items-center gap-1.5 mb-1">
            <Building2 className={cn('w-3 h-3', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Size</span>
          </div>
          <p className="text-sm font-bold">{company.employeeCount}</p>
        </div>
      </div>

      {/* Hover-expanded footer */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? 'auto' : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className={cn(
          'pt-3 mt-1 border-t space-y-2',
          'border-[var(--app-border-light)]'
        )}>
          <div className="flex items-center gap-2">
            <User className={cn('w-3.5 h-3.5', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>{company.owner}</span>
          </div>
          {company.website && (
            <div className="flex items-center gap-2">
              <Globe className={cn('w-3.5 h-3.5', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-xs truncate', 'text-[var(--app-text-secondary)]')}>{company.website}</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
