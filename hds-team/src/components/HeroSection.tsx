'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Sparkles } from 'lucide-react';
import CountUp from './CountUp';
import TypewriterText from './TypewriterText';

const HeroSection: React.FC = () => {
    return (
        <div className="relative overflow-hidden">
            <div className="absolute -top-32 -left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse-slow float"></div>
            <div className="absolute top-40 -right-20 w-[30rem] h-[30rem] bg-purple-500/20 rounded-full blur-3xl float float-delay-1"></div>
            <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl animate-pulse-slow float float-delay-2" style={{ animationDelay: '1s' }}></div>

            <div className="space-y-6 relative z-10 flex flex-col items-center">
                <div className="inline-block rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md px-4 py-1.5 text-sm font-medium mb-2 border border-white/20 hover:border-white/40 transition-all shadow-lg transform hover:-translate-y-1">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span>Иновативни софтуерни решения</span>
          </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-center">
          <span className="inline-block">
            Модерни решения с <br />
          </span>
                    <div className="fixed-height-container justify-center">
                        <TypewriterText
                            phrases={[
                                "изкуствен интелект",
                                "машинно обучение",
                                "невронни мрежи",
                                "чат GPT технология",
                                "предиктивен анализ"
                            ]}
                            typingSpeed={80}
                            deletingSpeed={40}
                            delayAfterPhrase={2000}
                        />
                    </div>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl text-center">
                    Разработваме персонализиран софтуер за вашия бизнес, съчетавайки
                    традиционни подходи и изкуствен интелект за оптимални резултати.
                </p>

                <div className="flex flex-wrap justify-center gap-5 pt-6">
                    <Button
                        className="bg-blue-purple-gradient hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-white text-base px-8 py-6 h-auto group modern-button"
                    >
                        <span>Поръчай сега</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <Button
                        variant="outline"
                        className="border-primary/30 text-primary hover:bg-primary/5 hover:border-primary transition-all duration-300 transform hover:scale-105 backdrop-blur-sm text-base px-8 py-6 h-auto modern-button"
                    >
                        <Code className="mr-2 h-4 w-4" />
                        <span>Научи повече</span>
                    </Button>
                </div>

                <div className="flex items-center justify-center gap-4 pt-8">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center transform hover:scale-110 transition-transform duration-200 float shadow-lg"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            >
                                <span className="text-xs font-medium text-white">👤</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-base text-muted-foreground bg-white/10 backdrop-blur-md py-1.5 px-3 rounded-full border border-white/10">
            <span className="font-medium text-foreground">
              <CountUp end={100} suffix="+" /> удовлетворени клиенти
            </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;