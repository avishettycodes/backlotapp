import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CarDetailModal from './CarDetailModal';
import { Car } from '../types/car';
import { useGarageStore } from '../store/garageStore';
import { useSwipeQueueStore } from '../store/swipeQueueStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;

// Sample car data
const sampleCars: Car[] = [
  {
    id: 1,
    year: 2020,
    make: "Toyota",
    model: "Camry",
    price: 35000,
    mileage: 45000,
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    description: "Well maintained Toyota Camry with low mileage and excellent condition.",
    sellerName: "John Doe",
    listedDate: "2024-12-15",
    priceRating: "Great Deal",
    deal: "good",
    exteriorColor: "Blue",
    interiorColor: "Black",
    transmission: "Automatic",
    fuelType: "Gasoline",
    trim: "SE",
    seats: 5,
    pros: ["Reliable", "Comfortable", "Good fuel economy"],
    cons: ["Expensive to maintain", "Small trunk space"]
  },
  {
    id: 2,
    year: 2021,
    make: "Honda",
    model: "Civic",
    price: 28000,
    mileage: 32000,
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    description: "Sporty Honda Civic with great fuel economy and modern features.",
    sellerName: "Jane Smith",
    listedDate: "2024-12-10",
    priceRating: "Fair Price",
    deal: "fair",
    exteriorColor: "Red",
    interiorColor: "Gray",
    transmission: "Automatic",
    fuelType: "Gasoline",
    trim: "Sport",
    seats: 5,
    pros: ["Sporty handling", "Great fuel economy", "Modern features"],
    cons: ["Small back seats", "Firm ride"]
  },
  {
    id: 3,
    year: 2019,
    make: "BMW",
    model: "3 Series",
    price: 42000,
    mileage: 38000,
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    images: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    description: "Luxury BMW 3 Series with premium features and excellent performance.",
    sellerName: "Mike Johnson",
    listedDate: "2024-12-05",
    priceRating: "Great Deal",
    deal: "good",
    exteriorColor: "White",
    interiorColor: "Black",
    transmission: "Automatic",
    fuelType: "Gasoline",
    trim: "330i",
    seats: 5,
    pros: ["Luxury features", "Excellent performance", "Premium interior"],
    cons: ["Expensive maintenance", "High insurance costs"]
  }
];

export default function SwipeDeck() {
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isGestureActive, setIsGestureActive] = useState(false);
  const [gestureStartTime, setGestureStartTime] = useState(0);
  const [gestureStartPosition, setGestureStartPosition] = useState({ x: 0, y: 0 });
  
  const { addToGarage } = useGarageStore();
  const { carQueue, addToQueue, removeFromQueue } = useSwipeQueueStore();

  // Combine sample cars with queue cars, prioritizing queue cars
  const allCars = [...carQueue, ...sampleCars];
  const currentCar = allCars[currentCarIndex] || sampleCars[0];

  // Animation values for the top card
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: ['-30deg', '0deg', '30deg'],
  });

  // Animation values for swipe overlays
  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gesture) => {
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
      setIsGestureActive(false);
      const gestureDuration = Date.now() - gestureStartTime;
      const gestureDistance = Math.sqrt(
        Math.pow(gesture.x0 - gesture.dx, 2) + Math.pow(gesture.y0 - gesture.dy, 2)
      );

      // Determine if it's a tap or swipe
      if (gestureDuration < 200 && gestureDistance < 50) {
        // Tap - open modal
        console.log('Tap detected! Opening modal for car:', currentCar);
        setSelectedCar(currentCar);
        setModalVisible(true);
        position.setValue({ x: 0, y: 0 });
      } else {
        // Swipe
        const direction = gesture.dx > SWIPE_THRESHOLD ? 'right' : 
                         gesture.dx < -SWIPE_THRESHOLD ? 'left' : null;
        
        if (direction) {
          forceSwipe(direction);
        } else {
          resetPosition();
        }
      }
    },
  });

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
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

  const renderCard = (car: Car, index: number) => {
    if (index === 0) {
      // Top card - interactive
      return (
        <Animated.View
          key={car.id}
          style={[
            styles.card,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate: rotation },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Image source={{ uri: car.image }} style={styles.cardImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradientOverlay}
            locations={[0.7, 1]}
          />
          
          {/* Swipe Overlays */}
          <Animated.View style={[styles.overlay, styles.likeOverlay, { opacity: likeOpacity }]}>
            <Text style={styles.likeText}>LIKE</Text>
          </Animated.View>
          
          <Animated.View style={[styles.overlay, styles.nopeOverlay, { opacity: nopeOpacity }]}>
            <Text style={styles.nopeText}>NOPE</Text>
          </Animated.View>
          
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.carTitle}>
                {car.year} {car.make} {car.model}
              </Text>
              <Text style={styles.carPrice}>
                ${car.price?.toLocaleString()}
              </Text>
            </View>
            <Text style={styles.carSubtitle}>
              {car.mileage?.toLocaleString()} mi • {car.location}
            </Text>
          </View>
        </Animated.View>
      );
    } else {
      // Stacked cards - static
      const scale = 1 - (index * 0.05);
      const translateY = index * 8;
      
      return (
        <Animated.View
          key={car.id}
          style={[
            styles.card,
            styles.stackedCard,
            {
              transform: [
                { scale },
                { translateY },
              ],
            },
          ]}
        >
          <Image source={{ uri: car.image }} style={styles.cardImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradientOverlay}
            locations={[0.7, 1]}
          />
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.carTitle}>
                {car.year} {car.make} {car.model}
              </Text>
              <Text style={styles.carPrice}>
                ${car.price?.toLocaleString()}
              </Text>
            </View>
            <Text style={styles.carSubtitle}>
              {car.mileage?.toLocaleString()} mi • {car.location}
            </Text>
          </View>
        </Animated.View>
      );
    }
  };

  const renderCards = () => {
    if (currentCarIndex >= allCars.length) {
      return (
        <View style={styles.noMoreCards}>
          <Ionicons name="car-outline" size={64} color="#666" />
          <Text style={styles.noMoreCardsText}>No more cars!</Text>
          <Text style={styles.noMoreCardsSubtext}>Check back later for new listings</Text>
        </View>
      );
    }

    // Render up to 3 cards in the stack
    const cardsToRender: React.ReactNode[] = [];
    for (let i = 0; i < Math.min(3, allCars.length - currentCarIndex); i++) {
      const car = allCars[currentCarIndex + i];
      cardsToRender.push(renderCard(car, i));
    }

    return cardsToRender;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Blur Effect */}
      {currentCar && (
        <Image
          source={{ uri: currentCar.image }}
          style={styles.backgroundImage}
          blurRadius={20}
        />
      )}

      {/* Card Stack */}
      <View style={styles.cardContainer}>
        {renderCards()}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <View style={styles.actionButton} onTouchEnd={() => forceSwipe('left')}>
          <Ionicons name="close" size={32} color="#e74c3c" />
        </View>
        <View style={styles.actionButton} onTouchEnd={() => forceSwipe('right')}>
          <Ionicons name="heart" size={32} color="#27ae60" />
        </View>
      </View>

      {/* Car Detail Modal */}
      <CarDetailModal
        visible={modalVisible}
        car={selectedCar}
        onClose={() => {
          setModalVisible(false);
          setSelectedCar(null);
        }}
        isInGarage={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    position: 'absolute',
    width: '90%',
    height: '75%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  stackedCard: {
    position: 'absolute',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  carTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  carPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  carSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  overlay: {
    position: 'absolute',
    padding: 8,
    borderWidth: 4,
    borderRadius: 8,
  },
  likeOverlay: {
    top: 40,
    right: 40,
    borderColor: 'rgba(39,174,96,0.8)',
    transform: [{ rotate: '20deg' }],
  },
  nopeOverlay: {
    top: 40,
    left: 40,
    borderColor: 'rgba(231,76,60,0.8)',
    transform: [{ rotate: '-20deg' }],
  },
  likeText: {
    fontSize: 32,
    fontWeight: '800',
    color: 'rgba(39,174,96,0.8)',
  },
  nopeText: {
    fontSize: 32,
    fontWeight: '800',
    color: 'rgba(231,76,60,0.8)',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noMoreCardsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  noMoreCardsSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 