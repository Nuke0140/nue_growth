'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Timer, Plus, Play, Pencil, Clock, CheckCircle2, Pause, XCircle,
  Zap, User, Tag, Calendar, ArrowRight,
} from 'lucide-react';
import ExecutionReplayTimeline from './components/execution-replay-timeline';
import { scheduledJobs, recentExecutionLogs } from './data/mock-data';

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  active: { icon: CheckCircle2, color: 'text-emerald-400', bgColor: 'bg-emerald-500/15', label: 'Active' },
  paused: { icon: Pause, color: 'text-amber-400', bgColor: 'bg-amber-500/15', label: 'Paused' },
  failed: { icon: XCircle, color: 'text-red-400', bgColor: 'bg-red-500/15', label: 'Failed' },
};

const TAG_COLORS = [
  'bg-blue-500/15 text-blue-400',
  'bg-emerald-500/15 text-emerald-400',
  'bg-purple-500/15 text-purple-400',
  'bg-orange-500/15 text-orange-400',
  'bg-pink-500/15 text-pink-400',
  'bg-cyan-500/15 text-cyan-400',
  'bg-amber-500/15 text-amber-400',
];

export default function ScheduledJobsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const activeJobs = scheduledJobs.filter((j) => j.status === 'active').length;
  const totalRunsToday = scheduledJobs.reduce((sum, j) => sum + (j.status === 'active' ? 1 : 0), 0);
  const avgSuccessRate = scheduledJobs.length > 0
    ? Math.round(scheduledJobs.reduce((sum, j) => sum + j.successRate, 0) / scheduledJobs.length * 10) / 10
    : 0;

  const nextRunJob = useMemo(() => {
    const sorted = scheduledJobs
      .filter((j) => j.nextRun)
      .sort((a, b) => new Date(a.nextRun).getTime() - new Date(b.nextRun).getTime());
    return sorted[0];
  }, []);

  function formatTimestamp(ts: string) {
    return new Date(ts).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  function getCountdown(nextRun: string) {
    const diff = new Date(nextRun).getTime() - Date.now();
    if (diff <= 0) return 'Overdue';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  }

  function formatDuration(seconds: number) {
    if (seconds >= 60) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  const card = cn(
    'rounded-2xl border shadow-sm p-4 sm:p-5',
    isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
  );

  // Convert first execution log to timeline steps for the replay component
  const firstExecution = recentExecutionLogs[0];
  const timelineSteps = firstExecution
    ? firstExecution.nodeResults.map((node, idx) => ({
        id: node.nodeId,
        nodeName: node.nodeName,
        nodeType: ['trigger', 'action', 'condition', 'delay', 'ai'][idx % 5],
        status: node.status as 'success' | 'failed' | 'running' | 'skipped',
        duration: node.duration * 1000,
        timestamp: new Date(new Date(firstExecution.startedAt).getTime() + node.duration * 1000 * idx).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      }))
    : [];
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className={cn('text-2xl font-bold tracking-tight', isDark ? 'text-white' : 'text-zinc-900')}>
              Scheduled Jobs
            </h1>
            <p className={cn('text-sm mt-1', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
              Time-based automation center
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            Create Job
          </motion.button>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Active Jobs', value: activeJobs, icon: Timer, color: 'text-blue-400', bg: 'bg-blue-500/15' },
            { label: 'Total Runs Today', value: totalRunsToday, icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
            { label: 'Success Rate', value: `${avgSuccessRate}%`, icon: CheckCircle2, color: 'text-purple-400', bg: 'bg-purple-500/15' },
            {
              label: 'Next Run',
              value: nextRunJob ? getCountdown(nextRunJob.nextRun) : '—',
              icon: Clock,
              color: 'text-amber-400',
              bg: 'bg-amber-500/15',
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={card}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn('text-[10px] font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                    {stat.label}
                  </p>
                  <p className={cn('text-2xl font-bold mt-1', stat.color)}>
                    {stat.value}
                  </p>
                </div>
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', stat.bg)}>
                  <stat.icon className={cn('w-5 h-5', stat.color)} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {scheduledJobs.map((job, i) => {
            const statusConf = STATUS_CONFIG[job.status];
            const StatusIcon = statusConf.icon;

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={cn(
                  'rounded-2xl border shadow-sm p-4 sm:p-5 space-y-3',
                  isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className={cn('text-sm font-semibold truncate', isDark ? 'text-white' : 'text-zinc-900')}>
                        {job.name}
                      </h3>
                      <span className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                        statusConf.bgColor, statusConf.color,
                      )}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConf.label}
                      </span>
                    </div>
                    <p className={cn('text-xs line-clamp-2', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
                      {job.description}
                    </p>
                  </div>
                </div>

                {/* Schedule Display */}
                <div className={cn('rounded-xl p-3', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]')}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Calendar className={cn('h-3 w-3', isDark ? 'text-zinc-500' : 'text-zinc-400')} />
                    <p className={cn('text-[10px] font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                      Schedule
                    </p>
                  </div>
                  <p className={cn('text-xs font-medium', isDark ? 'text-zinc-200' : 'text-zinc-700')}>
                    {job.schedule}
                  </p>
                  <code className={cn(
                    'inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono mt-1.5',
                    isDark ? 'bg-white/[0.06] text-zinc-400' : 'bg-black/[0.04] text-zinc-500',
                  )}>
                    {job.cron}
                  </code>
                </div>

                {/* Last & Next Run */}
                <div className="grid grid-cols-2 gap-2">
                  <div className={cn('rounded-xl p-3', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]')}>
                    <p className={cn('text-[10px] font-medium uppercase tracking-wider mb-1', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                      Last Run
                    </p>
                    {job.lastRun ? (
                      <>
                        <p className={cn('text-[11px]', isDark ? 'text-zinc-300' : 'text-zinc-600')}>
                          {formatTimestamp(job.lastRun)}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className={cn(
                            'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold',
                            job.status !== 'failed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400',
                          )}>
                            {job.status !== 'failed' ? <CheckCircle2 className="h-2.5 w-2.5" /> : <XCircle className="h-2.5 w-2.5" />}
                            {job.status !== 'failed' ? 'Success' : 'Failed'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className={cn('text-[11px]', isDark ? 'text-zinc-600' : 'text-zinc-400')}>Never</p>
                    )}
                  </div>
                  <div className={cn('rounded-xl p-3', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]')}>
                    <p className={cn('text-[10px] font-medium uppercase tracking-wider mb-1', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                      Next Run
                    </p>
                    <p className={cn('text-[11px]', isDark ? 'text-zinc-300' : 'text-zinc-600')}>
                      {formatTimestamp(job.nextRun)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-2.5 w-2.5 text-amber-400" />
                      <span className="text-[9px] font-bold text-amber-400">
                        {getCountdown(job.nextRun)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Duration + Success Rate */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Zap className={cn('h-3 w-3', isDark ? 'text-zinc-500' : 'text-zinc-400')} />
                    <span className={cn('text-[10px]', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
                      {formatDuration(job.duration)}
                    </span>
                  </div>
                  <span className={cn('text-[10px]', isDark ? 'text-zinc-500' : 'text-zinc-400')}>·</span>
                  <span className={cn('text-[10px] font-bold', job.successRate >= 95 ? 'text-emerald-400' : job.successRate >= 90 ? 'text-amber-400' : 'text-red-400')}>
                    {job.successRate}% success
                  </span>
                </div>

                {/* Success Rate Bar */}
                <div className={cn('w-full h-1 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${job.successRate}%` }}
                    transition={{ delay: i * 0.06 + 0.3, duration: 0.6 }}
                    className={cn(
                      'h-full rounded-full',
                      job.successRate >= 95 ? 'bg-emerald-500' : job.successRate >= 90 ? 'bg-amber-500' : 'bg-red-500',
                    )}
                  />
                </div>

                {/* Created By */}
                <div className="flex items-center gap-1.5">
                  <User className={cn('h-3 w-3', isDark ? 'text-zinc-500' : 'text-zinc-400')} />
                  <span className={cn('text-[10px]', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
                    Created by {job.createdBy}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Tag className={cn('h-3 w-3', isDark ? 'text-zinc-500' : 'text-zinc-400')} />
                  {job.tags.map((tag, ti) => (
                    <span
                      key={tag}
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                        TAG_COLORS[ti % TAG_COLORS.length],
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                      'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25',
                    )}
                  >
                    <Play className="h-3 w-3" />
                    Run Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                      isDark ? 'bg-white/[0.06] text-zinc-300 hover:bg-white/[0.1]' : 'bg-black/[0.04] text-zinc-600 hover:bg-black/[0.08]',
                    )}
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Execution Timeline */}
        {timelineSteps.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ArrowRight className={cn('w-4 h-4', isDark ? 'text-zinc-400' : 'text-zinc-500')} />
              <h2 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>
                Recent Execution
              </h2>
            </div>
            <ExecutionReplayTimeline
              steps={timelineSteps}
              isPlaying={isTimelinePlaying}
              onPlay={() => setIsTimelinePlaying(true)}
              onPause={() => setIsTimelinePlaying(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
