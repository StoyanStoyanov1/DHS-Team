import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authValidateForm } from "@/utils/validation/authValidateForm";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; 
import { useLanguage } from "@/context/language/LanguageContext";
import authTranslate from "@/utils/translate/authTranslate";
import { X, Check } from "lucide-react";

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const getIcon = (isTrue: boolean): React.ReactElement => {
    if (!isTrue) {
      return <X className="text-red-500 text-xs w-3 h-3" />;
    }
    
    return <Check className="text-green-500 text-xs w-3 h-3" />;
  }

  const { language } = useLanguage();

  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const passwordButtonRef = useRef<HTMLButtonElement>(null); 
  const confirmPasswordButtonRef = useRef<HTMLButtonElement>(null);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = authValidateForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Registering user:", form);
    setForm({ email: "", password: "", confirmPassword: "" });
    setErrors({});
  };

  const handlePasswordClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setShowPassword((prev) => !prev);
  };

  const handleConfirmPasswordClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setShowConfirmPassword((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      if (document.activeElement === emailInputRef.current) {
        passwordInputRef.current?.focus();
      } else if (document.activeElement === passwordInputRef.current) {
        confirmPasswordInputRef.current?.focus();
      }
    } else if (e.key === "ArrowUp") {
      if (document.activeElement === confirmPasswordInputRef.current) {
        passwordInputRef.current?.focus();
      } else if (document.activeElement === passwordInputRef.current) {
        emailInputRef.current?.focus();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Card className="w-full shadow-none">
      <CardHeader>
        <CardTitle className="text-center text-sm text-gray-700">{authTranslate[language].register}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-2">

          <div>
            <Input
              name="email"
              placeholder={authTranslate[language].email}
              value={form.email}
              onChange={handleChange}
              ref={emailInputRef}
              className="bg-white text-gray-800 border border-gray-300 focus:ring-1 focus:ring-gray-200 text-[10px] py-1 px-2 h-6" 
            />
          </div>

          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={authTranslate[language].password}
              value={form.password}
              onChange={handleChange}
              ref={passwordInputRef}
              className="bg-white text-gray-800 border border-gray-300 focus:ring-1 focus:ring-gray-200 text-[10px] py-1 px-2 h-6" // Намален размер на шрифта
            />
            <button
              type="button"
              onClick={handlePasswordClick}
              ref={passwordButtonRef}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <AiFillEyeInvisible className="text-gray-500 text-sm" />
              ) : (
                <AiFillEye className="text-gray-500 text-sm" />
              )}
            </button>
          </div>

          <div className="relative">
            <Input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={authTranslate[language].confirmPassword}
              value={form.confirmPassword}
              onChange={handleChange}
              ref={confirmPasswordInputRef}
              className="bg-white text-gray-800 border border-gray-300 focus:ring-1 focus:ring-gray-200 text-[10px] py-1 px-2 h-6" // Намален размер на шрифта
            />
            <button
              type="button"
              onClick={handleConfirmPasswordClick}
              ref={confirmPasswordButtonRef}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <AiFillEyeInvisible className="text-gray-500 text-sm" />
              ) : (
                <AiFillEye className="text-gray-500 text-sm" />
              )}
            </button>
          </div>

          <div className="text-[8px] text-blue-500 mt-1 space-y-1">
          <p className="inline-flex items-center">
              {getIcon(false)} {authTranslate[language].emailFormat}
            </p>
            <p className="inline-flex items-center">
              {getIcon(false)} {authTranslate[language].passwordLength}
            </p>
            <p className="inline-flex items-center">
              {getIcon(true)} {authTranslate[language].passwordUppercase}
            </p>
            <p className="inline-flex items-center">
              {getIcon(false)} {authTranslate[language].passwordLowercase}
            </p>
            <p className="inline-flex items-center">
              {getIcon(true)} {authTranslate[language].passwordNumber}
            </p>
          </div>

          <div className="flex justify-center">
            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-[120px] text-white bg-[#9B1C31] text-xs py-[0.25rem] mx-auto cursor-pointer hover:bg-[#7A1426] transition-colors"
              >
                {authTranslate[language].createAccount}
              </Button>
            </div>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}
