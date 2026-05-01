export async function translateToKannada(text: string): Promise<string> {
  if (!text) return '';
  try {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=kn&dt=t&q=' + encodeURIComponent(text);
    const res = await fetch(url);
    if (!res.ok) return '';
    const data = await res.json();
    // The response format is nested arrays; join the translated pieces
    if (Array.isArray(data)) {
      return data[0].map((item: unknown[]) => item[0] as string).join('') || '';
    }
    return '';
  } catch (e) {
    console.warn('Translate error', e);
    return '';
  }
}
