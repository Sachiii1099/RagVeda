import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radar as RadarIcon, Eye, AlertTriangle, ShieldCheck, BookOpen, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface RadarNode {
  id: string;
  label: string;
  category: 'tk' | 'research' | 'patent' | 'regulatory' | 'innovation';
  similarity: number;
  distance: number;
  angle: number;
  source_title: string;
  section?: string;
  citation_id?: string;
  summary: string;
}

export interface RadarData {
  center_label: string;
  nodes: RadarNode[];
  max_similarity: number;
  high_risk_cluster: boolean;
}

interface PriorArtRadarProps {
  radarData: RadarData;
  onViewEvidence: (citationId?: string) => void;
}

export const PriorArtRadar: React.FC<PriorArtRadarProps> = ({ radarData, onViewEvidence }) => {
  const { t } = useApp();
  const [hoveredNode, setHoveredNode] = useState<RadarNode | null>(null);

  const centerX = 200;
  const centerY = 200;
  const maxRadius = 140;

  const getNodeColor = (cat: string) => {
    switch (cat) {
      case 'tk':
        return '#f59e0b'; // Amber
      case 'research':
        return '#38bdf8'; // Sky
      case 'patent':
        return '#a855f7'; // Purple
      case 'regulatory':
        return '#10b981'; // Emerald
      default:
        return '#22c55e';
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <RadarIcon className="w-5 h-5 text-amber-400" />
            <span>{t.radarTitle}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{t.radarSubtitle}</p>
        </div>

        {radarData.high_risk_cluster ? (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-500/40 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            High Overlap with Classical TKDL
          </span>
        ) : (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Clearance Space Detected
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Radar Chart */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="relative w-[340px] h-[340px] sm:w-[400px] sm:h-[400px]">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              {/* Concentric distance circles */}
              {[0.25, 0.5, 0.75, 1.0].map((frac, idx) => (
                <circle
                  key={idx}
                  cx={centerX}
                  cy={centerY}
                  r={maxRadius * frac}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1.5"
                  strokeDasharray={idx === 3 ? '0' : '4 4'}
                />
              ))}

              {/* Axis cross lines */}
              <line x1="200" y1="40" x2="200" y2="360" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1.5" />
              <line x1="40" y1="200" x2="360" y2="200" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1.5" />

              {/* Center Innovation Node */}
              <motion.circle
                cx={centerX}
                cy={centerY}
                r="18"
                fill="#22c55e"
                className="cursor-pointer"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              />
              <circle cx={centerX} cy={centerY} r="8" fill="#ffffff" />
              <text
                x={centerX}
                y={centerY + 32}
                textAnchor="middle"
                fill="#86efac"
                fontSize="11"
                fontWeight="bold"
              >
                {radarData.center_label.slice(0, 18)}
              </text>

              {/* Surrounding Nodes */}
              {radarData.nodes.map((node) => {
                const rad = (node.angle * Math.PI) / 180;
                // distance on radar: closer to center = higher similarity
                const r = maxRadius * (1.1 - node.similarity * 0.75);
                const nx = centerX + r * Math.cos(rad);
                const ny = centerY + r * Math.sin(rad);
                const color = getNodeColor(node.category);

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredNode(node)}
                    onClick={() => {
                      setHoveredNode(node);
                      onViewEvidence(node.citation_id);
                    }}
                  >
                    {/* Connecting line */}
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={nx}
                      y2={ny}
                      stroke={color}
                      strokeWidth="1.5"
                      strokeOpacity="0.4"
                    />

                    {/* Outer pulse */}
                    <circle
                      cx={nx}
                      cy={ny}
                      r="16"
                      fill={color}
                      fillOpacity="0.25"
                      className="group-hover:scale-125 transition-transform"
                    />
                    {/* Core node */}
                    <circle
                      cx={nx}
                      cy={ny}
                      r="9"
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    {/* Node label */}
                    <text
                      x={nx}
                      y={ny > centerY ? ny + 18 : ny - 12}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="10"
                      fontWeight="600"
                    >
                      {Math.round(node.similarity * 100)}% Sim
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected / Hovered Node Details */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10">
            {hoveredNode ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                    style={{
                      backgroundColor: `${getNodeColor(hoveredNode.category)}20`,
                      color: getNodeColor(hoveredNode.category),
                      border: `1px solid ${getNodeColor(hoveredNode.category)}50`,
                    }}
                  >
                    {hoveredNode.category.toUpperCase()} Reference
                  </span>
                  <span className="text-xs font-extrabold text-white">
                    {Math.round(hoveredNode.similarity * 100)}% Similarity
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-100">
                  {hoveredNode.label}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {hoveredNode.summary}
                </p>

                <div className="text-[11px] text-slate-400 pt-2 border-t border-white/5 space-y-1">
                  <p>Source: <span className="text-slate-200">{hoveredNode.source_title}</span></p>
                  {hoveredNode.section && <p>Section: <span className="text-slate-200">{hoveredNode.section}</span></p>}
                </div>

                <button
                  onClick={() => onViewEvidence(hoveredNode.citation_id)}
                  className="mt-3 w-full py-2 px-3 rounded-xl bg-ayur-600/80 hover:bg-ayur-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t.viewEvidenceBtn}</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs font-bold text-slate-300">Hover or click any node on the radar</p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Inspect overlap with Classical Treatises, Pharmacopoeia monographs, and Published Patent literature.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
