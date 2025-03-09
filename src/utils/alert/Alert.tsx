"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Info, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AlertInfoProps {
  title: string;
  description: string;
  type: "error" | "info" | "success"; 
}

export default function AlertInfo({ title, description, type }: AlertInfoProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 800); 
    const autoClose = setTimeout(() => setIsVisible(false), 4000); 

    return () => {
      clearTimeout(timeout);
      clearTimeout(autoClose);
    };
  }, []);

  const getAlertStyles = () => {
    switch (type) {
      case "error":
        return {
          bgColor: "bg-red-100",
          borderColor: "border-red-500",
          textColor: "text-red-600",
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        };
      case "info":
        return {
          bgColor: "bg-blue-100",
          borderColor: "border-blue-500",
          textColor: "text-blue-600",
          icon: <Info className="h-4 w-4 text-blue-500" />,
        };
      case "success":
        return {
          bgColor: "bg-green-100",
          borderColor: "border-green-500",
          textColor: "text-green-600",
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        };
      default:
        return {
          bgColor: "bg-gray-100",
          borderColor: "border-gray-500",
          textColor: "text-gray-600",
          icon: <AlertCircle className="h-4 w-4 text-gray-500" />,
        };
    }
  };

  const { bgColor, borderColor, textColor, icon } = getAlertStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -30, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <Alert
            variant="destructive"
            className={`shadow-lg w-[280px] ${bgColor} ${borderColor} ${textColor} rounded-lg px-3 py-2 flex items-center gap-2`}
          >
            {icon}
            <div className="flex flex-col">
              <AlertTitle className="text-xs font-semibold">{title}</AlertTitle>
              <AlertDescription className="text-xs opacity-80">{description}</AlertDescription>
            </div>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
