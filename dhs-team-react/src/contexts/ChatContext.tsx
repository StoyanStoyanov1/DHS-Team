
import React, { createContext, useContext, useState } from 'react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  typing?: boolean;
}

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  handleSendMessage: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Здравейте! Аз съм AI асистентът на SparkDev. Как мога да помогна с вашия проект?", isBot: true },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const demoResponses = [
    "Чудесно! Бихте ли споделили малко повече за вашата идея за проекта?",
    "Това звучи интересно! Какъв бюджет бихте предвидили за разработката?",
    "Разбирам нуждите ви. Кога бихте искали да стартираме проекта?",
    "Благодаря за детайлите! Ще подготвя оферта въз основа на споделената информация и ще ви я изпратя скоро."
  ];

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage = { id: messages.length + 1, text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const responseIndex = messages.filter(m => !m.isBot).length % demoResponses.length;
      const botMessage = { 
        id: messages.length + 2, 
        text: demoResponses[responseIndex], 
        isBot: true 
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1500);
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      setMessages, 
      input, 
      setInput, 
      isTyping, 
      setIsTyping,
      handleSendMessage 
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

