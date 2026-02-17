import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getItem, saveItem } from '../utils/methods';
import { translations, type Language } from './translations';

const STORAGE_KEY = 'app_language';

export type I18nContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

export const I18nContext = createContext<I18nContextValue>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

function detectInitialLanguage(): Language {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale || 'en';
    return locale.toLowerCase().startsWith('ar') ? 'ar' : 'en';
  } catch (e) {
    return 'en';
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectInitialLanguage());

  useEffect(() => {
    (async () => {
      const stored = await getItem<Language>(STORAGE_KEY);
      if (stored === 'en' || stored === 'ar') {
        setLanguageState(stored);
      }
    })();
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    saveItem(STORAGE_KEY, lang);
  }, []);

  const t = useCallback(
    (key: string) => {
      return translations[language]?.[key] ?? translations.en[key] ?? key;
    },
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
