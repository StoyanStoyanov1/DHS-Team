"use client";

import Select, { SingleValue } from "react-select";
import { useLanguage } from "@/context/language/LanguageContext";
import { useEffect, useState } from "react";
import Flag from "react-world-flags"; 

const languageOptions = [
  { value: "en", flag: "GB" },
  { value: "de", flag: "DE" },
  { value: "bg", flag: "BG" },
];

// Форматиране на опциите (само флаг)
const formatOptionLabel = ({ flag }: { flag: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px" }}>
    <Flag code={flag} style={{ width: 25, height: 18 }} />
  </div>
);

const customSingleValue = ({ data }: any) => (
  <div style={{ fontSize: "16px", display: "flex", alignItems: "center" }}>
    <Flag code={data.flag} style={{ width: 25, height: 18 }} />
  </div>
);

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; 

  const handleChange = (selectedOption: SingleValue<{ value: string; flag: string }>) => {
    if (selectedOption) {
      setLanguage(selectedOption.value);
    }
  };

  return (
    <Select
      options={languageOptions}
      value={languageOptions.find((option) => option.value === language)}
      onChange={handleChange}
      formatOptionLabel={formatOptionLabel} 
      components={{ SingleValue: customSingleValue }} 
      isSearchable={false}
      styles={{
        control: (base) => ({
          ...base,
          width: 60,
          height: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          fontSize: "0px", 
          border: "none", 
          background: "none",
          boxShadow: "none",  
          padding: "0", 
          margin: 0,
        }),
        dropdownIndicator: (base) => ({
          ...base,
          display: "none",  
        }),
        indicatorSeparator: () => ({
          display: "none",
        }),
        menu: (base) => ({
          ...base,
          boxShadow: "none", 
          padding: "0",
        }),
      }}
    />
  );
}
