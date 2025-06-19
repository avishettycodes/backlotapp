import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
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
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('auto');

  // Get the effective theme (auto resolves to system theme)
  const effectiveTheme = theme === 'auto' ? (systemColorScheme || 'light') : theme;
  const isDark = effectiveTheme === 'dark';
  const colors = getThemeColors(theme, systemColorScheme as 'light' | 'dark');

  // Debug logging
  useEffect(() => {
    console.log('System color scheme:', systemColorScheme);
    console.log('Current theme setting:', theme);
    console.log('Effective theme:', effectiveTheme);
    console.log('Is dark mode:', isDark);
  }, [systemColorScheme, theme, effectiveTheme, isDark]);

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