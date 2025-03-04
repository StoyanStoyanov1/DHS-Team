"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", password: "", confirmPassword: "", });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Registering user:", form);
  };

  return (
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-gray-700">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="bg-white text-gray-800 border border-gray-300 focus:ring-2 focus:ring-gray-200"
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="bg-white text-gray-800 border border-gray-300 focus:ring-2 focus:ring-gray-200"
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="bg-white text-gray-800 border border-gray-300 focus:ring-2 focus:ring-gray-200"
              required
            />
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="bg-white text-gray-800 border border-gray-300 focus:ring-2 focus:ring-gray-200"
              required
            />
            <Button type="submit" className="w-full text-white bg-gray-500">Register</Button>
          </form>
        </CardContent>
      </Card>
  );
}
