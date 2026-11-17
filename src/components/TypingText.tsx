import { useState, useEffect } from 'react';

interface TypingTextProps {
  text: string;
  speed?: number; // ms per char
  onComplete?: () => void;
  className?: string;
}

export function TypingText({ text, speed = 35, onComplete, className = '' }: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsDone(false);
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsDone(true);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {!isDone && (
        <span className="inline-block w-1.5 h-4 ml-1 bg-pink-400 animate-pulse align-middle" />
      )}
    </span>
  );
}
