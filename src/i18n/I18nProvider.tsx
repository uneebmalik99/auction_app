import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { I18nManager } from 'react-native';
import { getItem, saveItem } from '../utils/methods';
import { translations, type Language } from './translations';

const STORAGE_KEY = 'app_language';

export type I18nContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
};

export const I18nContext = createContext<I18nContextValue>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  isRTL: false,
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

  // Set RTL when language changes
  useEffect(() => {
    const isRTL = language === 'ar';
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
      I18nManager.allowRTL(isRTL);
      // On Android, we need to restart the app for RTL to take effect
      // On iOS, it should work immediately
      if (require('react-native').Platform.OS === 'android') {
        // Note: This requires app restart on Android
        // For a better UX, you might want to show a message to restart
      }
    }
  }, [language]);

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

  const isRTL = language === 'ar';

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      isRTL,
    }),
    [language, setLanguage, t, isRTL],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
