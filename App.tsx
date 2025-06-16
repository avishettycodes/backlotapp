import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Placeholder components - we'll create these next
const SwipeDeck = () => null;
const Garage = () => null;
const Post = () => null;
const Settings = () => null;

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
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
                case 'Settings':
                  iconName = focused ? 'settings' : 'settings-outline';
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
          <Tab.Screen name="Post" component={Post} />
          <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
} 