"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form"
import { useState } from "react";

export default function Auth() {
  const [activeTab, setActiveTab] = useState("login"); 

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px] flex justify-center mx-auto p-10">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login" className="cursor-pointer">Anmeldung</TabsTrigger>
        <TabsTrigger value="register" className="cursor-pointer">Registrierung</TabsTrigger>
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
