'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Send, Mic, Sparkles, Bot, User, TrendingUp, BarChart3,
  AlertTriangle, Lightbulb, Zap, Brain, MessageSquare,
} from 'lucide-react';
import AIInsightPanel from './components/ai-insight-panel';
import { aiInsights } from './data/mock-data';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  chartData?: { labels: string[]; values: number[] };
  recommendation?: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Why did revenue drop this week?',
    timestamp: '10:32 AM',
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Revenue dipped 8.4% this week (₹38.2L vs ₹41.7L last week). The primary drivers are:',
    timestamp: '10:32 AM',
    chartData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [6.2, 5.8, 5.1, 5.4, 4.9, 5.2, 5.6],
    },
    recommendation: 'Google Ads CPL spiked 38% due to ad fatigue on "Brand Intent — Q4". Recommend pausing that campaign and reallocating 40% budget to WhatsApp campaigns (6.1x ROI).',
  },
  {
    id: '3',
    role: 'user',
    content: 'Show me top performing campaigns',
    timestamp: '10:35 AM',
  },
  {
    id: '4',
    role: 'assistant',
    content: 'Here are your top 3 campaigns by ROI this month:\n\n1. WhatsApp Business — 6.1x ROI, ₹23.2L revenue\n2. Organic SEO — 12.4x ROI, ₹34.7L revenue\n3. Email Campaigns — 8.6x ROI, ₹15.5L revenue\n\n"Product Hunt Launch" showing best CTR at 2.8% with low fatigue score of 42%.',
    timestamp: '10:35 AM',
  },
  {
    id: '5',
    role: 'user',
    content: "What's our churn risk?",
    timestamp: '10:38 AM',
  },
  {
    id: '6',
    role: 'assistant',
    content: 'Churn risk analysis shows 3 mid-market clients at elevated risk:\n\n• CRED — Scope disputes, invoice overdue 48 days\n• Slice — Recovery probability 42%, requesting 60% refund\n• 1 unnamed client — NPS dropped to 42, support tickets up 68%\n\nOverall monthly churn at 4.2% vs 3.1% baseline — 35% above normal.',
    timestamp: '10:38 AM',
    recommendation: 'Activate winback sequence for all 3 clients. Assign senior AM for relationship review within 48 hours.',
  },
];

const SUGGESTED_QUESTIONS = [
  'Revenue forecast?',
  'Best channel ROI?',
  'Client risk summary?',
  'Team performance?',
];

const QUICK_STATS = [
  { label: 'Questions Answered', value: '142', icon: MessageSquare },
  { label: 'Insights Generated', value: '67', icon: Lightbulb },
  { label: 'Time Saved', value: '24h', icon: Zap },
  { label: 'Accuracy Score', value: '94.2%', icon: Brain },
];

export default function AIBIAssistantPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    if (!inputText.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm analyzing your data across revenue, pipeline, marketing, and retention modules. Based on current patterns, I can provide insights but need a moment to process the full dataset. This is a demo response — in production, I would provide a detailed analysis with specific recommendations.",
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        recommendation: 'Try asking about specific metrics like revenue, churn, or campaign performance for more targeted insights.',
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1500);
  }

  const card = cn(
    'rounded-2xl border shadow-sm',
    isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
  );

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className={cn('text-2xl font-bold tracking-tight', isDark ? 'text-white' : 'text-zinc-900')}>
            AI BI Assistant
          </h1>
          <p className={cn('text-sm mt-1', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
            Your AI business analyst
          </p>
        </div>

        {/* Two-Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT: Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Chat Messages Area */}
            <div className={cn('rounded-2xl border shadow-sm overflow-hidden flex flex-col', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]')}>
              {/* Chat Header */}
              <div className={cn('flex items-center gap-2 px-4 py-3 border-b', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
                <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', isDark ? 'bg-purple-500/15' : 'bg-purple-50')}>
                  <Bot className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>Chat</h3>
                  <p className={cn('text-[10px]', isDark ? 'text-zinc-500' : 'text-zinc-400')}>Ask anything about your data</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium text-emerald-400 bg-emerald-500/15">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: '420px', maxHeight: '600px' }}>
                {messages.map((msg) => (
                  <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}>
                    {/* Avatar */}
                    <div className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl',
                      msg.role === 'assistant'
                        ? 'bg-purple-500/15 text-purple-400'
                        : isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-500',
                    )}>
                      {msg.role === 'assistant' ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    {/* Message Bubble */}
                    <div className={cn('max-w-[80%] space-y-2')}>
                      <div
                        className={cn(
                          'rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed',
                          msg.role === 'assistant'
                            ? isDark ? 'bg-white/[0.04] text-zinc-200' : 'bg-black/[0.03] text-zinc-700'
                            : 'bg-blue-500/15 text-blue-100',
                        )}
                      >
                        {msg.content.split('\n').map((line, i) => (
                          <p key={i} className={i > 0 ? 'mt-1.5' : ''}>{line}</p>
                        ))}
                      </div>

                      {/* Mini chart visualization */}
                      {msg.chartData && (
                        <div className={cn('rounded-xl border p-3', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]')}>
                          <div className="flex items-end gap-1.5 h-16">
                            {msg.chartData.labels.map((label, ci) => {
                              const maxVal = Math.max(...msg.chartData!.values);
                              const height = maxVal > 0 ? (msg.chartData!.values[ci] / maxVal) * 100 : 0;
                              return (
                                <div key={label} className="flex-1 flex flex-col items-center gap-1">
                                  <div className={cn('w-full rounded-t-md bg-blue-500/40 transition-all', isDark ? 'hover:bg-blue-500/60' : 'hover:bg-blue-500/30')} style={{ height: `${height}%` }} />
                                  <span className={cn('text-[9px]', isDark ? 'text-zinc-600' : 'text-zinc-400')}>{label}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Recommendation */}
                      {msg.recommendation && (
                        <div className={cn('rounded-xl border border-l-4 border-l-emerald-500 p-3', isDark ? 'bg-emerald-500/5 border-white/[0.06]' : 'bg-emerald-50/50 border-black/[0.06]')}>
                          <div className="flex items-center gap-1 mb-1">
                            <Lightbulb className="w-3 h-3 text-emerald-400" />
                            <span className={cn('text-[10px] font-semibold text-emerald-400 uppercase tracking-wider')}>Recommendation</span>
                          </div>
                          <p className={cn('text-[11px] leading-relaxed', isDark ? 'text-zinc-300' : 'text-zinc-600')}>
                            {msg.recommendation}
                          </p>
                        </div>
                      )}

                      <p className={cn('text-[9px]', isDark ? 'text-zinc-600' : 'text-zinc-400')}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className={cn('rounded-2xl px-4 py-3', isDark ? 'bg-white/[0.04]' : 'bg-black/[0.03]')}>
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className={cn('h-2 w-2 rounded-full', isDark ? 'bg-zinc-500' : 'bg-zinc-400')}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Suggested Questions */}
              <div className={cn('px-4 pb-2 flex flex-wrap gap-1.5')}>
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <motion.button
                    key={q}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      setInputText(q);
                    }}
                    className={cn(
                      'rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors',
                      isDark
                        ? 'bg-white/[0.06] text-zinc-400 hover:bg-white/[0.1] hover:text-zinc-200'
                        : 'bg-black/[0.04] text-zinc-500 hover:bg-black/[0.08] hover:text-zinc-700',
                    )}
                  >
                    {q}
                  </motion.button>
                ))}
              </div>

              {/* Input Area */}
              <div className={cn('border-t p-3', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
                <div className={cn('flex items-center gap-2 rounded-xl border px-3 py-2', isDark ? 'border-white/[0.08] bg-white/[0.02]' : 'border-black/[0.08] bg-black/[0.01]')}>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about your data..."
                    className={cn(
                      'flex-1 bg-transparent text-sm outline-none placeholder',
                      isDark ? 'text-white placeholder-zinc-600' : 'text-zinc-900 placeholder-zinc-400',
                    )}
                  />
                  <button className={cn('p-1.5 rounded-lg transition-colors', isDark ? 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06]' : 'text-zinc-400 hover:text-zinc-600 hover:bg-black/[0.04]')}>
                    <Mic className="w-4 h-4" />
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className={cn(
                      'p-1.5 rounded-lg transition-colors',
                      inputText.trim()
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : isDark ? 'bg-white/[0.06] text-zinc-600' : 'bg-black/[0.06] text-zinc-400',
                    )}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: AI Insights Panel + Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK_STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + 0.25, duration: 0.3 }}
                  className={cn(card, 'flex items-center gap-3')}
                >
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', isDark ? 'bg-purple-500/15' : 'bg-purple-50')}>
                    <stat.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-zinc-900')}>
                      {stat.value}
                    </p>
                    <p className={cn('text-[10px]', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI Insights Panel */}
            <AIInsightPanel insights={aiInsights} onSelectInsight={(id) => {
              const insight = aiInsights.find((i) => i.id === id);
              if (insight) {
                setInputText(`Tell me more about: ${insight.title}`);
              }
            }} />

            {/* AI Capabilities Info */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className={cn(card, 'space-y-3')}
            >
              <div className="flex items-center gap-2">
                <Brain className={cn('w-4 h-4', isDark ? 'text-purple-400' : 'text-purple-500')} />
                <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>
                  AI Capabilities
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { title: 'Revenue Analysis', desc: 'Trend detection, forecasting, and anomaly identification' },
                  { title: 'Client Intelligence', desc: 'Health scoring, churn prediction, and expansion opportunities' },
                  { title: 'Campaign Optimization', desc: 'Budget allocation, ad fatigue detection, and ROI analysis' },
                  { title: 'Team Performance', desc: 'Productivity insights, workload balancing, and skill matching' },
                ].map((cap) => (
                  <div
                    key={cap.title}
                    className={cn(
                      'rounded-xl border p-3',
                      isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]',
                    )}
                  >
                    <h4 className={cn('text-xs font-semibold', isDark ? 'text-zinc-200' : 'text-zinc-800')}>
                      {cap.title}
                    </h4>
                    <p className={cn('text-[10px] mt-0.5 leading-relaxed', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                      {cap.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


