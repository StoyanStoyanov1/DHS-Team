
"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form"
import authTranslate from "@/utils/translate/authTranslate";
import { useLanguage } from "@/context/language/LanguageContext"

export default function Auth() {
  const { language } = useLanguage();

  return (
    <Tabs defaultValue="login" className="w-[400px] flex justify-center mx-auto p-10">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login" className="cursor-pointer">{authTranslate[language].login}</TabsTrigger>
        <TabsTrigger value="register" className="cursor-pointer">{authTranslate[language].register}</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <LoginForm />
      </TabsContent>
      <TabsContent value="register">
          <RegisterForm />
      </TabsContent>
    </Tabs>
  )
}
