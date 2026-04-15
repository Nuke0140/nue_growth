'use client';

import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import type { ApprovalStage } from '@/modules/marketing/types';

const STAGE_CONFIG: Record<ApprovalStage, { label: string; color: string }> = {
  'draft': { label: 'Draft', color: '#6b7280' },
  'in-review': { label: 'In Review', color: '#3b82f6' },
  'manager-review': { label: 'Manager Review', color: '#f59e0b' },
  'client-review': { label: 'Client Review', color: '#8b5cf6' },
  'approved': { label: 'Approved', color: '#10b981' },
  'published': { label: 'Published', color: '#059669' },
  'revision': { label: 'Revision', color: '#ef4444' },
};

interface ApprovalStatusChipProps {
  stage: ApprovalStage;
}

export default function ApprovalStatusChip({ stage }: ApprovalStatusChipProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const config = STAGE_CONFIG[stage] || STAGE_CONFIG['draft'];
  const color = config.color;

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium',
        isDark ? 'bg-white/[0.06]' : 'bg-gray-50'
      )}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span style={{ color }}>{config.label}</span>
    </span>
  );
}
