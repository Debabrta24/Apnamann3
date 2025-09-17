import { useState, useEffect, useCallback } from 'react';
import { translationService } from '@/lib/translation-service';
import { getTranslation } from '@/lib/static-translations';

/**
 * React hook for handling translations with automatic re-rendering
 * when language changes. This replaces the DOM-based translation approach
 * with a React-friendly solution.
 */
export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState(() => 
    translationService.getCurrentLanguage()
  );

  // Listen for language changes and trigger re-renders
  useEffect(() => {
    const unsubscribe = translationService.addLanguageChangeListener((language) => {
      setCurrentLanguage(language);
    });

    return unsubscribe;
  }, []);

  // Function to get translated text
  const t = useCallback(async (text: string, targetLanguage?: string): Promise<string> => {
    const language = targetLanguage || currentLanguage;
    if (!text || language === 'en') return text;
    
    return await translationService.translateText(text, language);
  }, [currentLanguage]);

  // Synchronous function for static translations (for immediate use in components)
  const ts = useCallback((text: string, targetLanguage?: string): string => {
    const language = targetLanguage || currentLanguage;
    if (!text || language === 'en') return text;
    
    // Use the imported getTranslation function
    return getTranslation(text, language);
  }, [currentLanguage]);

  // Function to change language
  const changeLanguage = useCallback(async (languageCode: string) => {
    translationService.setCurrentLanguage(languageCode);
    // Note: We don't need to call translatePage anymore since components
    // will re-render automatically with the new translations
  }, []);

  return {
    currentLanguage,
    t,        // Async translation function
    ts,       // Sync translation function for static translations
    changeLanguage,
    isTranslating: translationService.isCurrentlyTranslating()
  };
}

