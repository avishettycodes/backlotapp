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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CarDetailModal from './CarDetailModal';
import SettingsModal from './SettingsModal';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32; // Full width minus padding

// Responsive scaling factors
const scale = Math.min(SCREEN_WIDTH / 375, SCREEN_HEIGHT / 812);
const scaledFontSize = (size: number) => size * scale;
const scaledSize = (size: number) => size * scale;

const Garage = () => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  // Subscribe to both stores
  const { cars: garageCars, removeFromGarage, clearGarage } = useGarageStore()
  const { addToQueue, clearQueue } = useSwipeQueueStore()

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

  const handleRemoveFromGarage = (carId: string) => {
    console.log('Removing car from garage:', carId);
    removeFromGarage(carId);
    let carToReturn = garageCars.find(car => String(car.id) === carId);
    if (!carToReturn && selectedCar && String(selectedCar.id) === carId) {
      carToReturn = selectedCar;
    }
    if (carToReturn) {
      addToQueue(carToReturn);
    }
  };

  const renderCarCard = ({ item: car }: { item: Car }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        activeOpacity={0.8}
        onPress={() => openCarModal(car)}
      >
        <Image source={{ uri: car.image }} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={[styles.title, { color: colors.text }]}>
            {car.year} {car.make} {car.model}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {car.mileage?.toLocaleString()} mi · {car.location}
          </Text>
          <Text style={[styles.price, { color: colors.primary }]}>${car.price?.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>

      <View style={[styles.actionButtons, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={() => Alert.alert('Message Seller', 'This feature is coming soon!')}
        >
          <Ionicons name="chatbubble-outline" size={scaledSize(24)} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={() => handleRemoveFromGarage(String(car.id))}
        >
          <Ionicons name="trash-outline" size={scaledSize(24)} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
      <View style={styles.content}>
        {garageCars.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={scaledSize(64)} color={colors.textTertiary} />
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>Your garage is empty</Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.textTertiary }]}>Swipe right on cars to add them to your garage</Text>
          </View>
        ) : (
          <FlatList
            data={garageCars}
            renderItem={renderCarCard}
            keyExtractor={(item) => String(item.id)}
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
  },
  content: {
    flex: 1,
    paddingHorizontal: scaledSize(16),
    paddingTop: scaledSize(20),
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: scaledFontSize(18),
    marginTop: scaledSize(16),
    marginBottom: scaledSize(8),
  },
  emptyStateSubtext: {
    fontSize: scaledFontSize(14),
    textAlign: 'center',
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: scaledSize(16),
  },
  card: {
    borderRadius: scaledSize(12),
    overflow: 'hidden',
    borderWidth: 1,
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
    marginBottom: scaledSize(8),
  },
  price: {
    fontSize: scaledFontSize(16),
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: scaledSize(16),
    borderTopWidth: 1,
  },
  actionButton: {
    padding: scaledSize(8),
  },
  listContent: {
    paddingHorizontal: scaledSize(16),
  },
});

export default Garage; 