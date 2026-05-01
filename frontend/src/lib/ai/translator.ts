/**
 * Enhanced Translation Service
 * Supports bidirectional translation between English and Kannada
 */

export type Language = 'en' | 'kn';

interface TranslationCache {
  [key: string]: string;
}

class TranslationService {
  private cache: TranslationCache = {};
  private baseUrl = 'https://translate.googleapis.com/translate_a/single';

  /**
   * Translate text to target language
   */
  async translate(text: string, targetLang: Language): Promise<string> {
    if (!text.trim()) return '';

    const cacheKey = `${text}_${targetLang}`;
    if (this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }

    try {
      const sourceLang = targetLang === 'kn' ? 'en' : 'kn';
      const url = `${this.baseUrl}?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      if (Array.isArray(data) && data[0]) {
        const translated = data[0].map((item: unknown[]) => item[0] as string).join('');
        this.cache[cacheKey] = translated;
        return translated;
      }

      return text; // Return original if translation fails
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Fallback to original text
    }
  }

  /**
   * Translate to Kannada
   */
  async toKannada(text: string): Promise<string> {
    return this.translate(text, 'kn');
  }

  /**
   * Translate to English
   */
  async toEnglish(text: string): Promise<string> {
    return this.translate(text, 'en');
  }

  /**
   * Auto-detect language and translate
   */
  async autoTranslate(text: string): Promise<{ translated: string; detectedLang: Language }> {
    const isKannada = this.containsKannada(text);
    const targetLang: Language = isKannada ? 'en' : 'kn';
    const translated = await this.translate(text, targetLang);
    
    return {
      translated,
      detectedLang: isKannada ? 'kn' : 'en',
    };
  }

  /**
   * Check if text contains Kannada characters
   */
  containsKannada(text: string): boolean {
    const kannadaRegex = /[\u0C80-\u0CFF]/;
    return kannadaRegex.test(text);
  }

  /**
   * Detect language of text
   */
  detectLanguage(text: string): Language {
    return this.containsKannada(text) ? 'kn' : 'en';
  }

  /**
   * Clear translation cache
   */
  clearCache(): void {
    this.cache = {};
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return Object.keys(this.cache).length;
  }
}

// Export singleton instance
export const translationService = new TranslationService();

// Helper functions for backward compatibility
export async function translateToKannada(text: string): Promise<string> {
  return translationService.toKannada(text);
}

export async function translateToEnglish(text: string): Promise<string> {
  return translationService.toEnglish(text);
}

export function containsKannada(text: string): boolean {
  return translationService.containsKannada(text);
}
