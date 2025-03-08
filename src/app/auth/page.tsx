
"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form"

export default function Auth() {
  return (
    <Tabs defaultValue="login" className="w-[400px] flex justify-center mx-auto p-10">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login" className="cursor-pointer">Login</TabsTrigger>
        <TabsTrigger value="register" className="cursor-pointer">Register</TabsTrigger>
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
