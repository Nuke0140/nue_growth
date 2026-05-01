import { useState, useMemo } from 'react';
import { Target, TrendingUp, TrendingDown, Sparkles, Zap, AlertTriangle, Shield, Activity, BarChart3 } from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { StatusBadge } from '@/components/shared/status-badge';
import { FilterBar } from '@/components/shared/filter-bar';
import { CSS } from '@/styles/design-tokens';
import { formatINR } from './utils';
import { forecastData, scenarioSimulations } from './data/mock-data';
import { useFinanceStore } from './finance-store';

type QuickScenario = 'revenue-drop' | 'hiring-3' | 'cost-cut' | null;

export default function ForecastingPage() {
  const [activeQuick, setActiveQuick] = useState<QuickScenario>(null);
  const [simulated, setSimulated] = useState<string | null>(null);
  const navigate = useFinanceStore((s) => s.navigateTo);

  const revenueMetric = forecastData.find((f) => f.metric === 'Revenue')!;
  const expenseMetric = forecastData.find((f) => f.metric === 'Expenses')!;
  const profitMetric = forecastData.find((f) => f.metric === 'Profit')!;

  const runwayMetric = useMemo(() => {
    const runway = profitMetric.current > 0 ? (profitMetric.current * 3) / expenseMetric.current : 2.8;
    return runway.toFixed(1);
  }, [profitMetric, expenseMetric]);

  const confidenceColor = (c: number) =>
    c > 80 ? CSS.success : c > 60 ? CSS.info : CSS.warning;

  const trendIcon = (t: string) =>
    t === 'up' ? <TrendingUp size={14} style={{ color: CSS.success }} /> :
    t === 'down' ? <TrendingDown size={14} style={{ color: CSS.danger }} /> :
    <Activity size={14} style={{ color: CSS.info }} />;

  const riskItems = useMemo(
    () => forecastData.filter((f) => f.confidence < 70 || f.trend === 'down'),
    []
  );

  const quickScenarioMap: Record<string, typeof scenarioSimulations[0] | undefined> = {
    'revenue-drop': scenarioSimulations.find((s) => s.id === 'revenue-drop-20'),
    'hiring-3': scenarioSimulations.find((s) => s.id === 'hiring-3-engineers'),
    'cost-cut': scenarioSimulations.find((s) => s.id === 'cut-costs-15'),
  };

  const handleRunSim = (name: string) => {
    setSimulated(name);
    setTimeout(() => setSimulated(null), 2500);
  };

  return (
    <PageShell title="AI Forecasting & Scenario Planning" subtitle="Predict financial outcomes and simulate what-if scenarios">
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <KpiWidget icon={Target} label="Revenue Forecast" value={formatINR(revenueMetric.nextMonth)} color="success" />
        <KpiWidget icon={TrendingDown} label="Expense Forecast" value={formatINR(expenseMetric.nextMonth)} color="warning" />
        <KpiWidget icon={TrendingUp} label="Profit Forecast" value={formatINR(profitMetric.nextMonth)} color="success" />
        <KpiWidget icon={AlertTriangle} label="Runway Forecast" value={`${runwayMetric} mo`} color="danger" />
      </div>

      {/* Forecast Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
        {forecastData.map((f) => (
          <div key={f.metric} style={{ background: CSS.cardBg, borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: CSS.text }}>
                <Sparkles size={14} style={{ marginRight: 6, verticalAlign: 'middle', color: CSS.accent }} />
                {f.metric}
              </h4>
              {trendIcon(f.trend)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: CSS.textSecondary }}>Current</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: CSS.text }}>{formatINR(f.current)}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: CSS.textSecondary }}>Next Month</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: f.trend === 'up' ? CSS.success : CSS.warning }}>
                  {formatINR(f.nextMonth)}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: CSS.textSecondary, marginBottom: 8 }}>
              Range: <span style={{ color: CSS.success }}>{formatINR(f.bestCase)}</span> — <span style={{ color: CSS.danger }}>{formatINR(f.worstCase)}</span>
            </div>
            {/* Confidence bar */}
            <div style={{ marginBottom: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: CSS.textSecondary, marginBottom: 4 }}>
                <span>Confidence</span>
                <span style={{ fontWeight: 600, color: confidenceColor(f.confidence) }}>{f.confidence}%</span>
              </div>
              <div style={{ background: CSS.surface1, borderRadius: 6, height: 6, overflow: 'hidden' }}>
                <div
                  style={{ width: `${f.confidence}%`, height: '100%', borderRadius: 6, background: confidenceColor(f.confidence), transition: 'width 0.5s' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confidence Visualization */}
      <div style={{ background: CSS.cardBg, borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: CSS.text }}>
          <Shield size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Confidence Levels
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {forecastData.map((f) => (
            <div key={f.metric} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ width: 100, fontSize: 13, color: CSS.text, fontWeight: 500 }}>{f.metric}</span>
              <div style={{ flex: 1, background: CSS.surface1, borderRadius: 8, height: 28, position: 'relative', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${f.confidence}%`,
                    height: '100%',
                    borderRadius: 8,
                    background: confidenceColor(f.confidence),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: CSS.cardBg,
                    transition: 'width 0.6s ease',
                  }}
                >
                  {f.confidence}%
                </div>
              </div>
              <span style={{ fontSize: 12, color: f.confidence > 80 ? CSS.success : f.confidence > 60 ? CSS.info : CSS.warning, fontWeight: 600, width: 80 }}>
                {f.confidence > 80 ? 'High' : f.confidence > 60 ? 'Medium' : 'Low'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Planning Engine */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: CSS.text, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={16} /> Scenario Planning Engine
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {scenarioSimulations.map((s) => (
            <div key={s.id} style={{ background: CSS.cardBg, borderRadius: 12, padding: 20, border: `1px solid ${CSS.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: CSS.text }}>{s.name}</h4>
                <StatusBadge status={s.riskLevel} />
              </div>
              <p style={{ margin: '0 0 12px', fontSize: 12, color: CSS.textSecondary, lineHeight: 1.5 }}>{s.description}</p>
              <div style={{ background: CSS.surface1, borderRadius: 8, padding: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: CSS.textSecondary, marginBottom: 4 }}>Variable: <strong style={{ color: CSS.accent }}>{s.variable}</strong> ({s.changePercent > 0 ? '+' : ''}{s.changePercent}%)</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 10, color: CSS.textSecondary }}>Revenue</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: CSS.text }}>{formatINR(s.projectedRevenue)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: CSS.textSecondary }}>Profit</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: s.projectedProfit >= 0 ? CSS.success : CSS.danger }}>{formatINR(s.projectedProfit)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: CSS.textSecondary }}>Runway</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: CSS.text }}>{s.projectedRunway} mo</div>
                </div>
              </div>
              <button
                onClick={() => handleRunSim(s.name)}
                style={{
                  width: '100%',
                  padding: '8px 0',
                  border: `1px solid ${CSS.accent}`,
                  borderRadius: 8,
                  background: simulated === s.name ? CSS.accent : 'transparent',
                  color: simulated === s.name ? CSS.cardBg : CSS.accent,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {simulated === s.name ? '✓ Simulation Complete' : 'Run Simulation'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* What-If Quick Scenarios */}
      <div style={{ background: CSS.cardBg, borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: CSS.text }}>
          <Sparkles size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          What-If Quick Scenarios
        </h3>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {([
            { key: 'revenue-drop', label: 'Revenue drops 20%', icon: <TrendingDown size={14} /> },
            { key: 'hiring-3', label: 'Hiring +3 engineers', icon: <Activity size={14} /> },
            { key: 'cost-cut', label: 'Cut costs 15%', icon: <Zap size={14} /> },
          ] as const).map((qs) => (
            <button
              key={qs.key}
              onClick={() => setActiveQuick(activeQuick === qs.key ? null : qs.key)}
              style={{
                padding: '10px 18px',
                border: `1px solid ${activeQuick === qs.key ? CSS.accent : CSS.border}`,
                borderRadius: 8,
                background: activeQuick === qs.key ? CSS.accent : CSS.surface1,
                color: activeQuick === qs.key ? CSS.cardBg : CSS.text,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s',
              }}
            >
              {qs.icon} {qs.label}
            </button>
          ))}
        </div>
        {activeQuick && quickScenarioMap[activeQuick] && (
          <div style={{ background: CSS.surface1, borderRadius: 8, padding: 16, borderLeft: `3px solid ${CSS.accent}` }}>
            <div style={{ fontWeight: 600, color: CSS.text, marginBottom: 8 }}>{quickScenarioMap[activeQuick]!.name}</div>
            <div style={{ fontSize: 13, color: CSS.textSecondary, marginBottom: 8 }}>{quickScenarioMap[activeQuick]!.description}</div>
            <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
              <span style={{ color: CSS.text }}>Revenue: <strong>{formatINR(quickScenarioMap[activeQuick]!.projectedRevenue)}</strong></span>
              <span style={{ color: CSS.text }}>Profit: <strong>{formatINR(quickScenarioMap[activeQuick]!.projectedProfit)}</strong></span>
              <span style={{ color: CSS.text }}>Runway: <strong>{quickScenarioMap[activeQuick]!.projectedRunway} mo</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Risk Indicators */}
      {riskItems.length > 0 && (
        <div style={{ background: CSS.cardBg, borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: CSS.danger, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={16} /> Risk Indicators
          </h3>
          {riskItems.map((f) => (
            <div
              key={f.metric}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: CSS.surface1,
                borderRadius: 8,
                marginBottom: 8,
                borderLeft: `3px solid ${CSS.danger}`,
              }}
            >
              <div>
                <span style={{ fontWeight: 600, color: CSS.text, fontSize: 14 }}>{f.metric}</span>
                <span style={{ marginLeft: 10, fontSize: 12, color: f.trend === 'down' ? CSS.danger : CSS.warning }}>
                  {f.trend === 'down' ? '↓ Declining' : '↓ Low confidence'}
                </span>
              </div>
              <div style={{ fontSize: 12, color: CSS.textSecondary }}>
                Confidence: <strong style={{ color: CSS.warning }}>{f.confidence}%</strong> · Current: {formatINR(f.current)}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
