import React from 'react';
import { translations } from '../i18n/translations';

export default function DisclaimerBanner({ language }) {
  const t = translations[language] || translations.en;

  return (
    <div className="bg-void border-b border-surface-border px-4 py-1.5 text-[11px] font-mono text-ghost-dim">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-led-green led-glow-green"></span>
          <span className="schematic-tag text-ghost-dim">SYS.STATUS::GROUNDED</span>
          <span className="text-ghost-dark hidden sm:inline">|</span>
          <span className="text-ghost truncate">
            {t.disclaimerText}
          </span>
        </div>
        <div className="text-[10px] text-ghost-dark flex items-center space-x-3">
          <span className="text-tamra font-bold">◆ ZERO FABRICATION POLICY</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline font-mono text-ghost-dim">PATENTS 2024 • BDA 2023 • WIPO GRATK 2024</span>
        </div>
      </div>
    </div>
  );
}
