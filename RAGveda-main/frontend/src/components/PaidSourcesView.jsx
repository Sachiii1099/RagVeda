import React, { useState, useEffect } from 'react';
import { Key, Shield, Search, Lock, Unlock, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import { translations } from '../i18n/translations';

export default function PaidSourcesView({ paidConsentActive, setPaidConsentActive, language }) {
  const t = translations[language] || translations.en;

  const [selectedConnector, setSelectedConnector] = useState('manupatra');
  const [consentGranted, setConsentGranted] = useState(paidConsentActive);
  const [searchQuery, setSearchQuery] = useState('curcumin synergy piperine bio-enhancer patent');
  const [queryResult, setQueryResult] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const connectors = [
    { id: 'manupatra', name: 'Manupatra AYUSH Precedents', coverage: 'Supreme Court & High Court IP Rulings' },
    { id: 'scc_online', name: 'SCC Online IP Digest', coverage: 'Tribunal Decisions (IPAB & Commercial Courts)' },
    { id: 'air_web', name: 'AIR Web Legal Registry', coverage: 'Statutory Commentary & Trade Marks Registry' },
  ];

  const fetchAuditLogs = () => {
    fetch('http://127.0.0.1:8000/api/connectors/audit')
      .then((res) => res.json())
      .then((data) => setAuditLogs(data || []))
      .catch((err) => console.error('Failed to fetch audit trail:', err));
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const handleToggleConsent = async () => {
    const nextState = !consentGranted;
    try {
      const res = await fetch('http://127.0.0.1:8000/api/connectors/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: 'session-ui',
          connector_name: selectedConnector,
          consent_granted: nextState,
          consent_purpose: 'Retrieval of high-court/Supreme Court AYUSH IP precedents under DPDP Act 2023 session consent.'
        })
      });
      const data = await res.json();
      setConsentGranted(nextState);
      setPaidConsentActive(nextState);
      fetchAuditLogs();
    } catch (err) {
      alert('CONSENT_LOGGING_ERROR: Failed to update DPDP consent status.');
    }
  };

  const handleQueryPaid = async () => {
    setIsLoading(true);
    setQueryResult(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/connectors/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: 'session-ui',
          connector_name: selectedConnector,
          query: searchQuery
        })
      });
      const data = await res.json();
      setQueryResult(data);
      fetchAuditLogs();
    } catch (err) {
      alert('CONNECTOR_QUERY_ERROR: Error querying paid legal database.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header Schematic Label */}
      <div className="space-y-1">
        <div className="schematic-tag text-tamra font-bold flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-tamra led-glow-tamra"></span>
          <span>SYS.DPDP // DIGITAL PERSONAL DATA PROTECTION ACT 2023</span>
        </div>
        <h2 className="font-dot text-lg sm:text-xl font-bold text-ghost-light tracking-wide">
          {t.paidTitle || 'PAID LEGAL DATABASE CONNECTORS & CONSENT GATE'}
        </h2>
        <p className="text-xs font-mono text-ghost-dim max-w-2xl">
          {t.paidDesc || 'Connectors for Manupatra and SCC Online subscriptions with explicit per-session user consent under DPDP Act 2023.'}
        </p>
      </div>

      {/* Main Hardware Panel */}
      <div className="hardware-panel corner-cross rounded-lg p-6 space-y-5 shadow-xl border border-surface-border font-mono">
        
        {/* Connector Selector Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {connectors.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedConnector(c.id)}
              className={`p-3 rounded border text-left text-xs transition-all ${
                selectedConnector === c.id
                  ? 'border-tamra bg-tamra-tint text-ghost-light'
                  : 'border-surface-border bg-surface-card hover:bg-surface-muted text-ghost-dim'
              }`}
            >
              <div className="font-bold">{c.name}</div>
              <div className="text-[10px] text-ghost-dark mt-0.5">{c.coverage}</div>
            </button>
          ))}
        </div>

        {/* Consent Status Strip */}
        <div className="p-4 bg-void rounded border border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="font-bold text-ghost-light flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${consentGranted ? 'bg-led-green led-glow-green' : 'bg-led-red'}`}></span>
              <span>SESSION CONSENT: {consentGranted ? 'AUTHORIZED_ACTIVE' : 'BLOCKED_UNAUTHORIZED'}</span>
            </div>
            <p className="text-ghost-dark text-[11px]">DPDP Mandate: Zero persistent tracking, on-demand session access only.</p>
          </div>

          <button
            onClick={handleToggleConsent}
            className={`px-4 py-2 rounded text-xs font-mono font-bold transition-all flex items-center space-x-1.5 ${
              consentGranted ? 'bg-led-red text-void hover:bg-red-500' : 'bg-ghost-light text-void hover:bg-white'
            }`}
          >
            {consentGranted ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            <span>{consentGranted ? (t.revokeConsent || 'REVOKE CONSENT') : (t.grantConsent || 'GRANT SESSION CONSENT')}</span>
          </button>
        </div>

        {/* Query Input */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. curcumin synergy patent case, ashwagandha rule 158b ruling"
            className="flex-1 text-xs p-3 rounded border border-surface-border bg-surface-card text-ghost-light font-mono focus:border-tamra focus:outline-none"
          />
          <button
            onClick={handleQueryPaid}
            disabled={isLoading}
            className="px-5 py-3 bg-tamra text-void font-bold text-xs font-mono rounded hover:bg-tamra-hover transition-all disabled:opacity-50 flex items-center justify-center space-x-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isLoading ? 'QUERYING...' : (t.queryPaidBtn || 'QUERY PRECEDENTS ◆')}</span>
          </button>
        </div>

        {/* Precedents Output */}
        {queryResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-void rounded border border-surface-border text-xs space-y-3"
          >
            {queryResult.success ? (
              <div className="space-y-2">
                <div className="text-led-green font-bold flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-led-green led-glow-green"></span>
                  <span>{queryResult.message}</span>
                </div>
                {queryResult.precedents?.map((p, idx) => (
                  <div key={idx} className="p-3 bg-surface-card rounded border border-surface-border space-y-1">
                    <div className="font-bold text-ghost-light">{p.case_title}</div>
                    <div className="text-tamra text-[11px] font-statute">{p.citation}</div>
                    <p className="text-ghost text-[11px] font-sans">{p.holding}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-led-red font-bold flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-led-red"></span>
                <span>{queryResult.message}</span>
              </div>
            )}
          </motion.div>
        )}

      </div>

      {/* Cryptographic SHA-256 Audit Trail */}
      <div className="hardware-panel corner-cross rounded-lg p-5 space-y-3 shadow-xl border border-surface-border font-mono text-xs">
        <div className="schematic-tag font-bold text-ghost-light border-b border-surface-border pb-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Hash className="w-3.5 h-3.5 text-tamra" />
            <span>DPDP ACT 2023 IMMUTABLE AUDIT TRAIL (SHA-256 HASHES)</span>
          </div>
          <span className="text-[9px] text-ghost-dark">CRYPT_AUDIT</span>
        </div>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 no-scrollbar">
          {auditLogs.map((log, idx) => (
            <div key={idx} className="p-2.5 bg-void rounded border border-surface-border text-[11px] flex items-center justify-between">
              <span className={log.consent_granted ? 'text-led-green font-bold' : 'text-led-red font-bold'}>
                {log.consent_granted ? '● CONSENT_AUTHORIZED' : '○ CONSENT_REVOKED'} [{log.connector}]
              </span>
              <span className="text-ghost-dark text-[10px] font-statute">HASH::{log.hash?.slice(0, 18)}...</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
