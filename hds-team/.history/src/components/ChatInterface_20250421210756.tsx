import React from 'react';
import { Bot, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/context/ChatContext';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatInterfaceProps {
    className?: string;
}

const ChatInterface = ({ className = "" }: ChatInterfaceProps) => {
    const { messages, input, setInput, isTyping, handleSendMessage } = useChat();

    return (
        <div className={`flex flex-col h-full ${className}`}>
            <ScrollArea className="flex-1 w-full">
                <div className="p-4 space-y-4">
                    {messages.map(message => (
                        <div
                            key={message.id}
                            className={`flex mb-4 ${!message.isBot ? "justify-end" : ""}`}
                        >
                            <div className={`flex items-start max-w-[80%] ${!message.isBot ? "flex-row-reverse" : ""}`}>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${
                                    message.isBot ? "bg-blue-purple-gradient text-white" : "bg-gray-200 dark:bg-gray-700"
                                }`}>
                                    {message.isBot ? <Bot size={16} /> : <User size={16} />}
                                </div>
                                <div className={`p-3 rounded-lg ${
                                    message.isBot
                                        ? "bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
                                        : "bg-blue-purple-gradient text-white"
                                }`}>
                                    <p className="text-sm">{message.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex mb-4">
                            <div className="flex items-start max-w-[80%]">
                                <div className="h-8 w-8 rounded-full bg-blue-purple-gradient text-white flex items-center justify-center mr-2">
                                    <Bot size={16} />
                                </div>
                                <div className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                                    <p className="text-sm flex items-center">
                                        <span className="inline-block h-2 w-2 bg-primary rounded-full mr-1 animate-pulse"></span>
                                        <span className="inline-block h-2 w-2 bg-primary rounded-full mr-1 animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                                        <span className="inline-block h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Напишете съобщение..."
                    />
                    <Button
                        onClick={handleSendMessage}
                        className="bg-blue-purple-gradient hover:opacity-90"
                        size="icon"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;