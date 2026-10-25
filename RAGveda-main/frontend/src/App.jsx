import React, { useState } from 'react';
import Header from './components/Header';
import DisclaimerBanner from './components/DisclaimerBanner';
import Navigation from './components/Navigation';
import ChatView from './components/ChatView';
import ClassifierView from './components/ClassifierView';
import ABSTKDLView from './components/ABSTKDLView';
import GraphView from './components/GraphView';
import PaidSourcesView from './components/PaidSourcesView';
import EvalDashboard from './components/EvalDashboard';
import EscalationModal from './components/EscalationModal';
import { translations } from './i18n/translations';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [jurisdiction, setJurisdiction] = useState('india');
  const [language, setLanguage] = useState('en');
  const [isEscalationOpen, setIsEscalationOpen] = useState(false);
  const [escalationContext, setEscalationContext] = useState(null);
  const [paidConsentActive, setPaidConsentActive] = useState(false);

  const t = translations[language] || translations.en;

  const handleOpenEscalationWithContext = (context) => {
    setEscalationContext(context);
    setIsEscalationOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] bg-dot-grid flex flex-col font-sans text-ghost-light selection:bg-tamra selection:text-void">
      
      {/* Exposed-Structure Header */}
      <Header
        jurisdiction={jurisdiction}
        setJurisdiction={setJurisdiction}

        language={language}
        setLanguage={setLanguage}
        onOpenEscalation={() => setIsEscalationOpen(true)}
        onOpenPaidConsent={() => setActiveTab('paid')}
        paidConsentActive={paidConsentActive}
      />

      {/* Technical Disclaimer Banner */}
      <DisclaimerBanner language={language} />

      {/* Mechanical Tab Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} language={language} />

      {/* Main Technical View Area */}
      <main className="flex-1">
        {activeTab === 'chat' && (
          <ChatView
            jurisdiction={jurisdiction}
            language={language}
            onEscalateWithContext={handleOpenEscalationWithContext}
          />
        )}

        {activeTab === 'classify' && (
          <ClassifierView
            onEscalateWithContext={handleOpenEscalationWithContext}
            language={language}
          />
        )}

        {activeTab === 'abs_tkdl' && (
          <ABSTKDLView
            onEscalateWithContext={handleOpenEscalationWithContext}
            language={language}
          />
        )}

        {activeTab === 'graph' && (
          <GraphView
            onEscalateWithContext={handleOpenEscalationWithContext}
            language={language}
          />
        )}

        {activeTab === 'paid' && (
          <PaidSourcesView
            paidConsentActive={paidConsentActive}
            setPaidConsentActive={setPaidConsentActive}
            language={language}
          />
        )}

        {activeTab === 'eval' && (
          <EvalDashboard language={language} />
        )}
      </main>

      {/* Facilitator Escalation Modal */}
      <EscalationModal
        isOpen={isEscalationOpen}
        onClose={() => setIsEscalationOpen(false)}
        currentContext={escalationContext}
        language={language}
      />

      {/* Technical Blueprint Footer */}
      <footer className="border-t border-surface-border py-4 text-xs font-mono text-ghost-dark bg-void">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-led-green led-glow-green"></span>
            <span className="schematic-tag text-ghost-dim">RAGVEDA // MINISTRY OF AYUSH • AIIA IP CELL</span>
          </div>
          <div className="text-[10px] text-ghost-dark flex items-center space-x-3">
            <span>PATENTS_ACT_2024</span>
            <span>•</span>
            <span>BDA_2023_ABS</span>
            <span>•</span>
            <span>WIPO_GRATK_2024</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
