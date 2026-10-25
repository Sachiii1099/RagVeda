import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, BookOpen, ExternalLink, Scale, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface Citation {
  source_id: string;
  source_title: string;
  publisher: string;
  authority_level: number;
  jurisdiction: string;
  section?: string;
  page?: number;
  quoted_snippet: string;
  relevance_score: number;
  url?: string;
}

interface EvidenceDrawerProps {
  citation: Citation | null;
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ citation, onClose }) => {
  const { t } = useApp();

  if (!citation) return null;

  const getAuthorityBadge = (level: number) => {
    switch (level) {
      case 1:
        return {
          label: 'LEVEL 1 — Primary Legislation / Statutory Act',
          bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
        };
      case 2:
        return {
          label: 'LEVEL 2 — Official Government Authority / Regulator',
          bg: 'bg-sky-950/80 text-sky-300 border-sky-500/40',
        };
      case 3:
        return {
          label: 'LEVEL 3 — Official International Treaty (WIPO / Nagoya)',
          bg: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
        };
      default:
        return {
          label: `LEVEL ${level} — Statutory Guidance & Monograph`,
          bg: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
        };
    }
  };

  const badge = getAuthorityBadge(citation.authority_level);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-lg bg-slate-950 border-l border-white/10 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-ayur-600/30 border border-ayur-400/40 text-ayur-400">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">
                      {t.evidenceDrawerTitle}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {t.evidenceDrawerSubtitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  aria-label="Close evidence drawer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Authority Level Badge */}
              <div className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${badge.bg}`}>
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{badge.label}</span>
              </div>

              {/* Source Title & Publisher */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-900/80 border border-white/5">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                  Statutory Publication
                </span>
                <h4 className="text-sm font-bold text-slate-100">
                  {citation.source_title}
                </h4>
                <p className="text-xs text-slate-300">
                  Publisher: <strong className="text-slate-200">{citation.publisher}</strong>
                </p>
                <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-400 border-t border-white/5">
                  <span>Jurisdiction: <strong className="text-emerald-400">{citation.jurisdiction}</strong></span>
                  {citation.section && <span>Section: <strong className="text-amber-300">{citation.section}</strong></span>}
                  {citation.page && <span>Page: <strong className="text-slate-200">{citation.page}</strong></span>}
                </div>
              </div>

              {/* Verbatim Quoted Statutory Text */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  {t.quotedLawSnippet}
                </span>
                <div className="p-4 rounded-2xl bg-slate-900/90 border-l-4 border-ayur-500 text-xs text-slate-200 leading-relaxed font-serif italic shadow-inner">
                  "{citation.quoted_snippet}"
                </div>
              </div>

              {/* Verification Stamp */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-emerald-200">{t.verifiedOfficialCitation}</p>
                  <p className="text-[11px] text-emerald-300/80">
                    Relevance Confidence Score: {Math.round(citation.relevance_score * 100)}%
                  </p>
                </div>
              </div>

              {citation.url && (
                <a
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 hover:underline"
                >
                  <span>Open Official Gazette / Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="pt-6 border-t border-white/10">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
              >
                {t.closeDrawer}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
