'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import type { Workflow } from '../types';

const nodeColors: Record<string, string> = {
  trigger: 'bg-blue-500/20 border-blue-500/40 text-blue-400',
  action: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
  condition: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
  delay: 'bg-sky-500/20 border-sky-500/40 text-sky-400',
  split: 'bg-violet-500/20 border-violet-500/40 text-violet-400',
  loop: 'bg-pink-500/20 border-pink-500/40 text-pink-400',
  ai: 'bg-purple-500/20 border-purple-500/40 text-purple-400',
};

const statusIndicator: Record<string, string> = {
  idle: '',
  running: 'ring-2 ring-blue-400/50 animate-pulse',
  success: 'ring-2 ring-emerald-400/50',
  error: 'ring-2 ring-red-400/50',
  skipped: 'ring-1 ring-zinc-400/30',
};

interface WorkflowCanvasProps {
  workflow: Workflow;
}

export default function WorkflowCanvas({ workflow }: WorkflowCanvasProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={cn(
      'h-full min-h-[400px] rounded-2xl border overflow-hidden relative',
      'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
    )}>
      {/* Grid background */}
      <div className="absolute inset-0" style={{
        backgroundImage: isDark
          ? 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)'
          : 'radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      <div className="relative z-10 p-6">
        {/* Connections SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {workflow.connections.map((conn) => {
            const fromNode = workflow.nodes.find((n) => n.id === conn.fromNodeId);
            const toNode = workflow.nodes.find((n) => n.id === conn.toNodeId);
            if (!fromNode || !toNode) return null;
            const x1 = fromNode.position.x + 80;
            const y1 = fromNode.position.y + 24;
            const x2 = toNode.position.x;
            const y2 = toNode.position.y + 24;
            const midX = (x1 + x2) / 2;
            return (
              <path
                key={conn.id}
                d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke={'var(--app-border-strong)'}
                strokeWidth="2"
                strokeDasharray={conn.condition ? '6 4' : 'none'}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {workflow.nodes.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.3, ease: 'easeOut' as const }}
            className={cn(
              'absolute flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer',
              'transition-all duration-200 hover:scale-105',
              nodeColors[node.type] || nodeColors.action,
              statusIndicator[node.status || 'idle'],
            )}
            style={{ left: node.position.x, top: node.position.y }}
            title={node.label}
          >
            <span className="text-[10px] uppercase tracking-wider opacity-60">
              {node.type}
            </span>
            <span className="font-semibold whitespace-nowrap">
              {node.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
