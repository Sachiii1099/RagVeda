import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Globe, Shield, Key, BookOpen, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../i18n/translations';

interface NavbarProps {
  onOpenSettings: () => void;
  onScrollToDemos: () => void;
  onScrollToIntake: () => void;
  onExportPassport?: () => void;
  hasAssessment?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSettings,
  onScrollToDemos,
  onScrollToIntake,
  onExportPassport,
  hasAssessment
}) => {
  const { lang, setLang, t, jurisdiction, setJurisdiction } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div 
          onClick={onScrollToIntake}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ayur-500 to-ayur-700 flex items-center justify-center shadow-lg shadow-ayur-600/30 border border-ayur-400/40 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-300 via-ayur-300 to-amber-200 bg-clip-text text-transparent">
                {t.brandName}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-ayur-900/80 border border-ayur-500/40 text-ayur-300">
                SIH 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-sm">
              {t.brandTagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* SIH Benchmark Demos Button */}
          <button
            onClick={onScrollToDemos}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border border-amber-500/30 transition-colors shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.loadDemo}</span>
          </button>

          {/* Jurisdiction Toggle: 🇮🇳 India vs 🌍 International */}
          <div className="flex items-center bg-slate-900/90 rounded-lg p-1 border border-white/10 shadow-inner">
            <button
              onClick={() => setJurisdiction('IN')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                jurisdiction === 'IN'
                  ? 'bg-ayur-600 text-white shadow-md shadow-ayur-700/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🇮🇳 IN
            </button>
            <button
              onClick={() => setJurisdiction('INT')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                jurisdiction === 'INT'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-700/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🌍 INT
            </button>
          </div>

          {/* Multilingual Selector: English / हिन्दी / मराठी */}
          <div className="relative flex items-center bg-slate-900/90 rounded-lg p-1 border border-white/10">
            <Globe className="w-3.5 h-3.5 text-ayur-400 ml-1.5 mr-1" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              aria-label="Select Language"
              className="bg-transparent text-xs font-medium text-slate-200 py-1 pr-2 rounded focus:outline-none cursor-pointer max-w-[140px] sm:max-w-none truncate"
            >
              <option value="en" className="bg-slate-900 text-white">English</option>
              <option value="hi" className="bg-slate-900 text-white">हिन्दी (Hindi)</option>
              <option value="mr" className="bg-slate-900 text-white">मराठी (Marathi)</option>
              <option value="ta" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
              <option value="te" className="bg-slate-900 text-white">తెలుగు (Telugu)</option>
              <option value="gu" className="bg-slate-900 text-white">ગુજરાતી (Gujarati)</option>
              <option value="kn" className="bg-slate-900 text-white">ಕನ್ನಡ (Kannada)</option>
              <option value="ml" className="bg-slate-900 text-white">മലയാളം (Malayalam)</option>
              <option value="bn" className="bg-slate-900 text-white">বাংলা (Bengali)</option>
            </select>
          </div>

          {/* Export Passport / Expert Brief CTA */}
          {hasAssessment && onExportPassport && (
            <button
              onClick={onExportPassport}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white border border-emerald-400/30 transition-all shadow-md shadow-emerald-700/30"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.exportPassport}</span>
            </button>
          )}

          {/* Settings / API Key Modal Button */}
          <button
            onClick={onOpenSettings}
            title={t.apiKeyBtn}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors"
          >
            <Key className="w-4 h-4 text-ayur-300" />
          </button>
        </div>
      </div>
    </header>
  );
};
