"use react"

import React from 'react';
import { Bot, Code, Lightbulb, MessageCircle, Settings, Users, Rocket } from 'lucide-react';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay = '0s' }) => (
    <div
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 duration-300 border border-gray-200 dark:border-gray-800 space-y-4"
        style={{ animationDelay: delay }}
    >
        <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
);

const FeaturesSection: React.FC = () => {
    const features = [
        {
            icon: <Bot size={24} />,
            title: "AI Чат Бот",
            description: "Интелигентен асистент, който ще събере цялата необходима информация за вашия проект.",
            delay: "0s"
        },
        {
            icon: <MessageCircle size={24} />,
            title: "Класически подход",
            description: "Традиционна форма за поръчка с детайлни въпроси за конкретни изисквания.",
            delay: "0.1s"
        },
        {
            icon: <Lightbulb size={24} />,
            title: "Персонализирани решения",
            description: "Разработка на софтуер, съобразен с конкретните нужди на вашия бизнес.",
            delay: "0.2s"
        },
        {
            icon: <Code size={24} />,
            title: "Модерни технологии",
            description: "Използваме последните технологии за разработка на бързи и надеждни приложения.",
            delay: "0.3s"
        },
        {
            icon: <Users size={24} />,
            title: "Експертен екип",
            description: "Опитен екип от разработчици, дизайнери и продуктови мениджъри.",
            delay: "0.4s"
        },
        {
            icon: <Settings size={24} />,
            title: "Техническа поддръжка",
            description: "Непрекъсната поддръжка и обновяване на разработените решения.",
            delay: "0.5s"
        }
    ];

    return (
        <section id="features" className="py-20 relative">
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4">
                {/* Feature cards from hero section */}
                <div className="relative mb-24 reveal">
                    <div className="absolute inset-0 bg-gradient-radial from-secondary/20 to-transparent rounded-full blur-3xl"></div>
                    <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-800 transition-all duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Update the first four feature cards with improved styling */}
                            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">AI Асистент</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Интелигентен чат бот</p>
                                </div>
                            </div>

                            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800">
                                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                                    <Code size={24} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Софтуерна разработка</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Персонализирани решения</p>
                                </div>
                            </div>

                            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800">
                                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 dark:bg-green-900 dark:text-green-300">
                                    <Rocket size={24} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Бързо внедряване</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Оптимизиран процес</p>
                                </div>
                            </div>

                            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800">
                                <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 dark:bg-orange-900 dark:text-orange-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings">
                                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Поддръжка</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">24/7 обслужване</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Нашите <span className="text-gradient">услуги</span></h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Комбинираме традиционен подход и изкуствен интелект за създаване на
                        оптимални софтуерни решения за вашия бизнес.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            delay={feature.delay}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
