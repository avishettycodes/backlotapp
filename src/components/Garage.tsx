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
  RefreshControl,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CarDetailModal from './CarDetailModal';
import SettingsModal from './SettingsModal';
import { useTheme } from '../context/ThemeContext';
import { TextStyles } from '../constants/Typography';
import { 
  SCREEN_WIDTH, 
  SCREEN_HEIGHT, 
  scaledSize, 
  scaledFontSize, 
  SPACING, 
  BORDER_RADIUS,
  CONTENT_PADDING,
  ICON_SIZES,
  CARD,
  CARD_SHADOW
} from '../constants/Layout';

const Garage = () => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  // Subscribe to both stores
  const { cars: garageCars, removeFromGarage, clearGarage } = useGarageStore()
  const { addToQueue, clearQueue } = useSwipeQueueStore()

  // Debug: Log garage state changes
  useEffect(() => {
    if (__DEV__) {
      console.log('Garage component mounted/updated')
      console.log('Current garage cars:', garageCars)
      console.log('Garage cars length:', garageCars.length)
    }
  }, [garageCars])

  const openCarModal = (car: Car) => {
    if (__DEV__) console.log('Opening modal for car:', car);
    setSelectedCar(car);
    setModalVisible(true);
  };

  const closeModal = () => {
    if (__DEV__) console.log('Closing modal');
    setModalVisible(false);
    setSelectedCar(null);
  };

  const handleRemoveFromGarage = (carId: string) => {
    if (__DEV__) console.log('Removing car from garage:', carId);
    removeFromGarage(carId);
    let carToReturn = garageCars.find(car => String(car.id) === carId);
    if (!carToReturn && selectedCar && String(selectedCar.id) === carId) {
      carToReturn = selectedCar;
    }
    if (carToReturn) {
      addToQueue(carToReturn);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const renderCarCard = ({ item: car }: { item: Car }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.8}
      onPress={() => openCarModal(car)}
    >
      <Image source={{ uri: car.image }} style={styles.cardImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)']}
        style={styles.imageGradient}
        locations={[0.5, 0.8, 1]}
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
      
      {/* Deal Badge */}
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
      
      {/* Card Content */}
      <View style={styles.cardContent}>
        <Text style={[styles.title, { color: '#FFFFFF' }]} numberOfLines={1}>
          {car.year} {car.make} {car.model}
        </Text>
        <Text style={[styles.subtitle, { color: '#FFFFFF' }]} numberOfLines={1}>
          {car.mileage?.toLocaleString()} mi • {car.location}
        </Text>
        <View style={styles.cardDetails}>
          <Text style={[styles.trim, { color: '#FFFFFF' }]} numberOfLines={1}>
            {car.trim}
          </Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveFromGarage(String(car.id))}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={ICON_SIZES.sm} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>My Garage</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {garageCars.length} {garageCars.length === 1 ? 'car' : 'cars'} saved
        </Text>
      </View>
      
      {garageCars.length === 0 ? (
        <View style={styles.emptyState}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={styles.emptyStateIcon}
          >
            <Ionicons name="car-outline" size={ICON_SIZES.xxl} color="#fff" />
          </LinearGradient>
          <Text style={[styles.emptyStateText, { color: colors.text }]}>Your garage is empty</Text>
          <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
            Swipe right on cars to add them to your garage
          </Text>
        </View>
      ) : (
        <FlatList
          data={garageCars}
          renderItem={renderCarCard}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}

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
  },
  emptyStateIcon: {
    width: scaledSize(120),
    height: scaledSize(120),
    borderRadius: scaledSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: CONTENT_PADDING.bottom, // Account for tab bar
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  emptyStateText: {
    fontSize: scaledFontSize(18),
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: scaledFontSize(14),
    textAlign: 'center',
  },
  card: {
    width: (SCREEN_WIDTH - SPACING.md * 3) / 2,
    height: scaledSize(220),
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...CARD_SHADOW,
  },
  image: {
    width: scaledSize(180), // Slightly wider image
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  title: {
    ...TextStyles.bodyLarge,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: scaledFontSize(12),
    marginBottom: SPACING.xs,
  },
  priceBadge: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceBadgeText: {
    fontSize: scaledFontSize(12),
    fontWeight: 'bold',
    color: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trim: {
    fontSize: scaledFontSize(12),
  },
  titleStatus: {
    fontSize: scaledFontSize(12),
  },
  actionButtons: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: SPACING.sm,
    width: scaledSize(40),
  },
  actionButton: {
    width: scaledSize(36),
    height: scaledSize(36),
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: CONTENT_PADDING.bottom,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  screenTitle: {
    ...TextStyles.heading1,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    ...TextStyles.bodyMedium,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  priceBadgeGradient: {
    paddingHorizontal: scaledSize(8),
    paddingVertical: scaledSize(4),
    borderRadius: BORDER_RADIUS.lg,
  },
  dealBadge: {
    position: 'absolute',
    top: scaledSize(8),
    left: scaledSize(8),
    zIndex: 10,
    paddingHorizontal: scaledSize(8),
    paddingVertical: scaledSize(4),
    borderRadius: BORDER_RADIUS.md,
  },
  dealBadgeText: {
    fontSize: scaledFontSize(10),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  removeButton: {
    padding: scaledSize(4),
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default Garage; 