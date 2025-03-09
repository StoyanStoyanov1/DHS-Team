import { Info } from 'lucide-react';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

interface HoverMessageInterface {
  title: string;
  messages: string[];
}

export function HoverMessage({ title, messages }: HoverMessageInterface) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Info className="text-blue-500 w-4 h-4 transition-transform duration-200 hover:scale-125 cursor-pointer" />
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <span className="text-sm font-semibold text-gray-800 block">{title}</span>
          <div className="text-xs space-y-1">
            {messages.map((message, index) => (
              <p key={index}>{message}</p>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
