import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DemoCasesSelector, DemoCase } from './components/DemoCasesSelector';
import { InnovationIntake } from './components/InnovationIntake';
import { ClarificationPanel, ClarificationQuestion } from './components/ClarificationPanel';
import { FingerprintCard, InnovationFingerprint } from './components/FingerprintCard';
import { AssessmentDashboard } from './components/AssessmentDashboard';
import { EvidenceDrawer, Citation } from './components/EvidenceDrawer';
import { SettingsModal } from './components/SettingsModal';
import { InnovationPassportModal } from './components/InnovationPassportModal';
import { RadarData } from './components/PriorArtRadar';
import { TimelineItem } from './components/NoveltyTimeline';
import { DependencyGraphData } from './components/DependencyGraph';
import { ScenarioComparison } from './components/WhatIfSimulator';

export const App: React.FC = () => {
  const { t, jurisdiction, activeCitation, setActiveCitation } = useApp();

  // State
  const [demoCases, setDemoCases] = useState<DemoCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | undefined>(undefined);

  // Form input prepopulation state
  const [intakeTitle, setIntakeTitle] = useState('');
  const [intakeDescription, setIntakeDescription] = useState('');
  const [intakeUse, setIntakeUse] = useState('');

  // Assessment flow state
  const [innovationId, setInnovationId] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<InnovationFingerprint | null>(null);
  const [clarifyingQuestions, setClarifyingQuestions] = useState<ClarificationQuestion[]>([]);
  const [assessmentResult, setAssessmentResult] = useState<any | null>(null);
  const [radarData, setRadarData] = useState<RadarData | null>(null);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [dependencyGraph, setDependencyGraph] = useState<DependencyGraphData | null>(null);
  const [passportData, setPassportData] = useState<any | null>(null);

  // Modals & Drawers
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load 5 SIH Demo Benchmark Cases on mount
  useEffect(() => {
    fetch('/api/v1/innovations/demo-cases')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDemoCases(data);
        }
      })
      .catch((err) => console.error('Failed to load demo cases:', err));
  }, []);

  // When jurisdiction is toggled and we already have an active innovation, re-assess for the new jurisdiction
  useEffect(() => {
    if (innovationId && assessmentResult) {
      handleRunAssessment(jurisdiction);
    }
  }, [jurisdiction]);

  const handleSelectDemoCase = (c: DemoCase) => {
    setSelectedCaseId(c.id);
    setIntakeTitle(c.title);
    setIntakeDescription(c.description);
    setIntakeUse(c.intended_use);

    // Scroll to intake section smoothly
    const elem = document.getElementById('intake-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleIntakeSubmit = async (formData: {
    title: string;
    description: string;
    intended_use: string;
    target_jurisdiction: string;
    commercial_intent: boolean;
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/innovations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create innovation');

      const data = await res.json();
      setInnovationId(data.innovation_id);
      setFingerprint(data.fingerprint);
      setClarifyingQuestions(data.clarifying_questions || []);
      setAssessmentResult(null); // Reset previous assessment

      // Auto-scroll to fingerprint / clarifications
      setTimeout(() => {
        const elem = document.getElementById('decision-checkpoints');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err) {
      console.error('Intake error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClarificationSubmit = async (answers: Record<string, string>) => {
    if (!innovationId) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/v1/innovations/${innovationId}/clarify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (res.ok) {
        const data = await res.json();
        setFingerprint(data.fingerprint);
        setClarifyingQuestions([]); // Dismiss answered questions
      }
    } catch (err) {
      console.error('Clarification submit error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAssessment = async (jurisdictionOverride?: string) => {
    if (!innovationId) return;
    setIsLoading(true);

    const targetJur = jurisdictionOverride || jurisdiction || 'IN';

    try {
      // 1. Run Assessment
      const assessRes = await fetch(`/api/v1/innovations/${innovationId}/assess?jurisdiction=${targetJur}`, {
        method: 'POST',
      });
      if (!assessRes.ok) throw new Error('Assessment failed');
      const assessData = await assessRes.json();
      setAssessmentResult(assessData);

      // 2. Concurrently fetch Radar, Timeline, and Dependency Graph
      const [radarRes, timelineRes, depRes] = await Promise.all([
        fetch(`/api/v1/innovations/${innovationId}/radar`),
        fetch(`/api/v1/innovations/${innovationId}/timeline`),
        fetch(`/api/v1/innovations/${innovationId}/dependency-graph`),
      ]);

      if (radarRes.ok) setRadarData(await radarRes.json());
      if (timelineRes.ok) setTimelineItems(await timelineRes.json());
      if (depRes.ok) setDependencyGraph(await depRes.json());

      // Scroll to assessment dashboard
      setTimeout(() => {
        const elem = document.getElementById('dashboard-section');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err) {
      console.error('Assessment execution error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateScenario = async (title: string, deltaParams: any): Promise<ScenarioComparison> => {
    if (!innovationId) throw new Error('No active innovation');

    const res = await fetch(`/api/v1/scenarios/${innovationId}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, delta_params: deltaParams }),
    });

    if (!res.ok) throw new Error('Scenario simulation failed');
    return await res.json();
  };

  const handleExportPassport = async () => {
    if (!innovationId) return;

    try {
      const res = await fetch(`/api/v1/innovations/${innovationId}/passport`);
      if (res.ok) {
        const data = await res.json();
        setPassportData(data);
        setIsPassportOpen(true);
      }
    } catch (err) {
      console.error('Passport fetch error:', err);
    }
  };

  const scrollToDemos = () => {
    const elem = document.getElementById('demo-cases-section');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToIntake = () => {
    const elem = document.getElementById('intake-section');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080d14] text-slate-100 flex flex-col justify-between selection:bg-ayur-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onScrollToDemos={scrollToDemos}
        onScrollToIntake={scrollToIntake}
        onExportPassport={handleExportPassport}
        hasAssessment={!!assessmentResult}
      />

      <main className="flex-1 space-y-10 pb-16">
        {/* Hero Section */}
        <Hero
          onStartAssessment={scrollToIntake}
          onExploreDemos={scrollToDemos}
        />

        {/* 5 SIH Benchmark Cases */}
        <DemoCasesSelector
          cases={demoCases}
          onSelectCase={handleSelectDemoCase}
          selectedCaseId={selectedCaseId}
        />

        {/* Innovation Intake & Speech-to-Text */}
        <InnovationIntake
          initialTitle={intakeTitle}
          initialDescription={intakeDescription}
          initialIntendedUse={intakeUse}
          initialJurisdiction={jurisdiction}
          onSubmit={handleIntakeSubmit}
          isLoading={isLoading}
        />

        {/* Minimum Clarifying Questions (if generated) */}
        {clarifyingQuestions.length > 0 && (
          <div id="decision-checkpoints">
            <ClarificationPanel
              questions={clarifyingQuestions}
              onSubmitAnswers={handleClarificationSubmit}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Structured Innovation Fingerprint */}
        {fingerprint && (
          <FingerprintCard
            fingerprint={fingerprint}
            onRunAssessment={() => handleRunAssessment()}
            isLoading={isLoading}
          />
        )}

        {/* Central Multi-Domain Assessment Dashboard */}
        {assessmentResult && (
          <div id="dashboard-section">
            <AssessmentDashboard
              innovationId={innovationId || ''}
              assessmentResult={assessmentResult}
              radarData={radarData}
              timelineItems={timelineItems}
              dependencyGraph={dependencyGraph}
              onViewEvidence={(cite) => setActiveCitation(cite)}
              onSimulateScenario={handleSimulateScenario}
              onExportPassport={handleExportPassport}
            />
          </div>
        )}
      </main>

      {/* Evidence Drawer */}
      <EvidenceDrawer
        citation={activeCitation}
        onClose={() => setActiveCitation(null)}
      />

      {/* Settings & API Key Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Innovation Passport & Expert Brief Modal */}
      {isPassportOpen && (
        <InnovationPassportModal
          passportData={passportData}
          onClose={() => setIsPassportOpen(false)}
        />
      )}

      {/* Footer & Statutory Non-Legal Advice Disclaimer */}
      <footer className="border-t border-white/10 glass-panel py-8 px-4 lg:px-8 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto space-y-3">
          <p className="font-extrabold text-slate-300">
            IP-SAKTI Sahayak • Smart India Hackathon 2026
          </p>
          <p className="text-[11px] leading-relaxed text-slate-500 max-w-3xl mx-auto">
            {t.footerLegalDisclaimer}
          </p>
          <div className="flex items-center justify-center gap-4 text-[11px] text-ayur-400 pt-1">
            <span>The Patents Act, 1970 (Sec 3(p))</span>
            <span>•</span>
            <span>Biological Diversity Act 2002 & 2023 Rules</span>
            <span>•</span>
            <span>Drugs & Cosmetics Act (Rule 158-B)</span>
            <span>•</span>
            <span>TKDL IPC A61K 36</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
