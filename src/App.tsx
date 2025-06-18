import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Dimensions } from 'react-native';
import SwipeDeck from './components/SwipeDeck';
import Garage from './components/Garage';
import Submit from './components/Submit';

const Tab = createBottomTabNavigator();
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Responsive scaling factors
const scale = Math.min(SCREEN_WIDTH / 375, SCREEN_HEIGHT / 812);
const scaledSize = (size: number) => size * scale;

function TabNavigator() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Garage') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'Submit') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: Platform.OS === 'ios' ? scaledSize(100) + insets.bottom + scaledSize(20) : scaledSize(80) + insets.bottom,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          elevation: 12,
          shadowOpacity: 0.2,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -4 },
          paddingBottom: Platform.OS === 'ios' ? insets.bottom + scaledSize(20) : insets.bottom,
          paddingTop: scaledSize(12),
        },
        tabBarLabelStyle: {
          fontSize: scaledSize(12),
          fontWeight: '500',
          marginTop: scaledSize(4),
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={SwipeDeck}
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen 
        name="Garage" 
        component={Garage}
        options={{
          title: 'Garage',
        }}
      />
      <Tab.Screen 
        name="Submit" 
        component={Submit}
        options={{
          title: 'Submit',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <TabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
} 