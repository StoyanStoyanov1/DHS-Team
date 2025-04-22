"use client";

import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import ChatInterface from './ChatInterface';

const FloatingChatButton: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <>
            {/* Плаващ бутон за чат */}
            <button
                onClick={toggleChat}
                aria-label="Open AI Chat"
                className={`fixed bottom-6 right-6 z-50 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-3 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${isChatOpen ? 'rotate-90' : 'animate-bounce-slow'}`}
            >
                {isChatOpen ? <X size={24} /> : <Bot size={24} />}
            </button>

            {/* Чат прозорец */}
            {isChatOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 max-h-[calc(100vh-120px)] flex flex-col rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot size={20} className="text-white" />
                            <h3 className="font-medium text-white">SparkDev AI Асистент</h3>
                        </div>
                        <button 
                            onClick={toggleChat}
                            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-hidden bg-white dark:bg-gray-900">
                        <ChatInterface />
                    </div>
                </div>
            )}
        </>
    );
};

export default FloatingChatButton; 