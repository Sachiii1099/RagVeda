import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Sparkles, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSpeechToText } from '../hooks/useSpeechToText';

interface InnovationIntakeProps {
  initialTitle?: string;
  initialDescription?: string;
  initialIntendedUse?: string;
  initialJurisdiction?: string;
  onSubmit: (formData: {
    title: string;
    description: string;
    intended_use: string;
    target_jurisdiction: string;
    commercial_intent: boolean;
  }) => void;
  isLoading: boolean;
}

export const InnovationIntake: React.FC<InnovationIntakeProps> = ({
  initialTitle = '',
  initialDescription = '',
  initialIntendedUse = '',
  initialJurisdiction = 'IN',
  onSubmit,
  isLoading,
}) => {
  const { t, lang, jurisdiction, setJurisdiction, apiKeys } = useApp();

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [intendedUse, setIntendedUse] = useState(initialIntendedUse);
  const [commercialIntent, setCommercialIntent] = useState(true);
  const [audioUploading, setAudioUploading] = useState(false);
  const [sttNotice, setSttNotice] = useState<string | null>(null);

  // Sync with prop updates (e.g. when demo case is clicked)
  useEffect(() => {
    if (initialTitle) setTitle(initialTitle);
    if (initialDescription) setDescription(initialDescription);
    if (initialIntendedUse) setIntendedUse(initialIntendedUse);
    if (initialJurisdiction) setJurisdiction(initialJurisdiction as 'IN' | 'INT');
  }, [initialTitle, initialDescription, initialIntendedUse, initialJurisdiction]);

  // Speech to Text hook
  const {
    isListening,
    transcript,
    error: sttError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText({
    lang,
    onTranscriptChange: (text) => {
      setDescription((prev) => {
        // If empty, set directly; else append
        if (!prev) return text;
        if (prev.endsWith(text)) return prev;
        return `${prev.trim()} ${text}`.trim();
      });
    },
  });

  const handleToggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  // Audio File Upload Fallback
  const handleAudioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioUploading(true);
    setSttNotice('Transcribing uploaded audio file...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', lang);

      const headers: Record<string, string> = {};
      if (apiKeys.sttApiKey) {
        headers['X-STT-Api-Key'] = apiKeys.sttApiKey;
      }

      const res = await fetch('/api/v1/stt/transcribe', {
        method: 'POST',
        headers,
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          setDescription((prev) => (prev ? `${prev}\n${data.text}` : data.text));
          setSttNotice(`Transcribed successfully via ${data.provider}`);
          setTimeout(() => setSttNotice(null), 4000);
        }
      }
    } catch (err) {
      console.error('Audio upload error:', err);
      setSttNotice('Failed to transcribe audio file.');
    } finally {
      setAudioUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSubmit({
      title,
      description,
      intended_use: intendedUse || 'Therapeutic treatment',
      target_jurisdiction: jurisdiction,
      commercial_intent: commercialIntent,
    });
  };

  return (
    <section id="intake-section" className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-ayur-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{t.intakeTitle}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {t.intakeSubtitle}
            </p>
          </div>

          {/* Voice Input Pulse Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleMic}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
                isListening
                  ? 'bg-rose-600 text-white shadow-rose-600/40 animate-pulse border border-rose-400'
                  : 'bg-ayur-950/80 hover:bg-ayur-900 text-ayur-300 border border-ayur-500/40 shadow-ayur-900/30'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 text-white animate-bounce" />
                  <span>{t.micListening}</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-amber-400" />
                  <span>{t.micClickToSpeak}</span>
                </>
              )}
            </button>

            {/* Audio upload button */}
            <label className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-slate-400" />
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Live Audio Visualizer when listening */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between overflow-hidden"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[0.4, 0.9, 0.5, 1, 0.7, 0.3, 0.8, 0.5].map((scale, i) => (
                    <motion.span
                      key={i}
                      animate={{ scaleY: [0.3, scale, 0.3] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        delay: i * 0.1,
                      }}
                      className="w-1 h-5 bg-rose-400 rounded-full inline-block"
                    />
                  ))}
                </div>
                <p className="text-xs font-semibold text-rose-200">
                  {t.micListening} ({lang.toUpperCase()})
                </p>
              </div>
              <span className="text-[11px] text-slate-400 italic">
                {transcript || 'Speak naturally about ingredients, process & novelty...'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Notices */}
        {sttNotice && (
          <div className="mb-4 p-3 rounded-xl bg-slate-900/90 border border-ayur-500/30 text-xs text-ayur-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-ayur-400 shrink-0" />
            <span>{sttNotice}</span>
          </div>
        )}
        {sttError && (
          <div className="mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{sttError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Innovation Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              {t.innovationTitleLabel}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.innovationTitlePlaceholder}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-ayur-400 transition-colors"
            />
          </div>

          {/* Detailed Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                {t.descriptionLabel}
              </label>
              <span className="text-[11px] text-slate-400">
                {t.micLanguageHint}
              </span>
            </div>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descriptionPlaceholder}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-ayur-400 transition-colors resize-y"
            />
          </div>

          {/* Intended Use & Commercial Intent Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {t.intendedUseLabel}
              </label>
              <input
                type="text"
                value={intendedUse}
                onChange={(e) => setIntendedUse(e.target.value)}
                placeholder={t.intendedUsePlaceholder}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-ayur-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {t.targetJurisdictionLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setJurisdiction('IN')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    jurisdiction === 'IN'
                      ? 'bg-ayur-600 text-white border-ayur-400 shadow-md shadow-ayur-700/30'
                      : 'bg-slate-900/70 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  🇮🇳 India (AYUSH/NBA)
                </button>
                <button
                  type="button"
                  onClick={() => setJurisdiction('INT')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    jurisdiction === 'INT'
                      ? 'bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-700/30'
                      : 'bg-slate-900/70 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  🌍 International (WIPO/FDA)
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading || !title.trim() || !description.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-ayur-600 to-ayur-700 hover:from-ayur-500 hover:to-ayur-600 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-ayur-700/30 border border-ayur-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.analyzingLoading}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{t.generateFingerprintCta}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
