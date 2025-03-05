"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authValidateForm } from "@/utils/validation/authValidateForm";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; 

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

  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const passwordButtonRef = useRef<HTMLButtonElement>(null); 
  const confirmPasswordButtonRef = useRef<HTMLButtonElement>(null);

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

  return (
    <Card className="w-full max-w-md p-4 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-gray-700">Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">

          <div>
            <Input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="bg-white text-gray-800 border border-gray-300 focus:ring-2 focus:ring-gray-200"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="bg-white text-gray-800 border border-gray-300 focus:ring-2 focus:ring-gray-200"
            />
            <button
              type="button"
              onClick={handlePasswordClick}
              ref={passwordButtonRef}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <AiFillEyeInvisible className="text-gray-500" />
              ) : (
                <AiFillEye className="text-gray-500" />
              )}
            </button>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className="relative">
            <Input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="bg-white text-gray-800 border border-gray-300 focus:ring-2 focus:ring-gray-200"
            />
            <button
              type="button"
              onClick={handleConfirmPasswordClick}
              ref={confirmPasswordButtonRef}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <AiFillEyeInvisible className="text-gray-500" />
              ) : (
                <AiFillEye className="text-gray-500" />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <Button type="submit" className="w-full text-white bg-gray-500">
            Register
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
