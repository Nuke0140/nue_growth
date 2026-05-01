'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  FileText, BarChart3, PieChart, LayoutGrid, LineChart, Funnel, Target,
  Plus, Trash2, Download, Eye, Palette, Upload, ChevronDown,
} from 'lucide-react';
import ReportTemplateCard from './components/report-template-card';
import { reportTemplates } from './data/mock-data';

const DATA_SOURCES = ['CRM', 'Sales', 'Marketing', 'Finance', 'Retention'];
const WIDGET_TYPES = [
  { id: 'line-chart', label: 'Line Chart', icon: LineChart },
  { id: 'bar-chart', label: 'Bar Chart', icon: BarChart3 },
  { id: 'pie-chart', label: 'Pie Chart', icon: PieChart },
  { id: 'kpi', label: 'KPI Cards', icon: Target },
  { id: 'pipeline', label: 'Pipeline', icon: Funnel },
  { id: 'roi', label: 'ROI Summary', icon: PieChart },
  { id: 'table', label: 'Data Table', icon: LayoutGrid },
  { id: 'cohort-heatmap', label: 'Cohort', icon: BarChart3 },
];
const PRESET_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#1e293b'];

export default function ReportBuilderPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [reportTitle, setReportTitle] = useState('New Report');
  const [dataSource, setDataSource] = useState('CRM');
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>(['kpi', 'line-chart', 'bar-chart']);
  const [sections, setSections] = useState([
    { id: 's1', title: 'Overview', widgets: ['kpi'] },
    { id: 's2', title: 'Trends', widgets: ['line-chart'] },
    { id: 's3', title: 'Breakdown', widgets: ['bar-chart'] },
  ]);
  const [brandColor, setBrandColor] = useState('#6366f1');
  const [notes, setNotes] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const card = cn(
    'rounded-2xl border shadow-sm p-4 sm:p-5',
    isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
  );

  function addSection() {
    const id = `s${sections.length + 1}`;
    setSections([...sections, { id, title: `Section ${sections.length + 1}`, widgets: [] }]);
  }

  function removeSection(id: string) {
    setSections(sections.filter((s) => s.id !== id));
  }

  function toggleWidget(widgetId: string) {
    setSelectedWidgets((prev) =>
      prev.includes(widgetId) ? prev.filter((w) => w !== widgetId) : [...prev, widgetId],
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={cn('text-2xl font-bold tracking-tight', isDark ? 'text-white' : 'text-zinc-900')}>
              Report Builder
            </h1>
            <p className={cn('text-sm mt-1', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
              Create custom reports
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPreview(!showPreview)}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-colors',
                isDark
                  ? 'bg-white/[0.06] text-zinc-300 hover:bg-white/[0.1] border border-white/[0.08]'
                  : 'bg-black/[0.03] text-zinc-600 hover:bg-black/[0.06] border border-black/[0.06]',
              )}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </motion.button>
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowExport(!showExport)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-colors',
                  isDark
                    ? 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/30'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200',
                )}
              >
                <Download className="w-3.5 h-3.5" />
                Export
                <ChevronDown className="w-3 h-3" />
              </motion.button>
              {showExport && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'absolute right-0 top-full z-50 mt-1 min-w-[140px] rounded-xl border shadow-lg py-1',
                    isDark ? 'bg-zinc-800 border-white/[0.08]' : 'bg-white border-black/[0.08]',
                  )}
                >
                  {[
                    { label: 'PDF', icon: FileText },
                    { label: 'CSV', icon: LayoutGrid },
                    { label: 'Excel', icon: BarChart3 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setShowExport(false)}
                      className={cn(
                        'flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-left',
                        isDark ? 'text-zinc-300 hover:bg-white/[0.06]' : 'text-zinc-700 hover:bg-black/[0.03]',
                      )}
                    >
                      <opt.icon className="w-3.5 h-3.5" />
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Template Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className={cn('text-sm font-semibold mb-3', isDark ? 'text-white' : 'text-zinc-900')}>
            Start from Template
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {reportTemplates.map((tpl) => (
              <ReportTemplateCard
                key={tpl.id}
                name={tpl.name}
                description={tpl.description}
                category={tpl.id === 'rpt-executive-quarterly' ? 'executive' : 'team'}
                widgetCount={tpl.sections.length}
                onClick={() => setReportTitle(tpl.name)}
              />
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Builder Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Title */}
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className={card}>
              <label className={cn('text-[10px] font-medium uppercase tracking-wider block mb-2', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                Report Title
              </label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className={cn(
                  'w-full rounded-xl border px-3 py-2 text-sm font-medium outline-none transition-colors',
                  isDark
                    ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder-zinc-600 focus:border-blue-500/40'
                    : 'bg-black/[0.02] border-black/[0.08] text-zinc-900 placeholder-zinc-400 focus:border-blue-500/40',
                )}
                placeholder="Enter report title..."
              />
            </motion.div>

            {/* Data Source Selector */}
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className={card}>
              <label className={cn('text-[10px] font-medium uppercase tracking-wider block mb-2', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                Data Source
              </label>
              <div className="flex flex-wrap gap-2">
                {DATA_SOURCES.map((src) => (
                  <motion.button
                    key={src}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDataSource(src)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                      dataSource === src
                        ? 'bg-blue-500/15 text-blue-600 border border-blue-500/30'
                        : isDark
                          ? 'bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:bg-white/[0.08]'
                          : 'bg-black/[0.03] border border-black/[0.06] text-zinc-600 hover:bg-black/[0.06]',
                    )}
                  >
                    {src}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Widget Selector */}
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={card}>
              <label className={cn('text-[10px] font-medium uppercase tracking-wider block mb-2', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                Widgets
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {WIDGET_TYPES.map((wt) => {
                  const isSelected = selectedWidgets.includes(wt.id);
                  const Icon = wt.icon;
                  return (
                    <motion.button
                      key={wt.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleWidget(wt.id)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-colors',
                        isSelected
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-600'
                          : isDark
                            ? 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:bg-white/[0.04]'
                            : 'bg-black/[0.01] border-black/[0.06] text-zinc-600 hover:bg-black/[0.03]',
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] font-medium">{wt.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Sections List */}
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className={card}>
              <div className="flex items-center justify-between mb-3">
                <label className={cn('text-[10px] font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                  Sections
                </label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addSection}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium',
                    isDark ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
                  )}
                >
                  <Plus className="w-3 h-3" />
                  Add
                </motion.button>
              </div>
              <div className="space-y-2">
                {sections.map((section, i) => (
                  <div
                    key={section.id}
                    className={cn(
                      'flex items-center justify-between rounded-xl border p-3',
                      isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn('text-[10px] font-mono', isDark ? 'text-zinc-600' : 'text-zinc-400')}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={cn('text-xs font-medium', isDark ? 'text-white' : 'text-zinc-900')}>
                        {section.title}
                      </span>
                      <span className={cn('text-[10px]', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                        ({section.widgets.length} widgets)
                      </span>
                    </div>
                    <button
                      onClick={() => removeSection(section.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Brand Header Section */}
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className={card}>
              <div className="flex items-center gap-2 mb-3">
                <Palette className={cn('w-4 h-4', isDark ? 'text-zinc-400' : 'text-zinc-500')} />
                <label className={cn('text-[10px] font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                  Branding
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Logo Upload */}
                <div>
                  <p className={cn('text-xs font-medium mb-2', isDark ? 'text-zinc-300' : 'text-zinc-700')}>Logo</p>
                  <div
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 cursor-pointer transition-colors',
                      isDark
                        ? 'border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]'
                        : 'border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02]',
                    )}
                  >
                    <Upload className={cn('w-4 h-4', isDark ? 'text-zinc-500' : 'text-zinc-400')} />
                    <span className={cn('text-xs', isDark ? 'text-zinc-500' : 'text-zinc-400')}>Upload logo</span>
                  </div>
                </div>

                {/* Color Picker */}
                <div>
                  <p className={cn('text-xs font-medium mb-2', isDark ? 'text-zinc-300' : 'text-zinc-700')}>Primary Color</p>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setBrandColor(color)}
                        className={cn(
                          'h-8 w-8 rounded-lg transition-transform hover:scale-110',
                          brandColor === color && 'ring-2 ring-offset-2 ring-blue-500 ring-offset-transparent scale-110',
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Notes Section */}
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }} className={card}>
              <label className={cn('text-[10px] font-medium uppercase tracking-wider block mb-2', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add custom notes to this report..."
                className={cn(
                  'w-full rounded-xl border px-3 py-2 text-sm outline-none transition-colors resize-none',
                  isDark
                    ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder-zinc-600 focus:border-blue-500/40'
                    : 'bg-black/[0.02] border-black/[0.08] text-zinc-900 placeholder-zinc-400 focus:border-blue-500/40',
                )}
              />
            </motion.div>
          </div>

          {/* Preview Section */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className={cn('text-sm font-semibold mb-3', isDark ? 'text-white' : 'text-zinc-900')}>
                Preview
              </h2>
              <div
                className={cn(
                  'rounded-2xl border shadow-sm overflow-hidden',
                  isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
                )}
              >
                {/* Brand Header */}
                <div className="p-4" style={{ backgroundColor: brandColor }}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{reportTitle}</h3>
                      <p className="text-[10px] text-white/70">{dataSource} Data</p>
                    </div>
                  </div>
                </div>

                {/* Report Content Preview */}
                <div className="p-4 space-y-3">
                  {sections.map((section) => (
                    <div key={section.id}>
                      <div className={cn('flex items-center gap-2 mb-2', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
                        <div className="h-0.5 w-4 rounded-full" style={{ backgroundColor: brandColor }} />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">{section.title}</span>
                      </div>
                      <div
                        className={cn(
                          'rounded-lg border p-3',
                          isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]',
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex gap-1">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className={cn('h-6 rounded', isDark ? 'bg-white/[0.06] w-8' : 'bg-black/[0.06] w-8')}
                              />
                            ))}
                          </div>
                          <div className={cn('h-4 w-16 rounded', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')} />
                        </div>
                        <div className={cn('h-20 rounded-lg', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]')} />
                      </div>
                    </div>
                  ))}

                  {/* Stats Preview */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {[
                      { label: 'Widgets', val: selectedWidgets.length.toString() },
                      { label: 'Sections', val: sections.length.toString() },
                    ].map((s) => (
                      <div key={s.label} className={cn('rounded-lg border p-2 text-center', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]')}>
                        <p className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-zinc-900')}>{s.val}</p>
                        <p className={cn('text-[10px]', isDark ? 'text-zinc-500' : 'text-zinc-400')}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
