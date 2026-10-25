import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../i18n/translations';

export default function ClassifierView({ onEscalateWithContext, language }) {
  const t = translations[language] || translations.en;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    is_classical_text_recipe: false,
    classical_text_name: 'Charaka Samhita',
    has_ingredient_modifications: false,
    is_purified_standardized_fraction: false,
    bioactive_markers_count: 0,
    intended_use: 'therapeutic_disease',
    has_heavy_metals_or_schedule_e1: false,
    extraction_method: 'classical_water_oil',
    clinical_safety_data_available: false
  });

  const [pathwayResult, setPathwayResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const classicalTexts = [
    'Charaka Samhita', 'Sushruta Samhita', 'Ashtanga Hridaya', 'Sharangadhara Samhita',
    'Bhavaprakasha', 'Bhaishajya Ratnavali', 'Ayurvedic Formulary of India (AFI)', 'Ayurvedic Pharmacopoeia of India (API)'
  ];

  const handleClassify = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setPathwayResult(data);
    } catch (err) {
      alert('CLASSIFICATION_ERROR: Failed to compute regulatory pathway.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setPathwayResult(null);
    setFormData({
      is_classical_text_recipe: false,
      classical_text_name: 'Charaka Samhita',
      has_ingredient_modifications: false,
      is_purified_standardized_fraction: false,
      bioactive_markers_count: 0,
      intended_use: 'therapeutic_disease',
      has_heavy_metals_or_schedule_e1: false,
      extraction_method: 'classical_water_oil',
      clinical_safety_data_available: false
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header Diagnostic Label */}
      <div className="space-y-1">
        <div className="schematic-tag text-tamra font-bold flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-tamra led-glow-tamra"></span>
          <span>SYS.CLASSIFIER // 5-CATEGORY DETERMINATION WIZARD</span>
        </div>
        <h2 className="font-dot text-lg sm:text-xl font-bold text-ghost-light tracking-wide">
          {t.classifierTitle || 'FORMULATION CLASSIFICATION & REGULATORY DOSSIER'}
        </h2>
        <p className="text-xs font-mono text-ghost-dim max-w-2xl">
          {t.classifierDesc || 'Determines classification into Classical ASU Drug, Patent/Proprietary ASU, Phytopharmaceutical, Ayurveda-Aahar, or Cosmetic, with Rule 158B licensing requirements.'}
        </p>
      </div>

      {!pathwayResult ? (
        <div className="hardware-panel corner-cross rounded-lg p-6 space-y-6 shadow-xl border border-surface-border">
          
          {/* Step Sequence Indicator */}
          <div className="flex items-center justify-between border-b border-surface-border pb-3 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className="font-dot text-tamra text-sm">[0{step}/04]</span>
              <span className="schematic-tag font-bold text-ghost-light">
                {step === 1 && 'STAGE::CLASSICAL_AUTHORITY_BASIS'}
                {step === 2 && 'STAGE::INGREDIENT_MODIFICATIONS'}
                {step === 3 && 'STAGE::EXTRACTION_STANDARDIZATION'}
                {step === 4 && 'STAGE::INTENDED_COMMERCIAL_USE'}
              </span>
            </div>
            <span className="schematic-tag text-ghost-dark">STEP_PARAM_INTAKE</span>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <p className="text-xs font-mono text-ghost-dim">
                  {t.classicalQuestion || 'Is your formulation manufactured exclusively in accordance with a recipe in one of the 54 authoritative books of the First Schedule to the Drugs and Cosmetics Act?'}
                </p>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_classical_text_recipe: true })}
                    className={`w-full p-4 rounded border text-left font-mono transition-all flex items-start space-x-3 ${
                      formData.is_classical_text_recipe
                        ? 'border-tamra bg-tamra-tint text-ghost-light'
                        : 'border-surface-border hover:border-surface-border-light bg-surface-card text-ghost-dim'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full mt-1 ${formData.is_classical_text_recipe ? 'bg-tamra led-glow-tamra' : 'bg-ghost-faint'}`}></span>
                    <div>
                      <div className="text-xs font-bold text-ghost-light">
                        {t.classicalYes || 'YES — EXACT CLASSICAL FORMULATION'}
                      </div>
                      <div className="text-[11px] text-ghost-dim mt-0.5">
                        {t.classicalYesDesc || 'Adheres strictly to Charaka, Sushruta, Bhavaprakasha, or AFI formulae without modification.'}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_classical_text_recipe: false })}
                    className={`w-full p-4 rounded border text-left font-mono transition-all flex items-start space-x-3 ${
                      !formData.is_classical_text_recipe
                        ? 'border-tamra bg-tamra-tint text-ghost-light'
                        : 'border-surface-border hover:border-surface-border-light bg-surface-card text-ghost-dim'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full mt-1 ${!formData.is_classical_text_recipe ? 'bg-tamra led-glow-tamra' : 'bg-ghost-faint'}`}></span>
                    <div>
                      <div className="text-xs font-bold text-ghost-light">
                        {t.classicalNo || 'NO — NOVEL / MODIFIED COMBINATION'}
                      </div>
                      <div className="text-[11px] text-ghost-dim mt-0.5">
                        {t.classicalNoDesc || 'Novel herbal combination, altered classical proportions, or proprietary extract vehicle.'}
                      </div>
                    </div>
                  </button>
                </div>

                {formData.is_classical_text_recipe && (
                  <div className="pt-2">
                    <label className="block schematic-tag mb-1.5 text-ghost-dim">{t.selectText || 'FIRST SCHEDULE AUTHORITATIVE TEXT:'}</label>
                    <select
                      value={formData.classical_text_name}
                      onChange={(e) => setFormData({ ...formData, classical_text_name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded border border-surface-border bg-surface-card text-ghost-light font-mono focus:border-tamra"
                    >
                      {classicalTexts.map((text, idx) => (
                        <option key={idx} value={text} className="bg-surface">{text}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-surface-border">
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-2 bg-ghost-light text-void text-xs font-mono font-bold rounded hover:bg-white flex items-center space-x-1.5"
                  >
                    <span>{t.continueBtn || 'CONTINUE'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4 font-mono"
              >
                <p className="text-xs text-ghost-dim">
                  {t.stepModQuestion || 'Have you modified classical ratios or introduced modern dosage vehicles or potent mineral ingredients?'}
                </p>

                <div className="space-y-2">
                  <label className="flex items-start space-x-3 p-3.5 rounded border border-surface-border hover:border-surface-border-light bg-surface-card cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.has_ingredient_modifications}
                      onChange={(e) => setFormData({ ...formData, has_ingredient_modifications: e.target.checked })}
                      className="mt-0.5 rounded text-tamra focus:ring-tamra bg-surface"
                    />
                    <div>
                      <span className="text-xs font-bold text-ghost-light">{t.modDosage || 'Modern Dosage Form (Tablets, Capsules, Gels, Liposomes)'}</span>
                      <p className="text-[11px] text-ghost-dim mt-0.5">{t.modDosageDesc || 'Converting classical Kwatha or Taila into modern delivery vehicles.'}</p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-3.5 rounded border border-surface-border hover:border-surface-border-light bg-surface-card cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.has_heavy_metals_or_schedule_e1}
                      onChange={(e) => setFormData({ ...formData, has_heavy_metals_or_schedule_e1: e.target.checked })}
                      className="mt-0.5 rounded text-tamra focus:ring-tamra bg-surface"
                    />
                    <div>
                      <span className="text-xs font-bold text-ghost-light">{t.modMetals || 'Contains Mineral Bhasmas or Schedule E(1) Botanicals'}</span>
                      <p className="text-[11px] text-ghost-dim mt-0.5">{t.modMetalsDesc || 'e.g. Swarna Bhasma, Rasasindura, Vatsanabha, Kupilu, Bhang.'}</p>
                    </div>
                  </label>
                </div>

                <div className="flex justify-between pt-4 border-t border-surface-border">
                  <button onClick={() => setStep(1)} className="px-4 py-2 text-xs font-mono text-ghost-dim hover:text-ghost-light flex items-center space-x-1">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t.backBtn || 'BACK'}</span>
                  </button>
                  <button onClick={() => setStep(3)} className="px-5 py-2 bg-ghost-light text-void text-xs font-mono font-bold rounded hover:bg-white flex items-center space-x-1.5">
                    <span>{t.continueBtn || 'CONTINUE'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4 font-mono"
              >
                <div>
                  <label className="block schematic-tag text-ghost-dim mb-1.5">{t.extractionTech || 'EXTRACTION TECHNOLOGY METHODOLOGY:'}</label>
                  <select
                    value={formData.extraction_method}
                    onChange={(e) => setFormData({ ...formData, extraction_method: e.target.value })}
                    className="w-full text-xs p-2.5 rounded border border-surface-border bg-surface-card text-ghost-light font-mono focus:border-tamra"
                  >
                    <option value="classical_water_oil">Classical Aqueous Decoction (Kwatha / Sneha Kalpana)</option>
                    <option value="solvent_hydroalcoholic">Hydro-alcoholic / Solvent Gradient Extraction</option>
                    <option value="supercritical_co2">Supercritical CO2 / Subcritical Water Extraction</option>
                  </select>
                </div>

                <label className="flex items-start space-x-3 p-3.5 rounded border border-surface-border hover:border-surface-border-light bg-surface-card cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_purified_standardized_fraction}
                    onChange={(e) => setFormData({ ...formData, is_purified_standardized_fraction: e.target.checked })}
                    className="mt-0.5 rounded text-tamra focus:ring-tamra bg-surface"
                  />
                  <div>
                    <span className="text-xs font-bold text-ghost-light">{t.phytoCandidate || 'Purified Standardized Fraction (Phytopharmaceutical Candidate)'}</span>
                    <p className="text-[11px] text-ghost-dim mt-0.5">{t.phytoCandidateDesc || 'Standardized chromatographic markers under New Drugs Rules 2019.'}</p>
                  </div>
                </label>

                {formData.is_purified_standardized_fraction && (
                  <div className="p-3 bg-void rounded border border-surface-border font-mono text-xs">
                    <label className="block text-ghost-light font-bold mb-1">{t.bioactiveMarkers || 'NUMBER OF CHROMATOGRAPHIC BIOACTIVE MARKERS:'}</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.bioactive_markers_count}
                      onChange={(e) => setFormData({ ...formData, bioactive_markers_count: parseInt(e.target.value) || 0 })}
                      className="w-24 p-2 rounded border border-surface-border bg-surface-card text-ghost-light"
                    />
                    <span className="text-ghost-dark text-[11px] ml-2">(Min 4 required for CDSCO Phytopharmaceutical Approval)</span>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t border-surface-border">
                  <button onClick={() => setStep(2)} className="px-4 py-2 text-xs font-mono text-ghost-dim hover:text-ghost-light flex items-center space-x-1">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t.backBtn || 'BACK'}</span>
                  </button>
                  <button onClick={() => setStep(4)} className="px-5 py-2 bg-ghost-light text-void text-xs font-mono font-bold rounded hover:bg-white flex items-center space-x-1.5">
                    <span>{t.continueBtn || 'CONTINUE'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4 font-mono"
              >
                <p className="text-xs text-ghost-dim">{t.intendedUseQuestion || 'What is the commercial intended use and label claim category of the formulation?'}</p>

                <div className="space-y-2">
                  {[
                    { id: 'therapeutic_disease', title: t.therapeuticTitle || 'Therapeutic ASU Medicine', desc: t.therapeuticDesc || 'Treatment, cure, or mitigation of clinical disease or disorder.' },
                    { id: 'dietary_nutrition', title: t.ayurvedaAaharTitle || 'Ayurveda Aahar / Dietary Food', desc: t.ayurvedaAaharDesc || 'Dietary supplement rooted in traditional recipes (FSSAI 2022).' },
                    { id: 'external_beauty', title: t.cosmeticTitle || 'Ayurvedic Cosmetic', desc: t.cosmeticDesc || 'External application for skincare without medicinal cure claims.' },
                    { id: 'general_wellness', title: t.wellnessTitle || 'General Rasayana / Vitality', desc: t.wellnessDesc || 'Preventive health and immunity enhancement.' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, intended_use: item.id })}
                      className={`w-full p-3.5 rounded border text-left transition-all flex items-start space-x-3 ${
                        formData.intended_use === item.id
                          ? 'border-tamra bg-tamra-tint text-ghost-light'
                          : 'border-surface-border hover:border-surface-border-light bg-surface-card text-ghost-dim'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full mt-1 ${formData.intended_use === item.id ? 'bg-tamra led-glow-tamra' : 'bg-ghost-faint'}`}></span>
                      <div>
                        <div className="text-xs font-bold text-ghost-light">{item.title}</div>
                        <div className="text-[11px] text-ghost-dim mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t border-surface-border">
                  <button onClick={() => setStep(3)} className="px-4 py-2 text-xs font-mono text-ghost-dim hover:text-ghost-light flex items-center space-x-1">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t.backBtn || 'BACK'}</span>
                  </button>
                  <button
                    onClick={handleClassify}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-tamra text-void font-bold text-xs font-mono rounded hover:bg-tamra-hover transition-colors disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    <span>{isLoading ? 'COMPUTING_DOSSIER...' : (t.generateDossier || 'GENERATE STATUTORY DOSSIER ◆')}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hardware-panel corner-cross rounded-lg p-6 space-y-6 shadow-xl border border-surface-border"
        >
          {/* Dossier Result Header */}
          <div className="border-b border-surface-border pb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="schematic-tag text-tamra font-bold flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tamra led-glow-tamra"></span>
                <span>DETERMINATION_RESULT::STATUTORY_DOSSIER</span>
              </div>
              <h3 className="font-dot text-xl sm:text-2xl font-bold text-ghost-light mt-1">
                {pathwayResult.category_name}
              </h3>
              <p className="text-xs font-mono text-ghost-dim mt-0.5">
                AUTHORITY::{pathwayResult.licensing_authority}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded border border-surface-border text-xs font-mono text-ghost-dim hover:text-ghost-light bg-surface-card"
              >
                {t.reclassify || 'RE-CLASSIFY'}
              </button>
              <button
                onClick={() => onEscalateWithContext({ formulation: pathwayResult.category_name, lastQuery: pathwayResult.statutory_category })}
                className="px-4 py-1.5 bg-ghost-light text-void text-xs font-mono font-bold rounded hover:bg-white"
              >
                {t.consultAIIA || 'CONSULT AIIA CELL'}
              </button>
            </div>
          </div>

          {/* Statutory Matrix */}
          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 bg-void rounded border border-surface-border space-y-2">
              <div className="flex justify-between">
                <span className="text-ghost-dark">{t.governingStatute || 'GOVERNING STATUTE:'}</span>
                <span className="text-ghost-light font-bold">{pathwayResult.governing_act}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ghost-dark">{t.statutoryProvision || 'PROVISION:'}</span>
                <span className="text-ghost-light font-bold font-statute">{pathwayResult.governing_section_or_rule}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ghost-dark">{t.licensingApp || 'LICENSING FORM:'}</span>
                <span className="text-led-green font-bold">{pathwayResult.licensing_form}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ghost-dark">{t.patentRiskIndex || 'PATENTABILITY RISK:'}</span>
                <span className="text-tamra font-bold">{pathwayResult.ip_patentability_risk}</span>
              </div>
            </div>

            {/* Strategic IP Recommendations */}
            <div className="space-y-2">
              <div className="schematic-tag font-bold text-ghost-light flex items-center space-x-1.5">
                <span className="text-tamra">◆</span>
                <span>{t.ipStrategyRecs || 'ACTIONABLE IP STRATEGY RECOMMENDATIONS:'}</span>
              </div>
              <div className="space-y-1.5">
                {pathwayResult.ip_strategy_recommendations.map((rec, rIdx) => (
                  <div key={rIdx} className="p-3 bg-surface-card rounded border border-surface-border text-xs text-ghost font-sans flex items-start space-x-2">
                    <span className="text-tamra font-bold font-mono">▪</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prohibited Claims */}
            <div className="space-y-2">
              <div className="schematic-tag font-bold text-led-red flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-led-red"></span>
                <span>{t.prohibitedClaims || 'PROHIBITED CLAIMS & BOUNDARIES:'}</span>
              </div>
              <div className="space-y-1.5">
                {pathwayResult.prohibited_claims.map((claim, cIdx) => (
                  <div key={cIdx} className="p-2.5 bg-surface-card rounded border-l-2 border-led-red text-xs text-ghost-dim font-mono">
                    {claim}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
}
