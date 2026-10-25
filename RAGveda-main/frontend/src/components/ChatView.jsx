import React, { useState, useEffect, useRef } from 'react';
import { Send, ChevronDown, ChevronUp, ArrowUpRight, ShieldCheck, Activity, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations, sampleQueriesByJurisdiction } from '../i18n/translations';

// Addressable LED Meter Component
function LEDConfidenceMeter({ score = 0.95, rating = 'HIGH' }) {
  const totalDots = 5;
  const activeDots = Math.round(score * totalDots);

  return (
    <div className="flex items-center space-x-1.5 font-mono text-[10px]" title={`Confidence Score: ${Math.round(score * 100)}%`}>
      <span className="schematic-tag text-ghost-dark mr-1">CONF:</span>
      <div className="flex space-x-1">
        {Array.from({ length: totalDots }).map((_, i) => {
          const isActive = i < activeDots;
          return (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                isActive
                  ? rating === 'HIGH'
                    ? 'bg-led-green led-glow-green'
                    : rating === 'MEDIUM'
                    ? 'bg-led-amber led-glow-amber'
                    : 'bg-led-red'
                  : 'bg-neutral-800'
              }`}
            />
          );
        })}
      </div>
      <span className={`font-dot text-[9px] ml-1 ${
        rating === 'HIGH' ? 'text-led-green' : rating === 'MEDIUM' ? 'text-led-amber' : 'text-led-red'
      }`}>
        {Math.round(score * 100)}%
      </span>
    </div>
  );
}

export default function ChatView({ jurisdiction, language, onEscalateWithContext }) {
  const t = translations[language] || translations.en;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCitations, setExpandedCitations] = useState({});
  const [expandedReasoning, setExpandedReasoning] = useState({});
  const messagesEndRef = useRef(null);

  // Initialize or reframe orientation message when jurisdiction or language changes
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: `### ${t.chatOrientationTitle || 'Statutory Intelligence Orientation'}

${t.chatOrientationDesc || 'RAGveda reads primary statutes, official notifications, and codified traditional knowledge to orient your Ayurvedic innovation. Every answer cites verified sections of the Patents Act, Biological Diversity Act, Drugs & Cosmetics Rules, or WIPO treaties.'}

**${t.sampleInquiriesTitle || 'Sample Statutory Inquiries:'}**`,
        citations: [],
        confidence: 1.0,
        confidenceRating: 'HIGH',
        isAbstained: false,
        reasoningSteps: [
          `ACTIVE_REGIME :: ${jurisdiction === 'india' ? 'INDIA_DOMESTIC_STATUTES' : 'WIPO_INTERNATIONAL_TREATIES'}`,
          `LANGUAGE_LOCK :: ${language.toUpperCase()}`,
          'ZERO_FABRICATED_CITATIONS_GUARDRAILS :: ENFORCED'
        ]
      }
    ]);
  }, [jurisdiction, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const activeQueries = (sampleQueriesByJurisdiction[jurisdiction] && (sampleQueriesByJurisdiction[jurisdiction][language] || sampleQueriesByJurisdiction[jurisdiction].en)) || [];

  const handleSend = async (queryText) => {
    const q = queryText || input;
    if (!q.trim() || isLoading) return;

    const userMessage = { role: 'user', content: q, jurisdiction: jurisdiction };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          jurisdiction: jurisdiction,
          language: language,
          session_id: 'session-ui'
        })
      });
      const data = await res.json();

      const assistantMessage = {
        role: 'assistant',
        content: data.answer,
        citations: data.citations || [],
        confidence: data.confidence_score,
        confidenceRating: data.confidence_rating,
        isAbstained: data.is_abstained,
        abstentionReason: data.abstention_reason,
        partialFlag: data.partial_coverage_flag,
        uncovered: data.uncovered_aspects,
        reasoningSteps: data.reasoning_steps || [],
        sourcesAccessed: data.sources_accessed || []
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '◆ HARDWARE_COMMUNICATION_ERROR: Failed to connect to RAGveda backend daemon on port 8000.',
          citations: [],
          confidence: 0.0,
          confidenceRating: 'LOW'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCitation = (msgIndex, citIndex) => {
    const key = `${msgIndex}-${citIndex}`;
    setExpandedCitations((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleReasoning = (msgIndex) => {
    setExpandedReasoning((prev) => ({ ...prev, [msgIndex]: !prev[msgIndex] }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto px-4 py-6">
      
      {/* Active Regime & Hardware State Bar */}
      <div className="border-b border-surface-border pb-2.5 mb-4 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="schematic-tag">REGIME:</span>
          <span className="font-dot text-tamra text-[11px] font-bold tracking-wider">
            {jurisdiction === 'india' ? 'INDIA::DOMESTIC' : 'WIPO::INTERNATIONAL'}
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-ghost-dark font-mono">
          <span>LANG::<strong className="text-ghost-light uppercase">{language}</strong></span>
          <span>•</span>
          <span className="flex items-center space-x-1 text-led-green">
            <span className="w-1.5 h-1.5 rounded-full bg-led-green led-glow-green"></span>
            <span>RAG_LIVE</span>
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 no-scrollbar">
        {messages.map((msg, mIdx) => (
          <div
            key={mIdx}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            {msg.role === 'user' ? (
              <div className="max-w-2xl bg-surface-card border border-surface-border-light px-4 py-3 rounded-lg text-ghost-light text-xs sm:text-sm font-sans relative shadow-sm">
                <div className="schematic-tag text-[9px] text-ghost-dark mb-1">INQUIRY_INPUT:</div>
                {msg.content}
              </div>
            ) : (
              <div className="max-w-3xl w-full hardware-panel corner-cross p-5 sm:p-6 rounded-lg space-y-4 shadow-lg">
                
                {/* Exposed Header: Statutory Metadata & LED Meter */}
                <div className="flex items-center justify-between border-b border-surface-border pb-3 text-xs font-mono flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-dot text-tamra text-xs">◆</span>
                    <span className="schematic-tag font-bold text-ghost-light">
                      {t.statutoryAnalysis || 'STATUTORY ANALYSIS'}
                    </span>
                  </div>
                  
                  {msg.confidence !== undefined && msg.role === 'assistant' && (
                    <LEDConfidenceMeter score={msg.confidence} rating={msg.confidenceRating} />
                  )}
                </div>

                {/* Response Prose */}
                <div className="text-xs sm:text-sm leading-relaxed text-ghost font-sans space-y-3 whitespace-pre-line">
                  {msg.content}
                </div>

                {/* Partial Coverage Notice */}
                {msg.partialFlag && (
                  <div className="p-3 bg-surface-muted border-l-2 border-led-amber text-xs font-mono space-y-1">
                    <div className="text-led-amber font-bold flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-led-amber led-glow-amber"></span>
                      <span>PARTIAL_STATUTORY_COVERAGE_NOTICE</span>
                    </div>
                    <p className="text-ghost-dim text-[11px]">{msg.uncovered}</p>
                  </div>
                )}

                {/* First-Class Exposed-Structure Citation Cards */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-4 border-t border-surface-border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="schematic-tag font-bold text-ghost-dim flex items-center space-x-1.5">
                        <span className="text-tamra font-bold">◆</span>
                        <span>{t.verifiedSources || 'VERIFIED STATUTORY SOURCES'} ({msg.citations.length})</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {msg.citations.map((cit, cIdx) => {
                        const isExpanded = expandedCitations[`${mIdx}-${cIdx}`];
                        return (
                          <div
                            key={cIdx}
                            className="p-3 bg-surface-muted/90 rounded border border-surface-border hover:border-surface-border-light text-xs font-mono transition-all"
                          >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-tamra font-bold font-dot">▪</span>
                                <span className="font-bold text-ghost-light font-statute">{cit.section}</span>
                                <span className="text-ghost-dark">•</span>
                                <span className="text-ghost-dim text-[11px] truncate max-w-xs">{cit.act_title}</span>
                              </div>
                              <div className="flex items-center space-x-3 text-[11px]">
                                <a
                                  href={cit.official_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-tamra hover:underline flex items-center space-x-1 font-mono"
                                >
                                  <span>{t.officialText || 'OFFICIAL TEXT'}</span>
                                  <ArrowUpRight className="w-3 h-3" />
                                </a>
                                <button
                                  onClick={() => toggleCitation(mIdx, cIdx)}
                                  className="text-ghost-dim hover:text-ghost-light flex items-center space-x-0.5"
                                >
                                  <span>{isExpanded ? (t.hideExcerpt || 'HIDE') : (t.viewExcerpt || 'EXCERPT')}</span>
                                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                              </div>
                            </div>

                            {/* Verbatim Excerpt Drawer */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.15 }}
                                  className="mt-2.5 pt-2.5 border-t border-surface-border text-ghost-dim text-[11px] font-mono space-y-1.5 bg-void p-3 rounded"
                                >
                                  <div className="schematic-tag text-[9px] text-tamra font-bold">
                                    {t.excerptTitle || 'VERBATIM STATUTORY TEXT:'}
                                  </div>
                                  <blockquote className="italic border-l border-tamra pl-2 text-ghost-light font-statute">
                                    "{cit.exact_quote}"
                                  </blockquote>
                                  <div className="text-[9px] text-ghost-dark pt-1">
                                    REF_ID::{cit.chunk_id} • JURISDICTION::{cit.jurisdiction}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Diagnostic Trace Drawer */}
                {msg.reasoningSteps && msg.reasoningSteps.length > 0 && msg.role === 'assistant' && (
                  <div className="pt-2 border-t border-surface-border">
                    <button
                      onClick={() => toggleReasoning(mIdx)}
                      className="text-[10px] font-mono text-ghost-dark hover:text-ghost-light flex items-center space-x-1.5"
                    >
                      <Terminal className="w-3 h-3 text-tamra" />
                      <span>{expandedReasoning[mIdx] ? 'HIDE' : 'INSPECT'} RETRIEVAL_DIAGNOSTICS_TRACE</span>
                    </button>
                    {expandedReasoning[mIdx] && (
                      <div className="mt-2 p-3 bg-void rounded text-[10px] font-mono text-ghost-dim space-y-1 border border-surface-border">
                        {msg.reasoningSteps.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-center space-x-2">
                            <span className="text-led-green">✓</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-3 p-4 hardware-panel rounded-lg max-w-sm text-xs font-mono text-ghost-dim">
            <span className="animate-blink text-tamra font-dot text-sm">◆</span>
            <span>SCANNING_STATUTORY_VECTOR_CORPUS...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Orientation Prompts */}
      {messages.length <= 2 && (
        <div className="py-2.5 border-t border-surface-border space-y-1.5">
          <div className="schematic-tag text-[9px] text-ghost-dark">
            {t.sampleInquiriesTitle || 'SAMPLE STATUTORY INQUIRIES:'}
          </div>
          <div className="space-y-1">
            {activeQueries.slice(0, 3).map((itemText, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(itemText)}
                className="w-full text-left text-xs font-mono p-2 rounded border border-surface-border bg-surface-card hover:bg-surface-muted hover:border-tamra/40 text-ghost flex items-center space-x-2 transition-all"
              >
                <span className="font-dot text-[9px] text-tamra">[{idx + 1}]</span>
                <span className="truncate">{itemText}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Field */}
      <div className="pt-2 border-t border-surface-border">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={jurisdiction === 'india' ? (t.inputPlaceholderIndia || 'Ask about Section 3(p), BDA Form III, Rule 158B...') : (t.inputPlaceholderIntl || 'Ask about WIPO GRATK Treaty 2024, TRIPS Art 27...')}
            className="flex-1 text-xs sm:text-sm p-3 rounded border border-surface-border focus:border-tamra focus:outline-none bg-surface-card text-ghost-light font-mono"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-ghost-light text-void hover:bg-white p-3 rounded font-mono text-xs transition-all disabled:opacity-40 flex items-center justify-center font-bold"
          >
            <Send className="w-4 h-4 text-void" />
          </button>
        </form>
      </div>

    </div>
  );
}
