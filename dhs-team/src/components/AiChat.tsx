
import React from 'react';
import ChatInterface from './ChatInterface';

const AiChat: React.FC = () => {
    return (
        <section id="ai-demo" className="py-20 relative">
            <div className="blurred-circle bg-blue-500/20 h-64 w-64 top-20 -right-10 float"></div>

            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Демонстрация на <span className="text-gradient">AI асистента</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Нашият интелигентен асистент ще ви зададе всички важни въпроси, за да разберем
                        вашите нужди и да предложим най-подходящото решение.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto glassmorphism rounded-xl overflow-hidden shadow-xl border border-white/30 dark:border-white/10 assemble floating-card">
                    <div className="bg-blue-purple-gradient p-4 flex items-center gap-2">
                        <h3 className="font-medium text-white">SparkDev AI Асистент</h3>
                    </div>

                    <div className="h-[500px]"> {/* Увеличих височината от h-80 на h-[500px] */}
                        <ChatInterface />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AiChat;