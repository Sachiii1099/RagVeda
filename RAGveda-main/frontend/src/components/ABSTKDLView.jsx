import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Search, ArrowRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../i18n/translations';

// Addressable Risk Meter
function LEDRiskMeter({ riskLevel = 'HIGH' }) {
  const isHigh = riskLevel.includes('HIGH');
  return (
    <div className="flex items-center space-x-1.5 font-mono text-[10px]">
      <span className="schematic-tag text-ghost-dark mr-1">RISK:</span>
      <div className="flex space-x-1">
        <span className={`w-2 h-2 rounded-full ${isHigh ? 'bg-tamra led-glow-tamra' : 'bg-led-amber'}`}></span>
        <span className={`w-2 h-2 rounded-full ${isHigh ? 'bg-tamra led-glow-tamra' : 'bg-led-amber'}`}></span>
        <span className={`w-2 h-2 rounded-full ${isHigh ? 'bg-tamra led-glow-tamra' : 'bg-neutral-800'}`}></span>
        <span className={`w-2 h-2 rounded-full ${isHigh ? 'bg-tamra led-glow-tamra' : 'bg-neutral-800'}`}></span>
      </div>
      <span className={`font-dot text-[9px] ml-1.5 font-bold ${isHigh ? 'text-tamra' : 'text-led-amber'}`}>
        {isHigh ? 'HIGH' : 'MODERATE'}
      </span>
    </div>
  );
}

export default function ABSTKDLView({ onEscalateWithContext, language }) {
  const t = translations[language] || translations.en;
  const [activeTab, setActiveTab] = useState('tkdl');

  const [tkdlInput, setTkdlInput] = useState('Yogaraja Guggulu with Ashwagandha and Rasna for joint pain and Amavata');
  const [tkdlIndication, setTkdlIndication] = useState('Amavata / Arthritis');
  const [tkdlResult, setTkdlResult] = useState(null);
  const [isTkdlLoading, setIsTkdlLoading] = useState(false);

  const [absInput, setAbsInput] = useState({
    is_foreign_entity_or_has_foreign_equity: false,
    is_nri: false,
    purpose: 'commercial_utilization',
    is_cultivated_ayush_resource: false,
    is_registered_ayush_practitioner_for_clinic: false,
    annual_turnover_bracket: 'upto_1cr'
  });
  const [absResult, setAbsResult] = useState(null);
  const [isAbsLoading, setIsAbsLoading] = useState(false);

  const handleTkdlScan = async () => {
    if (!tkdlInput.trim()) return;
    setIsTkdlLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/tkdl/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formulation_text: tkdlInput,
          indication: tkdlIndication
        })
      });
      const data = await res.json();
      setTkdlResult(data);
    } catch (err) {
      alert('TKDL_SCAN_ERROR: Failed to query CSIR-TKDL repository.');
    } finally {
      setIsTkdlLoading(false);
    }
  };

  const handleAbsAssess = async () => {
    setIsAbsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/abs/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(absInput)
      });
      const data = await res.json();
      setAbsResult(data);
    } catch (err) {
      alert('ABS_EVALUATION_ERROR: Failed to assess ABS obligations.');
    } finally {
      setIsAbsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Sub-Navigation Switcher */}
      <div className="border-b border-surface-border pb-3 flex space-x-4 text-xs font-mono">
        <button
          onClick={() => setActiveTab('tkdl')}
          className={`px-3 py-1.5 rounded border transition-all flex items-center space-x-2 ${
            activeTab === 'tkdl'
              ? 'border-tamra bg-tamra-tint text-ghost-light font-bold'
              : 'border-transparent text-ghost-dim hover:text-ghost-light'
          }`}
        >
          <span className="font-dot text-[9px] text-tamra">[01]</span>
          <span>{t.tkdlTab || 'CSIR-TKDL PRIOR ART SCANNER'}</span>
        </button>
        <button
          onClick={() => setActiveTab('abs')}
          className={`px-3 py-1.5 rounded border transition-all flex items-center space-x-2 ${
            activeTab === 'abs'
              ? 'border-tamra bg-tamra-tint text-ghost-light font-bold'
              : 'border-transparent text-ghost-dim hover:text-ghost-light'
          }`}
        >
          <span className="font-dot text-[9px] text-tamra">[02]</span>
          <span>{t.absTab || 'BIODIVERSITY ACT (ABS) HELPER'}</span>
        </button>
      </div>

      {activeTab === 'tkdl' && (
        <div className="space-y-6">
          <div className="hardware-panel corner-cross rounded-lg p-6 space-y-4 shadow-xl border border-surface-border">
            <div className="space-y-1">
              <div className="schematic-tag text-tamra font-bold flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tamra led-glow-tamra"></span>
                <span>{t.tkdlHeaderSubtitle || 'PRIOR ART REPOSITORY // SECTION 3(p) DEFENSE'}</span>
              </div>
              <h3 className="font-dot text-lg font-bold text-ghost-light">{t.tkdlHeaderTitle || 'CSIR-TKDL CODIFIED FORMULATION SCANNER'}</h3>
              <p className="text-xs font-mono text-ghost-dim">{t.tkdlHeaderDesc || 'Checks botanical/Sanskrit ingredients and classical therapeutic indications against 430,000+ digitized formulations.'}</p>
            </div>

            <div className="space-y-3 pt-2 font-mono">
              <div>
                <label className="block schematic-tag text-ghost-dim mb-1">{t.compLabel || 'FORMULATION COMPOSITION & INGREDIENTS:'}</label>
                <textarea
                  rows={2}
                  value={tkdlInput}
                  onChange={(e) => setTkdlInput(e.target.value)}
                  className="w-full text-xs p-3 rounded border border-surface-border bg-surface-card text-ghost-light focus:border-tamra focus:outline-none"
                />
              </div>

              <div>
                <label className="block schematic-tag text-ghost-dim mb-1">{t.indicationLabel || 'INTENDED THERAPEUTIC INDICATION / SYMPTOM:'}</label>
                <input
                  type="text"
                  value={tkdlIndication}
                  onChange={(e) => setTkdlIndication(e.target.value)}
                  className="w-full text-xs p-2.5 rounded border border-surface-border bg-surface-card text-ghost-light focus:border-tamra focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleTkdlScan}
                  disabled={isTkdlLoading}
                  className="px-5 py-2.5 bg-tamra text-void font-bold text-xs font-mono rounded hover:bg-tamra-hover transition-all disabled:opacity-50 flex items-center space-x-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isTkdlLoading ? 'SCANNING_TKDL...' : (t.scanBtn || 'SCAN TKDL DATABASE ◆')}</span>
                </button>
              </div>
            </div>
          </div>

          {tkdlResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="hardware-panel corner-cross rounded-lg p-6 space-y-6 shadow-xl border border-surface-border"
            >
              <div className="flex items-center justify-between border-b border-surface-border pb-3 flex-wrap gap-2">
                <div>
                  <div className="schematic-tag text-ghost-dim">SCAN_RESULT</div>
                  <div className="font-dot text-sm sm:text-base font-bold text-ghost-light mt-0.5">
                    FOUND {tkdlResult.total_matches_found} CODIFIED MATCHES
                  </div>
                </div>
                <LEDRiskMeter riskLevel={tkdlResult.risk_level} />
              </div>

              <div className="space-y-3">
                {tkdlResult.matches.map((m, idx) => (
                  <div key={idx} className="p-4 bg-void rounded border border-surface-border space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-bold text-ghost-light font-statute">{m.tkdl_id} • {m.classical_name} ({m.sanskrit_name})</span>
                      <span className="text-tamra font-bold text-[10px]">RISK::{m.sec_3p_patent_risk}</span>
                    </div>
                    <p className="text-ghost-dim text-[11px]">SOURCE::{m.authoritative_source}</p>
                    <div className="text-ghost-light bg-surface-card p-2.5 rounded border border-surface-border text-[11px] font-sans">
                      {m.patent_filing_status}
                    </div>
                    <div className="pt-1">
                      <span className="schematic-tag text-ghost-dark">ALLOWABLE ALTERNATIVE IP AVENUES:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {m.allowable_ip_avenues.map((ave, aIdx) => (
                          <span key={aIdx} className="text-[10px] bg-surface-card border border-surface-border px-2 py-0.5 rounded text-led-green">
                            ◆ {ave}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="schematic-tag font-bold text-ghost-light">
                  ◆ TACTICAL PROSECUTION RECOMMENDATIONS:
                </div>
                <div className="space-y-1.5">
                  {tkdlResult.strategic_advice.map((adv, aIdx) => (
                    <div key={aIdx} className="p-2.5 bg-surface-card rounded border border-surface-border text-xs text-ghost font-sans flex items-start space-x-2">
                      <span className="text-tamra font-bold font-mono">▪</span>
                      <span>{adv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {activeTab === 'abs' && (
        <div className="space-y-6">
          <div className="hardware-panel corner-cross rounded-lg p-6 space-y-4 shadow-xl border border-surface-border font-mono">
            <div className="space-y-1">
              <div className="schematic-tag text-tamra font-bold flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tamra led-glow-tamra"></span>
                <span>{t.absHeaderSubtitle || 'COMPLIANCE WIZARD // NBA & SBB APPROVALS'}</span>
              </div>
              <h3 className="font-dot text-lg font-bold text-ghost-light">{t.absHeaderTitle || 'BIOLOGICAL DIVERSITY ACT (BDA) COMPLIANCE'}</h3>
              <p className="text-xs text-ghost-dim">{t.absHeaderDesc || 'Assesses Section 3 (foreign entities), Section 6 (NBA Form III patent clearance), Section 7 (SBB intimation), and 2023 AYUSH practitioner exemptions.'}</p>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start space-x-3 p-3.5 rounded border border-surface-border hover:border-surface-border-light bg-surface-card cursor-pointer">
                <input
                  type="checkbox"
                  checked={absInput.is_foreign_entity_or_has_foreign_equity}
                  onChange={(e) => setAbsInput({ ...absInput, is_foreign_entity_or_has_foreign_equity: e.target.checked })}
                  className="mt-0.5 rounded text-tamra focus:ring-tamra bg-surface"
                />
                <div>
                  <span className="text-xs font-bold text-ghost-light">{t.foreignEntity || 'Foreign Entity / NRI / Foreign Shareholding'}</span>
                  <p className="text-[11px] text-ghost-dim mt-0.5">{t.foreignEntityDesc || 'Triggers Section 3 NBA Form I prior approval requirement.'}</p>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3.5 rounded border border-surface-border hover:border-surface-border-light bg-surface-card cursor-pointer">
                <input
                  type="checkbox"
                  checked={absInput.is_registered_ayush_practitioner_for_clinic}
                  onChange={(e) => setAbsInput({ ...absInput, is_registered_ayush_practitioner_for_clinic: e.target.checked })}
                  className="mt-0.5 rounded text-tamra focus:ring-tamra bg-surface"
                />
                <div>
                  <span className="text-xs font-bold text-ghost-light">{t.ayushPractitioner || 'Registered AYUSH Practitioner / Vaid / Hakim'}</span>
                  <p className="text-[11px] text-ghost-dim mt-0.5">{t.ayushPractitionerDesc || 'Formulations prepared strictly for own clinical dispensary practice (2023 Statutory Exemption).'}</p>
                </div>
              </label>

              <div>
                <label className="block schematic-tag text-ghost-dim mb-1">{t.purposeLabel || 'PURPOSE OF BIOLOGICAL RESOURCE ACCESS:'}</label>
                <select
                  value={absInput.purpose}
                  onChange={(e) => setAbsInput({ ...absInput, purpose: e.target.value })}
                  className="w-full text-xs p-2.5 rounded border border-surface-border bg-surface-card text-ghost-light focus:border-tamra"
                >
                  <option value="commercial_utilization">Commercial Utilization (ASU Drug Manufacturing)</option>
                  <option value="ipr_patent_filing">Applying for Intellectual Property / Patent (Section 6 NBA Form III)</option>
                  <option value="research">Scientific & Academic Research</option>
                  <option value="bio_survey">Bio-survey & Bio-utilization</option>
                </select>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleAbsAssess}
                  disabled={isAbsLoading}
                  className="px-5 py-2.5 bg-tamra text-void font-bold text-xs font-mono rounded hover:bg-tamra-hover transition-all disabled:opacity-50"
                >
                  {isAbsLoading ? 'ASSESSING...' : (t.evaluateAbsBtn || 'EVALUATE ABS OBLIGATIONS ◆')}
                </button>
              </div>
            </div>
          </div>

          {absResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="hardware-panel corner-cross rounded-lg p-6 space-y-4 shadow-xl border border-surface-border font-mono text-xs"
            >
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <div className="font-bold text-ghost-light">{absResult.governing_statute}</div>
                <div className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center space-x-1.5 ${
                  absResult.is_exempt ? 'bg-led-green-dim text-led-green border border-led-green/40' : 'bg-tamra-tint text-tamra border border-tamra/40'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${absResult.is_exempt ? 'bg-led-green led-glow-green' : 'bg-tamra led-glow-tamra'}`}></span>
                  <span>{absResult.is_exempt ? 'STATUTORILY_EXEMPT' : 'NBA_APPROVAL_MANDATORY'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-void rounded border border-surface-border flex justify-between">
                  <span className="text-ghost-dark">STATUTORY PROVISION:</span>
                  <span className="text-ghost-light font-bold font-statute">{absResult.applicable_section}</span>
                </div>
                <div className="p-3 bg-void rounded border border-surface-border flex justify-between">
                  <span className="text-ghost-dark">AUTHORITY TO APPROACH:</span>
                  <span className="text-ghost-light font-bold">{absResult.authority_to_approach}</span>
                </div>
                <div className="p-3 bg-void rounded border border-surface-border flex justify-between">
                  <span className="text-ghost-dark">REQUIRED APPLICATION FORM:</span>
                  <span className="text-led-green font-bold">{absResult.required_form}</span>
                </div>
                <div className="p-3 bg-void rounded border border-surface-border flex justify-between">
                  <span className="text-ghost-dark">ESTIMATED ABS CESS:</span>
                  <span className="text-tamra font-bold">{absResult.abs_cess_percentage}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

    </div>
  );
}
