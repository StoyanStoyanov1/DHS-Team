
import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 rounded-full bg-blue-purple-gradient flex items-center justify-center">
                                <span className="text-white font-bold">S</span>
                            </div>
                            <span className="font-bold text-xl text-white dark:text-gray-100">SparkDev</span>
                        </div>
                        <p className="text-gray-300 dark:text-gray-400 max-w-xs">
                            Модерни софтуерни решения с изкуствен интелект за вашия бизнес.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-gray-300 dark:text-gray-400">
                        <div>
                            <h4 className="font-bold mb-4 text-white dark:text-gray-200">Услуги</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-primary transition-colors">AI решения</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Уеб разработка</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Мобилни приложения</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Консултации</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4 text-white dark:text-gray-200">Компания</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-primary transition-colors">За нас</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Екип</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Кариери</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Блог</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4 text-white dark:text-gray-200">Контакти</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-primary transition-colors">contact@sparkdev.com</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">+359 888 123 456</a></li>
                            </ul>

                            <div className="flex gap-4 mt-4">
                                <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-primary" aria-label="Twitter">
                                    <Twitter size={20} />
                                </a>
                                <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-primary" aria-label="LinkedIn">
                                    <Linkedin size={20} />
                                </a>
                                <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-primary" aria-label="GitHub">
                                    <Github size={20} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-700 dark:border-gray-800 text-center">
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                        © {currentYear} SparkDev. Всички права запазени.
                    </p>
                </div>
            </div>
    );
};

export default Footer;