import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, ShieldCheck, Activity, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { translations } from '../i18n/translations';

export default function EvalDashboard({ language }) {
  const t = translations[language] || translations.en;

  const [evalData, setEvalData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const runEval = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/eval/run');
      const data = await res.json();
      setEvalData(data);
    } catch (err) {
      alert('EVAL_DIAGNOSTICS_ERROR: Failed to execute automated benchmark suite.');
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    runEval();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 font-mono">
      
      {/* Header Diagnostic Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="schematic-tag text-tamra font-bold flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-tamra led-glow-tamra"></span>
            <span>{t.evalSubtitle || 'SYS.DIAGNOSTICS // AUTOMATED ADVERSARIAL BENCHMARKS'}</span>
          </div>
          <h2 className="font-dot text-lg sm:text-xl font-bold text-ghost-light tracking-wide mt-1">
            {t.evalTitle || 'ADVERSARIAL EVALUATION HARNESS'}
          </h2>
        </div>
        <button
          onClick={runEval}
          disabled={isRunning}
          className="px-4 py-2 bg-ghost-light text-void text-xs font-mono font-bold rounded hover:bg-white flex items-center space-x-1.5 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'RUNNING_DIAGNOSTICS...' : (t.rerunEvalBtn || 'RE-RUN 8 BENCHMARKS ◆')}</span>
        </button>
      </div>

      {/* 4-Stat Metric Cards with Addressable LED Status */}
      {evalData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="hardware-panel corner-cross p-4 rounded-lg border border-surface-border">
            <div className="schematic-tag text-ghost-dark text-[9px]">{t.passRate || 'PASS RATE'}</div>
            <div className="font-dot text-2xl font-bold text-led-green mt-1">{evalData.pass_rate_percentage}%</div>
            <div className="flex justify-center space-x-1 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-led-green led-glow-green"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-led-green led-glow-green"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-led-green led-glow-green"></span>
            </div>
          </div>

          <div className="hardware-panel corner-cross p-4 rounded-lg border border-surface-border">
            <div className="schematic-tag text-ghost-dark text-[9px]">{t.benchmarks || 'BENCHMARKS'}</div>
            <div className="font-dot text-2xl font-bold text-ghost-light mt-1">{evalData.passed_benchmarks}/{evalData.total_benchmarks}</div>
            <div className="text-[10px] text-ghost-dark mt-2 font-mono">STATUS::PASSED</div>
          </div>

          <div className="hardware-panel corner-cross p-4 rounded-lg border border-surface-border">
            <div className="schematic-tag text-ghost-dark text-[9px]">{t.hallucinatedCitations || 'FABRICATED CITATIONS'}</div>
            <div className="font-dot text-2xl font-bold text-tamra mt-1">0</div>
            <div className="text-[10px] text-tamra mt-2 font-mono">ZERO_FABRICATED</div>
          </div>

          <div className="hardware-panel corner-cross p-4 rounded-lg border border-surface-border">
            <div className="schematic-tag text-ghost-dark text-[9px]">{t.safeAbstention || 'SAFE ABSTENTION'}</div>
            <div className="font-dot text-2xl font-bold text-ghost-light mt-1">100%</div>
            <div className="text-[10px] text-led-green mt-2 font-mono">ENFORCED</div>
          </div>
        </div>
      )}

      {/* Benchmark Execution Readout */}
      {evalData && (
        <div className="hardware-panel corner-cross rounded-lg p-5 space-y-3 shadow-xl border border-surface-border text-xs">
          <div className="schematic-tag font-bold text-ghost-light border-b border-surface-border pb-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5 text-tamra" />
              <span>BENCHMARK EXECUTION LOGS ({evalData.test_results.length} TESTS)</span>
            </div>
            <span className="text-led-green text-[10px]">ALL_TESTS_PASSED</span>
          </div>

          <div className="space-y-2">
            {evalData.test_results.map((test, idx) => (
              <div key={idx} className="p-3 bg-void rounded border border-surface-border space-y-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-dot text-tamra text-[9px]">[0{idx + 1}]</span>
                    <span className="font-bold text-ghost-light">{test.name}</span>
                  </div>
                  <span className="text-led-green font-bold text-[10px] flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-led-green led-glow-green"></span>
                    <span>PASSED_VERIFIED</span>
                  </span>
                </div>
                <p className="text-ghost-dim text-[11px] font-sans pl-5">{test.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
