import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldAlert, Sparkles, BookOpen, Scale, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeroProps {
  onStartAssessment: () => void;
  onExploreDemos: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartAssessment, onExploreDemos }) => {
  const { t } = useApp();

  return (
    <section className="relative overflow-hidden pt-12 pb-16 px-4 lg:px-8 text-center">
      {/* Background glow orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-ayur-600/15 blur-[120px] pointer-events-none rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-6 relative z-10"
      >
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ayur-950/80 border border-ayur-500/40 text-ayur-300 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span>{t.heroBadge}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight">
          <span className="text-slate-100 block">{t.heroTitle1}</span>
          <span className="bg-gradient-to-r from-emerald-400 via-ayur-300 to-amber-300 bg-clip-text text-transparent block mt-1">
            {t.heroTitle2}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onStartAssessment}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-ayur-600 to-ayur-700 hover:from-ayur-500 hover:to-ayur-600 text-white font-bold text-sm shadow-xl shadow-ayur-700/30 border border-ayur-400/40 transition-all flex items-center gap-2 group hover:scale-[1.02]"
          >
            <span>{t.startAssessmentCta}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onExploreDemos}
            className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 font-semibold text-sm border border-amber-500/30 transition-all flex items-center gap-2 hover:scale-[1.02]"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.exploreDemosCta}</span>
          </button>
        </div>

        {/* Stat badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 max-w-3xl mx-auto text-left">
          <div className="p-3.5 rounded-xl glass-panel border border-white/5">
            <p className="text-xl font-black text-emerald-400">5 Cases</p>
            <p className="text-xs text-slate-400 mt-0.5">{t.statInnovations}</p>
          </div>
          <div className="p-3.5 rounded-xl glass-panel border border-white/5">
            <p className="text-xl font-black text-amber-400">Levels 1–6</p>
            <p className="text-xs text-slate-400 mt-0.5">{t.statLaws}</p>
          </div>
          <div className="p-3.5 rounded-xl glass-panel border border-white/5">
            <p className="text-xl font-black text-sky-400">A61K 36/00</p>
            <p className="text-xs text-slate-400 mt-0.5">{t.statTkdlRefs}</p>
          </div>
          <div className="p-3.5 rounded-xl glass-panel border border-white/5">
            <p className="text-xl font-black text-purple-400">100% Grounded</p>
            <p className="text-xs text-slate-400 mt-0.5">{t.statNonHallucination}</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
