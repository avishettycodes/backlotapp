import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  SwipeDeck: undefined;
  Garage: undefined;
  Submit: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Submit() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Submit a Car</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.subtitle}>Coming soon!</Text>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('SwipeDeck')} 
          style={styles.tab}
        >
          <Ionicons name="home" size={24} color="#000" />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Garage')} 
          style={styles.tab}
        >
          <Ionicons name="car" size={24} color="#000" />
          <Text style={styles.tabLabel}>Garage</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Submit')} 
          style={styles.tab}
        >
          <Ionicons name="add-circle" size={24} color="#000" />
          <Text style={styles.tabLabel}>Post</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tab: {
    alignItems: 'center',
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 12,
  },
}); 