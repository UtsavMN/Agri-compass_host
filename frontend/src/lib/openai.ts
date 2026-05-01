import { ChatMessage } from './chatbot';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = import.meta.env.VITE_OPENAI_API_URL || 'https://api.openai.com/v1';
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'gpt-3.5-turbo';

if (!OPENAI_API_KEY) {
  console.error('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file');
}

export async function sendToOpenAI(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw error;
  }
}