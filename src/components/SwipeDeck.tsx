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
  ImageStyle,
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
import { TextStyles } from '../constants/Typography';
import { 
  SCREEN_WIDTH, 
  SCREEN_HEIGHT, 
  scaledSize, 
  scaledFontSize, 
  SPACING, 
  BORDER_RADIUS,
  CARD,
  CARD_SHADOW,
  CONTENT_PADDING,
  ICON_SIZES
} from '../constants/Layout';

// Card dimensions
const CARD_WIDTH = CARD.width;
const CARD_HEIGHT = CARD.height;

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
    if (__DEV__) console.log(`Swipe ${direction} completed for car:`, car);
    
    // Remove the car from the queue regardless of direction
    if (carQueue.some(c => c.id === car.id)) {
      removeFromQueue(car.id);
    }
    
    if (direction === 'right') {
      if (__DEV__) console.log('Adding car to garage...');
      addToGarage(car);
    } else {
      if (__DEV__) console.log('Car dismissed (swiped left)');
      // Left swipe = dismiss, don't add anywhere
    }
    
    // Move to next card
    setCurrentIndex(prev => prev + 1);
  };

  const handleCardPress = (car: Car) => {
    if (__DEV__) console.log('Card pressed! Opening modal for car:', car);
    setSelectedCar(car);
    setModalVisible(true);
  };

  const renderCard = (car: Car, isBlurred = false) => {
    return (
      <TouchableOpacity
        style={[
          styles.card, 
          { backgroundColor: colors.card }
        ]}
        activeOpacity={0.9}
        onPress={() => handleCardPress(car)}
      >
        <Image 
          source={{ uri: car.image }} 
          style={styles.cardImage as ImageStyle}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.9)']}
          style={styles.gradientOverlay}
          locations={[0.4, 0.7, 1]}
        />
        
        {/* Price Badge */}
        <View style={styles.priceBadge}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={styles.priceBadgeGradient}
          >
            <Text style={styles.priceBadgeText}>
              ${car.price?.toLocaleString()}
            </Text>
          </LinearGradient>
        </View>
        
        {/* Deal Rating Badge */}
        {car.deal && (
          <View style={[
            styles.dealBadge,
            { backgroundColor: car.deal === 'good' ? colors.success : car.deal === 'fair' ? colors.warning : colors.error }
          ]}>
            <Text style={styles.dealBadgeText}>
              {car.deal === 'good' ? 'Great Deal' : car.deal === 'fair' ? 'Fair Price' : 'Overpriced'}
            </Text>
          </View>
        )}
        
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[
              styles.carTitle,
              isBlurred && styles.blurredText
            ]}>
              {car.year} {car.make} {car.model}
            </Text>
          </View>
          <Text style={[
            styles.carSubtitle,
            isBlurred && styles.blurredText
          ]}>
            {car.mileage?.toLocaleString()} mi • {car.location}
          </Text>
          <View style={styles.carDetails}>
            <Text style={[
              styles.carTitleStatus,
              isBlurred && styles.blurredText
            ]}>
              {car.titleStatus || 'Clean'} Title
            </Text>
            <Text style={[
              styles.carTrim,
              isBlurred && styles.blurredText
            ]}>
              {car.trim}
            </Text>
          </View>
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
        <Ionicons name="car-outline" size={ICON_SIZES.xxl} color={colors.textSecondary} />
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
      {isDark && carQueue.length > 0 && carQueue[currentIndex] && (
        <Image
          source={{ uri: carQueue[currentIndex].image }}
          style={styles.backgroundImage as ImageStyle}
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
  } as ImageStyle,
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
    paddingVertical: SPACING.lg,
    paddingBottom: CONTENT_PADDING.bottom,
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
    borderRadius: CARD.borderRadius,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  card: {
    flex: 1,
    borderRadius: CARD.borderRadius,
    overflow: 'hidden' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  } as ImageStyle,
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
    padding: scaledSize(16),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scaledSize(8),
  },
  carTitle: {
    ...TextStyles.carTitle,
    color: '#FFFFFF',
    flex: 1,
    marginRight: scaledSize(10),
  },
  carPrice: {
    ...TextStyles.price,
    color: '#FFFFFF',
  },
  carSubtitle: {
    ...TextStyles.bodyMedium,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: scaledSize(4),
  },
  carTitleStatus: {
    ...TextStyles.caption,
    color: '#FFFFFF',
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaledSize(40),
  },
  noMoreCardsText: {
    ...TextStyles.heading1,
    marginTop: scaledSize(20),
    marginBottom: scaledSize(10),
    textAlign: 'center',
  },
  noMoreCardsSubtext: {
    ...TextStyles.bodyMedium,
    textAlign: 'center',
    opacity: 0.8,
  },
  cardStackContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
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
      { translateY: -(CARD_HEIGHT - scaledSize(20)) / 2 },
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
  priceBadge: {
    position: 'absolute',
    top: scaledSize(12),
    right: scaledSize(12),
    zIndex: 10,
  },
  priceBadgeGradient: {
    paddingHorizontal: scaledSize(12),
    paddingVertical: scaledSize(8),
    borderRadius: scaledSize(20),
  },
  priceBadgeText: {
    ...TextStyles.accent,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dealBadge: {
    position: 'absolute',
    top: scaledSize(12),
    left: scaledSize(12),
    zIndex: 10,
    paddingHorizontal: scaledSize(10),
    paddingVertical: scaledSize(4),
    borderRadius: scaledSize(12),
  },
  dealBadgeText: {
    ...TextStyles.overline,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  carDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scaledSize(8),
  },
  carTrim: {
    ...TextStyles.bodyMedium,
    color: '#FFFFFF',
    opacity: 0.8,
    fontWeight: '500',
  },
}); 