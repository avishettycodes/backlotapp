import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../App';

// Mock the components to avoid complex dependencies
jest.mock('../components/SwipeDeck', () => {
  return function MockSwipeDeck() {
    return <div data-testid="swipe-deck">SwipeDeck Component</div>;
  };
});

jest.mock('../components/Garage', () => {
  return function MockGarage() {
    return <div data-testid="garage">Garage Component</div>;
  };
});

jest.mock('../components/Submit', () => {
  return function MockSubmit() {
    return <div data-testid="submit">Submit Component</div>;
  };
});

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

// Mock Expo StatusBar
jest.mock('expo-status-bar', () => ({
  StatusBar: () => <div data-testid="status-bar" />,
}));

// Mock SafeAreaProvider
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="safe-area-provider">{children}</div>
  ),
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock Expo Vector Icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name }: { name: string }) => <div data-testid={`icon-${name}`}>{name}</div>,
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('safe-area-provider')).toBeInTheDocument();
  });

  it('renders navigation container', () => {
    render(<App />);
    expect(screen.getByTestId('navigation-container')).toBeInTheDocument();
  });

  it('renders status bar', () => {
    render(<App />);
    expect(screen.getByTestId('status-bar')).toBeInTheDocument();
  });

  it('renders tab navigator', () => {
    render(<App />);
    expect(screen.getByTestId('tab-navigator')).toBeInTheDocument();
  });

  it('renders all tab screens', () => {
    render(<App />);
    expect(screen.getByTestId('tab-screen-Home')).toBeInTheDocument();
    expect(screen.getByTestId('tab-screen-Garage')).toBeInTheDocument();
    expect(screen.getByTestId('tab-screen-Submit')).toBeInTheDocument();
  });

  it('renders SwipeDeck component in Home tab', () => {
    render(<App />);
    expect(screen.getByTestId('swipe-deck')).toBeInTheDocument();
  });

  it('renders Garage component in Garage tab', () => {
    render(<App />);
    expect(screen.getByTestId('garage')).toBeInTheDocument();
  });

  it('renders Submit component in Submit tab', () => {
    render(<App />);
    expect(screen.getByTestId('submit')).toBeInTheDocument();
  });

  it('has correct component hierarchy', () => {
    render(<App />);
    
    expect(screen.getByTestId('safe-area-provider')).toBeInTheDocument();
    expect(screen.getByTestId('navigation-container')).toBeInTheDocument();
    expect(screen.getByTestId('tab-navigator')).toBeInTheDocument();
  });
}); 