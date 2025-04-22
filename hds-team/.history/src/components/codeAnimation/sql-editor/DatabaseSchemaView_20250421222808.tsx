'use client';
import React from 'react';
import { Database, Key, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

const tableFadeIn = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { delay, duration: 0.5 } },
});

const TableBox = ({
    title,
    iconColor,
    fields,
    className,
    delay,
}: {
    title: string;
    iconColor: string;
    fields: { name: string; type?: string; pk?: boolean; fk?: boolean; color?: string }[];
    className?: string;
    delay: number;
}) => (
    <motion.div
        className={`bg-gray-900/80 backdrop-blur-sm border border-purple-500/10 shadow-lg rounded-lg p-3 hover:border-purple-500/30 transition-all duration-300 ${className}`}
        {...tableFadeIn(delay)}
    >
        <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <Database className={iconColor} size={14} />
            </div>
            <span className={`${iconColor} font-medium text-xs uppercase tracking-wide`}>
                {title}
            </span>
        </div>
        <div className="space-y-1.5 text-xs">
            {fields.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5">
                    {f.pk ? (
                        <Key className="text-yellow-400" size={10} />
                    ) : f.fk ? (
                        <GitBranch className={f.color?.replace('bg-', 'text-') ?? 'text-gray-400'} size={10} />
                    ) : (
                        <div className={`w-1.5 h-1.5 rounded-full ${f.color ?? 'bg-gray-400'}`} />
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
        <div className="relative bg-[#1E1E1E] rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm px-4 py-2 border-b border-purple-500/20">
                <div className="flex items-center gap-2">
                    <Database className="text-purple-400" size={16} />
                    <span className="text-purple-100 text-sm font-medium">Database Schema</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 relative min-h-[350px]">
                {/* Background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
                <div className="absolute w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -top-48 -right-48 animate-pulse-slow" />
                <div className="absolute w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl -bottom-32 -left-32 animate-pulse-slow" style={{ animationDelay: '1s' }} />

                {/* Tables Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 relative z-10">
                    <TableBox
                        title="users"
                        iconColor="text-purple-400"
                        delay={0.1}
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
                        fields={[
                            { name: 'post_id', fk: true, color: 'bg-blue-400' },
                            { name: 'category_id', fk: true, color: 'bg-blue-400' },
                        ]}
                    />
                </div>

                {/* Decorative elements */}
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
            </div>
        </div>
    );
};

export default DatabaseSchemaView;
