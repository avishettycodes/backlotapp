import React, { useState, useEffect } from 'react'
import { useGarageStore } from '../store/garageStore'
import { useSwipeQueueStore } from '../store/swipeQueueStore'
import { Car } from '../types/car'
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CarDetailModal from './CarDetailModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32; // Full width minus padding

// Responsive scaling factors
const scale = Math.min(SCREEN_WIDTH / 375, SCREEN_HEIGHT / 812);
const scaledFontSize = (size: number) => size * scale;
const scaledSize = (size: number) => size * scale;

const Garage = () => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  
  // Subscribe to both stores
  const { cars: garageCars, removeFromGarage } = useGarageStore()
  const { addToQueue } = useSwipeQueueStore()

  // Debug: Log garage state changes
  useEffect(() => {
    console.log('Garage component mounted/updated')
    console.log('Current garage cars:', garageCars)
    console.log('Garage cars length:', garageCars.length)
  }, [garageCars])

  const openCarModal = (car: Car) => {
    console.log('Opening modal for car:', car);
    setSelectedCar(car);
    setModalVisible(true);
  };

  const closeModal = () => {
    console.log('Closing modal');
    setModalVisible(false);
    setSelectedCar(null);
  };

  const handleRemoveFromGarage = (carId: number) => {
    console.log('Removing car from garage:', carId);
    removeFromGarage(carId);
    const carToRemove = garageCars.find(car => car.id === carId);
    if (carToRemove) {
      addToQueue(carToRemove);
  }
  };

  const renderCarCard = ({ item: car }: { item: Car }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => openCarModal(car)}
      >
        <Image source={{ uri: car.image }} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={styles.title}>
            {car.year} {car.make} {car.model}
          </Text>
          <Text style={styles.subtitle}>
            {car.mileage?.toLocaleString()} mi · {car.location}
          </Text>
          <Text style={styles.price}>${car.price?.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={() => Alert.alert('Message Seller', 'This feature is coming soon!')}
        >
          <Ionicons name="chatbubble-outline" size={scaledSize(24)} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={() => handleRemoveFromGarage(car.id)}
        >
          <Ionicons name="trash-outline" size={scaledSize(24)} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Garage</Text>
      </View>
      
      <View style={styles.content}>
        {garageCars.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={scaledSize(64)} color="#ccc" />
            <Text style={styles.emptyStateText}>Your garage is empty</Text>
            <Text style={styles.emptyStateSubtext}>Swipe right on cars to add them to your garage</Text>
          </View>
        ) : (
          <FlatList
            data={garageCars}
            renderItem={renderCarCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            snapToInterval={CARD_WIDTH + 16} // Card width + padding
            decelerationRate="fast"
            snapToAlignment="center"
          />
        )}
      </View>

      {/* Car Detail Modal */}
      <CarDetailModal
        visible={modalVisible}
        car={selectedCar}
        onClose={closeModal}
        isInGarage={true}
        onRemoveFromGarage={handleRemoveFromGarage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    padding: scaledSize(16),
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: scaledFontSize(24),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: scaledSize(16),
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: scaledFontSize(18),
    color: '#666',
    marginTop: scaledSize(16),
    marginBottom: scaledSize(8),
  },
  emptyStateSubtext: {
    fontSize: scaledFontSize(14),
    color: '#999',
    textAlign: 'center',
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: scaledSize(16),
  },
  card: {
    backgroundColor: 'white',
    borderRadius: scaledSize(12),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: scaledSize(200),
  },
  cardContent: {
    padding: scaledSize(16),
  },
  title: {
    fontSize: scaledFontSize(18),
    fontWeight: 'bold',
    marginBottom: scaledSize(4),
  },
  subtitle: {
    fontSize: scaledFontSize(14),
    color: '#666',
    marginBottom: scaledSize(8),
  },
  price: {
    fontSize: scaledFontSize(16),
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: scaledSize(16),
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    padding: scaledSize(8),
  },
  listContent: {
    paddingHorizontal: scaledSize(16),
  },
});

export default Garage; 