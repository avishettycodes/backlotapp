import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';
import CarDetailModal from './CarDetailModal';
import SettingsModal from './SettingsModal';
import { Car } from '../types/car';
import { useGarageStore } from '../store/garageStore';
import { useSwipeQueueStore } from '../store/swipeQueueStore';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive scaling factors
const scale = Math.min(SCREEN_WIDTH / 375, SCREEN_HEIGHT / 812);
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const { colors, isDark } = useTheme();
  
  const { addToGarage, clearGarage } = useGarageStore();
  const { carQueue, addToQueue, removeFromQueue, clearQueue } = useSwipeQueueStore();

  // Development mode: Reset stores on component mount
  useEffect(() => {
    if (__DEV__) {
      console.log('🔄 Development mode: Resetting app state');
      clearGarage();
      clearQueue();
    }
  }, [clearGarage, clearQueue]);

  // Combine sample cars with queue cars, prioritizing queue cars
  const allCars = [...carQueue, ...sampleCars];

  const handleSwipe = (direction: 'left' | 'right', cardIndex: number) => {
    const car = allCars[cardIndex];
    console.log(`Swipe ${direction} completed for car:`, car);
    
    // Remove the car from the queue if it was in the queue
    if (carQueue.some(c => c.id === car.id)) {
      removeFromQueue(car.id);
    }
    
    if (direction === 'right') {
      console.log('Adding car to garage...');
      addToGarage(car);
    } else {
      console.log('Adding car to queue...');
      addToQueue(car);
    }
  };

  const handleCardPress = (car: Car) => {
    console.log('Card pressed! Opening modal for car:', car);
    setSelectedCar(car);
    setModalVisible(true);
  };

  const renderCard = (car: Car, cardIndex: number) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => handleCardPress(car)}
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
      </TouchableOpacity>
    );
  };

  const renderNoMoreCards = () => {
    return (
      <View style={styles.noMoreCards}>
        <Ionicons name="car-outline" size={64} color={colors.textSecondary} />
        <Text style={[styles.noMoreCardsText, { color: colors.text }]}>No more cars!</Text>
        <Text style={[styles.noMoreCardsSubtext, { color: colors.textSecondary }]}>Check back later for new listings</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Settings Button */}
      <TouchableOpacity
        style={[styles.settingsButton, { backgroundColor: colors.primary }]}
        onPress={() => setSettingsVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="settings-outline" size={scaledSize(24)} color={colors.textInverse} />
      </TouchableOpacity>

      {/* Background Blur Effect - Only show in dark mode */}
      {isDark && allCars.length > 0 && (
        <Image
          source={{ uri: allCars[0].image }}
          style={styles.backgroundImage}
          blurRadius={35}
        />
      )}

      {/* Dark Overlay for Contrast - Only show in dark mode */}
      {isDark && (
        <View style={[styles.darkOverlay, { backgroundColor: colors.backdrop }]} />
      )}

      {/* Swiper Component */}
      <View style={styles.swiperContainer}>
        <Swiper
          cards={allCars}
          renderCard={renderCard}
          onSwipedLeft={(cardIndex) => handleSwipe('left', cardIndex)}
          onSwipedRight={(cardIndex) => handleSwipe('right', cardIndex)}
          cardIndex={0}
          stackSize={3}
          backgroundColor="transparent"
          animateOverlayLabelsOpacity
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: {
                  fontSize: scaledFontSize(24),
                  fontWeight: 'bold',
                  color: colors.textInverse,
                  borderWidth: 3,
                  borderColor: colors.swipeNope,
                  borderStyle: 'solid',
                  paddingHorizontal: scaledSize(12),
                  paddingVertical: scaledSize(6),
                  borderRadius: scaledSize(2),
                  backgroundColor: colors.swipeNope,
                  textShadowColor: 'rgba(0,0,0,0.2)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 1,
                },
                wrapper: {
                  position: 'absolute',
                  top: scaledSize(20),
                  right: scaledSize(20),
                  alignItems: 'flex-end',
                  zIndex: 10,
                },
              },
            },
            right: {
              title: 'SAVE',
              style: {
                label: {
                  fontSize: scaledFontSize(24),
                  fontWeight: 'bold',
                  color: colors.textInverse,
                  borderWidth: 3,
                  borderColor: colors.swipeSave,
                  borderStyle: 'solid',
                  paddingHorizontal: scaledSize(12),
                  paddingVertical: scaledSize(6),
                  borderRadius: scaledSize(2),
                  backgroundColor: colors.swipeSave,
                  textShadowColor: 'rgba(0,0,0,0.2)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 1,
                },
                wrapper: {
                  position: 'absolute',
                  top: scaledSize(20),
                  left: scaledSize(20),
                  alignItems: 'flex-start',
                  zIndex: 10,
                },
              },
            },
          }}
          onSwipedAll={renderNoMoreCards}
        />
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

      {/* Settings Modal */}
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingsButton: {
    position: 'absolute',
    top: scaledSize(60),
    right: scaledSize(20),
    width: scaledSize(44),
    height: scaledSize(44),
    borderRadius: scaledSize(22),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  swiperContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaledSize(20),
  },
  card: {
    width: SCREEN_WIDTH * 0.92,
    height: SCREEN_HEIGHT * 0.7,
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