import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Mic, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t, apiKeys, setApiKeys } = useApp();
  const [sttKey, setSttKey] = useState(apiKeys.sttApiKey);
  const [llmKey, setLlmKey] = useState(apiKeys.llmApiKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKeys({ sttApiKey: sttKey, llmApiKey: llmKey });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md glass-panel-glow rounded-2xl p-6 shadow-2xl relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-ayur-600/30 border border-ayur-400/40 flex items-center justify-center text-ayur-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t.settingsTitle}</h3>
              <p className="text-xs text-slate-400">{t.settingsSubtitle}</p>
            </div>
          </div>

          <div className="space-y-4 my-5">
            {/* Zero-setup badge */}
            <div className="p-3 rounded-xl bg-ayur-950/60 border border-ayur-500/30 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-ayur-400 shrink-0 mt-0.5" />
              <p className="text-xs text-ayur-200 leading-relaxed">
                Native voice recognition is <strong>active by default</strong> for English, Hindi, and Marathi via the Web Speech API. Adding an external key is purely optional for server-side Whisper processing.
              </p>
            </div>

            {/* STT Key Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-amber-400" />
                {t.sttApiKeyLabel}
              </label>
              <input
                type="password"
                value={sttKey}
                onChange={(e) => setSttKey(e.target.value)}
                placeholder={t.sttApiKeyPlaceholder}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-ayur-400 transition-colors"
              />
            </div>

            {/* LLM Key Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                {t.llmApiKeyLabel}
              </label>
              <input
                type="password"
                value={llmKey}
                onChange={(e) => setLlmKey(e.target.value)}
                placeholder={t.llmApiKeyPlaceholder}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-ayur-400 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-ayur-600 hover:bg-ayur-500 text-white text-xs font-bold transition-all shadow-md shadow-ayur-700/30 flex items-center gap-1.5"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200 animate-bounce" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>{t.saveSettingsBtn}</span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
