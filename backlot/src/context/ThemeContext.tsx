import React, { createContext, useContext, useState } from 'react';
import { Colors, Theme, getThemeColors } from '../constants/Colors';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colors: typeof Colors.light;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Default to dark mode for the current user (avishetty), light mode for others
  // You can change this to your specific device identifier or username
  const isCurrentUser = true; // Set to false for other users
  const defaultTheme: Theme = isCurrentUser ? 'dark' : 'light';
  
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const isDark = theme === 'dark';
  const colors = getThemeColors(theme);

  const value: ThemeContextType = {
    theme,
    setTheme,
    colors,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 