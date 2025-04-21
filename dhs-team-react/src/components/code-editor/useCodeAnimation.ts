
import { useState, useEffect, useRef } from 'react';

export const useCodeAnimation = (codeSnippets: string[]) => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [showWebsite, setShowWebsite] = useState(false);
  const [typing, setTyping] = useState(true);
  const [currentChar, setCurrentChar] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!typing || currentLine >= codeSnippets.length) return;

    const currentSnippet = codeSnippets[currentLine];
    
    if (currentChar < currentSnippet.length) {
      const timer = setTimeout(() => {
        setLines(prevLines => {
          const updatedLines = [...prevLines];
          if (!updatedLines[currentLine]) {
            updatedLines[currentLine] = "";
          }
          updatedLines[currentLine] = currentSnippet.substring(0, currentChar + 1);
          return updatedLines;
        });
        setCurrentChar(prev => prev + 1);
      }, 5); // Reduced from 10-30ms to 5ms fixed

      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
        setCurrentChar(0);
      }, 40); // Reduced from 80ms to 40ms

      return () => clearTimeout(timer);
    }
  }, [currentLine, currentChar, typing, codeSnippets]);

  useEffect(() => {
    if (currentLine >= codeSnippets.length && !showWebsite) {
      const timer = setTimeout(() => {
        setShowWebsite(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentLine, showWebsite, codeSnippets.length]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  return {
    lines,
    currentLine,
    currentChar,
    showWebsite,
    containerRef,
  };
};
