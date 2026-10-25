import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Globe2, AlertTriangle, PackageCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface DemoCase {
  id: string;
  title: string;
  description: string;
  intended_use: string;
  target_jurisdiction: string;
  commercial_intent: boolean;
  category_hint: string;
  key_issue: string;
}

interface DemoCasesSelectorProps {
  cases: DemoCase[];
  onSelectCase: (c: DemoCase) => void;
  selectedCaseId?: string;
}

export const DemoCasesSelector: React.FC<DemoCasesSelectorProps> = ({
  cases,
  onSelectCase,
  selectedCaseId,
}) => {
  const { t } = useApp();

  const getCaseIcon = (id: string) => {
    switch (id) {
      case 'demo_case_a':
        return <Leaf className="w-5 h-5 text-emerald-400" />;
      case 'demo_case_b':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'demo_case_c':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'demo_case_d':
        return <Globe2 className="w-5 h-5 text-sky-400" />;
      case 'demo_case_e':
      default:
        return <PackageCheck className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <section id="demo-cases-section" className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {t.demoCasesTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-2xl mx-auto">
          {t.demoCasesSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cases.map((demoCase, idx) => {
          const isSelected = selectedCaseId === demoCase.id;

          return (
            <motion.div
              key={demoCase.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => onSelectCase(demoCase)}
              className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 relative border flex flex-col justify-between ${
                isSelected
                  ? 'glass-panel-glow border-ayur-400 ring-2 ring-ayur-400/40 bg-ayur-950/40'
                  : 'glass-panel hover:border-slate-600 hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-white/5">
                    {getCaseIcon(demoCase.id)}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-white/10 uppercase tracking-wider">
                    {demoCase.target_jurisdiction === 'INT' ? '🌍 International' : '🇮🇳 India'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-100 leading-snug">
                  {demoCase.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 mt-2 leading-relaxed">
                  {demoCase.description}
                </p>

                <div className="mt-3 p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-400 block mb-0.5">
                    SIH Core Focal Point:
                  </span>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    {demoCase.key_issue}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-medium text-ayur-300">
                  {demoCase.category_hint}
                </span>
                <button
                  className={`text-xs font-bold flex items-center gap-1 transition-colors ${
                    isSelected ? 'text-ayur-300' : 'text-slate-400 group-hover:text-white'
                  }`}
                >
                  <span>{t.loadCaseBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
