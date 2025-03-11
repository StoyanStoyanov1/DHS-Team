"use client"

import { ChangeEvent, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock } from "lucide-react" 
import authTranslate from "@/utils/translate/authTranslate"
import { useLanguage } from "@/context/language/LanguageContext"
import { EmailValidation } from "@/utils/validation/auth/emailValidation"
import { motion } from "framer-motion"
import PasswordStrengthMeter from "@/components/password/PasswordStrengthMeter"

const inputVariants = {
  focus: { scale: 1.02, transition: { duration: 0.2 } },
  blur: { scale: 1, transition: { duration: 0.2 } }
};

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

interface RegisterFormProps extends React.ComponentPropsWithoutRef<"form"> {
  className?: string;
}

export default function RegisterForm({ className, ...props }: RegisterFormProps) {
  const {language} = useLanguage();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [emailIsValid, setEmailIsValid] = useState<boolean>(true);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
  const [isFocused, setIsFocused] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev)
  }

  const validatePasswords = () => {
    setPasswordsMatch(password === confirmPassword);
  }

  const onSubmitHandler = (e: React.FormEvent): void => {
    e.preventDefault();
    const { emailIsValid } = EmailValidation(email);
    setEmailIsValid(emailIsValid);
    validatePasswords();
  }

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>): void => {
    const newEmail = e.target.value;
    if (!emailIsValid) {
      const { emailIsValid } = EmailValidation(newEmail);
      setEmailIsValid(emailIsValid);
    }
    setEmail(newEmail);
  }

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  }

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
    if (confirmPassword) validatePasswords();
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className={cn("w-full max-w-md mx-auto", className)}
    >
      <form {...props} className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow-xl">
        <div className="flex flex-col items-center gap-2 text-center">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          >
            {authTranslate[language].createAccount}
          </motion.h1>
          <p className="text-balance text-sm text-muted-foreground">
            {authTranslate[language].noAccount}
          </p>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="email" className="text-sm font-medium">
              {authTranslate[language].email}
            </Label>
            <div className="relative">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-gray-400 pointer-events-none" />
                <motion.div
                  variants={inputVariants}
                  animate={isFocused === 'email' ? 'focus' : 'blur'}
                >
                  <Input 
                    value={email}
                    onChange={onChangeEmail}
                    onFocus={() => setIsFocused('email')}
                    onBlur={() => setIsFocused('')}
                    id="email"
                    type="text"
                    placeholder="user@example.com"
                    className={cn(
                      "pl-10 transition-all duration-200",
                      emailIsValid ? "border-input hover:border-primary" : "border-red-500"
                    )}
                  />
                </motion.div>
              </div>
              {!emailIsValid && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute text-red-500 text-xs mt-1"
                >
                  {authTranslate[language].emailFormat}
                </motion.p>
              )}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="password" className="text-sm font-medium">
              {authTranslate[language].password}
            </Label>
            <div className="relative">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-gray-400 pointer-events-none" />
                <motion.div
                  variants={inputVariants}
                  animate={isFocused === 'password' ? 'focus' : 'blur'}
                >
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={authTranslate[language].enterYourPassword}
                    value={password}
                    onChange={onChangePassword}
                    onFocus={() => setIsFocused('password')}
                    onBlur={() => setIsFocused('')}
                    className="pl-10 pr-10 transition-all duration-200 border-input hover:border-primary"
                  />
                </motion.div>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-[16px] w-[16px]" />
                  ) : (
                    <Eye className="h-[16px] w-[16px]" />
                  )}
                </button>
              </div>
              <PasswordStrengthMeter passwordStrengthValue={passwordStrength} password={password} />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              {authTranslate[language].confirmPassword}
            </Label>
            <div className="relative">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-gray-400 pointer-events-none" />
                <motion.div
                  variants={inputVariants}
                  animate={isFocused === 'confirmPassword' ? 'focus' : 'blur'}
                >
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={authTranslate[language].confirmPassword}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      validatePasswords();
                    }}
                    onFocus={() => setIsFocused('confirmPassword')}
                    onBlur={() => setIsFocused('')}
                    className={cn(
                      "pl-10 pr-10 transition-all duration-200",
                      passwordsMatch ? "border-input hover:border-primary" : "border-red-500"
                    )}
                  />
                </motion.div>
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-[16px] w-[16px]" />
                  ) : (
                    <Eye className="h-[16px] w-[16px]" />
                  )}
                </button>
              </div>
              {!passwordsMatch && confirmPassword && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute text-red-500 text-xs mt-1"
                >
                  {authTranslate[language].passwordsDoNotMatch}
                </motion.p>
              )}
            </div>
          </div>

          <Button 
            type="submit"
            onClick={onSubmitHandler}
            className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 transform hover:scale-[1.02]"
          >
            {authTranslate[language].register}
          </Button>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative">
              <span className="bg-white px-4 text-sm text-gray-500">
                {authTranslate[language].orContinueWith}
              </span>
            </div>
          </div>

          <Button 
            variant="outline"
            className="w-full border-2 hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02]"
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
    </motion.div>
  );
}
