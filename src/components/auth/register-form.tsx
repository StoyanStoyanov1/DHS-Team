"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react" 

export default function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to register to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="user@example.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter your password"
            />
            <div
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordVisibility}
                >
                {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                ) : (
                    <Eye className="h-5 w-5" />
                )}
            </div>

          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="confirm-password">Confirm Password</Label>
          </div>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Confirm your password"
            />
          </div>
        </div>
        <Button type="submit" className="w-full cursor-pointer">
          Login
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-5 w-5 mr-2"
          >
            <path
              fill="currentColor"
              d="M12 12v-2.5h10.92c.09.51.15 1.04.15 1.75 0 2.34-.84 4.3-2.23 5.71C19.49 18.99 16.98 20 14 20c-4 0-7.37-2.67-8.57-6.32-1.2-3.64.14-7.64 3.3-9.95 3.17-2.31 7.57-2.31 10.74 0l-1.88 1.86c-2.2-1.5-5.13-1.5-7.2 0-2.06 1.5-3.04 4.17-2.3 6.68.74 2.5 3.03 4.23 5.63 4.23 1.63 0 3.03-.49 4.15-1.37.85-.65 1.47-1.58 1.72-2.64H12z"
            />
          </svg>
          Login with Google
        </Button>
      </div>
    </form>
  )
}
