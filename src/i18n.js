import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

// Configuration for translations
i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fr',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    },
    backend: {
      // Fix the loadPath to use the correct public directory structure with Vite
      loadPath: '/src/locales/{{lng}}/{{ns}}.json'
    },
    react: {
      useSuspense: false // This can help with context errors
    }
  });

export default i18n;