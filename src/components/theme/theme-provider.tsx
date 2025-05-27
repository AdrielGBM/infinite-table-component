import { useState, useEffect, createContext, useContext } from "react";
import type { ThemeProviderProps } from "next-themes";

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}
const ThemeProviderContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("vite-ui-theme") || "dark"
  );
  useEffect(() => {
    localStorage.setItem("vite-ui-theme", theme);
    document.documentElement.className = theme;
  }, [theme]);
  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
};
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
