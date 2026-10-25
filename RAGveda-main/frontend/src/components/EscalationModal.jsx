import React, { useState } from 'react';
import { X, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../i18n/translations';

export default function EscalationModal({ isOpen, onClose, currentContext, language }) {
  const t = translations[language] || translations.en;

  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    organization: '',
    formulation_name: currentContext?.formulation || '',
    category: 'patent_eligibility',
    issue_description: '',
  });

  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/escalation/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          last_query: currentContext?.lastQuery || ''
        })
      });
      const data = await res.json();
      setSubmittedTicket(data);
    } catch (err) {
      alert('TICKET_ERROR: Failed to create AIIA Facilitator ticket.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSubmittedTicket(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-lg hardware-panel corner-cross rounded-lg p-6 space-y-5 border border-surface-border shadow-2xl font-mono text-xs"
      >
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div>
            <div className="schematic-tag text-tamra font-bold flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-tamra led-glow-tamra"></span>
              <span>AIIA // IP FACILITATION CELL ESCALATION</span>
            </div>
            <h3 className="font-dot text-base font-bold text-ghost-light mt-0.5">
              HUMAN IP EXPERT CONSULTATION
            </h3>
          </div>
          <button onClick={handleClose} className="p-1 rounded hover:bg-surface-muted text-ghost-dim hover:text-ghost-light">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!submittedTicket ? (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block schematic-tag text-ghost-dim mb-1">INNOVATOR FULL NAME:</label>
              <input
                type="text"
                required
                value={formData.user_name}
                onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                className="w-full p-2.5 rounded border border-surface-border bg-surface-card text-ghost-light focus:border-tamra focus:outline-none"
              />
            </div>

            <div>
              <label className="block schematic-tag text-ghost-dim mb-1">OFFICIAL EMAIL ADDRESS:</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 rounded border border-surface-border bg-surface-card text-ghost-light focus:border-tamra focus:outline-none"
              />
            </div>

            <div>
              <label className="block schematic-tag text-ghost-dim mb-1">AYURVEDIC FORMULATION / TRADEMARK NAME:</label>
              <input
                type="text"
                required
                value={formData.formulation_name}
                onChange={(e) => setFormData({ ...formData, formulation_name: e.target.value })}
                className="w-full p-2.5 rounded border border-surface-border bg-surface-card text-ghost-light focus:border-tamra focus:outline-none"
              />
            </div>

            <div>
              <label className="block schematic-tag text-ghost-dim mb-1">CONSULTATION STATUTORY CATEGORY:</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 rounded border border-surface-border bg-surface-card text-ghost-light focus:border-tamra"
              >
                <option value="patent_eligibility">Patents Act Section 3(p) / 3(d) Eligibility</option>
                <option value="biodiversity_nba">Biological Diversity Act (NBA Form III / SBB)</option>
                <option value="rule_158b_licensing">Drugs & Cosmetics Act Rule 158B Evidence Dossier</option>
                <option value="wipo_gratk_export">WIPO GRATK Treaty 2024 & International Export</option>
              </select>
            </div>

            <div>
              <label className="block schematic-tag text-ghost-dim mb-1">DETAILED ISSUE DESCRIPTION / DOSSIER SUMMARY:</label>
              <textarea
                rows={3}
                required
                value={formData.issue_description}
                onChange={(e) => setFormData({ ...formData, issue_description: e.target.value })}
                placeholder="Describe ingredient origins, extraction technique, or specific regulatory hurdle..."
                className="w-full p-2.5 rounded border border-surface-border bg-surface-card text-ghost-light focus:border-tamra focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 bg-tamra text-void font-bold text-xs font-mono rounded hover:bg-tamra-hover transition-all disabled:opacity-50 flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isLoading ? 'SUBMITTING_DOSSIER...' : 'TRANSMIT ESCALATION DOSSIER ◆'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 bg-void rounded border border-surface-border space-y-2">
              <div className="text-led-green font-bold flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-led-green led-glow-green"></span>
                <span>TICKET TRANSMITTED TO AIIA FACILITATION CELL</span>
              </div>
              <div className="text-ghost-light font-dot text-base font-bold">
                ID::{submittedTicket.ticket_id}
              </div>
              <p className="text-ghost-dim text-[11px]">
                ASSIGNED::{submittedTicket.assigned_cell}
              </p>
              <p className="text-ghost-dark text-[10px]">
                ESTIMATED RESPONSE::{submittedTicket.estimated_response_hours} HOURS
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2 bg-ghost-light text-void font-bold rounded hover:bg-white text-center"
            >
              CLOSE
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
