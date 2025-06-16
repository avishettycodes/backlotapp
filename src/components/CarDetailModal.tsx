import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Car } from '../types/car';
import FullscreenImageViewer from './FullscreenImageViewer';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CarDetailModalProps {
  visible: boolean;
  car: Car;
  onClose: () => void;
}

export default function CarDetailModal({ visible, car, onClose }: CarDetailModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const translateY = useSharedValue(300);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 300 });
      
      // Preload images
      const images = car.images || [car.image];
      Promise.all(images.map((uri) => Image.prefetch(uri)))
        .then(() => setImagesLoaded(true))
        .catch(() => setImagesLoaded(true));
    } else {
      translateY.value = withSpring(300, { damping: 20, stiffness: 200 });
      opacity.value = withTiming(0, { duration: 300 });
      setImagesLoaded(false);
    }
  }, [visible]);

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const renderImage = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => {
        setViewerIndex(activeIndex);
        setViewerVisible(true);
      }}
    >
      <Image
        source={{ uri: item }}
        style={styles.carouselImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  if (!imagesLoaded) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1CE1A9" />
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="none">
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        
        <Animated.View style={[styles.content, modalStyle]}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Image Carousel */}
            <View>
              <FlatList
                data={car.images || [car.image]}
                renderItem={renderImage}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.carousel}
                onViewableItemsChanged={({ viewableItems }) => {
                  setActiveIndex(viewableItems[0]?.index ?? 0);
                }}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
              />
              <View style={styles.dotsContainer}>
                {(car.images || [car.image]).map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.dot,
                      idx === activeIndex ? styles.dotActive : null
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>
                {car.year} {car.make} {car.model}
              </Text>
              <Text style={styles.subtitle}>
                {car.mileage?.toLocaleString()} mi · {car.location}
              </Text>
              <Text style={styles.price}>${car.price?.toLocaleString()}</Text>
            </View>

            {/* Specs Section */}
            <View style={styles.specsSection}>
              <Text style={styles.sectionTitle}>Specifications</Text>
              <View style={styles.specsGrid}>
                {car.transmission && (
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Transmission</Text>
                    <Text style={styles.specValue}>{car.transmission}</Text>
                  </View>
                )}
                {car.fuelType && (
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Fuel Type</Text>
                    <Text style={styles.specValue}>{car.fuelType}</Text>
                  </View>
                )}
                {car.seats && (
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Seats</Text>
                    <Text style={styles.specValue}>{car.seats}</Text>
                  </View>
                )}
                {car.trim && (
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Trim</Text>
                    <Text style={styles.specValue}>{car.trim}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Pros & Cons Section */}
            {(car.pros?.length || car.cons?.length) && (
              <View style={styles.prosConsSection}>
                {car.pros?.length > 0 && (
                  <View style={styles.prosConsColumn}>
                    <Text style={styles.sectionTitle}>Pros</Text>
                    {car.pros.map((pro, index) => (
                      <Text key={index} style={styles.listItem}>
                        • {pro}
                      </Text>
                    ))}
                  </View>
                )}
                {car.cons?.length > 0 && (
                  <View style={styles.prosConsColumn}>
                    <Text style={styles.sectionTitle}>Cons</Text>
                    {car.cons.map((con, index) => (
                      <Text key={index} style={styles.listItem}>
                        • {con}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Message Seller Button */}
            <TouchableOpacity
              style={styles.messageButton}
              activeOpacity={0.8}
              onPress={() => {
                // TODO: Implement message seller functionality
                console.log('Message seller:', car.id);
              }}
            >
              <Text style={styles.messageButtonText}>Message Seller</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>

        {/* Fullscreen Image Viewer */}
        <FullscreenImageViewer
          visible={viewerVisible}
          images={car.images || [car.image]}
          startIndex={viewerIndex}
          onClose={() => setViewerVisible(false)}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollContent: {
    padding: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  carousel: {
    height: 250,
    marginBottom: 8,
  },
  carouselImage: {
    width: SCREEN_WIDTH - 32,
    height: 250,
    borderRadius: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1CE1A9',
  },
  specsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  specItem: {
    flex: 1,
    minWidth: '45%',
  },
  specLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  specValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  prosConsSection: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  prosConsColumn: {
    flex: 1,
  },
  listItem: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 24,
  },
  messageButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  messageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 