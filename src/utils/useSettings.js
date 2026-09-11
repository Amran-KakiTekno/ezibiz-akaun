import { useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const THEME_KEY = 'ezibiz_theme';
const LANG_KEY = 'ezibiz_lang';

export function useSettings() {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
    }
    return 'light'; // Default: Light theme
  });

  const [language, setLanguageState] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LANG_KEY);
      if (stored === 'ms' || stored === 'en') return stored;
    }
    return 'en'; // Default: English
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.warn('Unable to persist theme', e);
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, language);
    } catch (e) {
      console.warn('Unable to persist language', e);
    }
  }, [language]);

  const setTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setThemeState(newTheme);
    }
  };

  const setLanguage = (newLang) => {
    if (newLang === 'en' || newLang === 'ms') {
      setLanguageState(newLang);
    }
  };

  const t = (key, params = {}) => {
    const langDict = translations[language] || translations.en;
    let str = langDict[key] || translations.en[key] || key;
    Object.keys(params).forEach(p => {
      str = str.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
    });
    return str;
  };

  return {
    theme,
    setTheme,
    language,
    setLanguage,
    t
  };
}
