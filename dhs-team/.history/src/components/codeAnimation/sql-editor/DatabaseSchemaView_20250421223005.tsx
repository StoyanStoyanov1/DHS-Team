'use client';
import React from 'react';
import { Database, Key, GitBranch, Calendar, Tag, Star, MessageSquare, User, FileText, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const tableFadeIn = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { delay, duration: 0.5 } },
});

const TableBox = ({
    title,
    iconColor,
    icon: Icon = Database,
    fields,
    className,
    delay,
}: {
    title: string;
    iconColor: string;
    icon?: React.ElementType;
    fields: { name: string; type?: string; pk?: boolean; fk?: boolean; color?: string }[];
    className?: string;
    delay: number;
}) => (
    <motion.div
        className={`bg-gray-900/80 backdrop-blur-sm border border-purple-500/10 shadow-lg rounded-lg p-3 hover:border-purple-500/30 transition-all duration-300 hover:scale-105 ${className}`}
        {...tableFadeIn(delay)}
    >
        <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <Icon className={iconColor} size={14} />
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
                    <span className="text-purple-100 text-sm font-medium">Extended Database Schema</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 relative min-h-[450px]">
                {/* Background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
                <div className="absolute w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl -top-48 -right-48 animate-pulse-slow" />
                <div className="absolute w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -bottom-32 -left-32 animate-pulse-slow" style={{ animationDelay: '1s' }} />

                {/* Tables Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10">
                    <TableBox
                        title="users"
                        icon={User}
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
                        icon={FileText}
                        iconColor="text-blue-400"
                        delay={0.2}
                        fields={[
                            { name: 'id', pk: true },
                            { name: 'user_id', fk: true, color: 'bg-purple-400' },
                            { name: 'title' },
                            { name: 'content' },
                            { name: 'status' },
                        ]}
                    />
                    <TableBox
                        title="comments"
                        icon={MessageSquare}
                        iconColor="text-green-400"
                        delay={0.3}
                        fields={[
                            { name: 'id', pk: true },
                            { name: 'post_id', fk: true, color: 'bg-blue-400' },
                            { name: 'user_id', fk: true, color: 'bg-purple-400' },
                            { name: 'content' },
                            { name: 'rating' },
                        ]}
                    />
                    <TableBox
                        title="categories"
                        icon={Tag}
                        iconColor="text-yellow-400"
                        delay={0.4}
                        fields={[
                            { name: 'id', pk: true },
                            { name: 'name' },
                            { name: 'slug' },
                            { name: 'parent_id', fk: true, color: 'bg-yellow-400' },
                        ]}
                    />
                    <TableBox
                        title="post_categories"
                        iconColor="text-indigo-400"
                        delay={0.5}
                        fields={[
                            { name: 'post_id', fk: true, color: 'bg-blue-400' },
                            { name: 'category_id', fk: true, color: 'bg-yellow-400' },
                            { name: 'order' },
                        ]}
                    />
                    <TableBox
                        title="tags"
                        icon={Star}
                        iconColor="text-orange-400"
                        delay={0.6}
                        fields={[
                            { name: 'id', pk: true },
                            { name: 'name' },
                            { name: 'slug' },
                            { name: 'usage_count' },
                        ]}
                    />
                    <TableBox
                        title="post_tags"
                        iconColor="text-pink-400"
                        delay={0.7}
                        fields={[
                            { name: 'post_id', fk: true, color: 'bg-blue-400' },
                            { name: 'tag_id', fk: true, color: 'bg-orange-400' },
                            { name: 'added_at' },
                        ]}
                    />
                    <TableBox
                        title="user_activity"
                        icon={Clock}
                        iconColor="text-cyan-400"
                        delay={0.8}
                        fields={[
                            { name: 'id', pk: true },
                            { name: 'user_id', fk: true, color: 'bg-purple-400' },
                            { name: 'action_type' },
                            { name: 'target_type' },
                            { name: 'target_id' },
                        ]}
                    />
                    <TableBox
                        title="notifications"
                        icon={Calendar}
                        iconColor="text-red-400"
                        delay={0.9}
                        fields={[
                            { name: 'id', pk: true },
                            { name: 'user_id', fk: true, color: 'bg-purple-400' },
                            { name: 'type' },
                            { name: 'read_at' },
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
