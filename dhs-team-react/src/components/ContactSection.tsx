
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, Bot } from 'lucide-react';

const ContactSection: React.FC = () => {
  const { toast } = useToast();

  // Отваря нашия AI чат долу в дясно
  const openAiChat = () => {
    const chatButton = document.querySelector('button[aria-label="Open AI Chat"]')
    || document.querySelector('.fixed.bottom-4.right-4');
    if (chatButton instanceof HTMLButtonElement) {
      chatButton.click();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Успешно изпратена заявка",
      description: "Ще се свържем с вас в рамките на 24 часа.",
    });
  };

  return (
    <section id="contact" className="py-12 relative">
      <div className="blurred-circle bg-purple-500/20 h-80 w-80 -bottom-20 right-0"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Свържете се с <span className="text-gradient">нас</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Попълнете формата по-долу или използвайте AI асистента, 
            за да започнем работа по вашия проект.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="glassmorphism rounded-xl p-8 shadow-lg order-2 lg:order-1">
            <h3 className="text-xl font-bold mb-6">Изпратете запитване</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium">Име</label>
                  <Input id="name" type="text" placeholder="Вашето име" required className="w-full" />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium">Имейл</label>
                  <Input id="email" type="email" placeholder="вашият@имейл.com" required className="w-full" />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block mb-2 text-sm font-medium">Тема</label>
                <Input id="subject" type="text" placeholder="Тема на съобщението" required className="w-full" />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 text-sm font-medium">Съобщение</label>
                <Textarea id="message" placeholder="Опишете вашето запитване или проект..." rows={5} required className="w-full" />
              </div>
              <div>
                <Button type="submit" className="w-full bg-blue-purple-gradient hover:opacity-90 transition-opacity">
                  <Send className="mr-2 h-4 w-4" />
                  Изпрати запитване
                </Button>
              </div>
            </form>
          </div>
          <div className="order-1 lg:order-2">
            <div className="glassmorphism rounded-xl p-6 shadow-lg flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-blue-purple-gradient flex items-center justify-center text-white mb-4">
                <Bot size={32} />
              </div>
              <h4 className="font-bold text-lg mb-2">Предпочитате AI асистент?</h4>
              <p className="text-muted-foreground mb-4">
                Нашият виртуален асистент може да ви помогне да опишете вашия проект и да съберем необходимата информация.
              </p>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5"
                type="button"
                onClick={openAiChat}
              >
                Старт с AI асистента
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
