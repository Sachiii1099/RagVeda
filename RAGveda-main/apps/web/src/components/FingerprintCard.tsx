import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Leaf, Beaker, Award, Globe, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface Ingredient {
  name: string;
  normalized_name?: string;
  scientific_name?: string;
  biological_resource: boolean;
  parts_used?: string;
  classical_reference?: string;
  source_country: string;
  is_threatened_or_endangered?: boolean;
}

export interface PreparationMethod {
  traditional: boolean;
  modified: boolean;
  details?: string;
  novel_features?: string[];
}

export interface InnovationFingerprint {
  title: string;
  summary: string;
  ingredients: Ingredient[];
  preparation_method: PreparationMethod;
  intended_use: string;
  product_form: string;
  product_category: string;
  claimed_novelty: string[];
  traditional_knowledge_signal: boolean;
  biological_resources: string[];
  source_location: string;
  commercial_intent: boolean;
  target_markets: string[];
  ip_targets: string[];
}

interface FingerprintCardProps {
  fingerprint: InnovationFingerprint;
  onRunAssessment: () => void;
  isLoading: boolean;
}

export const FingerprintCard: React.FC<FingerprintCardProps> = ({
  fingerprint,
  onRunAssessment,
  isLoading,
}) => {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'process' | 'novelty' | 'markets'>('ingredients');

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto px-4 lg:px-8 py-6"
    >
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-ayur-500/40 shadow-2xl relative">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ayur-600/30 border border-ayur-400/50 flex items-center justify-center text-ayur-300">
              <Fingerprint className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white tracking-tight">
                  {t.fingerprintTitle}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  Pydantic Validated
                </span>
              </div>
              <p className="text-xs text-slate-400">{t.fingerprintSubtitle}</p>
            </div>
          </div>

          <button
            onClick={onRunAssessment}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-ayur-600 to-ayur-700 hover:from-ayur-500 hover:to-ayur-600 text-white font-extrabold text-xs shadow-xl shadow-ayur-700/40 border border-ayur-400/40 transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{t.proceedToAssessmentCta}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ingredients'
                ? 'bg-ayur-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-800/50'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>{t.tabIngredients} ({fingerprint.ingredients.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('process')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'process'
                ? 'bg-ayur-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-800/50'
            }`}
          >
            <Beaker className="w-3.5 h-3.5" />
            <span>{t.tabProcess}</span>
          </button>
          <button
            onClick={() => setActiveTab('novelty')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'novelty'
                ? 'bg-ayur-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-800/50'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{t.tabNovelty}</span>
          </button>
          <button
            onClick={() => setActiveTab('markets')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'markets'
                ? 'bg-ayur-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-800/50'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t.tabMarkets}</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'ingredients' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fingerprint.ingredients.map((ing, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-slate-100">{ing.name}</h4>
                    {ing.is_threatened_or_endangered ? (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-rose-400" />
                        Threatened
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {t.biologicalResourceBadge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs italic text-ayur-300 mt-1 font-mono">
                    {ing.scientific_name || 'Botanical extract'}
                  </p>
                  {ing.normalized_name && (
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Sanskrit: <span className="text-slate-200">{ing.normalized_name}</span>
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Part: {ing.parts_used || 'Standardized extract'}</span>
                  <span>Origin: {ing.source_country}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'process' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-200">Process Classification</h4>
                <p className="text-xs text-slate-400 mt-1">
                  {fingerprint.preparation_method.details || 'Method details'}
                </p>
              </div>
              <div className="flex gap-2">
                {fingerprint.preparation_method.traditional && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    {t.traditionalMethodBadge}
                  </span>
                )}
                {fingerprint.preparation_method.modified && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-500/30">
                    {t.modifiedMethodBadge}
                  </span>
                )}
              </div>
            </div>

            {fingerprint.preparation_method.novel_features && fingerprint.preparation_method.novel_features.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Identified Processing Features
                </h4>
                <ul className="space-y-1.5">
                  {fingerprint.preparation_method.novel_features.map((feat, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-ayur-400" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'novelty' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5">
              <h4 className="text-xs font-bold text-ayur-300 uppercase tracking-wider mb-2">
                Claimed Novelty & Technical Effect
              </h4>
              <ul className="space-y-2">
                {fingerprint.claimed_novelty.map((nov, i) => (
                  <li key={i} className="text-xs text-slate-200 flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                    <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{nov}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'markets' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Target Jurisdictions
              </span>
              <p className="text-sm font-bold text-white">
                {fingerprint.target_markets.join(', ')}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Intended Product Form
              </span>
              <p className="text-sm font-bold text-white">
                {fingerprint.product_form}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};
