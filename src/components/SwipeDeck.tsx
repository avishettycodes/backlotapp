import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  StatusBar,
  TouchableOpacity,
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

// Responsive scaling factors
const scale = Math.min(SCREEN_WIDTH / 375, SCREEN_HEIGHT / 812); // Base on iPhone X dimensions
const scaledFontSize = (size: number) => size * scale;
const scaledSize = (size: number) => size * scale;

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
  const [swipeDirection, setSwipeDirection] = useState<'right' | 'left' | null>(null);
  
  const { addToGarage, clearGarage } = useGarageStore();
  const { carQueue, addToQueue, removeFromQueue, clearQueue } = useSwipeQueueStore();

  // Development mode: Reset stores and car index on component mount
  useEffect(() => {
    if (__DEV__) {
      console.log('🔄 Development mode: Resetting app state');
      clearGarage();
      clearQueue();
      setCurrentCarIndex(0);
    }
  }, [clearGarage, clearQueue]);

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
    setSwipeDirection(direction);
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

    const maxCards = 3;
    const cardsToRender: React.ReactNode[] = [];

    for (let i = maxCards - 1; i >= 0; i--) {
      const car = allCars[currentCarIndex + i];
      if (car) {
        const scale = 1 - (i * 0.05);
        const translateY = i * 8;
        const opacity = 1 - (i * 0.3);
        
        cardsToRender.push(
          <Animated.View
            key={`${car.id}-${i}`}
            style={[
              styles.card,
              styles.stackedCard,
              i === 0 ? styles.topCard : null,
              {
                transform: [
                  { scale },
                  { translateY },
                  // Add swipe animation for top card only
                  ...(i === 0 ? [
                    { translateX: position.x },
                    { translateY: position.y },
                    { rotate: rotation },
                  ] : []),
                ],
                opacity,
                zIndex: maxCards - i,
              },
            ]}
            {...(i === 0 ? panResponder.panHandlers : {})}
          >
            <Image source={{ uri: car.image }} style={styles.cardImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.gradientOverlay}
              locations={[0.7, 1]}
            />
            
            {/* Swipe Overlays for top card only */}
            {i === 0 && (
              <>
                <Animated.View style={[styles.overlay, styles.likeOverlay, { opacity: likeOpacity }]}>
                  <Text style={styles.likeText}>SAVE</Text>
                </Animated.View>
                <Animated.View style={[styles.overlay, styles.nopeOverlay, { opacity: nopeOpacity }]}>
                  <Text style={styles.nopeText}>NOPE</Text>
                </Animated.View>
              </>
            )}
            
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
          blurRadius={35}
        />
      )}

      {/* Dark Overlay for Contrast */}
      <View style={styles.darkOverlay} />

      {/* Card Stack with proper spacing above tab bar */}
      <View style={styles.cardContainer}>
        {renderCards()}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.6}
          onPress={() => forceSwipe('left')}
        >
          <Text style={styles.actionIcon}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.6}
          onPress={() => forceSwipe('right')}
        >
          <Text style={styles.actionIcon}>❤️</Text>
        </TouchableOpacity>
      </View>

      {/* Swipe Overlays */}
      {swipeDirection && (
        <View style={[
          styles.overlay,
          swipeDirection === 'right' ? styles.likeOverlay : styles.nopeOverlay
        ]}>
          <Text style={swipeDirection === 'right' ? styles.likeText : styles.nopeText}>
            {swipeDirection === 'right' ? 'SAVE' : 'NOPE'}
          </Text>
        </View>
      )}

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
    paddingBottom: scaledSize(120), // Responsive space for tab bar
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaledSize(20),
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.92, // Use screen width percentage
    height: SCREEN_HEIGHT * 0.7, // Use screen height percentage
    backgroundColor: '#fff',
    borderRadius: scaledSize(24),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  stackedCard: {
    position: 'absolute',
  },
  topCard: {
    zIndex: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: scaledSize(24),
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
    padding: scaledSize(24),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: scaledSize(8),
  },
  carTitle: {
    fontSize: scaledFontSize(28),
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  carPrice: {
    fontSize: scaledFontSize(24),
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  carSubtitle: {
    fontSize: scaledFontSize(16),
    color: '#fff',
    opacity: 0.9,
  },
  overlay: {
    position: 'absolute',
    padding: scaledSize(12),
    borderWidth: scaledSize(6),
    borderRadius: scaledSize(12),
  },
  likeOverlay: {
    top: scaledSize(50),
    right: scaledSize(50),
    borderColor: 'rgba(52,199,89,0.9)',
    transform: [{ rotate: '25deg' }],
  },
  nopeOverlay: {
    top: scaledSize(50),
    left: scaledSize(50),
    borderColor: 'rgba(255,76,76,0.9)',
    transform: [{ rotate: '-25deg' }],
  },
  likeText: {
    fontSize: scaledFontSize(36),
    fontWeight: '900',
    color: 'rgba(52,199,89,0.9)',
    letterSpacing: 2,
  },
  nopeText: {
    fontSize: scaledFontSize(36),
    fontWeight: '900',
    color: 'rgba(255,76,76,0.9)',
    letterSpacing: 2,
  },
  actionButtons: {
    position: 'absolute',
    bottom: scaledSize(140),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scaledSize(30),
  },
  actionButton: {
    width: scaledSize(72),
    height: scaledSize(72),
    borderRadius: scaledSize(36),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  actionIcon: {
    fontSize: scaledFontSize(28),
    fontWeight: 'bold',
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scaledSize(40),
  },
  noMoreCardsText: {
    fontSize: scaledFontSize(24),
    fontWeight: 'bold',
    color: '#fff',
    marginTop: scaledSize(16),
    marginBottom: scaledSize(8),
  },
  noMoreCardsSubtext: {
    fontSize: scaledFontSize(16),
    color: '#666',
    textAlign: 'center',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
}); 