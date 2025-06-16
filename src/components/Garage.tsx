import React, { useState, useEffect } from 'react'
import { useGarageStore } from '../store/garageStore'
import { useSwipeQueueStore } from '../store/swipeQueueStore'
import { Car } from '../types/car'
import { X, MessageCircle, Trash2, XCircle, CheckCircle, LogOut } from 'lucide-react'
import { useSwipeable } from 'react-swipeable'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32; // Full width minus padding

type RootStackParamList = {
  SwipeDeck: undefined;
  Garage: undefined;
  Submit: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Garage = () => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()
  const navigation = useNavigation<NavigationProp>();
  
  // Subscribe to both stores
  const { garageCars, removeFromGarage } = useGarageStore()
  const { addToQueue } = useSwipeQueueStore()

  // Helper function to check if a route is active
  const isActive = (path: string) => location.pathname === path

  // Debug: Log garage state changes
  useEffect(() => {
    console.log('Garage component mounted/updated')
    console.log('Current garage cars:', garageCars)
    console.log('Garage cars length:', garageCars.length)
  }, [garageCars])

  const closeModal = () => {
    setSelectedCar(null)
    setCurrentImageIndex(0)
  }

  const handleImageSwipe = useSwipeable({
    onSwipedLeft: () => {
      if (selectedCar?.images && currentImageIndex < selectedCar.images.length - 1) {
        setCurrentImageIndex(prev => prev + 1)
      }
    },
    onSwipedRight: () => {
      if (currentImageIndex > 0) {
        setCurrentImageIndex(prev => prev - 1)
      }
    },
    trackMouse: true,
    delta: 10,
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackTouch: true
  })

  const handleRemoveCar = (carId: number) => {
    removeFromGarage(carId)
    addToQueue(garageCars.find(car => car.id === carId) as Car)
  }

  const renderCarCard = ({ item: car }: { item: Car }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => setSelectedCar(car)}
      >
        <Image source={{ uri: car.image }} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={StyleSheet.absoluteFill}
          locations={[0.5, 1]}
        />
        <View style={styles.cardContent}>
          <Text style={styles.title}>
            {car.year} {car.make} {car.model}
          </Text>
          <Text style={styles.subtitle}>
            {car.mileage?.toLocaleString()} mi · {car.location}
          </Text>
          <Text style={styles.price}>${car.price?.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={() => {
            // TODO: Implement message seller
            console.log('Message seller for:', car.id);
          }}
        >
          <MessageCircle size={24} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={() => handleRemoveCar(car.id)}
        >
          <Trash2 size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Garage</Text>
      </View>
      
      <View style={styles.content}>
        {garageCars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Your garage is empty</p>
            <p className="text-gray-400 text-sm mt-2">Swipe right on cars to add them to your garage</p>
          </div>
        ) : (
          <FlatList
            data={garageCars}
            renderItem={renderCarCard}
            keyExtractor={(item) => item.id.toString()}
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

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('SwipeDeck')} 
          style={styles.tab}
        >
          <Ionicons name="home" size={24} color="#000" />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Garage')} 
          style={styles.tab}
        >
          <Ionicons name="car" size={24} color="#000" />
          <Text style={styles.tabLabel}>Garage</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Submit')} 
          style={styles.tab}
        >
          <Ionicons name="add-circle" size={24} color="#000" />
          <Text style={styles.tabLabel}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      {selectedCar && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-xl">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image Carousel */}
              <div {...handleImageSwipe} className="relative h-[300px] bg-gray-100">
                <img
                  src={selectedCar.images?.[currentImageIndex] || selectedCar.image}
                  alt={`${selectedCar.year} ${selectedCar.make} ${selectedCar.model}`}
                  className="w-full h-full object-cover rounded-t-2xl"
                />
                {selectedCar.images && selectedCar.images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {selectedCar.images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-6 text-gray-800 overflow-y-auto max-h-[calc(90vh-300px)]">
                {/* Title + Deal */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedCar.year} {selectedCar.make} {selectedCar.model}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedCar.mileage.toLocaleString()} miles • {selectedCar.location || 'Location Unknown'}
                    </p>
                  </div>
                  {selectedCar.priceRating && (
                    <span className="bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      {selectedCar.priceRating}
                    </span>
                  )}
                </div>

                <div className="text-2xl font-bold text-black">
                  ${selectedCar.price.toLocaleString()}
                </div>

                {/* Seller Info */}
                <div>
                  <h3 className="text-base font-semibold text-gray-700 mb-2">Seller Info</h3>
                  <p className="text-lg font-semibold text-gray-900">{selectedCar.sellerName || 'Private Seller'}</p>
                  <p className="text-sm text-gray-500">{selectedCar.location}</p>
                </div>

                {/* Vehicle Specs */}
                <div>
                  <h3 className="text-base font-semibold text-gray-700 mb-3">Vehicle Specs</h3>
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    {selectedCar.title && (
                      <div>
                        <div className="font-medium text-gray-600">Title</div>
                        <div className="text-gray-800">{selectedCar.title}</div>
                      </div>
                    )}
                    {selectedCar.transmission && (
                      <div>
                        <div className="font-medium text-gray-600">Transmission</div>
                        <div className="text-gray-800">{selectedCar.transmission}</div>
                      </div>
                    )}
                    {selectedCar.listedDate && (
                      <div>
                        <div className="font-medium text-gray-600">Listed</div>
                        <div className="text-gray-800">{selectedCar.listedDate}</div>
                      </div>
                    )}
                    {selectedCar.exteriorColor && (
                      <div>
                        <div className="font-medium text-gray-600">Exterior</div>
                        <div className="text-gray-800">{selectedCar.exteriorColor}</div>
                      </div>
                    )}
                    {selectedCar.interiorColor && (
                      <div>
                        <div className="font-medium text-gray-600">Interior</div>
                        <div className="text-gray-800">{selectedCar.interiorColor}</div>
                      </div>
                    )}
                    {selectedCar.fuelType && (
                      <div>
                        <div className="font-medium text-gray-600">Fuel Type</div>
                        <div className="text-gray-800">{selectedCar.fuelType}</div>
                      </div>
                    )}
                    {selectedCar.seats && (
                      <div>
                        <div className="font-medium text-gray-600">Seats</div>
                        <div className="text-gray-800">{selectedCar.seats} seats</div>
                      </div>
                    )}
                    {selectedCar.trim && (
                      <div>
                        <div className="font-medium text-gray-600">Trim</div>
                        <div className="text-gray-800">{selectedCar.trim}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {selectedCar.description && (
                  <div>
                    <h3 className="text-base font-semibold text-gray-700 mb-2">Description</h3>
                    <p className="text-sm text-gray-700 mb-4">{selectedCar.description}</p>

                    {(selectedCar.pros?.length || selectedCar.cons?.length) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedCar.pros?.length > 0 && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <h4 className="font-semibold text-green-700 mb-1">Pros</h4>
                            <ul className="list-disc list-inside text-sm text-gray-700">
                              {selectedCar.pros.map((pro, index) => (
                                <li key={index}>{pro}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {selectedCar.cons?.length > 0 && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <h4 className="font-semibold text-red-700 mb-1">Cons</h4>
                            <ul className="list-disc list-inside text-sm text-gray-700">
                              {selectedCar.cons.map((con, index) => (
                                <li key={index}>{con}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => {
                    handleRemoveCar(selectedCar.id)
                    closeModal()
                  }}
                  className="w-full py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  Remove from Garage
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: 16,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  cardContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginVertical: 2,
  },
  price: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1CE1A9',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 24,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tab: {
    alignItems: 'center',
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default Garage 