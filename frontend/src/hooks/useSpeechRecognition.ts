/**
 * useSpeechRecognition Hook
 * Web Speech API integration for voice input
 * Supports both English and Kannada
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export type SpeechLanguage = 'en-IN' | 'kn-IN';

interface UseSpeechRecognitionOptions {
  language?: SpeechLanguage;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const {
    language = 'en-IN',
    continuous = false,
    interimResults = true,
    onResult,
    onError,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<SpeechLanguage>(language);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
    } else {
      setIsSupported(false);
      console.warn('Speech Recognition API not supported in this browser');
    }
  }, []);

  // Configure recognition
  useEffect(() => {
    if (!recognitionRef.current) return;

    const recognition = recognitionRef.current;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = currentLanguage;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setInterimTranscript('');
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptText = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcriptText + ' ';
        } else {
          interim += transcriptText;
        }
      }

      if (finalTranscript) {
        const fullTranscript = transcript + finalTranscript;
        setTranscript(fullTranscript);
        onResult?.(fullTranscript.trim());
      }

      setInterimTranscript(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      let errorMessage = 'Speech recognition error';
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone not accessible. Please check permissions.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please enable it in browser settings.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        default:
          errorMessage = event.message || errorMessage;
      }
      
      onError?.(errorMessage);
    };

    return () => {
      if (recognition) {
        recognition.onstart = null;
        recognition.onend = null;
        recognition.onresult = null;
        recognition.onerror = null;
      }
    };
  }, [continuous, interimResults, currentLanguage, transcript, onResult, onError]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      onError?.('Failed to start speech recognition');
    }
  }, [isListening, onError]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Failed to stop recognition:', error);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLanguage: SpeechLanguage = currentLanguage === 'en-IN' ? 'kn-IN' : 'en-IN';
    setCurrentLanguage(newLanguage);
    
    // If listening, restart with new language
    if (isListening) {
      stopListening();
      setTimeout(() => startListening(), 100);
    }
  }, [currentLanguage, isListening, startListening, stopListening]);

  const setLanguage = useCallback((lang: SpeechLanguage) => {
    setCurrentLanguage(lang);
    
    if (isListening) {
      stopListening();
      setTimeout(() => startListening(), 100);
    }
  }, [isListening, startListening, stopListening]);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    currentLanguage,
    startListening,
    stopListening,
    resetTranscript,
    toggleLanguage,
    setLanguage,
  };
}
