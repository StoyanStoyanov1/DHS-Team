import React from "react";

interface PasswordStrengthMeterProps {
  passwordStrengthValue: number;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ passwordStrengthValue }) => {
  const getStrengthColor = (strength: number) => {
    switch (strength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
        return "bg-green-500"
      default:
        return "bg-green-800";
    }
  };

  return (
    <div className="mt-2 h-1 w-full bg-gray-300 rounded">
      <div
        className={`h-full rounded ${getStrengthColor(passwordStrengthValue)}`}
        style={{ width: `${(passwordStrengthValue / 5) * 100}%` }}
      />
    </div>
  );
};

export default PasswordStrengthMeter;
