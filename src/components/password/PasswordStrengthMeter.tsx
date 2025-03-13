import React from "react";
import { motion } from "framer-motion";

interface PasswordStrengthMeterProps {
  passwordStrengthValue: number;
  password: string;
  text: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ passwordStrengthValue, password, text}) => {
  const getStrengthColor = (strength: number) => {
    switch (strength) {
      case 1:
        return {
          gradient: "from-red-200 via-red-400 to-red-500",
          shadow: "shadow-red-200",
          width: "w-[20%]",
        };
      case 2:
        return {
          gradient: "from-orange-200 via-orange-400 to-orange-500",
          shadow: "shadow-orange-200",
          width: "w-[40%]",
        };
      case 3:
        return {
          gradient: "from-yellow-200 via-yellow-400 to-yellow-500",
          shadow: "shadow-yellow-200",
          width: "w-[60%]",
        };
      case 4:
        return {
          gradient: "from-blue-200 via-blue-400 to-blue-500",
          shadow: "shadow-blue-200",
          width: "w-[80%]",
        };
      case 5:
        return {
          gradient: "from-green-200 via-green-400 to-green-500",
          shadow: "shadow-green-200",
          width: "w-[100%]",
        };
      default:
        return {
          gradient: "from-green-400 via-green-600 to-green-800",
          shadow: "shadow-green-300",
          width: "w-[100%]",
        };
    }
  };

  const { gradient, shadow, width } = getStrengthColor(passwordStrengthValue);

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
          passwordStrengthValue <= 2 ? "text-red-500" :
          passwordStrengthValue === 3 ? "text-yellow-600" :
          passwordStrengthValue === 4 ? "text-blue-600" :
          "text-green-600"
        }`}
      >
        {text}
      </motion.p>
    </div>
  );
};

export default PasswordStrengthMeter;
