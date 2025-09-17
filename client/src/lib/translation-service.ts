// Translation service for real-time language translation
import { getTranslation, staticTranslations } from './static-translations';

export interface TranslationCache {
  [key: string]: {
    [languageCode: string]: string;
  };
}

class TranslationService {
  private cache: TranslationCache = {};
  private currentLanguage: string = 'en';
  private isTranslating: boolean = false;
  private listeners: Array<(language: string) => void> = [];
  private translationTimeout: NodeJS.Timeout | null = null;
  private lastTranslationTime: number = 0;

  constructor() {
    // Initialize language from localStorage
    try {
      this.currentLanguage = localStorage.getItem('apnamaan_language') || 'en';
    } catch {
      this.currentLanguage = 'en';
    }
  }

  // Get stored language from localStorage
  private getStoredLanguage(): string {
    try {
      return localStorage.getItem('apnamaan_language') || 'en';
    } catch {
      return 'en';
    }
  }

  // Store language selection in localStorage
  private setStoredLanguage(languageCode: string): void {
    try {
      localStorage.setItem('apnamaan_language', languageCode);
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  // Add listener for language changes
  addLanguageChangeListener(listener: (language: string) => void): () => void {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners of language change
  private notifyLanguageChange(language: string): void {
    this.listeners.forEach(listener => {
      try {
        listener(language);
      } catch (error) {
        console.warn('Language change listener error:', error);
      }
    });
  }

  // Language code mappings for Google Translate API
  private languageMap: { [key: string]: string } = {
    'en': 'en',
    'hi': 'hi', 
    'bn': 'bn',
    'ta': 'ta',
    'gu': 'gu'
  };

  setCurrentLanguage(languageCode: string) {
    this.currentLanguage = languageCode;
    this.setStoredLanguage(languageCode);
    this.notifyLanguageChange(languageCode);
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  // Translate text using static translations with API fallback
  async translateText(text: string, targetLanguage: string): Promise<string> {
    if (!text || text.trim() === '') return text;
    if (targetLanguage === 'en') return text;

    const trimmedText = text.trim();
    const cacheKey = trimmedText.toLowerCase();

    // Check cache first
    if (this.cache[cacheKey] && this.cache[cacheKey][targetLanguage]) {
      return this.cache[cacheKey][targetLanguage];
    }

    // Try static translations first (instant and reliable)
    const staticTranslation = getTranslation(trimmedText, targetLanguage);
    if (staticTranslation !== trimmedText) {
      // Cache the static translation
      if (!this.cache[cacheKey]) {
        this.cache[cacheKey] = {};
      }
      this.cache[cacheKey][targetLanguage] = staticTranslation;
      return staticTranslation;
    }

    // Fallback to server-side translation or basic text replacement patterns
    // For Hindi, try common English to Hindi word replacements
    if (targetLanguage === 'hi') {
      const commonTranslations: { [key: string]: string } = {
        'Home': 'होम',
        'Chat': 'चैट',
        'Profile': 'प्रोफाइल',
        'Settings': 'सेटिंग्स',
        'Help': 'सहायता',
        'Support': 'समर्थन',
        'Mental Health': 'मानसिक स्वास्थ्य',
        'Doctor': 'डॉक्टर',
        'Screening': 'जांच',
        'Resources': 'संसाधन',
        'Community': 'समुदाय',
        'Dashboard': 'डैशबोर्ड'
      };
      
      // Check for exact matches in common translations
      if (commonTranslations[trimmedText]) {
        // Cache the translation
        if (!this.cache[cacheKey]) {
          this.cache[cacheKey] = {};
        }
        this.cache[cacheKey][targetLanguage] = commonTranslations[trimmedText];
        return commonTranslations[trimmedText];
      }
    }
    
    // If no translation found, return original text
    return text;

    // TODO: Implement server-side translation endpoint if needed for dynamic content
    /*
    try {
      // Use Google Translate via CORS proxy
      const encodedText = encodeURIComponent(text);
      const targetLang = this.languageMap[targetLanguage] || targetLanguage;
      
      // Try direct API call (may fail due to CORS)
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodedText}`;
      const response = await fetch(url);
      const result = await response.json();
      
      if (result && result[0] && result[0][0] && result[0][0][0]) {
        const translatedText = result[0][0][0];
        
        // Cache the translation
        if (!this.cache[cacheKey]) {
          this.cache[cacheKey] = {};
        }
        this.cache[cacheKey][targetLanguage] = translatedText;
        
        return translatedText;
      }
      
      return text;
    } catch (error) {
      return text; // Return original text on error
    }
    */
  }

  // Translate all text nodes in the page
  async translatePage(targetLanguage: string) {
    if (this.isTranslating || targetLanguage === 'en') return;
    
    this.isTranslating = true;
    this.currentLanguage = targetLanguage;
    this.lastTranslationTime = Date.now();

    console.log('Starting page translation to:', targetLanguage);

    try {
      // Get all text nodes in the document
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            // Skip script, style, and other non-visible elements
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            
            const tagName = parent.tagName.toLowerCase();
            if (['script', 'style', 'noscript'].includes(tagName)) {
              return NodeFilter.FILTER_REJECT;
            }
            
            // Skip empty or whitespace-only text nodes
            const text = node.textContent?.trim();
            if (!text || text.length < 2) {
              return NodeFilter.FILTER_REJECT;
            }
            
            // Skip text that looks like code or contains special characters
            if (/^[0-9\s\W]*$/.test(text) || /^[{}[\]();,.\-_+=]*$/.test(text)) {
              return NodeFilter.FILTER_REJECT;
            }
            
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      const textNodes: Text[] = [];
      let node;
      
      // Collect all text nodes
      while (node = walker.nextNode()) {
        textNodes.push(node as Text);
      }

      // Translate text nodes in batches to avoid overwhelming the API
      const batchSize = 10;
      for (let i = 0; i < textNodes.length; i += batchSize) {
        const batch = textNodes.slice(i, i + batchSize);
        
        await Promise.all(
          batch.map(async (textNode) => {
            const originalText = textNode.textContent;
            if (originalText) {
              try {
                const translatedText = await this.translateText(originalText, targetLanguage);
                if (translatedText !== originalText) {
                  textNode.textContent = translatedText;
                }
              } catch (error) {
                console.warn('Failed to translate text:', originalText, error);
              }
            }
          })
        );
        
        // Small delay between batches to avoid overwhelming the UI
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      console.log('Page translation completed for:', targetLanguage);
    } catch (error) {
      console.error('Page translation failed:', error);
    } finally {
      this.isTranslating = false;
    }
  }

  // Reset page to English
  async resetToEnglish() {
    if (this.currentLanguage === 'en') return;
    
    // Reload the page to reset to original English text
    window.location.reload();
  }

  isCurrentlyTranslating(): boolean {
    return this.isTranslating;
  }

  // Auto-translate current page if language is not English
  async autoTranslateIfNeeded() {
    if (this.currentLanguage === 'en' || this.isTranslating) {
      return;
    }

    // Clear any existing timeout
    if (this.translationTimeout) {
      clearTimeout(this.translationTimeout);
    }

    // Debounce translation to prevent too frequent calls
    const now = Date.now();
    const timeSinceLastTranslation = now - this.lastTranslationTime;
    const minimumDelay = 1500; // Wait at least 1.5 seconds between translations

    if (timeSinceLastTranslation < minimumDelay) {
      // Schedule translation for later
      this.translationTimeout = setTimeout(() => {
        this.translatePage(this.currentLanguage);
      }, minimumDelay - timeSinceLastTranslation);
    } else {
      // Translate immediately but with a small delay to let DOM settle
      this.translationTimeout = setTimeout(() => {
        this.translatePage(this.currentLanguage);
      }, 500);
    }
  }

  // Check if auto-translation is needed
  shouldAutoTranslate(): boolean {
    return this.currentLanguage !== 'en';
  }

  // Clear translation cache
  clearCache() {
    this.cache = {};
  }
}

export const translationService = new TranslationService();