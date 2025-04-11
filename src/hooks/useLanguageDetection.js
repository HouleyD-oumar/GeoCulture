import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguageDetection = () => {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    // Check if user has a saved language preference
    const savedLanguage = localStorage.getItem('language');
    
    if (savedLanguage) {
      // Use saved language preference
      i18n.changeLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLanguage = navigator.language.split('-')[0]; // Get language code (e.g., 'en' from 'en-US')
      
      // Check if browser language is supported
      const supportedLanguages = ['en', 'fr', 'es']; // Add all supported languages
      
      if (supportedLanguages.includes(browserLanguage)) {
        i18n.changeLanguage(browserLanguage);
        localStorage.setItem('language', browserLanguage);
      } else {
        // Default to English if browser language is not supported
        i18n.changeLanguage('en');
        localStorage.setItem('language', 'en');
      }
    }
  }, [i18n]);
};

export default useLanguageDetection;