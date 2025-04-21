"use client"
import React from 'react';
import { Database, Key } from 'lucide-react';

const DatabaseSchemaView: React.FC = () => {
    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 h-[400px] p-4 overflow-hidden">
            <div className="relative h-full">
                {/* Users Table */}
                <div className="absolute top-4 left-4 w-[180px] z-10 bg-gray-800/80 p-3 rounded-lg border border-purple-500/30 shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <Database className="text-purple-400" size={16} />
                        <span className="text-purple-400 font-semibold">users</span>
                    </div>
                    <div className="space-y-1.5 text-sm">
                        <div className="flex items-center gap-2">
                            <Key className="text-yellow-400" size={12} />
                            <span className="text-gray-300">id (PK)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            <span className="text-gray-300">username</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            <span className="text-gray-300">email</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            <span className="text-gray-300">created_at</span>
                        </div>
                    </div>
                </div>

                {/* Posts Table */}
                <div className="absolute top-4 right-4 w-[180px] z-10 bg-gray-800/80 p-3 rounded-lg border border-purple-500/30 shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <Database className="text-purple-400" size={16} />
                        <span className="text-purple-400 font-semibold">posts</span>
                    </div>
                    <div className="space-y-1.5 text-sm">
                        <div className="flex items-center gap-2">
                            <Key className="text-yellow-400" size={12} />
                            <span className="text-gray-300">id (PK)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full" />
                            <span className="text-gray-300">user_id (FK)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            <span className="text-gray-300">title</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            <span className="text-gray-300">content</span>
                        </div>
                    </div>
                </div>

                {/* Comments Table */}
                <div className="absolute bottom-4 left-4 w-[180px] z-10 bg-gray-800/80 p-3 rounded-lg border border-purple-500/30 shadow-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <Database className="text-purple-400" size={16} />
                        <span className="text-purple-400 font-semibold">comments</span>
                    </div>
                    <div className="space-y-1.5 text-sm">
                        <div className="flex items-center gap-2">
                            <Key className="text-yellow-400" size={12} />
                            <span className="text-gray-300">id (PK)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full" />
                            <span className="text-gray-300">post_id (FK)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full" />
                            <span className="text-gray-300">user_id (FK)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            <span className="text-gray-300">content</span>
                        </div>
                    </div>
                </div>

                {/* Categories Table */}
                <div className="absolute bottom-4 right-4 w-[180px] z-10 bg-gray-800/80 p-3 rounded-lg border border-purple-500/30 shadow-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <Database className="text-purple-400" size={16} />
                        <span className="text-purple-400 font-semibold">categories</span>
                    </div>
                    <div className="space-y-1.5 text-sm">
                        <div className="flex items-center gap-2">
                            <Key className="text-yellow-400" size={12} />
                            <span className="text-gray-300">id (PK)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            <span className="text-gray-300">name</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            <span className="text-gray-300">slug</span>
                        </div>
                    </div>
                </div>

                {/* Post_Categories Junction Table */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 w-[180px] z-10 bg-gray-800/80 p-3 rounded-lg border border-blue-500/30 shadow-lg animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <Database className="text-blue-400" size={16} />
                        <span className="text-blue-400 font-semibold">post_categories</span>
                    </div>
                    <div className="space-y-1.5 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full" />
                            <span className="text-gray-300">post_id (FK)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full" />
                            <span className="text-gray-300">category_id (FK)</span>
                        </div>
                    </div>
                </div>

                {/* Relationship Lines */}
                <svg className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    {/* Users to Posts (1:N) */}
                    <path
                        d="M 170 60 Q 230 60 320 60"
                        fill="none"
                        stroke="rgba(147, 51, 234, 0.5)"
                        strokeWidth="1.5"
                        strokeDasharray="4"
                        className="animate-draw-line"
                        style={{ animationDelay: '0.6s' }}
                        markerEnd="url(#arrowhead)"
                    />

                    {/* Users to Comments (1:N) */}
                    <path
                        d="M 90 95 Q 90 190 90 270"
                        fill="none"
                        stroke="rgba(147, 51, 234, 0.5)"
                        strokeWidth="1.5"
                        strokeDasharray="4"
                        className="animate-draw-line"
                        style={{ animationDelay: '0.7s' }}
                        markerEnd="url(#arrowhead)"
                    />

                    {/* Posts to Comments (1:N) */}
                    <path
                        d="M 400 95 Q 400 190 170 270"
                        fill="none"
                        stroke="rgba(147, 51, 234, 0.5)"
                        strokeWidth="1.5"
                        strokeDasharray="4"
                        className="animate-draw-line"
                        style={{ animationDelay: '0.8s' }}
                        markerEnd="url(#arrowhead)"
                    />

                    {/* Posts to post_categories (1:N) */}
                    <path
                        d="M 400 80 Q 300 150 270 190"
                        fill="none"
                        stroke="rgba(147, 51, 234, 0.5)"
                        strokeWidth="1.5"
                        strokeDasharray="4"
                        className="animate-draw-line"
                        style={{ animationDelay: '0.9s' }}
                        markerEnd="url(#arrowhead)"
                    />

                    {/* Categories to post_categories (1:N) */}
                    <path
                        d="M 400 300 Q 350 250 270 210"
                        fill="none"
                        stroke="rgba(147, 51, 234, 0.5)"
                        strokeWidth="1.5"
                        strokeDasharray="4"
                        className="animate-draw-line"
                        style={{ animationDelay: '1s' }}
                        markerEnd="url(#arrowhead)"
                    />

                    {/* Arrowhead marker definition */}
                    <defs>
                        <marker
                            id="arrowhead"
                            markerWidth="6"
                            markerHeight="6"
                            refX="5"
                            refY="3"
                            orient="auto"
                        >
                            <polygon points="0 0, 6 3, 0 6" fill="rgba(147, 51, 234, 0.7)" />
                        </marker>
                    </defs>
                </svg>
            </div>
        </div>
    );
};

export default DatabaseSchemaView;