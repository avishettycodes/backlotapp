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
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

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
  
  // Gesture handling state
  const scrollY = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startY = translateY.value;
    },
    onActive: (event, context: any) => {
      // Only allow swipe down when at the top of scroll
      if (scrollY.value <= 0 && event.translationY > 0) {
        translateY.value = context.startY + event.translationY;
      }
    },
    onEnd: (event) => {
      // Check if swipe threshold is met
      if (scrollY.value <= 0 && event.translationY > 100) {
        // Close modal
        runOnJS(onClose)();
      } else {
        // Reset position
        translateY.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    if (visible && car) {
      // Reset animation values when modal opens
      translateY.value = 0;
      
      // Preload main image
      Image.prefetch(car.image)
        .then(() => setImageLoaded(true))
        .catch(() => setImageLoaded(true));
      setActiveIndex(0);
    } else {
      setImageLoaded(false);
      // Reset animation values when modal closes
      translateY.value = 0;
    }
  }, [visible, car]);

  const handleMessageSeller = () => {
    Alert.alert('Message Seller', 'This feature is coming soon!');
    onClose();
  };

  const handleRemoveFromGarage = () => {
    if (car && onRemoveFromGarage) {
      onRemoveFromGarage(car.id);
      onClose();
    }
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
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
      <View style={styles.backdrop}>
        <Animated.View 
          style={[
            styles.container,
            animatedStyle,
          ]}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Swipe indicator */}
            <View style={styles.swipeIndicator}>
              <View style={styles.swipeBar} />
            </View>
            
            {/* Scrollable content with gesture handler */}
            <PanGestureHandler onGestureEvent={gestureHandler}>
              <Animated.View style={{ flex: 1 }}>
                <ScrollView 
                  style={styles.scrollView}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={true}
                  onScroll={(event) => {
                    scrollY.value = event.nativeEvent.contentOffset.y;
                  }}
                  scrollEventThrottle={16}
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
                              idx === activeIndex ? styles.dotActive : null
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
                        <Text style={styles.title}>
                          {car.year} {car.make} {car.model}
                        </Text>
                        <Text style={styles.subtitle}>
                          {car.mileage?.toLocaleString()} miles
                        </Text>
                        <Text style={styles.listedDate}>
                          Listed {getDaysAgo(car.listedDate || '2023-01-01')}
                        </Text>
                      </View>
                      <View style={styles.headerRight}>
                        {car.priceRating === 'Great Deal' && (
                          <View style={styles.dealBadge}>
                            <Text style={styles.dealBadgeText}>Great Deal</Text>
                          </View>
                        )}
                        <Text style={styles.price}>${car.price?.toLocaleString()}</Text>
                      </View>
                    </View>

                    {/* Seller Info with Location */}
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Seller Info</Text>
                      <Text style={styles.sellerName}>{car.sellerName || 'John Doe'}</Text>
                      <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={16} color="#666" />
                        <Text style={styles.sellerLocation}>{car.location}</Text>
                      </View>
                    </View>

                    {/* Vehicle Specs */}
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Vehicle Specs</Text>
                      <View style={styles.specsGrid}>
                        <View style={styles.specRow}>
                          <View style={styles.specItem}>
                            <Text style={styles.specLabel}>Title</Text>
                            <Text style={styles.specValue}>{car.make} {car.model} {car.year}</Text>
                          </View>
                          <View style={styles.specItem}>
                            <Text style={styles.specLabel}>Transmission</Text>
                            <Text style={styles.specValue}>{car.transmission || 'Automatic'}</Text>
                          </View>
                        </View>
                        <View style={styles.specRow}>
                          <View style={styles.specItem}>
                            <Text style={styles.specLabel}>Listed</Text>
                            <Text style={styles.specValue}>{car.listedDate || '2023-01-01'}</Text>
                          </View>
                          <View style={styles.specItem}>
                            <Text style={styles.specLabel}>Exterior</Text>
                            <Text style={styles.specValue}>{car.exteriorColor || 'Blue'}</Text>
                          </View>
                        </View>
                        <View style={styles.specRow}>
                          <View style={styles.specItem}>
                            <Text style={styles.specLabel}>Interior</Text>
                            <Text style={styles.specValue}>{car.interiorColor || 'Black'}</Text>
                          </View>
                          <View style={styles.specItem}>
                            <Text style={styles.specLabel}>Fuel Type</Text>
                            <Text style={styles.specValue}>{car.fuelType || 'Gasoline'}</Text>
                          </View>
                        </View>
                        <View style={styles.specRow}>
                          <View style={styles.specItem}>
                            <Text style={styles.specLabel}>Seats</Text>
                            <Text style={styles.specValue}>{car.seats || 5} seats</Text>
                          </View>
                          <View style={styles.specItem}>
                            <Text style={styles.specLabel}>Trim</Text>
                            <Text style={styles.specValue}>{car.trim || 'SE'}</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Description */}
                    {car.description && (
                      <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{car.description}</Text>
                      </View>
                    )}

                    {/* Pros & Cons */}
                    {((car.pros && car.pros.length > 0) || (car.cons && car.cons.length > 0)) && (
                      <View style={styles.section}>
                        <View style={styles.prosConsContainer}>
                          {car.pros && car.pros.length > 0 && (
                            <View style={styles.prosBox}>
                              <Text style={styles.prosTitle}>Pros</Text>
                              {car.pros.map((pro, index) => (
                                <Text key={index} style={styles.prosItem}>
                                  • {pro}
                                </Text>
                              ))}
                            </View>
                          )}
                          {car.cons && car.cons.length > 0 && (
                            <View style={styles.consBox}>
                              <Text style={styles.consTitle}>Cons</Text>
                              {car.cons.map((con, index) => (
                                <Text key={index} style={styles.consItem}>
                                  • {con}
                                </Text>
                              ))}
                            </View>
                          )}
                        </View>
                      </View>
                    )}

                    {/* Action Buttons - Only show for garage cars */}
                    {isInGarage && (
                      <View style={styles.actionButtons}>
                        <View style={styles.buttonRow}>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.messageButton]}
                            activeOpacity={0.8}
                            onPress={handleMessageSeller}
                          >
                            <Ionicons name="chatbubble-outline" size={20} color="white" />
                            <Text style={styles.actionButtonText}>Message Seller</Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            style={[styles.actionButton, styles.removeButton]}
                            activeOpacity={0.8}
                            onPress={handleRemoveFromGarage}
                          >
                            <Ionicons name="trash-outline" size={20} color="white" />
                            <Text style={styles.actionButtonText}>Remove from Garage</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </Animated.View>
            </PanGestureHandler>
            
            {/* Floating Close Button - Bottom Right */}
            <TouchableOpacity
              onPress={onClose}
              style={styles.floatingCloseButton}
              testID="close-button"
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 100,
    maxHeight: SCREEN_HEIGHT - 100,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80, // Space for floating close button
  },
  imageContainer: {
    position: 'relative',
    height: 250,
    width: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  content: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginTop: 8,
  },
  dealBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  dealBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  sellerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  sellerLocation: {
    fontSize: 16,
    color: '#666',
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
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  specValue: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  prosConsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  prosBox: {
    flex: 1,
    backgroundColor: '#E6F9EC',
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: 12,
    padding: 12,
  },
  consBox: {
    flex: 1,
    backgroundColor: '#FDE6E6',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 12,
    padding: 12,
  },
  prosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 8,
  },
  consTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 8,
  },
  prosItem: {
    fontSize: 14,
    color: '#1a1a1a',
    marginBottom: 4,
    lineHeight: 20,
  },
  consItem: {
    fontSize: 14,
    color: '#1a1a1a',
    marginBottom: 4,
    lineHeight: 20,
  },
  actionButtons: {
    marginTop: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  messageButton: {
    backgroundColor: '#3b82f6',
  },
  removeButton: {
    backgroundColor: '#ef4444',
  },
  carousel: {
    height: 250,
    width: '100%',
  },
  carouselImage: {
    width: SCREEN_WIDTH,
    height: 250,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 10,
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
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: 'white',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listedDate: {
    fontSize: 14,
    color: '#666',
  },
  swipeIndicator: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  swipeBar: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
  safeArea: {
    flex: 1,
  },
  floatingCloseButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
}); 