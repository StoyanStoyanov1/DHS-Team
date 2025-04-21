
import React from 'react';
import { Circle } from 'lucide-react';

const WindowHeader = ({ fileName }: { fileName: string }) => {
  return (
    <div className="bg-gradient-to-r from-[#2D2D2F] to-[#38383A] px-4 py-3 flex items-center justify-between border-b border-gray-700/70">
      <div className="flex space-x-2">
        <Circle 
          size={13} 
          fill="#FF5F57" 
          stroke="none" 
          className="hover:opacity-80 transition-all duration-300 transform hover:scale-110 hover:rotate-12" 
        />
        <Circle 
          size={13} 
          fill="#FEBC2E" 
          stroke="none" 
          className="hover:opacity-80 transition-all duration-300 transform hover:scale-110 hover:rotate-12" 
        />
        <Circle 
          size={13} 
          fill="#28C840" 
          stroke="none" 
          className="hover:opacity-80 transition-all duration-300 transform hover:scale-110 hover:rotate-12" 
        />
      </div>
      <div className="text-gray-300 text-xs font-medium bg-gray-800/50 px-3 py-1 rounded-full backdrop-blur-sm border border-gray-700/30">{fileName}</div>
      <div className="w-12"></div>
    </div>
  );
};

export default WindowHeader;

