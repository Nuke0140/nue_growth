'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  GitBranch, Plus, ArrowRight, ChevronDown, Code2,
} from 'lucide-react';
import ConditionNode from './components/condition-node';
import { conditionRules } from './data/mock-data';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.15, ease: 'easeOut' as const } },
};

const operatorOptions = ['equals', 'not-equals', 'greater-than', 'less-than', 'contains', 'between', 'in', 'is-empty', 'is-not-empty'] as const;
const logicOptions = ['AND', 'OR'] as const;
const sampleFields = ['lead.score', 'lead.stage', 'client.healthScore', 'invoice.daysOverdue', 'ticket.priority', 'contact.emailOpens30d', 'ai.confidence', 'employee.joinDate'];

export default function ConditionsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Visual rule builder state
  const [builderConditions, setBuilderConditions] = useState([
    { field: sampleFields[0], operator: 'greater-than' as const, value: '80', logic: 'AND' as const },
  ]);
  const [thenAction, setThenAction] = useState('Assign to senior rep');
  const [elseAction, setElseAction] = useState('');

  const addCondition = () => {
    setBuilderConditions([
      ...builderConditions,
      { field: sampleFields[0], operator: 'equals' as const, value: '', logic: 'AND' as const },
    ]);
  };

  const removeCondition = (index: number) => {
    setBuilderConditions(builderConditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, field: string, value: string) => {
    const updated = [...builderConditions];
    updated[index] = { ...updated[index], [field]: value };
    setBuilderConditions(updated);
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]',
            )}>
              <GitBranch className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Conditions</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>
                Build smart automation rules
              </p>
            </div>
          </div>
          <button className={cn(
            'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors',
            isDark ? 'bg-violet-500/15 text-violet-300 hover:bg-violet-500/25' : 'bg-violet-50 text-violet-600 hover:bg-violet-100',
          )}>
            <Plus className="w-4 h-4" />
            Create New Rule
          </button>
        </div>

        {/* ── Existing Rules List ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <GitBranch className={cn('w-4 h-4', isDark ? 'text-amber-400' : 'text-amber-500')} />
            <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
              Active Rules
            </span>
            <span className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-semibold',
              isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600',
            )}>
              {conditionRules.length}
            </span>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {conditionRules.map((rule) => (
              <motion.div key={rule.id} variants={fadeUp}>
                <ConditionNode rule={rule} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Visual Rule Builder ── */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Code2 className={cn('w-4 h-4', isDark ? 'text-violet-400' : 'text-violet-500')} />
            <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
              Visual Rule Builder
            </span>
          </div>

          <div className={cn(
            'rounded-2xl border p-5 space-y-5',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
          )}>
            {/* Conditions */}
            <div className="space-y-3">
              <span className={cn('text-xs font-semibold uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                IF Conditions
              </span>
              {builderConditions.map((cond, i) => (
                <div key={i} className="flex items-center gap-2 flex-wrap">
                  {i > 0 && (
                    <select
                      value={cond.logic}
                      onChange={(e) => updateCondition(i, 'logic', e.target.value)}
                      className={cn(
                        'rounded-lg border px-2 py-1.5 text-[10px] font-bold focus:outline-none',
                        isDark
                          ? 'bg-violet-500/15 border-violet-500/20 text-violet-300'
                          : 'bg-violet-50 border-violet-200 text-violet-600',
                      )}
                    >
                      {logicOptions.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  )}
                  <select
                    value={cond.field}
                    onChange={(e) => updateCondition(i, 'field', e.target.value)}
                    className={cn(
                      'rounded-lg border px-2 py-1.5 text-xs font-mono focus:outline-none min-w-[180px]',
                      isDark
                        ? 'bg-white/[0.04] border-white/[0.08] text-white/70'
                        : 'bg-black/[0.03] border-black/[0.08] text-black/70',
                    )}
                  >
                    {sampleFields.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <select
                    value={cond.operator}
                    onChange={(e) => updateCondition(i, 'operator', e.target.value)}
                    className={cn(
                      'rounded-lg border px-2 py-1.5 text-xs focus:outline-none',
                      isDark
                        ? 'bg-white/[0.04] border-white/[0.08] text-white/70'
                        : 'bg-black/[0.03] border-black/[0.08] text-black/70',
                    )}
                  >
                    {operatorOptions.map((o) => (
                      <option key={o} value={o}>{o.replace(/-/g, ' ')}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={cond.value}
                    onChange={(e) => updateCondition(i, 'value', e.target.value)}
                    placeholder="Value"
                    className={cn(
                      'rounded-lg border px-2 py-1.5 text-xs w-24 focus:outline-none',
                      isDark
                        ? 'bg-white/[0.04] border-white/[0.08] text-white/70 placeholder:text-white/20'
                        : 'bg-black/[0.03] border-black/[0.08] text-black/70 placeholder:text-black/20',
                    )}
                  />
                  {builderConditions.length > 1 && (
                    <button
                      onClick={() => removeCondition(i)}
                      className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-xs',
                        isDark ? 'hover:bg-red-500/15 text-red-400/50 hover:text-red-400' : 'hover:bg-red-50 text-red-300 hover:text-red-500',
                      )}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addCondition}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
                  isDark ? 'bg-white/[0.06] text-white/40 hover:text-white/60' : 'bg-black/[0.04] text-black/40 hover:text-black/60',
                )}
              >
                <Plus className="w-3 h-3" />
                Add Condition
              </button>
            </div>

            {/* Then / Else Actions */}
            <div className={cn('border-t pt-4 space-y-3', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
              <div className="flex items-center gap-2">
                <ArrowRight className={cn('w-3.5 h-3.5', isDark ? 'text-emerald-400' : 'text-emerald-500')} />
                <span className={cn('text-[10px] font-semibold uppercase tracking-wider', isDark ? 'text-emerald-400' : 'text-emerald-500')}>
                  THEN
                </span>
                <input
                  type="text"
                  value={thenAction}
                  onChange={(e) => setThenAction(e.target.value)}
                  className={cn(
                    'flex-1 rounded-lg border px-2.5 py-1.5 text-xs focus:outline-none',
                    isDark
                      ? 'bg-white/[0.04] border-white/[0.08] text-white/70 placeholder:text-white/20'
                      : 'bg-black/[0.03] border-black/[0.08] text-black/70 placeholder:text-black/20',
                  )}
                  placeholder="Action to execute..."
                />
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className={cn('w-3.5 h-3.5', isDark ? 'text-red-400' : 'text-red-500')} />
                <span className={cn('text-[10px] font-semibold uppercase tracking-wider', isDark ? 'text-red-400' : 'text-red-500')}>
                  ELSE
                </span>
                <input
                  type="text"
                  value={elseAction}
                  onChange={(e) => setElseAction(e.target.value)}
                  className={cn(
                    'flex-1 rounded-lg border px-2.5 py-1.5 text-xs focus:outline-none',
                    isDark
                      ? 'bg-white/[0.04] border-white/[0.08] text-white/70 placeholder:text-white/20'
                      : 'bg-black/[0.03] border-black/[0.08] text-black/70 placeholder:text-black/20',
                  )}
                  placeholder="Optional fallback action..."
                />
              </div>
            </div>

            {/* Preview */}
            <div className={cn(
              'rounded-xl p-3',
              isDark ? 'bg-white/[0.02] border border-white/[0.06]' : 'bg-black/[0.02] border border-black/[0.06]',
            )}>
              <span className={cn('text-[10px] font-semibold uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>
                Rule Preview
              </span>
              <p className={cn('text-xs mt-1.5 font-mono leading-relaxed', isDark ? 'text-white/50' : 'text-black/50')}>
                <span className={cn(isDark ? 'text-violet-300' : 'text-violet-600')}>IF</span>{' '}
                {builderConditions.map((c, i) => (
                  <span key={i}>
                    {i > 0 && (
                      <span className={cn('mx-1 font-bold', isDark ? 'text-violet-300' : 'text-violet-600')}>{c.logic}</span>
                    )}
                    <span className={cn('text-emerald-300 dark:text-emerald-300', isDark ? 'text-emerald-300' : 'text-emerald-600')}>
                      {c.field}
                    </span>{' '}
                    <span className="opacity-50">{c.operator}</span>{' '}
                    <span className={cn(isDark ? 'text-amber-300' : 'text-amber-600')}>&quot;{c.value || '...'}&quot;</span>
                  </span>
                ))}{' '}
                <span className={cn(isDark ? 'text-emerald-300' : 'text-emerald-600')}>→</span>{' '}
                <span className={cn(isDark ? 'text-sky-300' : 'text-sky-600')}>{thenAction || '...'}</span>
                {elseAction && (
                  <span>
                    {' '}<span className={cn(isDark ? 'text-red-300' : 'text-red-600')}>ELSE</span>{' '}
                    <span className={cn(isDark ? 'text-sky-300' : 'text-sky-600')}>{elseAction}</span>
                  </span>
                )}
              </p>
            </div>

            {/* Example Rule */}
            <div className={cn(
              'rounded-xl p-3 border border-dashed',
              isDark ? 'border-white/[0.08]' : 'border-black/[0.08]',
            )}>
              <span className={cn('text-[10px] font-semibold uppercase tracking-wider', isDark ? 'text-white/25' : 'text-black/25')}>
                Example Rule
              </span>
              <p className={cn('text-xs mt-1 font-mono leading-relaxed', isDark ? 'text-white/35' : 'text-black/35')}>
                <span className={cn(isDark ? 'text-violet-300/60' : 'text-violet-600/60')}>IF</span>{' '}
                <span>lead.score</span>{' '}
                <span className="opacity-40">&gt;</span>{' '}
                <span className={cn(isDark ? 'text-amber-300/60' : 'text-amber-600/60')}>&quot;80&quot;</span>{' '}
                <span className={cn('font-bold', isDark ? 'text-violet-300/60' : 'text-violet-600/60')}>AND</span>{' '}
                <span>no reply</span>{' '}
                <span className="opacity-40">&gt;</span>{' '}
                <span className={cn(isDark ? 'text-amber-300/60' : 'text-amber-600/60')}>&quot;2d&quot;</span>{' '}
                <span className="opacity-40">→</span>{' '}
                <span className={cn(isDark ? 'text-sky-300/60' : 'text-sky-600/60')}>assign senior rep + send priority WhatsApp</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
