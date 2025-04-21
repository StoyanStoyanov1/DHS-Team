
import { useState, useEffect } from 'react';

export const sqlSnippets = [
  "CREATE TABLE users (",
  "  id SERIAL PRIMARY KEY,",
  "  name VARCHAR(255) NOT NULL,",
  "  email VARCHAR(255) UNIQUE,",
  "  created_at TIMESTAMP DEFAULT NOW()",
  ");",
  "",
  "CREATE TABLE posts (",
  "  id SERIAL PRIMARY KEY,",
  "  title VARCHAR(255) NOT NULL,",
  "  content TEXT,",
  "  user_id INTEGER REFERENCES users(id),",
  "  published BOOLEAN DEFAULT false,",
  "  created_at TIMESTAMP DEFAULT NOW()",
  ");",
  "",
  "-- Query to get all published posts with authors",
  "SELECT p.title, p.content, u.name as author",
  "FROM posts p",
  "JOIN users u ON u.id = p.user_id",
  "WHERE p.published = true",
  "ORDER BY p.created_at DESC;"
];

export const useSqlAnimation = () => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [showSchema, setShowSchema] = useState(false);
  const [typing, setTyping] = useState(true);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (!typing || currentLine >= sqlSnippets.length) return;

    const currentSnippet = sqlSnippets[currentLine];
    
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
      }, 5); // Matched with useCodeAnimation

      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
        setCurrentChar(0);
      }, 40); // Matched with useCodeAnimation

      return () => clearTimeout(timer);
    }
  }, [currentLine, currentChar, typing]);

  useEffect(() => {
    if (currentLine >= sqlSnippets.length && !showSchema) {
      const timer = setTimeout(() => {
        setShowSchema(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentLine, showSchema]);

  return {
    lines,
    currentLine,
    currentChar,
    showSchema,
    sqlSnippets
  };
};
