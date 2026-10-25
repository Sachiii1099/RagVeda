import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Scale, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface ClarificationQuestion {
  id: string;
  question: string;
  why_we_ask: string;
  options: string[];
  impact_variable: string;
}

interface ClarificationPanelProps {
  questions: ClarificationQuestion[];
  onSubmitAnswers: (answers: Record<string, string>) => void;
  isLoading: boolean;
}

export const ClarificationPanel: React.FC<ClarificationPanelProps> = ({
  questions,
  onSubmitAnswers,
  isLoading,
}) => {
  const { t } = useApp();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const handleSelectOption = (qid: string, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [qid]: option }));
  };

  const handleSubmit = () => {
    onSubmitAnswers(selectedAnswers);
  };

  if (!questions || questions.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 lg:px-8 py-6"
    >
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{t.clarifyTitle}</h3>
            <p className="text-xs text-slate-400">{t.clarifySubtitle}</p>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] font-extrabold flex items-center justify-center text-amber-300">
                    {idx + 1}
                  </span>
                  <span>{q.question}</span>
                </h4>
              </div>

              {/* Statutory Impact Note */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/20 flex items-start gap-2 text-xs text-amber-200">
                <Scale className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300 mr-1.5 uppercase text-[10px] tracking-wider">
                    {t.whyWeAskBadge}:
                  </span>
                  <span>{q.why_we_ask}</span>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt) => {
                  const isChecked = selectedAnswers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectOption(q.id, opt)}
                      className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all flex items-center justify-between gap-2 ${
                        isChecked
                          ? 'bg-ayur-950/90 border-ayur-400 text-white shadow-md shadow-ayur-900/40 ring-1 ring-ayur-400/50'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      <span className="leading-snug">{opt}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-ayur-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-ayur-600 hover:bg-ayur-500 text-white font-bold text-xs shadow-lg shadow-ayur-700/30 transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <span>Updating...</span>
            ) : (
              <>
                <span>{t.confirmContinueBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.section>
  );
};
