import { useState, useEffect, useRef } from 'react';
import { Language } from '../i18n/translations';

interface UseSpeechToTextProps {
  lang: Language;
  onTranscriptChange?: (text: string) => void;
}

export const useSpeechToText = ({ lang, onTranscriptChange }: UseSpeechToTextProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Map app language to BCP 47 language tag
  const getLanguageTag = (l: Language): string => {
    switch (l) {
      case 'hi':
        return 'hi-IN';
      case 'mr':
        return 'mr-IN';
      case 'ta':
        return 'ta-IN';
      case 'te':
        return 'te-IN';
      case 'gu':
        return 'gu-IN';
      case 'kn':
        return 'kn-IN';
      case 'ml':
        return 'ml-IN';
      case 'bn':
        return 'bn-IN';
      case 'en':
      default:
        return 'en-IN';
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Web Speech API is not supported in this browser. Please use Chrome, Edge, or upload audio.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = getLanguageTag(lang);

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        currentTranscript += text;
      }
      setTranscript(currentTranscript);
      if (onTranscriptChange && currentTranscript.trim()) {
        onTranscriptChange(currentTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition event:', event.error);
      if (event.error !== 'no-speech') {
        setError(`Speech error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [lang]);

  const startListening = () => {
    setError(null);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = getLanguageTag(lang);
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err: any) {
        console.error('Error starting speech recognition:', err);
        setError('Could not start microphone. Please check browser permissions.');
      }
    } else {
      setError('Speech recognition not available.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      setIsListening(false);
    }
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
};
