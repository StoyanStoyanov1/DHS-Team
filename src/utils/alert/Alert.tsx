"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Info, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
          bgColor: "bg-gradient-to-r from-red-50 to-red-100",
          borderColor: "border-l-4 border-red-500",
          textColor: "text-red-700",
          iconColor: "text-red-500",
          shadowColor: "shadow-red-100",
          icon: <AlertCircle className="h-5 w-5" />,
        };
      case "info":
        return {
          bgColor: "bg-gradient-to-r from-blue-50 to-blue-100",
          borderColor: "border-l-4 border-blue-500",
          textColor: "text-blue-700",
          iconColor: "text-blue-500",
          shadowColor: "shadow-blue-100",
          icon: <Info className="h-5 w-5" />,
        };
      case "success":
        return {
          bgColor: "bg-gradient-to-r from-green-50 to-green-100",
          borderColor: "border-l-4 border-green-500",
          textColor: "text-green-700",
          iconColor: "text-green-500",
          shadowColor: "shadow-green-100",
          icon: <CheckCircle className="h-5 w-5" />,
        };
      default:
        return {
          bgColor: "bg-gradient-to-r from-gray-50 to-gray-100",
          borderColor: "border-l-4 border-gray-500",
          textColor: "text-gray-700",
          iconColor: "text-gray-500",
          shadowColor: "shadow-gray-100",
          icon: <AlertCircle className="h-5 w-5" />,
        };
    }
  };

  const { bgColor, borderColor, textColor, iconColor, shadowColor, icon } = getAlertStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`fixed bottom-4 right-4 flex w-96 items-start gap-3 rounded-lg ${bgColor} ${borderColor} p-4 shadow-lg ${shadowColor} backdrop-blur-sm`}
        >
          <div className={`rounded-full bg-white/80 p-2 ${iconColor}`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold ${textColor}`}>{title}</h3>
            <p className={`mt-1 text-sm opacity-90 ${textColor}`}>{description}</p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className={`rounded-full p-1 ${textColor} opacity-60 hover:opacity-100 transition-opacity`}
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
