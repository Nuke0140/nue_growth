'use client';

import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { Workflow } from '@/modules/marketing/types';

const NODE_COLORS: Record<string, string> = {
  trigger: '#ef4444',
  delay: '#f59e0b',
  'send-whatsapp': '#25d366',
  'send-email': '#3b82f6',
  'send-sms': '#f97316',
  condition: '#8b5cf6',
  tag: '#06b6d4',
  'assign-lead': '#10b981',
  'move-lifecycle': '#6366f1',
  'notify-team': '#ec4899',
  'create-task': '#14b8a6',
  webhook: '#a855f7',
};

const NODE_ICONS: Record<string, string> = {
  trigger: '⚡',
  delay: '⏱',
  'send-whatsapp': '💬',
  'send-email': '📧',
  'send-sms': '📱',
  condition: '🔀',
  tag: '🏷',
  'assign-lead': '👤',
  'move-lifecycle': '🔄',
  'notify-team': '🔔',
  'create-task': '📋',
  webhook: '🔗',
};

interface WorkflowCanvasProps {
  workflow: Workflow;
}

export default function WorkflowCanvas({ workflow }: WorkflowCanvasProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const nodes = workflow.nodes;
  if (!nodes || nodes.length === 0) return null;

  const scaleX = 0.65;
  const scaleY = 0.65;
  const maxX = Math.max(...nodes.map(n => n.x)) + 160;
  const maxY = Math.max(...nodes.map(n => n.y)) + 120;
  const canvasW = maxX * scaleX;
  const canvasH = maxY * scaleY;

  const connectors = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    const from = nodes[i];
    const to = nodes[i + 1];
    if (to) {
      connectors.push(
        <line
          key={`conn-${i}`}
          x1={from.x * scaleX + 70}
          y1={from.y * scaleY + 24}
          x2={to.x * scaleX + 70}
          y2={to.y * scaleY + 24}
          stroke={'var(--app-border-strong)'}
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
      );
    }
  }

  return (
    <div className={cn('rounded-[var(--app-radius-xl)] border overflow-hidden', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
      <div
        className="relative w-full overflow-auto"
        style={{ minHeight: `${Math.max(canvasH, 200)}px` }}
      >
        {/* Dot grid background */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, ${'var(--app-border-strong)'} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />
        <svg
          className="absolute inset-0 pointer-events-none"
          width={canvasW}
          height={canvasH}
          viewBox={`0 0 ${canvasW} ${canvasH}`}
        >
          {connectors}
        </svg>
        <div className="relative" style={{ width: `${canvasW}px`, height: `${canvasH}px` }}>
          {nodes.map((node, i) => {
            const color = NODE_COLORS[node.type] || '#6b7280';
            const icon = NODE_ICONS[node.type] || '📦';
            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className={cn('absolute rounded-[var(--app-radius-lg)] border p-2 w-[140px] shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]',
                  isDark ? 'bg-white/[0.04] border-white/[0.08]' : 'bg-white border-gray-200 shadow-[var(--app-shadow-md)]-black/5'
                )}
                style={{ left: node.x * scaleX, top: node.y * scaleY }}
                title={node.description}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm">{icon}</span>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                </div>
                <p className={cn('text-[10px] font-medium leading-tight line-clamp-2', 'text-[var(--app-text-secondary)]')}>
                  {node.title}
                </p>
                <p className={cn('text-[8px] mt-0.5 truncate', 'text-[var(--app-text-muted)]')}>
                  {node.type.replace(/-/g, ' ')}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
