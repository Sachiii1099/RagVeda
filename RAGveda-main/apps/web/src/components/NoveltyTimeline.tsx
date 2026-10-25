import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Search, Award, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface TimelineItem {
  id: string;
  title: string;
  era_or_date: string;
  category: string;
  description: string;
  source_reference: string;
  significance: string;
}

interface NoveltyTimelineProps {
  items: TimelineItem[];
}

export const NoveltyTimeline: React.FC<NoveltyTimelineProps> = ({ items }) => {
  const { t } = useApp();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Classical Text':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'Modern Research':
        return <Search className="w-4 h-4 text-sky-400" />;
      case 'Prior Art Patent':
        return <FileText className="w-4 h-4 text-purple-400" />;
      default:
        return <Award className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl space-y-6">
      <div>
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-400" />
          <span>{t.timelineTitle}</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">{t.timelineSubtitle}</p>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l-2 border-ayur-600/40 space-y-8 my-4">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative group"
          >
            {/* Timeline node icon */}
            <div className="absolute -left-[35px] sm:-left-[43px] top-1 w-8 h-8 rounded-xl bg-slate-900 border-2 border-ayur-500/60 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              {getCategoryIcon(item.category)}
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2 hover:border-slate-600 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-amber-500/20">
                  {item.era_or_date}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {item.category}
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-slate-100">
                {item.title}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-2 pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <span className="text-slate-400">
                  Source: <strong className="text-slate-200 font-medium">{item.source_reference}</strong>
                </span>
                <span className="text-emerald-300/90 font-medium">
                  {item.significance}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
