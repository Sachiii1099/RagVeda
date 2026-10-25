import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Shield,
  Scale,
  Award,
  BookOpen,
  Leaf,
  AlertTriangle,
  Sliders,
  GitFork,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PriorArtRadar, RadarData } from './PriorArtRadar';
import { NoveltyTimeline, TimelineItem } from './NoveltyTimeline';
import { DependencyGraph, DependencyGraphData } from './DependencyGraph';
import { WhatIfSimulator, ScenarioComparison } from './WhatIfSimulator';

interface AssessmentDashboardProps {
  innovationId: string;
  assessmentResult: any;
  radarData: RadarData | null;
  timelineItems: TimelineItem[];
  dependencyGraph: DependencyGraphData | null;
  onViewEvidence: (citation: any) => void;
  onSimulateScenario: (title: string, delta: any) => Promise<ScenarioComparison>;
  onExportPassport: () => void;
}

export const AssessmentDashboard: React.FC<AssessmentDashboardProps> = ({
  innovationId,
  assessmentResult,
  radarData,
  timelineItems,
  dependencyGraph,
  onViewEvidence,
  onSimulateScenario,
  onExportPassport,
}) => {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'ip' | 'prior_art' | 'biodiversity' | 'regulatory' | 'dependency' | 'what_if'
  >('overview');

  const {
    summary,
    jurisdiction,
    confidence,
    classification,
    ip_opportunities = [],
    tk_prior_art,
    biodiversity_abs,
    regulatory,
    compliance_readiness_score = 65,
    action_roadmap = [],
    all_citations = [],
  } = assessmentResult;

  const getRiskBadge = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/40';
      case 'medium':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Top Banner with Readiness Meter */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-ayur-500/30 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full bg-ayur-950 text-ayur-300 border border-ayur-500/40">
                {jurisdiction === 'INT' ? '🌍 International Assessment' : '🇮🇳 Indian Statutory Assessment'}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/10">
                100% Traceable Legal Citations
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              {summary}
            </h2>

            {/* Multi-dimensional Confidence Indicators */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Evidence Quality:</span>
                <span className="font-extrabold text-emerald-400">{confidence?.evidence_quality || 'HIGH'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Classification:</span>
                <span className="font-extrabold text-emerald-400">{confidence?.classification_confidence || 'HIGH'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">TKDL Overlap:</span>
                <span className="font-extrabold text-amber-400">{tk_prior_art?.similarity_degree || 'MODERATE'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">ABS Scrutiny:</span>
                <span className="font-extrabold text-sky-400">{confidence?.abs_confidence || 'MEDIUM'}</span>
              </div>
            </div>
          </div>

          {/* Compliance Readiness Gauge */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/90 border border-white/10 text-center space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {t.complianceReadiness}
            </span>

            <div className="relative inline-flex items-center justify-center">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {compliance_readiness_score}%
              </div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${compliance_readiness_score}%` }}
              />
            </div>

            <button
              onClick={onExportPassport}
              className="w-full py-2 px-3 rounded-xl bg-ayur-600/80 hover:bg-ayur-500 text-white text-xs font-bold transition-all shadow-md shadow-ayur-700/30 flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.exportPassport}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-ayur-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{t.dashTabOverview}</span>
        </button>

        <button
          onClick={() => setActiveTab('ip')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ip'
              ? 'bg-ayur-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>{t.dashTabIP}</span>
        </button>

        <button
          onClick={() => setActiveTab('prior_art')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'prior_art'
              ? 'bg-ayur-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{t.dashTabPriorArt}</span>
        </button>

        <button
          onClick={() => setActiveTab('biodiversity')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'biodiversity'
              ? 'bg-ayur-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Leaf className="w-4 h-4" />
          <span>{t.dashTabBiodiversity}</span>
        </button>

        <button
          onClick={() => setActiveTab('regulatory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'regulatory'
              ? 'bg-ayur-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>{t.dashTabRegulatory}</span>
        </button>

        <button
          onClick={() => setActiveTab('dependency')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'dependency'
              ? 'bg-ayur-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <GitFork className="w-4 h-4" />
          <span>{t.dashTabDependency}</span>
        </button>

        <button
          onClick={() => setActiveTab('what_if')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'what_if'
              ? 'bg-ayur-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>{t.dashTabWhatIf}</span>
        </button>
      </div>

      {/* Tab Panels */}
      {/* 1. Overview & Classification */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Classification Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ayur-400 block mb-0.5">
                  {t.classificationCardTitle}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {classification?.category_display}
                </h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                {t.classificationConfidence}: {Math.round((classification?.confidence || 0.85) * 100)}%
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                {t.applicableStatute}
              </span>
              <p className="text-xs font-semibold text-slate-200">
                {classification?.applicable_statute}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {t.reasonsTitle}
              </span>
              <ul className="space-y-1.5">
                {classification?.reasons?.map((r: string, i: number) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-ayur-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {classification?.citations && classification.citations.length > 0 && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onViewEvidence(classification.citations[0])}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-ayur-300 border border-ayur-500/30 flex items-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{t.viewEvidenceBtn}</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Summary Grid of IP, TK, ABS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>Patentability Check</span>
              </h4>
              <p className="text-xs text-slate-300">
                {ip_opportunities[0]?.status || 'Investigate with Prior-Art Assessment'}
              </p>
              <button
                onClick={() => setActiveTab('ip')}
                className="text-xs font-bold text-ayur-400 hover:text-ayur-300 flex items-center gap-1 pt-1"
              >
                <span>Explore IP Matrix</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>TKDL / Prior-Art</span>
              </h4>
              <p className="text-xs text-slate-300">
                {tk_prior_art?.overlap_detected ? 'Classical Overlap Detected' : 'Clearance Space Identified'}
              </p>
              <button
                onClick={() => setActiveTab('prior_art')}
                className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 pt-1"
              >
                <span>View Radar & Timeline</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>Biodiversity / ABS</span>
              </h4>
              <p className="text-xs text-slate-300">
                {biodiversity_abs?.potential_abs_consideration || 'ABS Review Required'}
              </p>
              <button
                onClick={() => setActiveTab('biodiversity')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 pt-1"
              >
                <span>View ABS Filings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. IP Opportunities */}
      {activeTab === 'ip' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <span>{t.ipOpportunitiesTitle}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ip_opportunities.map((item: any, idx: number) => (
              <div
                key={idx}
                className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base font-black text-white">{item.category}</h4>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getRiskBadge(item.risk_level)}`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="text-[11px] font-bold text-amber-300/90 font-mono">
                    {item.statutory_basis}
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.explanation}
                  </p>

                  {item.recommendations && item.recommendations.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        Actionable Recommendations
                      </span>
                      <ul className="space-y-1">
                        {item.recommendations.map((rec: string, rIdx: number) => (
                          <li key={rIdx} className="text-xs text-slate-200 flex items-start gap-1.5">
                            <span className="text-ayur-400">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {item.citations && item.citations.length > 0 && (
                  <div className="pt-3 border-t border-white/5 flex justify-end">
                    <button
                      onClick={() => onViewEvidence(item.citations[0])}
                      className="text-xs font-bold text-ayur-300 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{t.viewEvidenceBtn}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TKDL Prior-Art Radar & Timeline */}
      {activeTab === 'prior_art' && (
        <div className="space-y-8">
          {radarData && (
            <PriorArtRadar
              radarData={radarData}
              onViewEvidence={(citeId) => {
                const found = all_citations.find((c: any) => c.source_id === citeId || c.section === citeId);
                if (found) onViewEvidence(found);
                else if (all_citations.length > 0) onViewEvidence(all_citations[0]);
              }}
            />
          )}

          {timelineItems && timelineItems.length > 0 && (
            <NoveltyTimeline items={timelineItems} />
          )}
        </div>
      )}

      {/* 4. Biodiversity & ABS */}
      {activeTab === 'biodiversity' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <span>{t.biodiversityTitle}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{t.biodiversitySubtitle}</p>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-amber-300 border border-amber-500/30">
              {biodiversity_abs?.potential_abs_consideration}
            </span>
          </div>

          {/* Statutory Non-Hallucination Alert */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3 text-xs text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-amber-300 mb-1">{t.statutoryWarningTitle}</h4>
              <p className="leading-relaxed">{biodiversity_abs?.statutory_warning}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.relevantAuthority}</span>
              <p className="text-sm font-bold text-slate-100">{biodiversity_abs?.relevant_authority}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.statutoryProvision}</span>
              <p className="text-sm font-bold text-slate-100">{biodiversity_abs?.statutory_provision}</p>
            </div>
          </div>

          {biodiversity_abs?.required_filings && biodiversity_abs.required_filings.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {t.requiredFilings}
              </span>
              <ul className="space-y-1.5">
                {biodiversity_abs.required_filings.map((filing: string, fIdx: number) => (
                  <li key={fIdx} className="text-xs text-slate-200 flex items-center gap-2 bg-slate-950/60 p-3 rounded-xl border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{filing}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {biodiversity_abs?.citations && biodiversity_abs.citations.length > 0 && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onViewEvidence(biodiversity_abs.citations[0])}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.viewEvidenceBtn}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. Regulatory Navigator */}
      {activeTab === 'regulatory' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-ayur-400" />
              <span>{t.regulatoryTitle}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{t.regulatorySubtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.licensingPathway}</span>
              <p className="text-xs font-bold text-white">{regulatory?.licensing_pathway}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.licensingForm}</span>
              <p className="text-xs font-bold text-amber-300">{regulatory?.licensing_form}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.rule158BStatus}</span>
              <p className="text-xs font-bold text-slate-200">
                {regulatory?.rule_158b_applicable ? 'Mandatory Proof Required' : 'First Schedule Reference Suffices'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              {t.safetyEvidence}
            </span>
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 text-xs text-slate-300 leading-relaxed">
              {regulatory?.safety_evidence_required}
            </div>
          </div>

          {regulatory?.labelling_advertising_guidelines && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {t.labellingRules}
              </span>
              <ul className="space-y-1.5">
                {regulatory.labelling_advertising_guidelines.map((lab: string, lIdx: number) => (
                  <li key={lIdx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-ayur-400 shrink-0 mt-0.5" />
                    <span>{lab}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Roadmap */}
          {action_roadmap && action_roadmap.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t.actionChecklist}</span>
              </h4>
              <div className="space-y-2">
                {action_roadmap.map((act: any) => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${getRiskBadge(act.priority)}`}>
                          {act.priority}
                        </span>
                        <h5 className="text-xs font-bold text-white">{act.title}</h5>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{act.description}</p>
                    </div>

                    <div className="text-right text-[11px] text-slate-400">
                      <p>Authority: <strong className="text-slate-200">{act.authority}</strong></p>
                      <p className="text-amber-300">{act.recommended_timeline}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. Regulatory Dependency Graph */}
      {activeTab === 'dependency' && dependencyGraph && (
        <DependencyGraph graphData={dependencyGraph} />
      )}

      {/* 7. What-If Simulator */}
      {activeTab === 'what_if' && (
        <WhatIfSimulator
          innovationId={innovationId}
          onSimulate={onSimulateScenario}
        />
      )}
    </section>
  );
};
