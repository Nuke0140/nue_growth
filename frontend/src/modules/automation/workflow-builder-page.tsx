'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Save, Send, Play, ChevronRight, ChevronDown, Workflow, Plus,
  MousePointerClick, GitBranch, Clock, Split, Repeat, BrainCircuit,
  PanelRightOpen, PanelRightClose, ZoomIn, ZoomOut, Maximize2,
  Info, Settings2, Trash2,
} from 'lucide-react';
import WorkflowCanvas from './components/workflow-canvas';
import { sampleWorkflows } from './data/mock-data';

const nodePalette = [
  { type: 'trigger', label: 'Trigger', icon: MousePointerClick, color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  { type: 'action', label: 'Action', icon: Play, color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  { type: 'condition', label: 'Condition', icon: GitBranch, color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  { type: 'delay', label: 'Delay', icon: Clock, color: 'bg-sky-500/15 text-sky-400 border-sky-500/20' },
  { type: 'split', label: 'Split', icon: Split, color: 'bg-violet-500/15 text-violet-400 border-violet-500/20' },
  { type: 'loop', label: 'Loop', icon: Repeat, color: 'bg-pink-500/15 text-pink-400 border-pink-500/20' },
  { type: 'ai', label: 'AI', icon: BrainCircuit, color: 'bg-purple-500/15 text-purple-400 border-purple-500/20' },
];

const statusOptions = ['Draft', 'Active', 'Paused'];
const statusColors: Record<string, string> = {
  Draft: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
  Active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Paused: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
};

export default function WorkflowBuilderPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [workflowName, setWorkflowName] = useState(sampleWorkflows[0]?.name || 'New Workflow');
  const [status, setStatus] = useState<string>('Active');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);

  const currentWorkflow = sampleWorkflows[0];
  const selectedNodeData = currentWorkflow?.nodes.find((n) => n.id === selectedNode);

  return (
    <div className="h-full flex flex-col">
      {/* ── Top Bar ── */}
      <div className={cn(
        'shrink-0 border-b px-4 py-3 flex items-center justify-between gap-3',
        'border-[var(--app-border)]',
      )}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={cn(
            'w-9 h-10  rounded-[var(--app-radius-lg)] flex items-center justify-center shrink-0',
            'bg-[var(--app-purple-light)]',
          )}>
            <Workflow className={cn('w-4 h-4', 'text-[var(--app-purple)]')} />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 min-w-0">
            <h1 className="text-lg font-bold shrink-0">Workflow Builder</h1>
            <span className={cn('text-xs hidden sm:block', 'text-[var(--app-text-muted)]')}>·</span>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className={cn(
                'bg-transparent text-sm font-medium focus:outline-none border-b border-dashed min-w-0 flex-1',
                isDark ? 'text-white/80 border-white/20 focus:border-violet-400/50 placeholder:text-white/20' : 'text-black/80 border-black/20 focus:border-violet-400/50 placeholder:text-black/20',
              )}
              placeholder="Enter workflow name..."
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Status Selector */}
          <div className="flex items-center gap-1">
            {statusOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setStatus(opt)}
                className={cn(
                  'rounded-[var(--app-radius-lg)] px-2.5 py-1 text-[10px] font-semibold border transition-colors',
                  status === opt
                    ? statusColors[opt]
                    : isDark
                      ? 'bg-transparent text-white/30 border-transparent hover:text-white/50'
                      : 'bg-transparent text-black/30 border-transparent hover:text-black/50',
                )}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className={cn('w-px h-6', 'bg-[var(--app-hover-bg)]')} />

          {/* Action Buttons */}
          <button className={cn(
            'inline-flex items-center gap-1.5 rounded-[var(--app-radius-lg)] px-3 py-1.5 text-xs font-medium transition-colors',
            isDark ? 'bg-white/[0.06] text-white/60 hover:bg-white/[0.1]' : 'bg-black/[0.04] text-black/60 hover:bg-black/[0.06]',
          )}>
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
          </button>
          <button className={cn(
            'inline-flex items-center gap-1.5 rounded-[var(--app-radius-lg)] px-3 py-1.5 text-xs font-medium transition-colors',
            isDark ? 'bg-white/[0.06] text-white/60 hover:bg-white/[0.1]' : 'bg-black/[0.04] text-black/60 hover:bg-black/[0.06]',
          )}>
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Publish</span>
          </button>
          <button className={cn(
            'inline-flex items-center gap-1.5 rounded-[var(--app-radius-lg)] px-3 py-1.5 text-xs font-semibold transition-colors',
            isDark ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
          )}>
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">Run Test</span>
          </button>
        </div>
      </div>

      {/* ── Main Content: Canvas + Sidebar ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 overflow-auto p-4 relative">
          <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}>
            {currentWorkflow ? (
              <WorkflowCanvas workflow={currentWorkflow} />
            ) : (
              /* Empty State */
              <div className={cn(
                'h-full min-h-[500px] rounded-[var(--app-radius-xl)] border flex flex-col items-center justify-center gap-4',
                'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
              )}>
                <div className={cn(
                  'w-16 h-16 rounded-[var(--app-radius-xl)] flex items-center justify-center',
                  'bg-[var(--app-hover-bg)]',
                )}>
                  <Plus className={cn('w-8 h-8', 'text-[var(--app-text-muted)]')} />
                </div>
                <div className="text-center">
                  <p className={cn('text-sm font-semibold', 'text-[var(--app-text-secondary)]')}>
                    No workflow selected
                  </p>
                  <p className={cn('text-xs mt-1', 'text-[var(--app-text-muted)]')}>
                    Create your first workflow to get started
                  </p>
                </div>
                <button className={cn(
                  'inline-flex items-center gap-2 rounded-[var(--app-radius-lg)] px-4 py-2 text-xs font-semibold transition-colors',
                  isDark ? 'bg-violet-500/15 text-violet-300 hover:bg-violet-500/25' : 'bg-violet-50 text-violet-600 hover:bg-violet-100',
                )}>
                  <Plus className="w-4 h-4" />
                  Create your first workflow
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'shrink-0 border-l overflow-hidden flex flex-col',
                isDark ? 'border-white/[0.06] bg-black/20' : 'border-black/[0.06] bg-white/80',
              )}
            >
              <div className="p-4 space-y-4 overflow-y-auto flex-1">
                {/* Node Palette */}
                <div>
                  <h3 className={cn('text-xs font-semibold uppercase tracking-wider mb-3', 'text-[var(--app-text-muted)]')}>
                    Add Node
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {nodePalette.map((node) => (
                      <motion.button
                        key={node.type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          'flex flex-col items-center gap-1.5 rounded-[var(--app-radius-lg)] border p-3 transition-colors cursor-pointer',
                          node.color,
                        )}
                      >
                        <node.icon className="w-5 h-5" />
                        <span className="text-[10px] font-semibold">{node.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Selected Node Config */}
                {selectedNodeData && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      'rounded-[var(--app-radius-lg)] border p-3 space-y-3',
                      'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className={cn('text-xs font-semibold', 'text-[var(--app-text-secondary)]')}>
                        Node Configuration
                      </h3>
                      <button onClick={() => setSelectedNode(null)} className={cn(
                        'w-6 h-6 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors',
                        isDark ? 'hover:bg-white/[0.06] text-white/30' : 'hover:bg-black/[0.06] text-black/30',
                      )}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                          Label
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedNodeData.label}
                          className={cn(
                            'w-full mt-1 rounded-[var(--app-radius-lg)] border px-2.5 py-1.5 text-xs focus:outline-none',
                            isDark
                              ? 'bg-white/[0.04] border-white/[0.08] text-white/80 focus:border-violet-400/50'
                              : 'bg-black/[0.03] border-black/[0.08] text-black/80 focus:border-violet-400/50',
                          )}
                        />
                      </div>
                      <div>
                        <label className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                          Type
                        </label>
                        <span className={cn('text-xs block mt-1', 'text-[var(--app-text-secondary)]')}>
                          {selectedNodeData.type}
                        </span>
                      </div>
                      <div>
                        <label className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                          Module
                        </label>
                        <span className={cn('text-xs block mt-1', 'text-[var(--app-text-secondary)]')}>
                          {selectedNodeData.module}
                        </span>
                      </div>
                      <div>
                        <label className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                          Config
                        </label>
                        <pre className={cn(
                          'mt-1 rounded-[var(--app-radius-lg)] p-2 text-[10px] font-mono overflow-auto max-h-32',
                          isDark ? 'bg-white/[0.02] text-white/40' : 'bg-black/[0.02] text-black/40',
                        )}>
                          {JSON.stringify(selectedNodeData.config, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Workflow Info */}
                {currentWorkflow && (
                  <div className={cn(
                    'rounded-[var(--app-radius-lg)] border p-3 space-y-2',
                    'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
                  )}>
                    <h3 className={cn('text-xs font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                      Workflow Info
                    </h3>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className={cn('text-[var(--app-text-muted)]')}>Version</span>
                        <span className={cn('font-medium', 'text-[var(--app-text)]')}>v{currentWorkflow.version}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className={cn('text-[var(--app-text-muted)]')}>Total Runs</span>
                        <span className={cn('font-medium', 'text-[var(--app-text)]')}>{currentWorkflow.runCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className={cn('text-[var(--app-text-muted)]')}>Success Rate</span>
                        <span className={cn('font-medium', 'text-[var(--app-success)]')}>{currentWorkflow.successRate}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className={cn('text-[var(--app-text-muted)]')}>Avg Duration</span>
                        <span className={cn('font-medium', 'text-[var(--app-text)]')}>{currentWorkflow.avgDuration}s</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom Bar ── */}
      <div className={cn(
        'shrink-0 border-t px-4 py-2 flex items-center justify-between',
        'border-[var(--app-border)]',
      )}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-[var(--app-radius-lg)] px-2.5 py-1 text-[10px] font-medium transition-colors',
              isDark ? 'bg-white/[0.06] text-white/40 hover:text-white/60' : 'bg-black/[0.04] text-black/40 hover:text-black/60',
            )}
          >
            {sidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            Nodes Panel
          </button>

          <div className="w-px h-4" style={{ backgroundColor: 'var(--app-border-strong)' }} />

          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className={cn(
                'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors',
                isDark ? 'hover:bg-white/[0.06] text-white/40' : 'hover:bg-black/[0.06] text-black/40',
              )}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className={cn('text-[10px] font-mono w-10 text-center', 'text-[var(--app-text-muted)]')}>
              {zoom}%
            </span>
            <button
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className={cn(
                'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors',
                isDark ? 'hover:bg-white/[0.06] text-white/40' : 'hover:bg-black/[0.06] text-black/40',
              )}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(100)}
              className={cn(
                'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors',
                isDark ? 'hover:bg-white/[0.06] text-white/40' : 'hover:bg-black/[0.06] text-black/40',
              )}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentWorkflow && (
            <>
              <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                v{currentWorkflow.version}
              </span>
              <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                {currentWorkflow.nodes.length} nodes · {currentWorkflow.connections.length} connections
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
