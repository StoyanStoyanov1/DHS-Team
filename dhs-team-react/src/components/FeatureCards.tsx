
import React from 'react';
import { Bot, Code, Settings, Rocket } from 'lucide-react';
import { Card } from '@/components/ui/card';

const FeatureCards = () => {
  const features = [
    {
      icon: <Bot className="h-6 w-6 text-blue-500" />,
      title: "AI Асистент",
      description: "Интелигентен чат бот"
    },
    {
      icon: <Code className="h-6 w-6 text-purple-500" />,
      title: "Софтуерна разработка",
      description: "Персонализирани решения"
    },
    {
      icon: <Rocket className="h-6 w-6 text-green-500" />,
      title: "Бързо внедряване",
      description: "Оптимизиран процес"
    },
    {
      icon: <Settings className="h-6 w-6 text-orange-500" />,
      title: "Поддръжка",
      description: "24/7 обслужване"
    }
  ];

  return (
    <>
      {features.map((feature, index) => (
        <Card 
          key={index} 
          className="p-4 hover:shadow-lg transition-shadow duration-300 bg-white/50 backdrop-blur-sm border-white/20 flex items-start gap-4"
        >
          <div className="rounded-lg p-2 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm">
            {feature.icon}
          </div>
          <div>
            <h3 className="font-medium text-lg">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        </Card>
      ))}
    </>
  );
};

export default FeatureCards;
