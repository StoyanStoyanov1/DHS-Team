"use client"

import React, { useRef, useEffect } from 'react';
import { sqlSnippets } from './useSqlAnimation';

interface SqlEditorViewProps {
    lines: string[];
    currentLine: number;
    currentChar: number;
}

const SqlEditorView: React.FC<SqlEditorViewProps> = ({ lines, currentLine, currentChar }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [lines]);

    return (
        <div
            className="bg-[#1E1E1E] text-white font-mono text-sm p-6 h-[400px] overflow-auto"
            ref={containerRef}
        >
            {lines.map((line, i) => (
                <div
                    key={i}
                    className="flex animate-fade-in"
                    style={{ animationDelay: `${i * 0.05}s` }}
                >
                    <span className="text-gray-500 w-8 text-right pr-4 select-none">{i + 1}</span>
                    <span className={`${i === currentLine && currentChar < sqlSnippets[i]?.length ? "after:content-['|'] after:text-purple-400 after:animate-blink" : ""}`}>
            {line && line.replace(/ /g, "\u00A0")}
          </span>
                </div>
            ))}
        </div>
    );
};

export default SqlEditorView;