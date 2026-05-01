/**
 * Enhanced AI Agent with all requested features:
 * 1. Typing animation for responses
 * 2. Voice input (Web Speech API) - Kannada + English
 * 3. Bilingual toggle with auto-translation
 * 4. "AI is thinking..." animation
 * 5. Graceful error handling
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { airAgent, ChatMessage } from '@/lib/ai/airAgent';
import { translationService } from '@/lib/ai/translator';
import { useSpeechRecognition, SpeechLanguage } from '@/hooks/useSpeechRecognition';
import { 
  Mic, 
  MicOff, 
  Globe, 
  AlertCircle, 
  Sparkles,
  Volume2,
  Send
} from 'lucide-react';

type LocalChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  originalContent?: string; // Store original before translation
  createdAt: string;
  isTyping?: boolean;
};

function generateId(): string {
  return Math.random().toString(36).slice(2);
}

// Typing Animation Component
function TypingMessage({ content, onComplete }: { content: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); // 30ms per character for smooth typing

      return () => clearTimeout(timer);
    } else if (currentIndex === content.length && currentIndex > 0) {
      onComplete?.();
    }
  }, [currentIndex, content, onComplete]);

  return (
    <span>
      {displayedText}
      {currentIndex < content.length && (
        <motion.span
          className="inline-block w-0.5 h-4 bg-leaf-600 ml-0.5"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </span>
  );
}

// AI Thinking Animation
function AIThinking() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-lg px-4 py-3 bg-slate-50 shadow-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <Sparkles className="h-4 w-4 text-leaf-600 animate-pulse" />
          <span className="text-sm">AI is thinking</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 bg-leaf-600 rounded-full"
                animate={{ y: [-3, 0, -3] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Error Message Component
function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex justify-start"
    >
      <div className="max-w-[80%] rounded-lg px-4 py-3 bg-red-50 border border-red-200 shadow-sm">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800">{message}</p>
            {onRetry && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                className="mt-2 text-xs border-red-300 text-red-700 hover:bg-red-100"
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function EnhancedAirAgent() {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<LocalChatMessage[]>(() => {
    try {
      const raw = localStorage.getItem('airagent_chat_messages');
      return raw ? (JSON.parse(raw) as LocalChatMessage[]) : [];
    } catch {
      return [];
    }
  });
  const [isTranslateMode, setIsTranslateMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'kn'>('en');
  const [error, setError] = useState<string | null>(null);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  
  const listRef = useRef<HTMLDivElement | null>(null);

  // Speech Recognition
  const {
    isSupported: isSpeechSupported,
    isListening,
    transcript,
    interimTranscript,
    currentLanguage: speechLang,
    startListening,
    stopListening,
    resetTranscript,
    setLanguage: setSpeechLanguage,
  } = useSpeechRecognition({
    language: currentLanguage === 'kn' ? 'kn-IN' : 'en-IN',
    onResult: (text) => {
      setInput(text);
      stopListening();
    },
    onError: (errorMsg) => {
      toast({
        title: 'Voice Input Error',
        description: errorMsg,
        variant: 'destructive',
      });
    },
  });

  // Sync speech language with current language
  useEffect(() => {
    const speechLangMap: Record<'en' | 'kn', SpeechLanguage> = {
      'en': 'en-IN',
      'kn': 'kn-IN',
    };
    setSpeechLanguage(speechLangMap[currentLanguage]);
  }, [currentLanguage, setSpeechLanguage]);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('airagent_chat_messages', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, sending]);

  // Handle voice input toggle
  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  // Handle language toggle
  const handleLanguageToggle = () => {
    const newLang = currentLanguage === 'en' ? 'kn' : 'en';
    setCurrentLanguage(newLang);
    
    toast({
      title: `Switched to ${newLang === 'kn' ? 'ಕನ್ನಡ' : 'English'}`,
      description: newLang === 'kn' 
        ? 'ಈಗ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಬಹುದು' 
        : 'You can now chat in English',
    });
  };

  // Send message with enhanced features
  const sendMessage = async (messageToSend?: string) => {
    const trimmed = (messageToSend || input).trim();
    if (!trimmed) return;

    setError(null);
    setSending(true);
    
    const userMsg: LocalChatMessage = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setRetryMessage(null);

    try {
      // Translate user message if needed
      let messageToAI = trimmed;
      if (isTranslateMode && currentLanguage === 'kn') {
        messageToAI = await translationService.toEnglish(trimmed);
      }

      const history: ChatMessage[] = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.originalContent || m.content,
      }));

      const answer = await airAgent.sendMessage(history, 'Karnataka');

      // Translate AI response if needed
      let displayAnswer = answer;
      if (isTranslateMode && currentLanguage === 'kn') {
        displayAnswer = await translationService.toKannada(answer);
      }

      const assistantMsg: LocalChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: displayAnswer,
        originalContent: answer,
        createdAt: new Date().toISOString(),
        isTyping: true,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Mark typing complete after animation
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id ? { ...m, isTyping: false } : m
          )
        );
      }, answer.length * 30 + 500);

    } catch (error) {
      const err = error as { message?: string };
      const errorMessage = getErrorMessage(err);
      
      setError(errorMessage);
      setRetryMessage(trimmed);

      // Add error message to chat
      const errorMsg: LocalChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: errorMessage,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);

      toast({
        title: currentLanguage === 'kn' ? 'ದೋಷ' : 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  // Get friendly error messages
  const getErrorMessage = (error: { message?: string }): string => {
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('network') || message.includes('fetch')) {
      return currentLanguage === 'kn'
        ? 'ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಇಲ್ಲ. ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ.'
        : 'No internet connection. Please check and try again.';
    }
    
    if (message.includes('timeout')) {
      return currentLanguage === 'kn'
        ? 'ಸಮಯ ಮೀರಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'
        : 'Request timed out. Please try again.';
    }
    
    if (message.includes('api') || message.includes('key')) {
      return currentLanguage === 'kn'
        ? 'AI ಸೇವೆ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ.'
        : 'AI service unavailable. Please try again later.';
    }
    
    return currentLanguage === 'kn'
      ? 'ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'
      : 'Something went wrong. Please try again.';
  };

  // Handle retry
  const handleRetry = () => {
    if (retryMessage) {
      sendMessage(retryMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  // Clear chat
  const clearChat = () => {
    setMessages([]);
    setError(null);
    setRetryMessage(null);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {currentLanguage === 'kn' ? 'AI ಸಹಾಯಕ' : 'AI Agent'}
            </h1>
            <p className="text-gray-600 mt-2">
              {currentLanguage === 'kn'
                ? 'ಕರ್ನಾಟಕ ರೈತರಿಗೆ AI-ಚಾಲಿತ ಕೃಷಿ ಸಹಾಯಕ'
                : 'Your AI-powered agricultural assistant for Karnataka farmers'}
            </p>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLanguageToggle}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {currentLanguage === 'kn' ? 'English' : 'ಕನ್ನಡ'}
            </Button>
            
            <Badge variant={isTranslateMode ? 'default' : 'secondary'} className="cursor-pointer" onClick={() => setIsTranslateMode(!isTranslateMode)}>
              {isTranslateMode ? 'Auto-translate ON' : 'Auto-translate OFF'}
            </Badge>
          </div>
        </div>

        {/* Chat Card */}
        <Card className="shadow-soft-lg">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-leaf-600" />
                {currentLanguage === 'kn' ? 'ಸಂವಾದ' : 'Conversation'}
              </CardTitle>
              
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  Clear Chat
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages Area */}
            <div
              ref={listRef}
              className="h-[55vh] overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-white to-slate-50"
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles className="h-12 w-12 text-leaf-600 mb-4 opacity-50" />
                  <p className="text-sm text-gray-500 mb-2">
                    {currentLanguage === 'kn'
                      ? 'ಇನ್ನೂ ಸಂದೇಶಗಳಿಲ್ಲ. ಹಲೋ ಎಂದು ಹೇಳಿ!'
                      : 'No messages yet. Say hello!'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {currentLanguage === 'kn'
                      ? 'ಬೆಳೆಗಳು, ಹವಾಮಾನ ಅಥವಾ ಕೃಷಿ ಸಲಹೆ ಕುರಿತು ಕೇಳಿ'
                      : 'Ask about crops, weather, or farming advice'}
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {messages.map((m, index) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                    >
                      {m.role === 'user' ? (
                        <div className="max-w-[80%] rounded-lg rounded-tr-sm px-4 py-2.5 bg-gradient-to-br from-leaf-600 to-leaf-700 text-white shadow-md">
                          <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                        </div>
                      ) : m.content.includes('ದೋಷ') || m.content.includes('Error') || m.content.includes('wrong') ? (
                        <ErrorMessage 
                          message={m.content} 
                          onRetry={index === messages.length - 1 ? handleRetry : undefined}
                        />
                      ) : (
                        <div className="max-w-[80%] rounded-lg rounded-tl-sm px-4 py-3 bg-slate-50 shadow-sm border border-slate-100">
                          <p className="text-sm text-gray-800 whitespace-pre-wrap">
                            {m.isTyping ? (
                              <TypingMessage content={m.content} />
                            ) : (
                              m.content
                            )}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {sending && <AIThinking />}
                </AnimatePresence>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white">
              {/* Voice feedback */}
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 p-2 bg-leaf-50 rounded-lg border border-leaf-200"
                >
                  <div className="flex items-center gap-2 text-sm text-leaf-700">
                    <Volume2 className="h-4 w-4 animate-pulse" />
                    <span>
                      {currentLanguage === 'kn' ? 'ಆಲಿಸುತ್ತಿದೆ...' : 'Listening...'}
                    </span>
                    {interimTranscript && (
                      <span className="text-leaf-600 italic">"{interimTranscript}"</span>
                    )}
                  </div>
                </motion.div>
              )}

              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    currentLanguage === 'kn'
                      ? 'ಬೆಳೆಗಳು, ಹವಾಮಾನ ಅಥವಾ ಕೃಷಿ ಸಲಹೆ ಕುರಿತು ಕೇಳಿ...'
                      : 'Ask about crops, weather, or farming advice...'
                  }
                  disabled={sending || isListening}
                  className="flex-1 input-field"
                />

                {/* Voice Input Button */}
                {isSpeechSupported && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleVoiceToggle}
                    disabled={sending}
                    className={isListening ? 'bg-red-50 border-red-300' : ''}
                  >
                    {isListening ? (
                      <MicOff className="h-4 w-4 text-red-600" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                )}

                {/* Send Button */}
                <Button
                  onClick={() => sendMessage()}
                  disabled={sending || !input.trim()}
                  className="btn-primary min-w-[100px]"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      {currentLanguage === 'kn' ? 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ' : 'Sending'}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {currentLanguage === 'kn' ? 'ಕಳುಹಿಸಿ' : 'Send'}
                    </>
                  )}
                </Button>
              </div>

              {/* Helper text */}
              <p className="text-xs text-slate-500 mt-2">
                {currentLanguage === 'kn'
                  ? '💡 ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬಳಸಲು ಮೈಕ್ ಒತ್ತಿರಿ'
                  : '💡 Press the mic button to use voice input'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
