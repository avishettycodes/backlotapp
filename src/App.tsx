import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SwipeDeck from './components/SwipeDeck';
import Garage from './components/Garage';
import Submit from './components/Submit';
import { TAB_BAR, scaledSize } from './constants/Layout';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const insets = useSafeAreaInsets();
  
  // Calculate proper tab bar height with safe area
  const tabBarHeight = TAB_BAR.height + insets.bottom;
  
  return (
    <Tab.Navigator
      id={undefined}
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

          return (
            <Ionicons 
              name={iconName} 
              size={focused ? TAB_BAR.iconSizeFocused : TAB_BAR.iconSize} 
              color={color} 
            />
          );
        },
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: tabBarHeight,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(0, 0, 0, 0.1)',
          elevation: 12,
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -3 },
          paddingBottom: insets.bottom,
          paddingTop: TAB_BAR.paddingVertical,
          paddingHorizontal: TAB_BAR.paddingHorizontal,
          borderTopLeftRadius: TAB_BAR.borderRadius,
          borderTopRightRadius: TAB_BAR.borderRadius,
        },
        tabBarLabelStyle: {
          fontSize: TAB_BAR.fontSize,
          fontWeight: '600',
          marginTop: scaledSize(4),
          letterSpacing: 0.5,
        },
        tabBarItemStyle: {
          paddingVertical: TAB_BAR.paddingVertical,
          marginHorizontal: scaledSize(4),
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={SwipeDeck}
        options={{
          title: 'Discover',
        }}
      />
      <Tab.Screen 
        name="Garage" 
        component={Garage}
        options={{
          title: 'My Garage',
        }}
      />
      <Tab.Screen 
        name="Submit" 
        component={Submit}
        options={{
          title: 'List Car',
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