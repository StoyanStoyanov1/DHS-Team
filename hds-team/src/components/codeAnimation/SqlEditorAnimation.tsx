"use client"
import React from 'react';
import { useSqlAnimation } from './sql-editor/useSqlAnimation';
import SqlEditorView from './sql-editor/SqlEditorView';
import DatabaseSchemaView from './sql-editor/DatabaseSchemaView';

const SqlEditorAnimation: React.FC = () => {
    const { lines, currentLine, currentChar, showSchema } = useSqlAnimation();

    return (
        <div className="w-full animate-slide-in-right transform hover:-translate-y-2 transition-transform duration-500" style={{ animationDelay: '0.7s' }}>
            <div className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-2xl border border-gray-700/50 hover:shadow-purple-500/30 transition-all duration-500">
                {/* Mac OS window header */}
                <div className="bg-gradient-to-r from-[#2D2D2F] to-[#38383A] px-4 py-3 flex items-center justify-between border-b border-gray-700/70">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                        <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                        <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                    </div>
                    <div className="text-gray-300 text-xs font-medium bg-gray-800/50 px-3 py-1 rounded-full backdrop-blur-sm border border-gray-700/30">database.sql</div>
                    <div className="w-12"></div>
                </div>

                {!showSchema ? (
                    <SqlEditorView
                        lines={lines}
                        currentLine={currentLine}
                        currentChar={currentChar}
                    />
                ) : (
                    <DatabaseSchemaView />
                )}
            </div>
        </div>
    );
};

export default SqlEditorAnimation;