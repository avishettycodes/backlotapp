import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, TouchableOpacity } from 'react-native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Import your actual components
import SwipeDeck from './src/components/SwipeDeck';
import Garage from './src/components/Garage';
import Submit from './src/components/Submit';

export type RootTabParamList = {
  Home: undefined;
  Garage: undefined;
  Post: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

// Settings button component for the header
function SettingsButton({ onPress }: { onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
      }}
    >
      <Ionicons name="settings-outline" size={20} color={colors.textInverse} />
    </TouchableOpacity>
  );
}

function TabNavigator() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  
  return (
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
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarText,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'ios' ? 60 + insets.bottom : 60,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: colors.surface,
          shadowOpacity: 0,
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          color: colors.text,
          fontSize: 20,
          fontWeight: 'bold',
        },
        headerRightContainerStyle: { paddingRight: 16 },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={SwipeDeck} 
        options={{
          title: 'Backlot',
          headerRight: () => <SettingsButton onPress={() => {}} />,
        }}
      />
      <Tab.Screen 
        name="Garage" 
        component={Garage} 
        options={{
          title: 'My Garage',
          headerRight: () => <SettingsButton onPress={() => {}} />,
        }}
      />
      <Tab.Screen 
        name="Post" 
        component={Submit} 
        options={{
          title: 'Submit a Car',
          headerRight: () => <SettingsButton onPress={() => {}} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { isDark } = useTheme();
  
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <TabNavigator />
          <StatusBar style={isDark ? "light" : "dark"} />
        </NavigationContainer>
      </SafeAreaProvider>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
} 