import React from 'react';
import { translations } from '../i18n/translations';

export default function Navigation({ activeTab, setActiveTab, language }) {
  const t = translations[language] || translations.en;

  const tabs = [
    { id: 'chat', index: '01', label: t.tabChat || 'STATUTORY INQUIRIES' },
    { id: 'classify', index: '02', label: t.tabClassify || 'FORMULATION CLASSIFIER' },
    { id: 'abs_tkdl', index: '03', label: t.tabABSTKDL || 'ABS & TKDL SCANNER' },
    { id: 'graph', index: '04', label: t.tabGraph || 'KNOWLEDGE GRAPH AGENT' },
    { id: 'paid', index: '05', label: t.tabPaid || 'PAID CONNECTORS (DPDP)' },
    { id: 'eval', index: '06', label: t.tabEval || 'EVAL DIAGNOSTICS (8/8)' },
  ];

  return (
    <nav className="hardware-panel border-b border-surface-border sticky top-16 sm:top-20 z-30 bg-surface/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded text-[11px] font-mono tracking-tight transition-all whitespace-nowrap flex items-center space-x-2 border ${
                  isActive
                    ? 'border-tamra/60 bg-tamra-tint text-ghost-light font-bold shadow-sm'
                    : 'border-transparent text-ghost-dim hover:text-ghost-light hover:border-surface-border-light bg-transparent'
                }`}
              >
                <span className={`font-dot text-[9px] ${isActive ? 'text-tamra' : 'text-ghost-dark'}`}>
                  [{tab.index}]
                </span>
                <span>{tab.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-tamra led-glow-tamra ml-1"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
