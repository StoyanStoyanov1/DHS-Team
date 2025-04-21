
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, 
  Send,
  FileText
} from 'lucide-react';

const formSchema = z.object({
  projectName: z.string().min(2, { message: 'Името на проекта е задължително' }),
  description: z.string().min(10, { message: 'Моля, добавете по-подробно описание' }),
  goals: z.string().min(10, { message: 'Моля, опишете целите на проекта' }),
  audience: z.string().min(2, { message: 'Целевата аудитория е задължителна' }),
  features: z.array(z.string()).optional(),
  design: z.string().optional(),
  budget: z.string().min(1, { message: 'Моля, изберете бюджетен диапазон' }),
  timeline: z.string().min(1, { message: 'Моля, изберете времеви диапазон' }),
  name: z.string().min(2, { message: 'Вашето име е задължително' }),
  email: z.string().email({ message: 'Моля, въведете валиден имейл адрес' }),
  phone: z.string().min(6, { message: 'Моля, въведете валиден телефонен номер' }),
  additionalNotes: z.string().optional(),
});

const features = [
  { id: 'website', label: 'Уебсайт' },
  { id: 'ecommerce', label: 'E-commerce функционалност' },
  { id: 'auth', label: 'Потребителска идентификация' },
  { id: 'blog', label: 'Блог' },
  { id: 'mobile', label: 'Мобилна оптимизация' },
  { id: 'seo', label: 'SEO оптимизация' },
  { id: 'analytics', label: 'Анализ и статистики' },
  { id: 'admin', label: 'Админ панел' },
];

const ProjectRequest: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: '',
      description: '',
      goals: '',
      audience: '',
      features: [],
      design: '',
      budget: '',
      timeline: '',
      name: '',
      email: '',
      phone: '',
      additionalNotes: '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    toast({
      title: "Заявката е изпратена успешно!",
      description: "Ще се свържем с вас скоро за обсъждане на вашия проект.",
    });
    
    // Reset the form and redirect to home page after a brief delay
    setTimeout(() => {
      form.reset();
      navigate('/');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Button 
              variant="ghost" 
              className="mb-6 gap-2"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={16} />
              Назад към началната страница
            </Button>
            
            <div className="glassmorphism rounded-xl p-8 shadow-lg mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-blue-purple-gradient flex items-center justify-center text-white">
                  <FileText size={20} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">Заявка за проект</h1>
              </div>
              
              <p className="text-muted-foreground mb-8">
                Попълнете формуляра по-долу с подробности за вашия проект и ние ще се свържем с вас, 
                за да обсъдим как можем да ви помогнем да го реализирате.
              </p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Детайли за проекта</h2>
                    
                    <FormField
                      control={form.control}
                      name="projectName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Име на проекта</FormLabel>
                          <FormControl>
                            <Input placeholder="Въведете име на проекта" {...field} />
                          </FormControl>
                          <FormDescription>
                            Кратко име, което описва вашия проект.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Описание на проекта</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Опишете подробно вашия проект..." 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Детайлно описание на това, което искате да постигнете с проекта.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="goals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Цели на проекта</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Какви са целите, които искате да постигнете..." 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Какво искате да постигнете с този проект?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="audience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Целева аудитория</FormLabel>
                          <FormControl>
                            <Input placeholder="За кого е предназначен проектът?" {...field} />
                          </FormControl>
                          <FormDescription>
                            Описание на хората, които ще ползват вашия проект.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Технически изисквания</h2>
                    
                    <FormField
                      control={form.control}
                      name="features"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Необходими функционалности</FormLabel>
                            <FormDescription>
                              Изберете функционалностите, които искате да включите в проекта.
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {features.map((feature) => (
                              <FormField
                                key={feature.id}
                                control={form.control}
                                name="features"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={feature.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(feature.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value || [], feature.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== feature.id
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {feature.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="design"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Дизайн предпочитания</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Опишете вашите предпочитания за дизайна, референции, цветове и т.н..." 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Имате ли специфични изисквания за визията на проекта?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Бюджет и срокове</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Бюджет</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Изберете бюджетен диапазон" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="под 2 000 лв.">под 2 000 лв.</SelectItem>
                                <SelectItem value="2 000 - 5 000 лв.">2 000 - 5 000 лв.</SelectItem>
                                <SelectItem value="5 000 - 10 000 лв.">5 000 - 10 000 лв.</SelectItem>
                                <SelectItem value="10 000 - 20 000 лв.">10 000 - 20 000 лв.</SelectItem>
                                <SelectItem value="над 20 000 лв.">над 20 000 лв.</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Очакван бюджет за проекта.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="timeline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Срок за изпълнение</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Изберете период" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="под 1 месец">под 1 месец</SelectItem>
                                <SelectItem value="1-2 месеца">1-2 месеца</SelectItem>
                                <SelectItem value="3-6 месеца">3-6 месеца</SelectItem>
                                <SelectItem value="над 6 месеца">над 6 месеца</SelectItem>
                                <SelectItem value="гъвкав график">Гъвкав график</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Колко спешно е изпълнението на проекта?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Контактна информация</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Вашето име</FormLabel>
                            <FormControl>
                              <Input placeholder="Въведете вашето име" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Имейл адрес</FormLabel>
                            <FormControl>
                              <Input placeholder="вашият@имейл.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Телефон</FormLabel>
                            <FormControl>
                              <Input placeholder="+359 88 123 4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Допълнителна информация</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Друга информация, която искате да споделите..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Всякаква друга информация, която смятате за важна за вашия проект.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-purple-gradient hover:opacity-90 transition-opacity"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Изпрати заявка за проект
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectRequest;
