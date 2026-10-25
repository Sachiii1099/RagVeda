import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, TranslationDict } from '../i18n/translations';

interface ApiKeys {
  sttApiKey: string;
  llmApiKey: string;
}

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationDict;
  jurisdiction: 'IN' | 'INT';
  setJurisdiction: (j: 'IN' | 'INT') => void;
  apiKeys: ApiKeys;
  setApiKeys: (keys: ApiKeys) => void;
  activeCitation: any | null;
  setActiveCitation: (c: any | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');
  const [jurisdiction, setJurisdiction] = useState<'IN' | 'INT'>('IN');
  const [activeCitation, setActiveCitation] = useState<any | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKeys>(() => {
    const saved = localStorage.getItem('ipsakti_api_keys');
    return saved ? JSON.parse(saved) : { sttApiKey: '', llmApiKey: '' };
  });

  useEffect(() => {
    localStorage.setItem('ipsakti_api_keys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  const t = translations[lang] || translations.en;

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        jurisdiction,
        setJurisdiction,
        apiKeys,
        setApiKeys,
        activeCitation,
        setActiveCitation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
};
