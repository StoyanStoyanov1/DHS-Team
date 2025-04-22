'use client';
import React from 'react';
import { Database, Key } from 'lucide-react';
import { motion } from 'framer-motion';

const tableFadeIn = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { delay, duration: 0.5 } },
});

const TableBox = ({
                      title,
                      iconColor,
                      fields,
                      style,
                      delay,
                  }: {
    title: string;
    iconColor: string;
    fields: { name: string; type?: string; pk?: boolean; fk?: boolean; color?: string }[];
    style: React.CSSProperties;
    delay: number;
}) => (
    <motion.div
        className="absolute w-[180px] bg-gray-900/90 backdrop-blur-sm border border-purple-500/20 shadow-lg rounded-xl p-4"
        style={style}
        {...tableFadeIn(delay)}
    >
        <div className="flex items-center gap-2 mb-3">
            <Database className={iconColor} size={18} />
            <span className={`${iconColor} font-semibold text-sm uppercase tracking-wide`}>
        {title}
      </span>
        </div>
        <div className="space-y-2 text-sm">
            {fields.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                    {f.pk ? (
                        <Key className="text-yellow-400" size={12} />
                    ) : (
                        <div className={`w-2 h-2 rounded-full ${f.color ?? 'bg-gray-400'}`} />
                    )}
                    <span className="text-gray-300">
            {f.name}
                        {f.fk && ' (FK)'}
                        {f.pk && ' (PK)'}
          </span>
                </div>
            ))}
        </div>
    </motion.div>
);

const DatabaseSchemaView = () => {
    return (
        <div className="relative h-[400px] bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-800 rounded-2xl overflow-hidden p-4">
            {/* Tables */}
            <TableBox
                title="users"
                iconColor="text-purple-400"
                delay={0.1}
                style={{ top: 20, left: 20 }}
                fields={[
                    { name: 'id', pk: true },
                    { name: 'username' },
                    { name: 'email' },
                    { name: 'created_at' },
                ]}
            />
            <TableBox
                title="posts"
                iconColor="text-purple-400"
                delay={0.2}
                style={{ top: 20, right: 20 }}
                fields={[
                    { name: 'id', pk: true },
                    { name: 'user_id', fk: true, color: 'bg-blue-400' },
                    { name: 'title' },
                    { name: 'content' },
                ]}
            />
            <TableBox
                title="comments"
                iconColor="text-purple-400"
                delay={0.3}
                style={{ bottom: 20, left: 20 }}
                fields={[
                    { name: 'id', pk: true },
                    { name: 'post_id', fk: true, color: 'bg-blue-400' },
                    { name: 'user_id', fk: true, color: 'bg-blue-400' },
                    { name: 'content' },
                ]}
            />
            <TableBox
                title="categories"
                iconColor="text-purple-400"
                delay={0.4}
                style={{ bottom: 20, right: 20 }}
                fields={[
                    { name: 'id', pk: true },
                    { name: 'name' },
                    { name: 'slug' },
                ]}
            />
            <TableBox
                title="post_categories"
                iconColor="text-blue-400"
                delay={0.5}
                style={{ top: '45%', left: 'calc(50% - 95px)' }}
                fields={[
                    { name: 'post_id', fk: true, color: 'bg-blue-400' },
                    { name: 'category_id', fk: true, color: 'bg-blue-400' },
                ]}
            />

            {/* Relationship lines */}
            <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(168, 85, 247, 0.7)" />
                    </marker>
                </defs>
                <path
                    d="M 190 60 Q 300 60 460 70"
                    className="animate-pulse"
                    fill="none"
                    stroke="rgba(168, 85, 247, 0.5)"
                    strokeWidth="1.5"
                    markerEnd="url(#arrow)"
                />
                <path
                    d="M 110 100 Q 110 230 60 260"
                    className="animate-pulse"
                    fill="none"
                    stroke="rgba(168, 85, 247, 0.5)"
                    strokeWidth="1.5"
                    markerEnd="url(#arrow)"
                />
                <path
                    d="M 450 100 Q 430 230 190 370"
                    className="animate-pulse"
                    fill="none"
                    stroke="rgba(168, 85, 247, 0.5)"
                    strokeWidth="1.5"
                    markerEnd="url(#arrow)"
                />
                <path
                    d="M 460 100 Q 390 120 330 220"
                    className="animate-pulse"
                    fill="none"
                    stroke="rgba(168, 85, 247, 0.5)"
                    strokeWidth="1.5"
                    markerEnd="url(#arrow)"
                />
                <path
                    d="M 460 280 Q 370 200 330 250"
                    className="animate-pulse"
                    fill="none"
                    stroke="rgba(168, 85, 247, 0.5)"
                    strokeWidth="1.5"
                    markerEnd="url(#arrow)"
                />
            </svg>
        </div>
    );
};

export default DatabaseSchemaView;
