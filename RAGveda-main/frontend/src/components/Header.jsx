import React from 'react';
import { translations } from '../i18n/translations';
import { ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';

export default function Header({ 
  jurisdiction, 
  setJurisdiction, 
  language, 
  setLanguage, 
  onOpenEscalation,
  onOpenPaidConsent,
  paidConsentActive
}) {
  const t = translations[language] || translations.en;

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'sa', label: 'संस्कृतम्' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'mr', label: 'मराठी' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'bn', label: 'বাংলা' },
  ];

  return (
    <header className="hardware-panel border-b border-surface-border sticky top-0 z-40 bg-surface/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Masthead: Dot-Matrix Brand & Technical Subtitle */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded border border-tamra/40 bg-tamra-tint flex items-center justify-center relative">
              <span className="font-dot text-tamra text-sm font-bold animate-pulse">◆</span>
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-led-green led-glow-green"></div>
            </div>
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="font-dot font-bold text-lg sm:text-xl tracking-wider text-ghost-light">
                  RAGVEDA
                </span>
                <span className="schematic-tag text-[10px] text-tamra font-mono hidden sm:inline">
                  SYS.AYUSH.AIIA
                </span>
              </div>
              <p className="schematic-tag text-[9px] text-ghost-dark tracking-widest hidden md:block">
                STATUTORY IP & REGULATORY ENGINE // V2024.REL
              </p>
            </div>
          </div>

          {/* Controls: Mechanical Jurisdiction Snap-State, Language, and Diagnostics */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Mechanical Snap-State Jurisdiction Toggle */}
            <div className="bg-surface-card p-1 rounded border border-surface-border flex items-center shadow-inner">
              <button
                onClick={() => setJurisdiction('india')}
                className={`px-2.5 sm:px-3 py-1 rounded text-[11px] font-mono transition-all flex items-center space-x-1.5 ${
                  jurisdiction === 'india'
                    ? 'bg-ghost-light text-void font-bold shadow-md'
                    : 'text-ghost-dim hover:text-ghost-light'
                }`}
                title="Strict Domestic Statutes: Patents Act 1970/2024, Biological Diversity Act 2002/2023, DCA Rule 158B, FSSAI 2022"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${jurisdiction === 'india' ? 'bg-tamra' : 'bg-ghost-faint'}`}></span>
                <span className="tracking-tight">INDIA</span>
              </button>
              <button
                onClick={() => setJurisdiction('international')}
                className={`px-2.5 sm:px-3 py-1 rounded text-[11px] font-mono transition-all flex items-center space-x-1.5 ${
                  jurisdiction === 'international'
                    ? 'bg-ghost-light text-void font-bold shadow-md'
                    : 'text-ghost-dim hover:text-ghost-light'
                }`}
                title="Strict International Treaties: WIPO GRATK Treaty 2024, TRIPS Art 27, Nagoya Protocol, PCT Rule 51bis"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${jurisdiction === 'international' ? 'bg-tamra' : 'bg-ghost-faint'}`}></span>
                <span className="tracking-tight">WIPO/INTL</span>
              </button>
            </div>

            {/* Language Selector */}
            <div className="relative flex items-center bg-surface-card px-2 py-1 rounded border border-surface-border text-xs text-ghost-light font-mono">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-ghost-light text-[11px] font-mono focus:outline-none cursor-pointer pr-1 uppercase"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-surface text-ghost-light">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* DPDP Paid Connector LED Status */}
            <button
              onClick={onOpenPaidConsent}
              className={`text-[11px] font-mono px-2.5 py-1 rounded border transition-all flex items-center space-x-1.5 ${
                paidConsentActive
                  ? 'border-led-green/40 text-led-green bg-led-green-dim'
                  : 'border-surface-border text-ghost-dim hover:text-ghost-light bg-surface-card'
              }`}
              title="DPDP Act 2023 Consent-Gated Connectors for Manupatra & SCC Online"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${paidConsentActive ? 'bg-led-green led-glow-green' : 'bg-ghost-faint'}`}></span>
              <span className="hidden lg:inline">DPDP</span>
            </button>

            {/* AIIA IP Facilitation Cell */}
            <button
              onClick={onOpenEscalation}
              className="text-[11px] font-mono font-medium px-3 py-1 rounded border border-ghost-dim/40 text-ghost-light hover:border-tamra hover:text-tamra bg-surface-card hover:bg-tamra-tint transition-all"
            >
              AIIA CELL
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
