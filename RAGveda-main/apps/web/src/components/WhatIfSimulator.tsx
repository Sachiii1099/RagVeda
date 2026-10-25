import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sliders, ArrowRight, CheckCircle2, TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface DiffItem {
  area: string;
  parameter: string;
  baseline_value: string;
  scenario_value: string;
  impact_summary: string;
  risk_change: 'Decreased' | 'Increased' | 'Neutral';
}

export interface ScenarioComparison {
  innovation_id: string;
  scenario_id: string;
  title: string;
  baseline_readiness: number;
  scenario_readiness: number;
  diff_items: DiffItem[];
  recommendation: string;
}

interface WhatIfSimulatorProps {
  innovationId: string;
  onSimulate: (scenarioTitle: string, deltaParams: any) => Promise<ScenarioComparison>;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ innovationId, onSimulate }) => {
  const { t } = useApp();
  const [selectedDelta, setSelectedDelta] = useState<'extraction' | 'cultivated' | 'export'>('extraction');
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<ScenarioComparison | null>(null);

  const handleRunSimulation = async () => {
    setLoading(true);
    let title = '';
    let deltaParams: any = {};

    if (selectedDelta === 'extraction') {
      title = 'Modified Novel Ultrasonic Extraction Technique';
      deltaParams = {
        preparation_method: {
          modified: true,
          novel_features: ['Ultrasonic Cavitation Standardized Extraction']
        }
      };
    } else if (selectedDelta === 'cultivated') {
      title = '100% Certified Farm Cultivation (2023 Exemption)';
      deltaParams = {
        biological_sourcing: 'Contract Farm Cultivation with Certificate of Origin'
      };
    } else {
      title = 'Export to United States (US FDA / DSHEA)';
      deltaParams = {
        target_markets: ['US', 'INT']
      };
    }

    try {
      const res = await onSimulate(title, deltaParams);
      setComparison(res);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskIcon = (change: string) => {
    switch (change) {
      case 'Decreased':
        return (
          <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
            <TrendingDown className="w-3.5 h-3.5" /> Risk Reduced
          </span>
        );
      case 'Increased':
        return (
          <span className="flex items-center gap-1 text-rose-400 text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> Scrutiny Increased
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-slate-400 text-xs font-bold">
            <Minus className="w-3.5 h-3.5" /> Neutral
          </span>
        );
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl space-y-6">
      <div>
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-amber-400" />
          <span>{t.whatIfTitle}</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">{t.whatIfSubtitle}</p>
      </div>

      {/* Variable selection buttons */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          {t.selectChangeLabel}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setSelectedDelta('extraction')}
            className={`p-3.5 rounded-xl text-left text-xs font-semibold border transition-all ${
              selectedDelta === 'extraction'
                ? 'bg-ayur-950 border-ayur-400 text-white shadow-lg ring-1 ring-ayur-400'
                : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <p className="font-bold mb-1">⚡ Process Change</p>
            <p className="text-[11px] text-slate-400 leading-snug">{t.optExtractionMethod}</p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDelta('cultivated')}
            className={`p-3.5 rounded-xl text-left text-xs font-semibold border transition-all ${
              selectedDelta === 'cultivated'
                ? 'bg-ayur-950 border-ayur-400 text-white shadow-lg ring-1 ring-ayur-400'
                : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <p className="font-bold mb-1">🌿 Sourcing Origin</p>
            <p className="text-[11px] text-slate-400 leading-snug">{t.optCultivatedOrigin}</p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDelta('export')}
            className={`p-3.5 rounded-xl text-left text-xs font-semibold border transition-all ${
              selectedDelta === 'export'
                ? 'bg-ayur-950 border-ayur-400 text-white shadow-lg ring-1 ring-ayur-400'
                : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <p className="font-bold mb-1">🌍 Target Market</p>
            <p className="text-[11px] text-slate-400 leading-snug">{t.optExportUS}</p>
          </button>
        </div>
      </div>

      <button
        onClick={handleRunSimulation}
        disabled={loading}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-amber-700/30 transition-all flex items-center gap-2 cursor-pointer"
      >
        {loading ? (
          <span>Simulating Pipeline...</span>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>{t.runSimulationBtn}</span>
          </>
        )}
      </button>

      {/* Comparative Diff Result */}
      {comparison && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-slate-900/95 border border-amber-500/30 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Simulated Scenario
              </span>
              <h4 className="text-sm font-bold text-white">{comparison.title}</h4>
            </div>

            {/* Compliance Readiness Before vs After */}
            <div className="flex items-center gap-4 bg-slate-950/80 p-2.5 rounded-xl border border-white/5">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block">Baseline Readiness</span>
                <span className="text-base font-black text-slate-200">{comparison.baseline_readiness}%</span>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400" />
              <div className="text-center">
                <span className="text-[10px] text-amber-300 block">Scenario Readiness</span>
                <span className="text-base font-black text-emerald-400">{comparison.scenario_readiness}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {t.baselineVsScenario}
            </h5>
            {comparison.diff_items.map((diff, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{diff.area}</span>
                  {getRiskIcon(diff.risk_change)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Baseline:</span>
                    <span className="text-slate-300">{diff.baseline_value}</span>
                  </div>
                  <div className="p-2 rounded bg-amber-950/40 border border-amber-500/20">
                    <span className="text-[10px] text-amber-300 block">What-If:</span>
                    <span className="text-amber-100">{diff.scenario_value}</span>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-300/90 leading-normal">
                  💡 {diff.impact_summary}
                </p>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-ayur-950/60 border border-ayur-500/30 text-xs text-ayur-200">
            <strong>Engine Recommendation:</strong> {comparison.recommendation}
          </div>
        </motion.div>
      )}
    </div>
  );
};
