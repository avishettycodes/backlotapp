import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SwipeDeck from './components/SwipeDeck';
import Garage from './components/Garage';
import Submit from './components/Submit';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="SwipeDeck"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#f0f0f0' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="SwipeDeck" component={SwipeDeck} />
          <Stack.Screen name="Garage" component={Garage} />
          <Stack.Screen name="Submit" component={Submit} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
} 