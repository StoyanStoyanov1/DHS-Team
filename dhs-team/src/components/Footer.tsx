import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="bg-gray-900 dark:bg-gray-950 text-gray-200 dark:text-gray-300 py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 rounded-full bg-blue-purple-gradient flex items-center justify-center">
                                <span className="text-white font-bold">S</span>
                            </div>
                            <span className="font-bold text-xl text-white">SparkDev</span>
                        </div>
                        <p className="text-gray-300 max-w-xs">
                            Модерни софтуерни решения с изкуствен интелект за вашия бизнес.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-gray-300">
                        <div>
                            <h4 className="font-bold mb-4 text-white">Услуги</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">AI решения</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Уеб разработка</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Мобилни приложения</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Консултации</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4 text-white">Компания</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">За нас</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Екип</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Кариери</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Блог</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4 text-white">Контакти</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">contact@sparkdev.com</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">+359 888 123 456</a></li>
                            </ul>

                            <div className="flex gap-4 mt-4">
                                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Twitter">
                                    <Twitter size={20} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="LinkedIn">
                                    <Linkedin size={20} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="GitHub">
                                    <Github size={20} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-700 text-center">
                    <p className="text-gray-400 text-sm">
                        © {currentYear} SparkDev. Всички права запазени.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Footer;