import React, { useState, useEffect } from 'react';
import { Network, ArrowRight, Zap, GitCommit, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../i18n/translations';

export default function GraphView({ onEscalateWithContext, language }) {
  const t = translations[language] || translations.en;

  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [compoundQuery, setCompoundQuery] = useState(
    'I want to patent this Western Ghats biological formulation in India AND sell it in the US AND export it as a Phytopharmaceutical - what approvals do I need, in what order?'
  );
  const [agentPlan, setAgentPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/graph')
      .then((res) => res.json())
      .then((data) => {
        setGraphData(data);
        if (data.nodes && data.nodes.length > 0) {
          setSelectedNode(data.nodes[0]);
        }
      })
      .catch((err) => console.error('Graph fetch error:', err));
  }, []);

  const handlePlan = async () => {
    if (!compoundQuery.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/agent/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: compoundQuery, jurisdiction: 'all', language: language })
      });
      const data = await res.json();
      setAgentPlan(data);
    } catch (err) {
      alert('AGENT_REASONING_ERROR: Failed to compute multi-hop compliance roadmap.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header Schematic Label */}
      <div className="space-y-1">
        <div className="schematic-tag text-tamra font-bold flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-tamra led-glow-tamra"></span>
          <span>SYS.GRAPH // RELATIONAL STATUTORY REASONING AGENT</span>
        </div>
        <h2 className="font-dot text-lg sm:text-xl font-bold text-ghost-light tracking-wide">
          {t.graphTitle || 'RELATIONAL KNOWLEDGE GRAPH & MULTI-HOP AGENT'}
        </h2>
        <p className="text-xs font-mono text-ghost-dim max-w-2xl">
          {t.graphDesc || 'Chains sequential legal dependencies across Biodiversity clearance, Patent origin disclosure, CDSCO clinical standardization, and WIPO treaties.'}
        </p>
      </div>

      {/* Multi-Hop Query Input Panel */}
      <div className="hardware-panel corner-cross rounded-lg p-6 space-y-3 shadow-xl border border-surface-border">
        <label className="block schematic-tag text-ghost-dim">COMPOUND MULTI-JURISDICTION INQUIRY:</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={compoundQuery}
            onChange={(e) => setCompoundQuery(e.target.value)}
            className="flex-1 text-xs p-3 rounded border border-surface-border bg-surface-card text-ghost-light font-mono focus:border-tamra focus:outline-none"
          />
          <button
            onClick={handlePlan}
            disabled={isLoading}
            className="px-5 py-3 bg-tamra text-void font-bold text-xs font-mono rounded hover:bg-tamra-hover flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <span>{isLoading ? 'PLANNING_ROADMAP...' : (t.planRoadmapBtn || 'PLAN ROADMAP ◆')}</span>
          </button>
        </div>
      </div>

      {/* Sequential Execution Roadmap */}
      {agentPlan && agentPlan.roadmap_steps && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hardware-panel corner-cross rounded-lg p-6 space-y-4 shadow-xl border border-surface-border"
        >
          <div className="schematic-tag font-bold text-ghost-light border-b border-surface-border pb-2 flex items-center space-x-2">
            <Zap className="w-3.5 h-3.5 text-tamra" />
            <span>CHRONOLOGICAL SEQUENTIAL EXECUTION ROADMAP ({agentPlan.roadmap_steps.length} STAGES):</span>
          </div>

          <div className="space-y-3">
            {agentPlan.roadmap_steps.map((st, sIdx) => (
              <div key={sIdx} className="p-4 bg-void rounded border border-surface-border space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-dot text-tamra text-xs">[STAGE 0{st.step}]</span>
                    <span className="font-bold text-ghost-light">{st.stage}</span>
                  </div>
                  <span className="text-led-green text-[10px] font-bold">AUTHORITY::{st.authority}</span>
                </div>
                <div className="text-ghost-dark text-[11px]">
                  STATUTE::{st.statute} • <span className="font-statute text-ghost-dim">{st.section}</span>
                </div>
                <p className="text-ghost bg-surface-card p-2.5 rounded border border-surface-border font-sans text-xs mt-1">
                  {st.mandatory_action}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Schematic Knowledge Graph Blueprint Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
        <div className="hardware-panel corner-cross rounded-lg p-5 space-y-3 shadow-xl border border-surface-border">
          <div className="schematic-tag font-bold text-ghost-light border-b border-surface-border pb-2 flex items-center justify-between">
            <span>STATUTORY ENTITY NODES ({graphData.nodes.length})</span>
            <span className="text-tamra text-[9px]">SYS.SCHEMA</span>
          </div>
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 no-scrollbar">
            {graphData.nodes.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`w-full p-2.5 rounded border text-left text-xs transition-all flex items-center justify-between ${
                  selectedNode?.id === node.id
                    ? 'border-tamra bg-tamra-tint text-ghost-light font-bold'
                    : 'border-surface-border bg-surface-card hover:bg-surface-muted text-ghost-dim'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="font-dot text-[9px] text-tamra">▪</span>
                  <span className="truncate">{node.label}</span>
                </div>
                <span className="text-[9px] text-ghost-dark">[{node.type}]</span>
              </button>
            ))}
          </div>
        </div>

        <div className="hardware-panel corner-cross rounded-lg p-5 space-y-3 shadow-xl border border-surface-border">
          <div className="schematic-tag font-bold text-ghost-light border-b border-surface-border pb-2 flex items-center justify-between">
            <span>RELATIONAL EDGES: {selectedNode?.label}</span>
            <span className="text-led-green text-[9px]">ACTIVE_NODE</span>
          </div>
          <div className="space-y-2 text-xs max-h-72 overflow-y-auto pr-1 no-scrollbar">
            {selectedNode ? (
              graphData.edges
                .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
                .map((e, idx) => (
                  <div key={idx} className="p-2.5 bg-void rounded border border-surface-border flex items-center justify-between">
                    <span className="text-tamra font-bold text-[10px]">{e.relation}</span>
                    <span className="text-ghost-dim text-[11px]">
                      {e.source === selectedNode.id ? `→ ${e.target}` : `← ${e.source}`}
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-ghost-dark text-xs">Select a node on the left to inspect relational edges.</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
