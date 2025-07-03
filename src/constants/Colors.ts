export const Colors = {
  light: {
    // Background colors
    background: '#fafbfc',
    surface: '#ffffff',
    card: '#ffffff',
    modal: '#ffffff',
    
    // Text colors
    text: '#1a1a1a',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    textInverse: '#ffffff',
    
    // Primary colors - More vibrant blue
    primary: '#2563eb',
    primaryLight: '#dbeafe',
    primaryDark: '#1d4ed8',
    
    // Status colors - More vibrant
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    
    // Border colors
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.5)',
    backdrop: 'rgba(0, 0, 0, 0.6)',
    
    // Tab bar colors - More modern gradient
    tabBar: 'rgba(255, 255, 255, 0.95)',
    tabBarText: 'rgba(107, 114, 128, 0.8)',
    tabBarActive: '#2563eb',
    
    // Swipe colors - More vibrant
    swipeSave: '#059669',
    swipeNope: '#dc2626',
    
    // Settings colors
    settingsSection: '#6b7280',
    settingsItem: '#ffffff',
    settingsItemBorder: '#f3f4f6',
    settingsIcon: '#2563eb',
    settingsIconBg: '#dbeafe',
    
    // New gradient colors
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
    cardGradientStart: '#ffffff',
    cardGradientEnd: '#f8fafc',
  },
  dark: {
    // Background colors - More sophisticated
    background: '#0f172a',
    surface: '#1e293b',
    card: '#334155',
    modal: '#1e293b',
    
    // Text colors
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    textInverse: '#0f172a',
    
    // Primary colors - More vibrant
    primary: '#3b82f6',
    primaryLight: '#1e3a8a',
    primaryDark: '#1d4ed8',
    
    // Status colors - More vibrant
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    
    // Border colors
    border: '#475569',
    borderLight: '#334155',
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.7)',
    backdrop: 'rgba(0, 0, 0, 0.8)',
    
    // Tab bar colors - More sophisticated
    tabBar: 'rgba(15, 23, 42, 0.95)',
    tabBarText: 'rgba(148, 163, 184, 0.8)',
    tabBarActive: '#3b82f6',
    
    // Swipe colors - More vibrant
    swipeSave: '#10b981',
    swipeNope: '#ef4444',
    
    // Settings colors
    settingsSection: '#94a3b8',
    settingsItem: '#334155',
    settingsItemBorder: '#475569',
    settingsIcon: '#3b82f6',
    settingsIconBg: '#1e3a8a',
    
    // New gradient colors
    gradientStart: '#4f46e5',
    gradientEnd: '#7c3aed',
    cardGradientStart: '#334155',
    cardGradientEnd: '#1e293b',
  },
};

export type Theme = 'light' | 'dark';

export const getThemeColors = (theme: Theme) => {
  return Colors[theme];
}; 