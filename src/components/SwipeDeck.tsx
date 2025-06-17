import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, PanResponder, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGarageStore } from '../store/garageStore';
import { useSwipeQueueStore } from '../store/swipeQueueStore';
import { Car } from '../types/car';
import CarDetailModal from './CarDetailModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const SWIPE_THRESHOLD = 120;

// Sample car data
const sampleCars: Car[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    ],
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    price: 35000,
    mileage: 45000,
    deal: 'good',
    location: 'Los Angeles, CA',
    description: 'Well maintained Toyota Camry with low mileage and excellent condition.',
    priceRating: 'Great Deal',
    sellerName: 'John Doe',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    seats: 5,
    trim: 'SE',
    exteriorColor: 'Blue',
    interiorColor: 'Black',
    listedDate: '2024-12-15',
    pros: ['Reliable', 'Comfortable', 'Good fuel economy'],
    cons: ['Expensive to maintain', 'Small trunk space'],
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    ],
    make: 'Honda',
    model: 'Civic',
    year: 2021,
    price: 28000,
    mileage: 32000,
    deal: 'fair',
    location: 'San Francisco, CA',
    description: 'Sporty Honda Civic with great fuel economy and modern features.',
    sellerName: 'Jane Smith',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    seats: 5,
    trim: 'Sport',
    exteriorColor: 'Red',
    interiorColor: 'Gray',
    listedDate: '2024-12-10',
    pros: ['Sporty handling', 'Great fuel economy', 'Modern features'],
    cons: ['Small back seats', 'Firm ride'],
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    ],
    make: 'BMW',
    model: '3 Series',
    year: 2019,
    price: 42000,
    mileage: 38000,
    deal: 'good',
    location: 'New York, NY',
    description: 'Luxury BMW 3 Series with premium features and excellent performance.',
    sellerName: 'Mike Johnson',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    seats: 5,
    trim: '330i',
    exteriorColor: 'White',
    interiorColor: 'Black',
    listedDate: '2024-12-05',
    pros: ['Luxury features', 'Excellent performance', 'Premium interior'],
    cons: ['Expensive maintenance', 'High insurance costs'],
  },
];

export default function SwipeDeck() {
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const position = useRef(new Animated.ValueXY()).current;
  
  const { addToGarage } = useGarageStore();
  const { carQueue, addToQueue, removeFromQueue } = useSwipeQueueStore();

  // Combine sample cars with queue cars, prioritizing queue cars
  const allCars = [...carQueue, ...sampleCars];
  const currentCar = allCars[currentCarIndex] || sampleCars[0];

  const [isGestureActive, setIsGestureActive] = useState(false);
  const [gestureStartTime, setGestureStartTime] = useState(0);
  const [gestureStartPosition, setGestureStartPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Reset to first car when queue changes
    if (carQueue.length > 0 && currentCarIndex >= allCars.length) {
      setCurrentCarIndex(0);
    }
  }, [carQueue, allCars.length, currentCarIndex]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gesture) => {
      // Only start pan responder if there's significant horizontal movement
      return Math.abs(gesture.dx) > 10;
    },
    onPanResponderGrant: (_, gesture) => {
      setIsGestureActive(true);
      setGestureStartTime(Date.now());
      setGestureStartPosition({ x: gesture.x0, y: gesture.y0 });
    },
    onPanResponderMove: (_, gesture) => {
      if (isGestureActive) {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      }
    },
    onPanResponderRelease: (_, gesture) => {
      const gestureDuration = Date.now() - gestureStartTime;
      const gestureDistance = Math.sqrt(gesture.dx * gesture.dx + gesture.dy * gesture.dy);
      
      // If it's a quick, short gesture, treat it as a tap
      if (gestureDuration < 200 && gestureDistance < 50) {
        console.log('Tap detected! Opening modal for car:', currentCar);
        openCarModal(currentCar);
        resetPosition();
        return;
      }
      
      // Otherwise, treat it as a swipe
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe('left');
      } else {
        resetPosition();
      }
      
      setIsGestureActive(false);
    },
    onPanResponderTerminate: () => {
      setIsGestureActive(false);
      resetPosition();
    },
  });

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: 'right' | 'left') => {
    const item = currentCar;
    console.log(`Swipe ${direction} completed for car:`, item);
    
    // Remove the car from the queue if it was in the queue
    if (carQueue.some(car => car.id === item.id)) {
      removeFromQueue(item.id);
    }
    
    if (direction === 'right') {
      console.log('Adding car to garage...');
      addToGarage(item);
    } else {
      console.log('Adding car to queue...');
      addToQueue(item);
    }
    
    position.setValue({ x: 0, y: 0 });
    setCurrentCarIndex((prev) => (prev + 1) % allCars.length);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-8deg', '0deg', '8deg'],
    });

    const opacity = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 0.5, 0, SCREEN_WIDTH * 0.5],
      outputRange: [0.8, 1, 0.8],
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
      opacity,
    };
  };

  const openCarModal = (car: Car) => {
    console.log('Card tapped! Opening modal for car:', car);
    setSelectedCar(car);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCar(null);
  };

  const renderCard = () => {
    if (currentCarIndex >= allCars.length) {
      return (
        <View style={styles.noMoreCards}>
          <Text style={styles.noMoreCardsText}>No more cars!</Text>
        </View>
      );
    }

    return (
      <Animated.View
        style={[styles.card, getCardStyle()]}
        {...panResponder.panHandlers}
      >
        <Image 
          source={{ uri: currentCar.image }} 
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardContent}>
          <Text style={styles.carTitle}>{currentCar.year} {currentCar.make} {currentCar.model}</Text>
          <Text style={styles.carSubtitle}>{currentCar.mileage?.toLocaleString()} mi · {currentCar.location}</Text>
          <Text style={styles.carPrice}>${currentCar.price?.toLocaleString()}</Text>
          {currentCar.description && (
            <Text style={styles.carDescription}>{currentCar.description}</Text>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Backlot</Text>
      </View>
      
      <View style={styles.cardContainer}>
        {renderCard()}

        {/* Swipe Instructions */}
        <View style={styles.swipeInstructions}>
          <View style={styles.instructionRow}>
            <View style={styles.instructionItem}>
              <Ionicons name="close-circle" size={24} color="#ef4444" />
              <Text style={styles.instructionText}>Swipe Left to Skip</Text>
            </View>
            <View style={styles.instructionItem}>
              <Ionicons name="heart" size={24} color="#10b981" />
              <Text style={styles.instructionText}>Swipe Right to Save</Text>
            </View>
          </View>
        </View>

        {/* Manual Buttons */}
        <View style={styles.manualButtons}>
          <TouchableOpacity style={styles.skipButton} onPress={() => forceSwipe('left')}>
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={() => forceSwipe('right')}>
            <Ionicons name="heart" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Car Detail Modal */}
      <CarDetailModal
        visible={modalVisible}
        car={selectedCar}
        onClose={closeModal}
        isInGarage={false}
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
    height: 400,
    width: '100%',
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
    marginBottom: 4,
  },
  carSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  carPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 8,
  },
  carDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  noMoreCardsText: {
    fontSize: 18,
    color: '#666',
  },
  swipeInstructions: {
    marginTop: 20,
    marginBottom: 20,
  },
  instructionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  instructionItem: {
    alignItems: 'center',
  },
  instructionText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
  manualButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  skipButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTouchable: {
    flex: 1,
  },
}); 