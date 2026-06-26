import React, { createContext, useContext, useEffect, useState } from "react";

export type TextSize = "normal" | "large" | "xlarge";

interface SettingsContextType {
  name: string;
  setName: (name: string) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [name, setNameState] = useState(() => localStorage.getItem("manocare:name") || "");
  const [textSize, setTextSizeState] = useState<TextSize>(() => 
    (localStorage.getItem("manocare:textSize") as TextSize) || "normal"
  );
  const [soundEnabled, setSoundEnabledState] = useState(() => {
    const saved = localStorage.getItem("manocare:sound");
    return saved !== "false";
  });

  const setName = (val: string) => {
    localStorage.setItem("manocare:name", val);
    setNameState(val);
  };

  const setTextSize = (val: TextSize) => {
    localStorage.setItem("manocare:textSize", val);
    setTextSizeState(val);
  };

  const setSoundEnabled = (val: boolean) => {
    localStorage.setItem("manocare:sound", String(val));
    setSoundEnabledState(val);
  };

  useEffect(() => {
    const sizes = {
      normal: "22px",
      large: "26px",
      xlarge: "30px",
    };
    document.documentElement.style.setProperty("--manocare-text-size", sizes[textSize]);
  }, [textSize]);

  return (
    <SettingsContext.Provider value={{ name, setName, textSize, setTextSize, soundEnabled, setSoundEnabled }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};
