import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Car } from '../types/car';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CarDetailModalProps {
  visible: boolean;
  car: Car | null;
  onClose: () => void;
  isInGarage?: boolean;
  onRemoveFromGarage?: (carId: number) => void;
}

export default function CarDetailModal({ 
  visible, 
  car, 
  onClose, 
  isInGarage = false,
  onRemoveFromGarage 
}: CarDetailModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { colors } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (visible && car) {
      // Preload main image
      Image.prefetch(car.image)
        .then(() => setImageLoaded(true))
        .catch(() => setImageLoaded(true));
      setActiveIndex(0);
    } else {
      setImageLoaded(false);
    }
  }, [visible, car]);

  const handleRemoveFromGarage = () => {
    if (onRemoveFromGarage && car) {
      onRemoveFromGarage(car.id);
    }
    onClose();
  };

  const getDaysAgo = (listedDate: string) => {
    const listed = new Date(listedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - listed.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (!car) return null;

  if (!imageLoaded) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={[styles.loadingContainer, { backgroundColor: colors.backdrop }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Modal>
    );
  }

  // Get all images for the car
  const images = car.images && car.images.length > 0 ? car.images : [car.image];

  const renderImage = ({ item }: { item: string }) => (
    <Image 
      source={{ uri: item }} 
      style={styles.carouselImage}
      resizeMode="cover"
    />
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.backdrop, { backgroundColor: colors.backdrop }]}>
        <View style={[styles.container, { backgroundColor: colors.modal }]}>
          <SafeAreaView style={styles.safeArea}>
            {/* Swipe indicator */}
            <View style={styles.swipeIndicator}>
              <View style={[styles.swipeBar, { backgroundColor: colors.border }]} />
            </View>
            
            {/* Scrollable content */}
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
            >
              {/* Image Carousel */}
              <View style={styles.imageContainer}>
                <FlatList
                  data={images}
                  renderItem={renderImage}
                  keyExtractor={(_, index) => index.toString()}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  style={styles.carousel}
                  onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                    setActiveIndex(index);
                  }}
                />
                <View style={styles.imageGradient} />
                
                {/* Carousel Dots */}
                {images.length > 1 && (
                  <View style={styles.dotsContainer}>
                    {images.map((_, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.dot,
                          { backgroundColor: colors.border },
                          idx === activeIndex && { backgroundColor: colors.primary }
                        ]}
                      />
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.content}>
                {/* Header Row */}
                <View style={styles.headerRow}>
                  <View style={styles.headerLeft}>
                    <Text style={[styles.title, { color: colors.text }]}>
                      {car.year} {car.make} {car.model}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                      {car.mileage?.toLocaleString()} miles
                    </Text>
                    <Text style={[styles.listedDate, { color: colors.textTertiary }]}>
                      Listed {getDaysAgo(car.listedDate || '2023-01-01')}
                    </Text>
                  </View>
                  <View style={styles.headerRight}>
                    {car.priceRating === 'Great Deal' && (
                      <View style={[styles.dealBadge, { backgroundColor: colors.success }]}>
                        <Text style={[styles.dealBadgeText, { color: colors.textInverse }]}>Great Deal</Text>
                      </View>
                    )}
                    <Text style={[styles.price, { color: colors.primary }]}>${car.price?.toLocaleString()}</Text>
                  </View>
                </View>

                {/* Seller Info with Location */}
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Seller Info</Text>
                  <Text style={[styles.sellerName, { color: colors.text }]}>{car.sellerName || 'John Doe'}</Text>
                  <View style={styles.locationContainer}>
                    <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.sellerLocation, { color: colors.textSecondary }]}>{car.location}</Text>
                  </View>
                </View>

                {/* Vehicle Specs */}
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Vehicle Specs</Text>
                  <View style={styles.specsGrid}>
                    <View style={styles.specRow}>
                      <View style={styles.specItem}>
                        <Text style={[styles.specLabel, { color: colors.textSecondary }]}>Title</Text>
                        <Text style={[styles.specValue, { color: colors.text }]}>{car.make} {car.model} {car.year}</Text>
                      </View>
                      <View style={styles.specItem}>
                        <Text style={[styles.specLabel, { color: colors.textSecondary }]}>Title Status</Text>
                        <Text style={[styles.specValue, { color: colors.text }]}>{car.titleStatus || 'Clean'} Title</Text>
                      </View>
                    </View>
                    <View style={styles.specRow}>
                      <View style={styles.specItem}>
                        <Text style={[styles.specLabel, { color: colors.textSecondary }]}>Transmission</Text>
                        <Text style={[styles.specValue, { color: colors.text }]}>{car.transmission || 'Automatic'}</Text>
                      </View>
                      <View style={styles.specItem}>
                        <Text style={[styles.specLabel, { color: colors.textSecondary }]}>Fuel Type</Text>
                        <Text style={[styles.specValue, { color: colors.text }]}>{car.fuelType || 'Gasoline'}</Text>
                      </View>
                    </View>
                    <View style={styles.specRow}>
                      <View style={styles.specItem}>
                        <Text style={[styles.specLabel, { color: colors.textSecondary }]}>Listed</Text>
                        <Text style={[styles.specValue, { color: colors.text }]}>{car.listedDate || '2023-01-01'}</Text>
                      </View>
                      <View style={styles.specItem}>
                        <Text style={[styles.specLabel, { color: colors.textSecondary }]}>Exterior</Text>
                        <Text style={[styles.specValue, { color: colors.text }]}>{car.exteriorColor || 'Unknown'}</Text>
                      </View>
                    </View>
                    <View style={styles.specRow}>
                      <View style={styles.specItem}>
                        <Text style={[styles.specLabel, { color: colors.textSecondary }]}>Interior</Text>
                        <Text style={[styles.specValue, { color: colors.text }]}>{car.interiorColor || 'Unknown'}</Text>
                      </View>
                      <View style={styles.specItem}>
                        <Text style={[styles.specLabel, { color: colors.textSecondary }]}>Seats</Text>
                        <Text style={[styles.specValue, { color: colors.text }]}>{car.seats || '5'} seats</Text>
                      </View>
                    </View>
                    <View style={styles.specRow}>
                      <View style={styles.specItem}>
                        <Text style={[styles.specLabel, { color: colors.textSecondary }]}>Trim</Text>
                        <Text style={[styles.specValue, { color: colors.text }]}>{car.trim || 'Standard'}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
                  <Text style={[styles.description, { color: colors.text }]}>
                    {car.description || 'No description available.'}
                  </Text>
                </View>

                {/* Pros and Cons */}
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Pros & Cons</Text>
                  <View style={styles.prosConsContainer}>
                    <View style={styles.prosContainer}>
                      <Text style={[styles.prosConsTitle, { color: colors.success }]}>Pros</Text>
                      {car.pros && car.pros.map((pro, index) => (
                        <View key={index} style={styles.prosConsItem}>
                          <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                          <Text style={[styles.prosConsText, { color: colors.text }]}>{pro}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.consContainer}>
                      <Text style={[styles.prosConsTitle, { color: colors.error }]}>Cons</Text>
                      {car.cons && car.cons.map((con, index) => (
                        <View key={index} style={styles.prosConsItem}>
                          <Ionicons name="close-circle" size={16} color={colors.error} />
                          <Text style={[styles.prosConsText, { color: colors.text }]}>{con}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={[styles.actionButtons, { backgroundColor: colors.modal, borderTopColor: colors.border }]}>
              {isInGarage && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.error }]}
                  onPress={handleRemoveFromGarage}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trash-outline" size={20} color={colors.textInverse} />
                  <Text style={[styles.actionButtonText, { color: colors.textInverse }]}>Remove from Garage</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.backdrop }]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={24} color={colors.textInverse} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    height: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  swipeIndicator: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  swipeBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  carousel: {
    flex: 1,
  },
  carouselImage: {
    width: SCREEN_WIDTH,
    height: 250,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  content: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  listedDate: {
    fontSize: 14,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  dealBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  dealBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerLocation: {
    fontSize: 14,
    marginLeft: 4,
  },
  specsGrid: {
    gap: 16,
  },
  specRow: {
    flexDirection: 'row',
    gap: 16,
  },
  specItem: {
    flex: 1,
  },
  specLabel: {
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  prosConsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  prosContainer: {
    flex: 1,
  },
  consContainer: {
    flex: 1,
  },
  prosConsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  prosConsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  prosConsText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitleStatus: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 16,
    marginTop: 12,
  },
  modalTitleStatusValue: {
    fontWeight: '700',
    color: '#000',
  },
}); 