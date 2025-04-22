"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Database, Key, Link2, Search, RefreshCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface Position {
    top?: number | string;
    bottom?: number | string;
    left?: number | string;
    right?: number | string;
    transform?: string;
}

interface Field {
    name: string;
    type?: string;
    pk?: boolean;
    fk?: boolean;
    references?: string;
    color?: string;
}

interface Table {
    id: string;
    title: string;
    iconColor: string;
    position: Position;
    fields: Field[];
}

interface Relationship {
    from: string;
    to: string;
    path: string;
    selfReference?: boolean;
}

interface ContainerSize {
    width: number;
    height: number;
}

interface Query {
    id: number;
    text: string;
    opacity: number;
}

const EnhancedDatabaseSchemaView: React.FC = () => {
    const [zoom, setZoom] = useState(1);
    const [showDetails, setShowDetails] = useState(false);
    const [activeTable, setActiveTable] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState<ContainerSize>({ width: 0, height: 0 });
    const [queries, setQueries] = useState<Query[]>([]);

    useEffect(() => {
        setIsLoaded(true);

        // Simulate real-time data updates
        const interval = setInterval(() => {
            const tables = document.querySelectorAll('.table-box');
            const randomTable = tables[Math.floor(Math.random() * tables.length)];
            if (randomTable) {
                randomTable.classList.add('pulse-highlight');
                setTimeout(() => {
                    randomTable.classList.remove('pulse-highlight');
                }, 1000);
            }
        }, 3000);

        // Handle resize for responsive behavior
        const handleResize = () => {
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const getResponsivePosition = (basePosition: Position, containerSize: ContainerSize): React.CSSProperties => {
        const result: Position = {};
        
        if (basePosition.top !== undefined) {
            result.top = typeof basePosition.top === 'string' && basePosition.top.includes('%')
                ? basePosition.top
                : `${(Number(basePosition.top) / 400) * 100}%`;
        }
        if (basePosition.bottom !== undefined) {
            result.bottom = typeof basePosition.bottom === 'string' && basePosition.bottom.includes('%')
                ? basePosition.bottom
                : `${(Number(basePosition.bottom) / 400) * 100}%`;
        }
        if (basePosition.left !== undefined) {
            result.left = typeof basePosition.left === 'string' && basePosition.left.includes('%')
                ? basePosition.left
                : `${(Number(basePosition.left) / 600) * 100}%`;
        }
        if (basePosition.right !== undefined) {
            result.right = typeof basePosition.right === 'string' && basePosition.right.includes('%')
                ? basePosition.right
                : `${(Number(basePosition.right) / 600) * 100}%`;
        }
        if (basePosition.transform) {
            result.transform = basePosition.transform;
        }
        return result as React.CSSProperties;
    };

    const tables: Table[] = [
        {
            id: 'users',
            title: 'users',
            iconColor: 'text-cyan-400',
            position: { top: 40, left: 40 },
            fields: [
                { name: 'id', pk: true },
                { name: 'username', type: 'VARCHAR(50)' },
                { name: 'email', type: 'VARCHAR(100)' },
                { name: 'password_hash', type: 'VARCHAR(255)' },
                { name: 'created_at', type: 'TIMESTAMP' },
                { name: 'last_login', type: 'TIMESTAMP' },
                { name: 'is_active', type: 'BOOLEAN' }
            ]
        },
        {
            id: 'posts',
            title: 'posts',
            iconColor: 'text-green-400',
            position: { top: 40, right: 40 },
            fields: [
                { name: 'id', pk: true },
                { name: 'user_id', fk: true, references: 'users', color: 'bg-cyan-400' },
                { name: 'title', type: 'VARCHAR(100)' },
                { name: 'content', type: 'TEXT' },
                { name: 'created_at', type: 'TIMESTAMP' },
                { name: 'updated_at', type: 'TIMESTAMP' },
                { name: 'views', type: 'INTEGER' }
            ]
        },
        {
            id: 'comments',
            title: 'comments',
            iconColor: 'text-pink-400',
            position: { bottom: 40, left: 40 },
            fields: [
                { name: 'id', pk: true },
                { name: 'post_id', fk: true, references: 'posts', color: 'bg-green-400' },
                { name: 'user_id', fk: true, references: 'users', color: 'bg-cyan-400' },
                { name: 'content', type: 'TEXT' },
                { name: 'created_at', type: 'TIMESTAMP' },
                { name: 'is_approved', type: 'BOOLEAN' }
            ]
        },
        {
            id: 'categories',
            title: 'categories',
            iconColor: 'text-yellow-400',
            position: { bottom: 40, right: 40 },
            fields: [
                { name: 'id', pk: true },
                { name: 'name', type: 'VARCHAR(50)' },
                { name: 'slug', type: 'VARCHAR(50)' },
                { name: 'parent_id', fk: true, references: 'categories', color: 'bg-yellow-400' }
            ]
        },
        {
            id: 'post_categories',
            title: 'post_categories',
            iconColor: 'text-purple-400',
            position: { top: '35%', left: '50%', transform: 'translate(-50%, -50%)' },
            fields: [
                { name: 'post_id', fk: true, references: 'posts', color: 'bg-green-400' },
                { name: 'category_id', fk: true, references: 'categories', color: 'bg-yellow-400' },
                { name: 'created_at', type: 'TIMESTAMP' }
            ]
        },
        {
            id: 'media',
            title: 'media',
            iconColor: 'text-blue-400',
            position: { top: 180, right: 200 },
            fields: [
                { name: 'id', pk: true },
                { name: 'post_id', fk: true, references: 'posts', color: 'bg-green-400' },
                { name: 'file_path', type: 'VARCHAR(255)' },
                { name: 'file_type', type: 'VARCHAR(50)' },
                { name: 'created_at', type: 'TIMESTAMP' }
            ]
        }
    ];

    const relationships: Relationship[] = [
        { from: 'users', to: 'posts', path: 'M 160 80 Q 300 20 470 80' },
        { from: 'users', to: 'comments', path: 'M 100 140 Q 80 250 100 320' },
        { from: 'posts', to: 'comments', path: 'M 470 140 Q 300 280 180 320' },
        { from: 'posts', to: 'post_categories', path: 'M 470 100 Q 380 200 300 200' },
        { from: 'categories', to: 'post_categories', path: 'M 450 320 Q 350 280 300 220' },
        { from: 'posts', to: 'media', path: 'M 500 130 Q 480 175 500 220' },
        { from: 'categories', to: 'categories', path: 'M 510 320 Q 560 320 560 340 Q 560 360 510 360', selfReference: true }
    ];

    const generateRandomQuery = (): string => {
        const queryTypes = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
        const tableNames = ['users', 'posts', 'comments', 'categories', 'post_categories', 'media'];
        const type = queryTypes[Math.floor(Math.random() * queryTypes.length)];
        const table = tableNames[Math.floor(Math.random() * tableNames.length)];

        if (type === 'SELECT') {
            return `SELECT * FROM ${table} WHERE id = ${Math.floor(Math.random() * 1000)}`;
        } else if (type === 'INSERT') {
            return `INSERT INTO ${table} VALUES (...) RETURNING id`;
        } else if (type === 'UPDATE') {
            return `UPDATE ${table} SET updated_at = NOW() WHERE id = ${Math.floor(Math.random() * 1000)}`;
        } else {
            return `DELETE FROM ${table} WHERE created_at < '2023-01-01'`;
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const newQuery: Query = {
                id: Date.now(),
                text: generateRandomQuery(),
                opacity: 1
            };

            setQueries(prevQueries => [...prevQueries, newQuery].slice(-5));

            setTimeout(() => {
                setQueries(prevQueries =>
                    prevQueries.map(q => q.id === newQuery.id ? {...q, opacity: 0} : q)
                );
            }, 3000);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative bg-gray-950 rounded-2xl overflow-hidden border border-gray-800 h-[400px] w-full">
            {/* Animated background grid */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(100,100,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>

            {/* Floating particles */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute h-1 w-1 rounded-full bg-blue-500/30"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${5 + Math.random() * 10}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            {/* Top controls */}
            <div className={`absolute top-4 right-4 z-20 flex items-center space-x-2 ${containerSize.width < 640 ? 'scale-75 origin-top-right' : ''}`}>
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center justify-center w-8 h-8 bg-gray-800/80 backdrop-blur-sm rounded-full text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
                >
                    <Search size={16} />
                </button>
                <button
                    onClick={() => setZoom(prev => Math.min(prev + 0.1, 1.5))}
                    className="flex items-center justify-center w-8 h-8 bg-gray-800/80 backdrop-blur-sm rounded-full text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
                >
                    <ZoomIn size={16} />
                </button>
                <button
                    onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
                    className="flex items-center justify-center w-8 h-8 bg-gray-800/80 backdrop-blur-sm rounded-full text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
                >
                    <ZoomOut size={16} />
                </button>
                <button
                    onClick={() => {
                        const randomElem = document.querySelector(`.table-box:nth-child(${Math.floor(Math.random() * tables.length) + 1})`);
                        if (randomElem) {
                            randomElem.classList.add('scale-highlight');
                            setTimeout(() => {
                                randomElem.classList.remove('scale-highlight');
                            }, 800);
                        }
                    }}
                    className="flex items-center justify-center w-8 h-8 bg-gray-800/80 backdrop-blur-sm rounded-full text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
                >
                    <RefreshCcw size={16} />
                </button>
            </div>

            {/* Live queries section */}
            <div className={`absolute top-4 left-4 z-20 ${containerSize.width < 768 ? 'w-40' : 'w-60'} max-h-32 overflow-hidden`}>
                <div className="text-xs text-green-400 font-mono bg-black/30 backdrop-blur-sm p-2 rounded-md space-y-1 border border-green-500/20">
                    <div className="text-green-300 mb-1">Live Queries:</div>
                    {queries.map(query => (
                        <div
                            key={query.id}
                            className="truncate transition-all duration-1000"
                            style={{ opacity: query.opacity }}
                        >
                            {query.text}
                        </div>
                    ))}
                </div>
            </div>

            {/* Container with zoom effect */}
            <div
                ref={containerRef}
                className={`relative h-full w-full overflow-auto transition-transform duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            >
                {/* Tables */}
                <div className="absolute inset-0">
                    {tables.map((table) => (
                        <div
                            key={table.id}
                            className={`table-box absolute bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 shadow-xl rounded-xl p-4 transition-all duration-300 hover:shadow-blue-500/20 hover:border-blue-500/30 overflow-hidden ${activeTable === table.id ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/30' : ''} ${containerSize.width < 768 ? 'w-40' : 'w-56'}`}
                            style={getResponsivePosition(table.position, containerSize)}
                            onClick={() => setActiveTable(table.id === activeTable ? null : table.id)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-transparent opacity-20"></div>

                            {/* Table header */}
                            <div className="flex items-center gap-2 mb-3 relative z-10">
                                <Database className={`${table.iconColor}`} size={18} />
                                <span className={`${table.iconColor} font-semibold text-sm uppercase tracking-wider`}>
                                    {table.title}
                                </span>
                                <span className="text-xs text-gray-500 ml-auto">{table.fields.length} fields</span>
                            </div>

                            {/* Table fields */}
                            <div className={`space-y-2 text-sm max-h-48 overflow-y-auto pr-2 relative z-10 ${containerSize.width < 768 ? 'text-xs' : 'text-sm'}`}>
                                {table.fields.map((field, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-center gap-2 p-1.5 rounded-md transition-colors ${activeTable === table.id ? 'hover:bg-gray-800/50' : ''} ${field.pk || field.fk ? 'bg-gray-800/30' : ''}`}
                                    >
                                        {field.pk ? (
                                            <Key className="text-yellow-400 animate-pulse" size={14} />
                                        ) : field.fk ? (
                                            <Link2 className={`${field.color?.replace('bg-', 'text-')}`} size={14} />
                                        ) : (
                                            <div className={`w-2 h-2 rounded-full ${field.color ?? 'bg-gray-400'}`} />
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-gray-300 font-medium">
                                                {field.name}
                                                {field.pk && <span className="text-yellow-500 text-xs font-mono ml-1">(PK)</span>}
                                                {field.fk && <span className="text-blue-400 text-xs font-mono ml-1">(FK)</span>}
                                            </span>
                                            {showDetails && field.type && (
                                                <span className="text-gray-500 text-xs font-mono">{field.type}</span>
                                            )}
                                            {showDetails && field.fk && (
                                                <span className="text-xs text-blue-300 font-mono">→ {field.references}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Visual glow effect */}
                            <div className={`absolute -inset-1 rounded-xl bg-gradient-to-r ${table.iconColor.replace('text', 'from')}/10 to-transparent -z-10 blur-sm transition-opacity duration-300 ${activeTable === table.id ? 'opacity-100' : 'opacity-0'}`}></div>
                        </div>
                    ))}
                </div>

                {/* Relationship lines */}
                <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(100, 150, 255, 0.7)" />
                        </marker>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(50, 130, 250, 0.6)" />
                            <stop offset="100%" stopColor="rgba(138, 180, 255, 0.5)" />
                        </linearGradient>
                    </defs>

                    {relationships.map((rel, i) => (
                        <g key={i} className="relationship-line">
                            <path
                                d={rel.path}
                                className={`transition-all duration-300 ${activeTable === rel.from || activeTable === rel.to ? 'stroke-[3px] opacity-100' : 'stroke-[1.5px] opacity-70'}`}
                                fill="none"
                                stroke="url(#lineGradient)"
                                strokeDasharray={rel.selfReference ? "5,5" : ""}
                                filter="url(#glow)"
                                markerEnd={rel.selfReference ? "" : "url(#arrow)"}
                            />
                            {/* Animated particle along the path */}
                            <circle r="2" fill="#60a5fa">
                                <animateMotion
                                    dur="3s"
                                    repeatCount="indefinite"
                                    path={rel.path}
                                />
                            </circle>
                        </g>
                    ))}
                </svg>

                {/* Server activity indicators */}
                <div className={`absolute bottom-4 right-4 flex items-center space-x-2 bg-gray-900/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-800 ${containerSize.width < 768 ? 'text-[10px]' : 'text-xs'}`}>
                    <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                        <span className="text-gray-400">Server</span>
                    </div>
                    <div className="text-gray-500">|</div>
                    <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-ping"></div>
                        <span className="text-gray-400">Queries</span>
                    </div>
                </div>
            </div>

            {/* Global styles */}
            <style jsx global>{`
                @keyframes float {
                    0% { transform: translate(0, 0); opacity: 0; }
                    10% { opacity: 0.7; }
                    90% { opacity: 0.7; }
                    100% { transform: translate(40px, -100px); opacity: 0; }
                }
                
                .pulse-highlight {
                    animation: pulse-animation 1s cubic-bezier(0.4, 0, 0.6, 1);
                }
                
                @keyframes pulse-animation {
                    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
                
                .scale-highlight {
                    animation: scale-animation 0.8s ease-in-out;
                }
                
                @keyframes scale-animation {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default EnhancedDatabaseSchemaView;