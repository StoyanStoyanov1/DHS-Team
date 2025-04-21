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
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:-translate-y-2 border border-gray-200 dark:border-gray-800 space-y-4 group hover:border-blue-400 dark:hover:border-blue-400 hover:bg-gradient-to-br hover:from-white/90 hover:to-blue-50/50 dark:hover:from-gray-900/90 dark:hover:to-blue-900/20"
        style={{ animationDelay: delay }}
    >
        <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white mb-4 shadow-md group-hover:shadow-lg group-hover:shadow-blue-400/30 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{description}</p>
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
            {/* Декоративни елементи */}
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute top-40 right-10 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
            
            {/* Плаващи частици */}
            <div className="absolute top-20 left-[20%] w-3 h-3 bg-blue-400 rounded-full opacity-70 float" style={{ animationDelay: '0.4s' }}></div>
            <div className="absolute top-60 right-[30%] w-4 h-4 bg-purple-400 rounded-full opacity-50 float" style={{ animationDelay: '1.2s' }}></div>
            <div className="absolute bottom-40 left-[40%] w-5 h-5 bg-pink-400 rounded-full opacity-60 float" style={{ animationDelay: '0.8s' }}></div>
            <div className="absolute bottom-20 right-[10%] w-2 h-2 bg-green-400 rounded-full opacity-60 float" style={{ animationDelay: '2s' }}></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Feature cards from hero section - always visible */}
                <div className="relative mb-24">
                    <div className="absolute inset-0 bg-gradient-radial from-secondary/20 to-transparent rounded-full blur-3xl"></div>
                    <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-800/50 hover:shadow-2xl transition-all duration-500 hover:border-blue-300/50 dark:hover:border-blue-700/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Компактни карти с функции */}
                            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 hover:shadow-xl hover:shadow-blue-200/20 dark:hover:shadow-blue-900/20 transition-all duration-500 border border-gray-200/50 dark:border-gray-800/50 hover:border-blue-300 dark:hover:border-blue-700 group float" style={{ animationDelay: '0.1s' }}>
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900 dark:text-blue-300 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-md">
                                    <Bot size={24} className="group-hover:animate-bounce" style={{ animationDuration: '2s' }} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">AI Асистент</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Интелигентен чат бот</p>
                                </div>
                            </div>

                            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 hover:shadow-xl hover:shadow-purple-200/20 dark:hover:shadow-purple-900/20 transition-all duration-500 border border-gray-200/50 dark:border-gray-800/50 hover:border-purple-300 dark:hover:border-purple-700 group float" style={{ animationDelay: '0.3s' }}>
                                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 dark:bg-purple-900 dark:text-purple-300 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-md">
                                    <Code size={24} className="group-hover:rotate-12 transition-transform duration-300" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Софтуерна разработка</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Персонализирани решения</p>
                                </div>
                            </div>

                            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 hover:shadow-xl hover:shadow-green-200/20 dark:hover:shadow-green-900/20 transition-all duration-500 border border-gray-200/50 dark:border-gray-800/50 hover:border-green-300 dark:hover:border-green-700 group float" style={{ animationDelay: '0.5s' }}>
                                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 dark:bg-green-900 dark:text-green-300 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-md">
                                    <Rocket size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">Бързо внедряване</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Оптимизиран процес</p>
                                </div>
                            </div>

                            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 hover:shadow-xl hover:shadow-orange-200/20 dark:hover:shadow-orange-900/20 transition-all duration-500 border border-gray-200/50 dark:border-gray-800/50 hover:border-orange-300 dark:hover:border-orange-700 group float" style={{ animationDelay: '0.7s' }}>
                                <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 dark:bg-orange-900 dark:text-orange-300 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-md group-hover:rotate-45">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings group-hover:rotate-90 transition-transform duration-700">
                                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">Поддръжка</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">24/7 обслужване</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-12 reveal active">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white animate-gradient-x bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 text-transparent bg-300%">Нашите <span className="text-gradient">услуги</span></h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Комбинираме традиционен подход и изкуствен интелект за създаване на
                        оптимални софтуерни решения за вашия бизнес.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal active">
                    {features.map((feature, index) => (
                        <div key={index} className={`float-delay-${index % 3}`}>
                            <FeatureCard
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                delay={feature.delay}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
