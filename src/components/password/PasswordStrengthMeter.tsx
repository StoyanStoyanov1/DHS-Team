import React from "react";
import { motion } from "framer-motion";

interface PasswordStrengthMeterProps {
  passwordStrengthValue: number;
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ passwordStrengthValue, password }) => {
  const getStrengthColor = (strength: number) => {
    switch (strength) {
      case 0:
        return {
          gradient: "from-red-200 via-red-400 to-red-500",
          shadow: "shadow-red-200",
          width: "w-[20%]",
          text: "Много слаба"
        };
      case 1:
        return {
          gradient: "from-orange-200 via-orange-400 to-orange-500",
          shadow: "shadow-orange-200",
          width: "w-[40%]",
          text: "Слаба"
        };
      case 2:
        return {
          gradient: "from-yellow-200 via-yellow-400 to-yellow-500",
          shadow: "shadow-yellow-200",
          width: "w-[60%]",
          text: "Средна"
        };
      case 3:
        return {
          gradient: "from-blue-200 via-blue-400 to-blue-500",
          shadow: "shadow-blue-200",
          width: "w-[80%]",
          text: "Силна"
        };
      case 4:
        return {
          gradient: "from-green-200 via-green-400 to-green-500",
          shadow: "shadow-green-200",
          width: "w-[100%]",
          text: "Много силна"
        };
      default:
        return {
          gradient: "from-green-400 via-green-600 to-green-800",
          shadow: "shadow-green-300",
          width: "w-[100%]",
          text: "Отлична"
        };
    }
  };

  const { gradient, shadow, width, text } = getStrengthColor(passwordStrengthValue);

  if (!password) return null;

  return (
    <div className="space-y-1 mt-3">
      <div className="h-2 w-full rounded-full bg-gray-100">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${gradient} ${shadow} ${width}`}
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`text-xs font-medium ${
          passwordStrengthValue <= 1 ? "text-red-500" :
          passwordStrengthValue === 2 ? "text-yellow-600" :
          passwordStrengthValue === 3 ? "text-blue-600" :
          "text-green-600"
        }`}
      >
        {text}
      </motion.p>
    </div>
  );
};

export default PasswordStrengthMeter;
