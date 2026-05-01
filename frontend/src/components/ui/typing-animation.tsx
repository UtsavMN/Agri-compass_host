/**
 * Typing Animation Components for AI Chat
 * Simulates human-like typing effect for AI responses
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// ============================================
// TYPING ANIMATION - REACT
// ============================================

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  showCursor?: boolean;
}

/**
 * Typewriter Effect - Character by character typing animation
 * @example
 * <Typewriter 
 *   text="Hello, I'm your AI farming assistant!" 
 *   speed={50}
 *   onComplete={() => console.log('Done')}
 * />
 */
export function Typewriter({ 
  text, 
  speed = 50, 
  onComplete,
  className = '',
  showCursor = true
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && isTyping && (
        <motion.span
          className="inline-block w-0.5 h-5 bg-leaf-600 ml-0.5"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </span>
  );
}

/**
 * AI Message Typewriter - Full featured AI message with avatar and typing effect
 */
interface AIMessageProps {
  message: string;
  speed?: number;
  showAvatar?: boolean;
  onComplete?: () => void;
}

export function AIMessage({ 
  message, 
  speed = 30,
  showAvatar = true,
  onComplete 
}: AIMessageProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const timer = setInterval(() => {
      if (index < message.length) {
        setDisplayedText((prev) => prev + message.charAt(index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [message, speed, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 items-start"
    >
      {showAvatar && (
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-leaf-500 to-leaf-700 flex items-center justify-center text-white font-semibold flex-shrink-0">
          AI
        </div>
      )}
      <div className="flex-1 bg-slate-50 rounded-2xl rounded-tl-sm px-4 py-3">
        <p className="text-slate-800 whitespace-pre-wrap">
          {displayedText}
          {isTyping && (
            <motion.span
              className="inline-block w-1 h-4 bg-leaf-600 ml-0.5"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Typing Indicator - Three dots typing animation
 */
export function TypingIndicator({ className = '' }: { className?: string }) {
  return (
    <div className={`flex gap-3 items-start ${className}`}>
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-leaf-500 to-leaf-700 flex items-center justify-center text-white font-semibold">
        AI
      </div>
      <div className="bg-slate-50 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 bg-slate-400 rounded-full"
              animate={{
                y: [-3, 0, -3],
              }}
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
  );
}

/**
 * Progressive Text Reveal - Reveal text word by word
 */
interface ProgressiveRevealProps {
  text: string;
  delay?: number;
  className?: string;
}

export function ProgressiveReveal({ 
  text, 
  delay = 100,
  className = ''
}: ProgressiveRevealProps) {
  const words = text.split(' ');
  
  return (
    <p className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * (delay / 1000) }}
          className="inline-block mr-1"
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

/**
 * Code Typewriter - Typing effect with code syntax highlighting
 */
export function CodeTypewriter({ 
  code, 
  speed = 30,
  className = ''
}: { 
  code: string;
  speed?: number;
  className?: string;
}) {
  const [displayedCode, setDisplayedCode] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayedCode('');

    const timer = setInterval(() => {
      if (index < code.length) {
        setDisplayedCode((prev) => prev + code.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [code, speed]);

  return (
    <pre className={`bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto ${className}`}>
      <code>{displayedCode}</code>
      <motion.span
        className="inline-block w-2 h-4 bg-green-400 ml-0.5"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
    </pre>
  );
}

// ============================================
// MARKDOWN TYPING (for formatted AI responses)
// ============================================

/**
 * Markdown Typewriter - Types markdown content with formatting
 */
export function MarkdownTypewriter({ 
  content,
  speed = 30,
  onComplete,
  className = ''
}: {
  content: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(prev => prev + content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex === content.length && currentIndex > 0) {
      onComplete?.();
    }
  }, [currentIndex, content, speed, onComplete]);

  return (
    <div className={`prose prose-slate max-w-none ${className}`}>
      <div dangerouslySetInnerHTML={{ __html: displayedContent }} />
    </div>
  );
}

// ============================================
// CUSTOM HOOKS
// ============================================

/**
 * useTypewriter Hook - Reusable typing animation hook
 * @example
 * const { displayedText, isTyping } = useTypewriter('Hello World', { speed: 50 });
 */
export function useTypewriter(
  text: string,
  options: { speed?: number; onComplete?: () => void } = {}
) {
  const { speed = 50, onComplete } = options;
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayedText('');
    setIsTyping(true);

    const timer = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(indexRef.current));
        indexRef.current++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return { displayedText, isTyping };
}

/**
 * useStreamingText Hook - For real streaming API responses
 * @example
 * const { text, append, clear } = useStreamingText();
 */
export function useStreamingText() {
  const [text, setText] = useState('');

  const append = (chunk: string) => {
    setText((prev) => prev + chunk);
  };

  const clear = () => {
    setText('');
  };

  const reset = () => {
    setText('');
  };

  return { text, append, clear, reset };
}
