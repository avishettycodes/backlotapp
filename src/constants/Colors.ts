export const Colors = {
  light: {
    // Background colors
    background: '#ffffff',
    surface: '#ffffff',
    card: '#ffffff',
    modal: '#ffffff',
    
    // Text colors
    text: '#1f2937',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    textInverse: '#ffffff',
    
    // Primary colors
    primary: '#3b82f6',
    primaryLight: '#eff6ff',
    primaryDark: '#1d4ed8',
    
    // Status colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    
    // Border colors
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.5)',
    backdrop: 'rgba(0, 0, 0, 0.6)',
    
    // Tab bar colors - Always black
    tabBar: 'rgba(0, 0, 0, 0.9)',
    tabBarText: 'rgba(255, 255, 255, 0.6)',
    tabBarActive: 'rgba(255, 255, 255, 0.9)',
    
    // Swipe colors
    swipeSave: '#34C759',
    swipeNope: '#FF3B30',
    
    // Settings colors
    settingsSection: '#6b7280',
    settingsItem: '#ffffff',
    settingsItemBorder: '#f3f4f6',
    settingsIcon: '#3b82f6',
    settingsIconBg: '#eff6ff',
  },
  dark: {
    // Background colors
    background: '#000000',
    surface: '#1f2937',
    card: '#374151',
    modal: '#1f2937',
    
    // Text colors
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    textTertiary: '#9ca3af',
    textInverse: '#1f2937',
    
    // Primary colors
    primary: '#60a5fa',
    primaryLight: '#1e3a8a',
    primaryDark: '#3b82f6',
    
    // Status colors
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    
    // Border colors
    border: '#4b5563',
    borderLight: '#374151',
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.7)',
    backdrop: 'rgba(0, 0, 0, 0.8)',
    
    // Tab bar colors - Always black
    tabBar: 'rgba(0, 0, 0, 0.9)',
    tabBarText: 'rgba(255, 255, 255, 0.6)',
    tabBarActive: 'rgba(255, 255, 255, 0.9)',
    
    // Swipe colors
    swipeSave: '#34C759',
    swipeNope: '#FF3B30',
    
    // Settings colors
    settingsSection: '#9ca3af',
    settingsItem: '#374151',
    settingsItemBorder: '#4b5563',
    settingsIcon: '#60a5fa',
    settingsIconBg: '#1e3a8a',
  },
};

export type Theme = 'light' | 'dark';

export const getThemeColors = (theme: Theme) => {
  return Colors[theme];
}; 