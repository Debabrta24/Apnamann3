// Translation service for real-time language translation
export interface TranslationCache {
  [key: string]: {
    [languageCode: string]: string;
  };
}

class TranslationService {
  private cache: TranslationCache = {};
  private currentLanguage: string = 'en';
  private isTranslating: boolean = false;

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
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  // Translate text using Google Translate (free tier) with CORS proxy
  async translateText(text: string, targetLanguage: string): Promise<string> {
    if (!text || text.trim() === '') return text;
    if (targetLanguage === 'en') return text;

    // Check cache first
    const cacheKey = text.trim().toLowerCase();
    if (this.cache[cacheKey] && this.cache[cacheKey][targetLanguage]) {
      return this.cache[cacheKey][targetLanguage];
    }

    try {
      // Use Google Translate via CORS proxy
      const encodedText = encodeURIComponent(text);
      const targetLang = this.languageMap[targetLanguage] || targetLanguage;
      
      // Try multiple translation endpoints
      const endpoints = [
        `https://api.allorigins.win/get?url=${encodeURIComponent(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodedText}`)}`,
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodedText}`
      ];
      
      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            }
          });
          
          if (!response.ok) continue;
          
          let result;
          if (url.includes('allorigins.win')) {
            const data = await response.json();
            result = JSON.parse(data.contents);
          } else {
            result = await response.json();
          }
          
          if (result && result[0] && result[0][0] && result[0][0][0]) {
            const translatedText = result[0][0][0];
            
            // Cache the translation
            if (!this.cache[cacheKey]) {
              this.cache[cacheKey] = {};
            }
            this.cache[cacheKey][targetLanguage] = translatedText;
            
            return translatedText;
          }
        } catch (endpointError) {
          console.warn(`Translation endpoint failed: ${url}`, endpointError);
          continue;
        }
      }
      
      return text; // Return original text if all endpoints fail
    } catch (error) {
      console.warn('Translation failed:', error);
      return text; // Return original text on error
    }
  }

  // Translate all text nodes in the page
  async translatePage(targetLanguage: string) {
    if (this.isTranslating || targetLanguage === 'en') return;
    
    this.isTranslating = true;
    this.currentLanguage = targetLanguage;

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
        
        // Small delay between batches to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
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

  // Clear translation cache
  clearCache() {
    this.cache = {};
  }
}

export const translationService = new TranslationService();