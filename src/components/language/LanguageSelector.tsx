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

const formatOptionLabel = ({ flag }: { flag: string }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <Flag code={flag} style={{ width: 20, height: 15 }} />
  </div>
);

const customSingleValue = ({ data }: any) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <Flag code={data.flag} style={{ width: 20, height: 15 }} />
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
          width: 30,  
          height: 5, 
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          fontSize: "0px", 
          borderRadius: "6px",
          border: "1px solid #dcdcdc",
          background: "#f9f9f9",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          padding: "0",
          margin: 0,
          transition: "border 0.3s, box-shadow 0.3s",
          '&:hover': {
            borderColor: "#aaa",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          }
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
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)", 
          padding: "5px 0",
          borderRadius: "8px", 
          backgroundColor: "#fff",
          zIndex: 1000, 
        }),
        option: (provided, state) => ({
          ...provided,
          padding: "5px 10px",
          backgroundColor: state.isSelected ? "#e0e0e0" : "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          fontSize: "0px", 
          gap: "5px",
          '&:hover': {
            backgroundColor: "#f5f5f5",
          },
        }),
      }}
    />
  );
}
