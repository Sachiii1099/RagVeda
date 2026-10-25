import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitFork, CheckCircle2, AlertTriangle, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface DependencyNode {
  id: string;
  label: string;
  category: string;
  status: 'completed' | 'warning' | 'required' | 'pending';
  details: string;
}

export interface DependencyEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  statutory_trigger?: string;
}

export interface DependencyGraphData {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

interface DependencyGraphProps {
  graphData: DependencyGraphData;
}

export const DependencyGraph: React.FC<DependencyGraphProps> = ({ graphData }) => {
  const { t } = useApp();
  const [selectedNode, setSelectedNode] = useState<DependencyNode | null>(graphData.nodes[0] || null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Satisfied
          </span>
        );
      case 'warning':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Statutory Scrutiny
          </span>
        );
      case 'required':
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-sky-400" />
            Mandatory Filing
          </span>
        );
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <GitFork className="w-5 h-5 text-ayur-400" />
            <span>{t.dashTabDependency}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Dynamic statutory link graph mapping Innovation attributes to regulatory and IP clearance gates.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Cleared
          </span>
          <span className="flex items-center gap-1 text-amber-400 ml-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Scrutiny
          </span>
          <span className="flex items-center gap-1 text-sky-400 ml-2">
            <span className="w-2 h-2 rounded-full bg-sky-400" /> Required
          </span>
        </div>
      </div>

      {/* Interactive Node Flow Display */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 py-4">
        {graphData.nodes.map((node, i) => {
          const isSelected = selectedNode?.id === node.id;

          return (
            <motion.div
              key={node.id}
              whileHover={{ y: -3 }}
              onClick={() => setSelectedNode(node)}
              className={`p-4 rounded-2xl cursor-pointer border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'glass-panel-glow border-ayur-400 ring-2 ring-ayur-400/40 bg-ayur-950/50'
                  : 'bg-slate-900/80 border-slate-700/60 hover:border-slate-500'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Node {i + 1}
                  </span>
                  {getStatusBadge(node.status)}
                </div>

                <h4 className="text-xs font-bold text-slate-100 leading-snug">
                  {node.label}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 text-[11px] text-slate-400">
                Click to inspect
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail panel of selected node */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-slate-900/90 border border-ayur-500/30 space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-ayur-400" />
              <h4 className="text-sm font-bold text-white">{selectedNode.label}</h4>
            </div>
            {getStatusBadge(selectedNode.status)}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedNode.details}
          </p>

          <div className="pt-2 text-[11px] text-slate-400 flex flex-wrap gap-4 border-t border-white/5">
            <span>Category: <strong className="text-slate-200 capitalize">{selectedNode.category}</strong></span>
            <span>Statutory Checkpoint: <strong className="text-amber-300">Verified Active</strong></span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
