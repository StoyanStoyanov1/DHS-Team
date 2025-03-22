"use client"

import { ChangeEvent, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock } from "lucide-react" 
import { EmailValidation } from "@/utils/validation/auth/emailValidation"
import { motion } from "framer-motion"
import PasswordStrengthMeter from "@/components/password/PasswordStrengthMeter"

const getStrengPasswordText = (level: number): string => {
    switch (level) {
      case 1: return "Sehr schwach";
      case 2: return "Schwach";
      case 3: return "Durchschnitt";
      case 4: return "Stark";
      case 5: return "Sehr stark";
      default: return "";
    }
}

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
            Konto erstellen
          </motion.h1>
          <p className="text-balance text-sm text-muted-foreground">
          Kein Konto? Vereinbare jetzt deinen Termin und werde Teil unserer exklusiven Beauty-Community – in nur wenigen Schritten!
          </p>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="email" className="text-sm font-medium">
              E-Mail
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
                  Gültigen Format user@domain.com
                </motion.p>
              )}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="password" className="text-sm font-medium">
              Passwort
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
                    placeholder="Geben Sie Ihr Passwort ein"
                    value={password}
                    onChange={onChangePassword}
                    onFocus={() => setIsFocused('password')}
                    onBlur={() => setIsFocused('')}
                    className="pl-10 pr-10 transition-all duration-200 border-input hover:border-primary"
                  />
                </motion.div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Passwort ausblenden" : "Passwort anzeigen"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              <PasswordStrengthMeter passwordStrengthValue={passwordStrength} password={password} text={getStrengPasswordText(passwordStrength)}/>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Passwort bestätigen
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
                    placeholder="Passwort bestätigen"
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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Passwort ausblenden" : "Passwort anzeigen"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              {!passwordsMatch && confirmPassword && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute text-red-500 text-xs mt-1"
                >
                  Passwörter stimmen nicht überein
                </motion.p>
              )}
            </div>
          </div>

          <Button 
            type="submit"
            onClick={onSubmitHandler}
            className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 transform hover:scale-[1.02]"
          >
            Registrieren
          </Button>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative">
              <span className="bg-white px-4 text-sm text-gray-500">
                Oder fahren Sie fort mit
              </span>
            </div>
          </div>

          <Button 
            variant="outline"
            className="w-full border-2 hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
              className="h-5 w-5 mr-2"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              />
            </svg>
            Google
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
