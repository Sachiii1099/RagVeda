import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, ShieldCheck, Download, Award, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PassportModalProps {
  passportData: any;
  onClose: () => void;
}

export const InnovationPassportModal: React.FC<PassportModalProps> = ({
  passportData,
  onClose,
}) => {
  const { t } = useApp();

  if (!passportData) return null;

  const handlePrint = () => {
    window.print();
  };

  const inv = passportData.innovation || {};
  const fp = passportData.fingerprint || {};
  const assess = passportData.assessment || {};

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-3xl glass-panel-glow rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 border border-ayur-400/40"
        >
          {/* Action buttons in header */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ayur-500 to-ayur-700 flex items-center justify-center text-white shadow-lg">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-400 block">
                  Official Innovation Dossier
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Innovation Passport: {passportData.passport_id}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={onClose}
                aria-label="Close passport"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dossier Body */}
          <div className="space-y-6 my-6 text-xs text-slate-300">
            {/* Disclaimer Alert */}
            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200 leading-relaxed">
              <strong>Expert Consultation Brief:</strong> {passportData.export_ready_expert_brief?.disclaimer}
            </div>

            {/* General Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-white/5">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Innovation Title</span>
                <p className="text-sm font-bold text-white">{inv.title}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Jurisdiction</span>
                <p className="text-sm font-bold text-emerald-400">{inv.target_jurisdiction}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Compliance Readiness</span>
                <p className="text-sm font-black text-amber-300">{assess.compliance_readiness_score || 70}%</p>
              </div>
            </div>

            {/* Classification & Statutory Authority */}
            {assess.classification && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Product Classification</span>
                <p className="text-sm font-bold text-slate-100">{assess.classification.category_display}</p>
                <p className="text-[11px] text-slate-400">{assess.classification.applicable_statute}</p>
              </div>
            )}

            {/* Ingredients & Biological Resources */}
            {fp.ingredients && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Identified Botanical Constituents ({fp.ingredients.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {fp.ingredients.map((ing: any, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-medium text-slate-200 border border-white/5"
                    >
                      {ing.name} <em className="text-ayur-300 font-mono">({ing.scientific_name})</em>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* IP & Biodiversity Findings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Prior-Art & TKDL Status</span>
                <p className="font-bold text-amber-300">
                  {assess.tk_prior_art?.overlap_detected ? 'TK Overlap Detected' : 'Clearance Space'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {assess.tk_prior_art?.patentability_impact || 'Moderate prior-art scrutiny'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Biodiversity & ABS Pathway</span>
                <p className="font-bold text-sky-300">
                  {assess.biodiversity_abs?.potential_abs_consideration || 'ABS Review Required'}
                </p>
                <p className="text-[11px] text-slate-400">
                  Authority: {assess.biodiversity_abs?.relevant_authority || 'State Biodiversity Board'}
                </p>
              </div>
            </div>

            {/* Action Roadmap */}
            {assess.action_roadmap && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Key Action Roadmap Checkpoints
                </span>
                <ul className="space-y-1.5">
                  {assess.action_roadmap.map((act: any) => (
                    <li key={act.id} className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-ayur-400 shrink-0" />
                      <span className="font-semibold">{act.title}</span>
                      <span className="text-slate-400">({act.authority})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
            >
              Close Passport
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
