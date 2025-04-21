
import React from 'react';

const WebsitePreview = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-black h-[400px] overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Enhanced header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-3 px-4 animate-gradient-x">
          <div className="flex justify-between items-center">
            <div className="text-white font-bold animate-fade-in flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center">
                <span className="text-xs text-blue-600">S</span>
              </div>
              Моето приложение
            </div>
            <div className="flex space-x-4">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="w-4 h-4 rounded-full bg-white/70 animate-pulse hover:bg-white/90 transition-all duration-300 transform hover:scale-110"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Enhanced content layout */}
        <div className="flex-1 flex">
          <div className="w-1/4 bg-gray-800/70 backdrop-blur-sm p-4 border-r border-gray-700/50">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className="h-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded mb-3 animate-pulse-slow flex items-center px-3"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <div className="h-3 w-3 rounded-sm bg-blue-500 mr-2"></div>
                <div className="h-2 bg-gray-500 rounded w-12"></div>
              </div>
            ))}
          </div>
          
          <div className="w-3/4 p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 p-5 rounded-lg animate-float">
                <div className="h-5 bg-white/20 rounded w-2/3 mb-3 animate-pulse-slow" />
                <div className="h-3 bg-white/10 rounded w-1/2 mb-2" />
                <div className="h-3 bg-white/10 rounded w-3/4 mb-2" />
                <div className="flex gap-2 mt-4">
                  <div className="h-8 w-20 bg-blue-600/70 rounded flex items-center justify-center">
                    <div className="h-2 w-10 bg-white/70 rounded"></div>
                  </div>
                  <div className="h-8 w-20 bg-gray-700/70 rounded flex items-center justify-center">
                    <div className="h-2 w-10 bg-white/50 rounded"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                {[1, 2].map((i) => (
                  <div 
                    key={i}
                    className="flex-1 bg-gradient-to-r from-gray-800/70 to-gray-700/70 p-4 rounded-lg animate-float border border-white/5"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  >
                    <div className="h-4 bg-white/10 rounded w-1/2 mb-2" />
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-400"></div>
                      <div className="h-3 bg-white/20 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-4 rounded-lg animate-float-delay-2 border border-white/5">
                <div className="flex justify-between mb-3">
                  <div className="h-4 bg-white/10 rounded w-1/4" />
                  <div className="h-4 bg-blue-500/30 rounded w-12"></div>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-2 bg-white/5 rounded w-full mb-2" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsitePreview;

