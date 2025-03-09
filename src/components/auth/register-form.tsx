"use client"

import {ChangeEvent, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react" 
import authTranslate from "@/utils/translate/authTranslate";
import { useLanguage } from "@/context/language/LanguageContext";
import PasswordStrengthMeter from "../password/PasswordStrengthMeter";
import {passwordValidation, PasswordValidationInterface} from "@/utils/validation/auth/passwordValidation"
import { EmailValidation } from "@/utils/validation/auth/emailValidation"
import { HoverMessage } from "../messages/hoverMessage"

export default function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {

  const {language} = useLanguage();

  const passwordRequirementsMessage = [
    authTranslate[language].passwordLength,
    authTranslate[language].passwordLowercase,
    authTranslate[language].passwordUppercase,
    authTranslate[language].passwordNumber,
  ]

  const passwordLevelInWords = [
    authTranslate[language].veryWeak,
    authTranslate[language].weak,
    authTranslate[language].average,
    authTranslate[language].strong,
    authTranslate[language].veryStrong,
]
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordLevel, setPasswordLevel] = useState<number>(0);

  const [emailIsValid, setEmailIsValid] = useState<boolean>(true);
  const [passwordsMatch, setPasswordMatch] = useState<boolean>(true);
  const [passwordIsStrong, setPasswordIsStrong] = useState<boolean>(true);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const onSumbitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    const { emailIsValid } = EmailValidation(email);

    setEmailIsValid(emailIsValid);
    setPasswordMatch(password === confirmPassword);
    setPasswordIsStrong(passwordLevel > 3);
  }

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;

    if (!emailIsValid) {
      const { emailIsValid } = EmailValidation(newEmail);
      setEmailIsValid(emailIsValid);
    }

    setEmail(newEmail);
  }

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {

    const newPassword = e.target.value;

    const testPassword: PasswordValidationInterface = passwordValidation(newPassword);
    const newPasswordLevel = Object.keys(testPassword).filter(key => testPassword[key as keyof PasswordValidationInterface] === true).length;
    if (!passwordIsStrong) {
      setPasswordIsStrong(newPasswordLevel > 3);
    }
    setPasswordLevel(newPasswordLevel)
    setPassword(e.target.value);
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{authTranslate[language].createAccount}</h1>
        <p className="text-balance text-sm text-muted-foreground">
          {authTranslate[language].noAccount}
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">{authTranslate[language].email}</Label>
          <Input 
          value={email} 
          onChange={onChangeEmail} 
          id="email" 
          type="text" 
          placeholder="user@example.com" 
          className={emailIsValid ? "" : "border-red-500"}
           />
        {emailIsValid ||
          <p className="text-red-500 text-xs">{authTranslate[language].emailFormat}</p>
        }
        </div>
        
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{authTranslate[language].password}</Label>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={authTranslate[language].enterYourPassword}
              onChange={onChangePassword}
              value={password}
              className={passwordIsStrong ? "" : "border-red-500"}
              
            />

            {passwordIsStrong || (
              <div className="text-red-500 text-xs inline-flex items-center">
                {authTranslate[language].passwordDoesNotMeetRequirements}
                <HoverMessage title={authTranslate[language].passwordRequirements} messages={passwordRequirementsMessage} />
              </div>
            )}


            <div
                className={`absolute right-2 top-1/2 transform -translate-y-${passwordIsStrong? 2 : 5} cursor-pointer`}
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
            <Label htmlFor="confirm-password">{authTranslate[language].confirmPassword}</Label>
          </div>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder={authTranslate[language].confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              className={passwordsMatch ? "" : "border-red-500"}
            />
             {passwordsMatch ||
              <div className="text-red-500 text-xs">{authTranslate[language].passwordsDoNotMatch}</div>
            }
          </div>
            {passwordLevel > 0 && (
                <>
                <div className="text-xs">{authTranslate[language].yourPasswordIs}: {passwordLevelInWords[passwordLevel - 1]} </div>
                <PasswordStrengthMeter passwordStrengthValue={passwordLevel}/>
              </>
            )}
            
        </div>
        <Button type="submit" className="w-full cursor-pointer" onClick={onSumbitHandler}>
          {authTranslate[language].createAccount}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            {authTranslate[language].orContinueWith}
          </span>
        </div>
        <Button 
        variant="outline" 
        className="w-full cursor-pointer" 
        >
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
         Google
        </Button>
      </div>
    </form>
  )
}
