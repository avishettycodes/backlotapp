import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../src/context/ThemeContext';
import SwipeDeck from '../src/components/SwipeDeck';
import Garage from '../src/components/Garage';
import Submit from '../src/components/Submit';

export type RootTabParamList = {
  Home: undefined;
  Garage: undefined;
  Post: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Tab.Navigator
            id={undefined}
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                switch (route.name) {
                  case 'Home':
                    iconName = focused ? 'home' : 'home-outline';
                    break;
                  case 'Garage':
                    iconName = focused ? 'car' : 'car-outline';
                    break;
                  case 'Post':
                    iconName = focused ? 'add-circle' : 'add-circle-outline';
                    break;
                  default:
                    iconName = 'help-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#3b82f6',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
            })}
          >
            <Tab.Screen name="Home" component={SwipeDeck} />
            <Tab.Screen name="Garage" component={Garage} />
            <Tab.Screen name="Post" component={Submit} />
          </Tab.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
} 