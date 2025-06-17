import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
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

const testCar = {
  id: 1,
  image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  make: 'Toyota',
  model: 'Camry',
  year: 2020,
  price: 35000,
};

export default function SwipeDeck() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Backlot</Text>
      </View>
      
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Image 
            source={{ uri: testCar.image }} 
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.cardContent}>
            <Text style={styles.carTitle}>{testCar.year} {testCar.make} {testCar.model}</Text>
            <Text style={styles.carPrice}>${testCar.price.toLocaleString()}</Text>
          </View>
        </View>
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
  cardContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 300,
  },
  cardContent: {
    padding: 16,
  },
  carTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  carPrice: {
    fontSize: 18,
    color: '#666',
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