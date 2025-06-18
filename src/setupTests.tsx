import React from 'react';
import '@testing-library/jest-dom';

// Mock React Native components that aren't available in jsdom
jest.mock('react-native', () => ({
  View: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  Modal: ({ children, visible, ...props }: any) => 
    visible ? <div data-testid="modal" {...props}>{children}</div> : null,
  TouchableOpacity: ({ children, onPress, ...props }: any) => 
    <button onClick={onPress} {...props}>{children}</button>,
  ScrollView: ({ children, ...props }: any) => 
    <div {...props}>{children}</div>,
  FlatList: ({ data, renderItem, ...props }: any) => 
    <div {...props}>{data?.map((item: any, index: number) => renderItem({ item, index }))}</div>,
  Image: ({ source, ...props }: any) => 
    <img src={typeof source === 'string' ? source : source?.uri} {...props} />,
  StatusBar: () => <div data-testid="status-bar" />,
  SafeAreaView: ({ children, ...props }: any) => 
    <div {...props}>{children}</div>,
  Dimensions: {
    get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
  },
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios || obj.default),
  },
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock Expo modules
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

jest.mock('expo-image', () => ({
  Image: ({ source, ...props }: any) => 
    <img src={typeof source === 'string' ? source : source?.uri} {...props} />,
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => <div data-testid="status-bar" />,
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="navigation-container">{children}</div>
  ),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="tab-navigator">{children}</div>
    ),
    Screen: ({ name, component: Component }: { name: string; component: React.ComponentType }) => (
      <div data-testid={`tab-screen-${name}`}>
        <Component />
      </div>
    ),
  }),
}));

// Mock Expo Vector Icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name }: { name: string }) => <div data-testid={`icon-${name}`}>{name}</div>,
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    img: ({ src, ...props }: any) => <img src={src} {...props} />,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
}); 