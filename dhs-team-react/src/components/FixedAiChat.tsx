
import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ChatInterface from './ChatInterface';

const FixedAiChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          className="fixed bottom-4 right-4 rounded-full h-16 w-16 p-0 bg-purple-500 hover:bg-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
          size="icon"
        >
          <Bot className="h-8 w-8 text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[380px] p-0" 
        side="top" 
        align="end"
        alignOffset={-40}
        sideOffset={20}
      >
        <div className="bg-purple-500 p-4">
          <h3 className="font-medium text-white flex items-center gap-2">
            <Bot className="h-5 w-5" />
            SparkDev AI Асистент
          </h3>
        </div>
        <div className="h-[500px] flex flex-col bg-white dark:bg-gray-900">
          <ChatInterface className="flex-1" />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FixedAiChat;
