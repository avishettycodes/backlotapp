import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CarDetailModal from './CarDetailModal';
import { Car } from '../types/car';
import { useGarageStore } from '../store/garageStore';
import { useSwipeQueueStore, initialCars } from '../store/swipeQueueStore';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Card dimensions
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.65;

// Responsive scaling factors
const scale = Math.min(SCREEN_WIDTH / 375, SCREEN_HEIGHT / 812);
const scaledFontSize = (size: number) => size * scale;
const scaledSize = (size: number) => size * scale;

export default function SwipeDeck() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { colors, isDark } = useTheme();
  
  const { addToGarage, clearGarage } = useGarageStore();
  const { carQueue, addToQueue, removeFromQueue, clearQueue, initializeQueue } = useSwipeQueueStore();

  // Development mode: Reset stores on component mount and initialize with new cars
  useEffect(() => {
    if (__DEV__) {
      console.log('🔄 Development mode: Resetting app state');
      clearGarage();
      clearQueue();
      
      // Initialize queue with new cars from the store
      console.log('🔄 Development mode: Initializing queue with new cars');
      initializeQueue(initialCars);
    }
  }, [clearGarage, clearQueue, initializeQueue]);

  const handleSwipe = (direction: 'left' | 'right') => {
    const car = carQueue[currentIndex];
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
    
    // Move to next card
    setCurrentIndex(prev => prev + 1);
  };

  const handleCardPress = (car: Car) => {
    console.log('Card pressed! Opening modal for car:', car);
    setSelectedCar(car);
    setModalVisible(true);
  };

  const renderCard = (car: Car, isBlurred = false) => {
    return (
      <TouchableOpacity
        style={[
          styles.card, 
          { backgroundColor: colors.card },
          isBlurred && styles.blurredCardContainer
        ]}
        activeOpacity={0.9}
        onPress={() => handleCardPress(car)}
      >
        <Image 
          source={{ uri: car.image }} 
          style={[
            styles.cardImage,
            isBlurred && { opacity: 0.8 }
          ]} 
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.gradientOverlay}
          locations={[0.6, 1]}
        />
        
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[
              styles.carTitle,
              isBlurred && styles.blurredText
            ]}>
              {car.year} {car.make} {car.model}
            </Text>
            <Text style={[
              styles.carPrice, 
              { color: colors.primary },
              isBlurred && styles.blurredText
            ]}>
              ${car.price?.toLocaleString()}
            </Text>
          </View>
          <Text style={[
            styles.carSubtitle,
            isBlurred && styles.blurredText
          ]}>
            {car.mileage?.toLocaleString()} mi • {car.location}
          </Text>
          <Text style={[
            styles.carTitleStatus,
            isBlurred && styles.blurredText
          ]}>
            {car.titleStatus || 'Clean'} Title
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCardStack = () => {
    if (carQueue.length === 0) {
      return renderNoMoreCards();
    }

    const currentCar = carQueue[currentIndex];
    const nextCar = carQueue[currentIndex + 1];

    return (
      <View style={styles.cardStackContainer}>
        {/* Background card (next card) - positioned behind */}
        {nextCar && (
          <View style={styles.backgroundCard}>
            {renderCard(nextCar, true)}
          </View>
        )}
        
        {/* Foreground card (current card) */}
        <View style={styles.foregroundCard}>
          <Swiper
            cards={[currentCar]}
            cardIndex={0}
            stackSize={1}
            backgroundColor="transparent"
            cardVerticalMargin={0}
            cardHorizontalMargin={0}
            containerStyle={styles.swiperContainerStyle}
            renderCard={(car: Car) => (
              <View style={styles.cardWrapper}>
                {renderCard(car, false)}
              </View>
            )}
            onSwipedLeft={() => handleSwipe('left')}
            onSwipedRight={() => handleSwipe('right')}
            overlayLabels={{
              left: {
                title: 'NOPE',
                style: {
                  label: {
                    backgroundColor: 'rgba(255,0,0,0.8)',
                    color: 'white',
                    fontSize: 32,
                    padding: 10,
                    borderRadius: 8,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginLeft: -20,
                    marginTop: 20,
                  },
                },
              },
              right: {
                title: 'SAVE',
                style: {
                  label: {
                    backgroundColor: 'rgba(0,200,0,0.8)',
                    color: 'white',
                    fontSize: 32,
                    padding: 10,
                    borderRadius: 8,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginLeft: 20,
                    marginTop: 20,
                  },
                },
              },
            }}
          />
        </View>
      </View>
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Full Screen Container for Gradient */}
      <View style={styles.fullScreenContainer}>
        <LinearGradient
          colors={['#1a1a1a', '#000000', '#000000']}
          style={styles.fullScreenGradient}
          locations={[0, 0.7, 1]}
        />
      </View>
      
      {/* Background Blur Effect - Only show in dark mode */}
      {isDark && carQueue.length > 0 && (
        <Image
          source={{ uri: carQueue[currentIndex]?.image }}
          style={styles.backgroundImage}
          blurRadius={35}
        />
      )}

      {/* Dark Overlay for Contrast - Only show in dark mode */}
      {isDark && (
        <View style={[styles.darkOverlay, { backgroundColor: colors.backdrop }]} />
      )}

      {/* Safe area for content only */}
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Card Stack */}
        <View style={styles.swiperContainer}>
          {renderCardStack()}
        </View>
      </SafeAreaView>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000000',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  safeArea: {
    flex: 1,
    position: 'relative',
  },
  swiperContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiperContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 25,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: scaledSize(20),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scaledSize(8),
  },
  carTitle: {
    fontSize: scaledFontSize(24),
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: scaledSize(10),
  },
  carPrice: {
    fontSize: scaledFontSize(20),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  carSubtitle: {
    fontSize: scaledFontSize(16),
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: scaledSize(4),
  },
  carTitleStatus: {
    fontSize: scaledFontSize(14),
    color: '#FFFFFF',
    opacity: 0.8,
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaledSize(40),
  },
  noMoreCardsText: {
    fontSize: scaledFontSize(24),
    fontWeight: 'bold',
    marginTop: scaledSize(20),
    marginBottom: scaledSize(10),
    textAlign: 'center',
  },
  noMoreCardsSubtext: {
    fontSize: scaledFontSize(16),
    textAlign: 'center',
    lineHeight: scaledFontSize(24),
  },
  cardStackContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    marginTop: scaledSize(20),
    justifyContent: 'center',
  },
  backgroundCard: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: CARD_WIDTH - scaledSize(10),
    height: CARD_HEIGHT - scaledSize(20),
    borderRadius: 25,
    transform: [
      { translateX: -(CARD_WIDTH - scaledSize(10)) / 2 },
      { translateY: -(CARD_HEIGHT - scaledSize(20)) / 2 + scaledSize(10) },
      { scale: 0.95 }
    ],
  },
  foregroundCard: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 25,
    transform: [
      { translateX: -CARD_WIDTH / 2 },
      { translateY: -CARD_HEIGHT / 2 }
    ],
  },
  blurredCardContainer: {
    opacity: 0.8,
  },
  blurredText: {
    opacity: 0.8,
  },
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  fullScreenGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
}); 