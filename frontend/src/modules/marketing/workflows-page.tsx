'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Zap, Clock, GitBranch, Mail, MessageCircle, Smartphone,
  UserPlus, ListTodo, Bell, ArrowRight, Globe, Tag, Plus,
  ZoomIn, ZoomOut, Maximize2, MousePointer2, Activity,
  ChevronRight, Play, Pause, BarChart3, TrendingUp
} from 'lucide-react';
import { mockWorkflows } from '@/modules/marketing/data/mock-data';
import type { Workflow, WorkflowNodeType } from '@/modules/marketing/types';

const nodeIcons: Record<WorkflowNodeType, React.ElementType> = {
  trigger: Zap,
  delay: Clock,
  condition: GitBranch,
  'send-email': Mail,
  'send-whatsapp': MessageCircle,
  'send-sms': Smartphone,
  'assign-lead': UserPlus,
  'create-task': ListTodo,
  'notify-team': Bell,
  'move-lifecycle': ArrowRight,
  webhook: Globe,
  tag: Tag,
};

const nodeTypeLabels: Record<WorkflowNodeType, string> = {
  trigger: 'Trigger',
  delay: 'Delay',
  condition: 'Condition',
  'send-email': 'Email',
  'send-whatsapp': 'WhatsApp',
  'send-sms': 'SMS',
  'assign-lead': 'Assign Lead',
  'create-task': 'Create Task',
  'notify-team': 'Notify Team',
  'move-lifecycle': 'Move Stage',
  webhook: 'Webhook',
  tag: 'Tag',
};

const nodeColors: Record<WorkflowNodeType, string> = {
  trigger: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  delay: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
  condition: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
  'send-email': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  'send-whatsapp': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  'send-sms': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  'assign-lead': 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  'create-task': 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  'notify-team': 'text-pink-400 bg-pink-500/10 border-pink-500/30',
  'move-lifecycle': 'text-teal-400 bg-teal-500/10 border-teal-500/30',
  webhook: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
  tag: 'text-lime-400 bg-lime-500/10 border-lime-500/30',
};

const paletteNodes: WorkflowNodeType[] = ['trigger', 'delay', 'condition', 'send-email', 'send-whatsapp', 'send-sms', 'assign-lead', 'create-task', 'notify-team', 'move-lifecycle', 'webhook', 'tag'];

export default function WorkflowsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(mockWorkflows[0].id);
  const [zoom, setZoom] = useState(1);

  const selectedWorkflow = useMemo(
    () => mockWorkflows.find(w => w.id === selectedWorkflowId) || mockWorkflows[0],
    [selectedWorkflowId]
  );

  const activeWorkflowsCount = useMemo(() => mockWorkflows.filter(w => w.status === 'active').length, []);

  const conversionRate = useMemo(() => {
    if (selectedWorkflow.triggers === 0) return 0;
    return Math.round((selectedWorkflow.conversions / selectedWorkflow.triggers) * 100);
  }, [selectedWorkflow]);

  const renderConnectors = (workflow: Workflow) => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const nodes = workflow.nodes;
    for (let i = 0; i < nodes.length - 1; i++) {
      const from = nodes[i];
      const to = nodes[i + 1];
      lines.push({
        x1: from.x + 160,
        y1: from.y + 40,
        x2: to.x,
        y2: to.y + 40,
      });
    }
    return lines;
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
              <Zap className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold">Workflow Automation</h1>
                <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600')}>
                  {activeWorkflowsCount} active
                </Badge>
              </div>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Visual automation builder for marketing workflows</p>
            </div>
          </div>
          <Button className={cn('px-4 py-2 text-sm font-medium rounded-xl gap-2', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}>
            <Plus className="w-4 h-4" />
            Create Workflow
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 min-h-[600px]">
          {/* Workflow List Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'lg:w-72 shrink-0 rounded-2xl border p-4 space-y-2',
              isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}
          >
            <p className={cn('text-[10px] uppercase tracking-wider font-medium mb-3', isDark ? 'text-white/40' : 'text-black/40')}>
              Workflows ({mockWorkflows.length})
            </p>
            {mockWorkflows.map((wf) => {
              const isSelected = wf.id === selectedWorkflowId;
              return (
                <button
                  key={wf.id}
                  onClick={() => setSelectedWorkflowId(wf.id)}
                  className={cn(
                    'w-full text-left p-3 rounded-xl border transition-all duration-200',
                    isSelected
                      ? (isDark ? 'border-white/[0.12] bg-white/[0.05]' : 'border-black/[0.12] bg-black/[0.03]')
                      : (isDark ? 'border-white/[0.04] hover:bg-white/[0.03]' : 'border-black/[0.04] hover:bg-black/[0.02]')
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className={cn('text-sm font-medium truncate pr-2', isSelected ? '' : (isDark ? 'text-white/70' : 'text-black/70'))}>
                      {wf.name}
                    </p>
                    <Badge variant="secondary" className={cn(
                      'text-[9px] px-1.5 py-0 shrink-0',
                      wf.status === 'active' ? (isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600') :
                      wf.status === 'paused' ? (isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600') :
                      (isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40')
                    )}>
                      {wf.status}
                    </Badge>
                  </div>
                  <p className={cn('text-[10px] truncate mb-1.5', isDark ? 'text-white/30' : 'text-black/30')}>
                    {wf.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>
                      {wf.triggers.toLocaleString()} triggers
                    </span>
                    <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>
                      {wf.conversions.toLocaleString()} conversions
                    </span>
                  </div>
                  {wf.lastRun && (
                    <p className={cn('text-[9px] mt-1', isDark ? 'text-white/15' : 'text-black/15')}>
                      Last run: {new Date(wf.lastRun).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                  <ChevronRight className={cn(
                    'w-3.5 h-3.5 mt-1.5 transition-transform',
                    isSelected ? (isDark ? 'text-white/40 rotate-90' : 'text-black/40 rotate-90') : (isDark ? 'text-white/10' : 'text-black/10')
                  )} />
                </button>
              );
            })}
          </motion.div>

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Canvas */}
            <motion.div
              key={selectedWorkflow.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'flex-1 rounded-2xl border overflow-hidden relative',
                isDark ? 'bg-white/[0.01] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]'
              )}
              style={{ minHeight: '400px' }}
            >
              {/* Dot Grid Background */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: isDark
                    ? 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)'
                    : 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Canvas Header */}
              <div className={cn(
                'absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 border-b',
                isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white/80 border-black/[0.06]'
              )}>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{selectedWorkflow.name}</h3>
                  <Badge variant="secondary" className={cn(
                    'text-[9px] px-1.5 py-0',
                    selectedWorkflow.status === 'active' ? (isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600') :
                    (isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600')
                  )}>
                    {selectedWorkflow.status}
                  </Badge>
                  <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>
                    {selectedWorkflow.nodes.length} nodes
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
                    className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-colors', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}
                  >
                    <ZoomOut className={cn('w-3.5 h-3.5', isDark ? 'text-white/40' : 'text-black/40')} />
                  </button>
                  <span className={cn('text-[10px] w-10 text-center', isDark ? 'text-white/30' : 'text-black/30')}>
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom(prev => Math.min(prev + 0.2, 2))}
                    className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-colors', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}
                  >
                    <ZoomIn className={cn('w-3.5 h-3.5', isDark ? 'text-white/40' : 'text-black/40')} />
                  </button>
                  <div className={cn('w-px h-4 mx-1', isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]')} />
                  <button className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-colors', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
                    <Maximize2 className={cn('w-3.5 h-3.5', isDark ? 'text-white/40' : 'text-black/40')} />
                  </button>
                  <div className={cn('w-px h-4 mx-1', isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]')} />
                  {selectedWorkflow.status === 'active' ? (
                    <Button variant="ghost" size="sm" className={cn('h-7 gap-1.5 text-[10px] rounded-lg', isDark ? 'text-amber-400 hover:bg-amber-500/10' : 'text-amber-600 hover:bg-amber-50')}>
                      <Pause className="w-3 h-3" /> Pause
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className={cn('h-7 gap-1.5 text-[10px] rounded-lg', isDark ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-emerald-600 hover:bg-emerald-50')}>
                      <Play className="w-3 h-3" /> Activate
                    </Button>
                  )}
                </div>
              </div>

              {/* Workflow Nodes */}
              <div
                className="absolute inset-0 pt-12 pb-4 px-4 overflow-auto"
              >
                <div
                  className="relative"
                  style={{
                    width: `${Math.max(...selectedWorkflow.nodes.map(n => n.x)) + 200}px`,
                    height: `${Math.max(...selectedWorkflow.nodes.map(n => n.y)) + 120}px`,
                    minWidth: '100%',
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                  }}
                >
                  {/* SVG Connectors */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    {renderConnectors(selectedWorkflow).map((line, i) => (
                      <g key={i}>
                        <line
                          x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                          stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}
                          strokeWidth="2"
                          strokeDasharray="6 4"
                        />
                        <polygon
                          points={`${line.x2},${line.y2} ${line.x2 - 8},${line.y2 - 4} ${line.x2 - 8},${line.y2 + 4}`}
                          fill={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}
                        />
                      </g>
                    ))}
                  </svg>

                  {/* Nodes */}
                  {selectedWorkflow.nodes.map((node, i) => {
                    const Icon = nodeIcons[node.type];
                    const colorClasses = nodeColors[node.type];
                    const [textColor, bgColor] = [colorClasses.split(' ')[0], colorClasses.split(' ')[1]];

                    return (
                      <motion.div
                        key={node.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          'absolute rounded-2xl border p-3 cursor-pointer transition-all duration-200 hover:shadow-lg group',
                          isDark ? 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.06]' : 'bg-white border-black/[0.08] hover:bg-black/[0.02] hover:shadow-black/5',
                        )}
                        style={{
                          left: node.x,
                          top: node.y,
                          width: '160px',
                          zIndex: 1,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', bgColor)}>
                            <Icon className={cn('w-3.5 h-3.5', textColor)} />
                          </div>
                          <Badge variant="secondary" className={cn('text-[8px] px-1.5 py-0 shrink-0', isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40')}>
                            {nodeTypeLabels[node.type]}
                          </Badge>
                        </div>
                        <p className={cn('text-[11px] font-medium mb-0.5 truncate', isDark ? 'text-white/70' : 'text-black/70')}>
                          {node.title}
                        </p>
                        <p className={cn('text-[9px] line-clamp-2 leading-relaxed', isDark ? 'text-white/30' : 'text-black/30')}>
                          {node.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Drag Hint */}
              <div className={cn(
                'absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border',
                isDark ? 'bg-white/[0.04] border-white/[0.06]' : 'bg-white/80 border-black/[0.06]'
              )}>
                <MousePointer2 className={cn('w-3 h-3', isDark ? 'text-white/25' : 'text-black/25')} />
                <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>
                  Drag nodes to rearrange · Click to edit
                </span>
              </div>
            </motion.div>

            {/* Workflow Stats */}
            <div className="grid grid-cols-3 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                  <span className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/40' : 'text-black/40')}>Total Triggers</span>
                </div>
                <p className="text-xl font-bold">{selectedWorkflow.triggers.toLocaleString()}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className={cn('w-4 h-4 text-emerald-400')} />
                  <span className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/40' : 'text-black/40')}>Conversions</span>
                </div>
                <p className="text-xl font-bold">{selectedWorkflow.conversions.toLocaleString()}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className={cn('w-4 h-4 text-violet-400')} />
                  <span className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/40' : 'text-black/40')}>Conversion Rate</span>
                </div>
                <p className="text-xl font-bold">{conversionRate}%</p>
              </motion.div>
            </div>

            {/* Node Palette */}
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
            >
              <p className={cn('text-[10px] uppercase tracking-wider font-medium mb-3', isDark ? 'text-white/40' : 'text-black/40')}>
                <Plus className="w-3 h-3 inline mr-1.5" /> Node Palette
              </p>
              <div className="flex flex-wrap gap-2">
                {paletteNodes.map(nodeType => {
                  const Icon = nodeIcons[nodeType];
                  const colorClasses = nodeColors[nodeType];
                  const [textColor, bgColor] = [colorClasses.split(' ')[0], colorClasses.split(' ')[1]];
                  return (
                    <button
                      key={nodeType}
                      className={cn(
                        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all duration-200 group',
                        isDark ? 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04]' : 'border-black/[0.06] hover:border-black/[0.12] hover:bg-black/[0.04]'
                      )}
                    >
                      <div className={cn('w-5 h-5 rounded-md flex items-center justify-center', bgColor)}>
                        <Icon className={cn('w-2.5 h-2.5', textColor)} />
                      </div>
                      <span className={cn('text-[10px] font-medium', isDark ? 'text-white/50 group-hover:text-white/70' : 'text-black/50 group-hover:text-black/70')}>
                        {nodeTypeLabels[nodeType]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
