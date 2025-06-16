import React, { useState, useCallback, useEffect } from 'react'
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid'
import { useSwipeable } from 'react-swipeable'
import { Link } from 'react-router-dom'
import { XCircle, CheckCircle, X } from "lucide-react"
import { useGarageStore } from '../store/garageStore'
import { useSwipeQueueStore } from '../store/swipeQueueStore'
import { Car } from '../types/car'

interface Car {
  id: number
  image: string
  make: string
  model: string
  year: number
  mileage: number
  price: number
  deal: 'good' | 'fair' | 'bad'
  location?: string
  priceRating?: string
  sellerName?: string
  title?: string
  transmission?: string
  listedDate?: string
  exteriorColor?: string
  interiorColor?: string
  fuelType?: string
  seats?: number
  trim?: string
  description?: string
  pros?: string[]
  cons?: string[]
  images?: string[]
}

const cars: Car[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    mileage: 15000,
    price: 35000,
    deal: 'good',
    location: 'San Jose, CA',
    priceRating: 'Great Deal',
    sellerName: 'John Doe',
    title: 'Toyota Camry 2020',
    transmission: 'Automatic',
    listedDate: '2023-01-01',
    exteriorColor: 'Blue',
    interiorColor: 'Black',
    fuelType: 'Gasoline',
    seats: 5,
    trim: 'SE',
    description: 'A great car for daily commuting',
    pros: ['Reliable', 'Comfortable', 'Good fuel economy'],
    cons: ['Expensive to maintain', 'Small trunk space']
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    make: 'Honda',
    model: 'Civic',
    year: 2021,
    mileage: 20000,
    price: 42000,
    deal: 'fair',
    location: 'Santa Clara, CA',
    priceRating: 'Fair Price',
    sellerName: 'Jane Smith',
    title: 'Honda Civic 2021',
    transmission: 'Manual',
    listedDate: '2023-02-01',
    exteriorColor: 'Red',
    interiorColor: 'Black',
    fuelType: 'Gasoline',
    seats: 5,
    trim: 'EX',
    description: 'A fun and sporty car',
    pros: ['Great handling', 'Good fuel economy', 'Spacious interior'],
    cons: ['Expensive to maintain', 'Small trunk space']
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1617704548623-340376564e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    make: 'Tesla',
    model: 'Model 3',
    year: 2022,
    mileage: 30000,
    price: 38000,
    deal: 'bad',
    location: 'Milpitas, CA',
    priceRating: 'Overpriced',
    sellerName: 'Bob Johnson',
    title: 'Tesla Model 3',
    transmission: 'Automatic',
    listedDate: '2023-03-01',
    exteriorColor: 'White',
    interiorColor: 'Black',
    fuelType: 'Electric',
    seats: 5,
    trim: 'Long Range',
    description: 'A high-performance electric car',
    pros: ['Zero emissions', 'High performance', 'Modern design'],
    cons: ['Expensive to maintain', 'Limited range']
  }
]

const nearbyCities = ["San Jose, CA", "Santa Clara, CA", "Milpitas, CA", "Fremont, CA", "Sunnyvale, CA"]

const getDealColor = (deal: Car['deal']) => {
  switch (deal) {
    case 'good':
      return 'text-green-500'
    case 'fair':
      return 'text-yellow-500'
    case 'bad':
      return 'text-red-500'
  }
}

const getDealText = (deal: Car['deal']) => {
  switch (deal) {
    case 'good':
      return 'Great Deal'
    case 'fair':
      return 'Fair Price'
    case 'bad':
      return 'Overpriced'
  }
}

const SwipeDeck = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showIndicator, setShowIndicator] = useState<'left' | 'right' | null>(null)
  const [swipeX, setSwipeX] = useState(0)
  const [swipeY, setSwipeY] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStartTime, setTouchStartTime] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchStartY, setTouchStartY] = useState(0)
  
  // Get both the garage state and addToGarage function
  const { garageCars, addToGarage } = useGarageStore()
  const { carQueue, removeFromQueue, initializeQueue } = useSwipeQueueStore()

  // Initialize carQueue with cars that are not in the garage
  useEffect(() => {
    const availableCars = cars.filter(car => 
      nearbyCities.includes(car.location) && 
      !garageCars.some(garageCar => garageCar.id === car.id)
    )
    console.log('SwipeDeck: Initializing car queue:', availableCars)
    initializeQueue(availableCars)
  }, [garageCars, initializeQueue])

  // Update carQueue when garageCars changes
  useEffect(() => {
    carQueue.forEach(car => {
      if (garageCars.some(garageCar => garageCar.id === car.id)) {
        removeFromQueue(car.id)
      }
    })
  }, [garageCars, carQueue, removeFromQueue])

  // Debug: Log initial states
  useEffect(() => {
    console.log('SwipeDeck mounted')
    console.log('Initial car queue:', carQueue)
    console.log('Initial garage state:', garageCars)
  }, [])

  const handleSwipe = useCallback((direction?: 'left' | 'right') => {
    const currentCar = carQueue[currentIndex]
    if (!currentCar) return

    // Remove the current car from the queue first
    removeFromQueue(currentCar.id)
    
    // If swiped right, add to garage
    if (direction === 'right') {
      console.log('SwipeDeck: Adding to garage:', currentCar)
      addToGarage(currentCar)
    }

    // Reset swipe state
    setShowIndicator(null)
    setSwipeX(0)
    setSwipeY(0)
    setIsSwiping(false)

    // Update current index after queue modification
    const newQueue = carQueue.filter(car => car.id !== currentCar.id)
    if (newQueue.length === 0) {
      setCurrentIndex(0)
    } else if (currentIndex >= newQueue.length) {
      setCurrentIndex(newQueue.length - 1)
    }
  }, [currentIndex, carQueue, addToGarage, removeFromQueue])

  const handleCardClick = (car: Car, event: React.MouseEvent | React.TouchEvent) => {
    // Get the correct coordinates based on event type
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

    // Calculate touch duration and distance
    const touchDuration = Date.now() - touchStartTime
    const touchDistance = Math.sqrt(
      Math.pow(clientX - touchStartX, 2) + 
      Math.pow(clientY - touchStartY, 2)
    )

    // Only open modal if it's a quick tap/click with minimal movement
    if (!isSwiping && touchDuration < 200 && touchDistance < 10) {
      setSelectedCar(car)
      setCurrentImageIndex(0)
    }
  }

  const swipeHandlers = useSwipeable({
    onSwiping: (e) => {
      setIsSwiping(true)
      setSwipeX(e.deltaX)
      setSwipeY(e.deltaY)
      
      // Show indicator based on swipe direction
      if (e.deltaX > 50) {
        setShowIndicator('right')
      } else if (e.deltaX < -50) {
        setShowIndicator('left')
      } else {
        setShowIndicator(null)
      }
    },
    onSwiped: (e) => {
      const swipeThreshold = 100
      if (Math.abs(e.deltaX) > swipeThreshold) {
        handleSwipe(e.deltaX > 0 ? 'right' : 'left')
      } else {
        // Reset if swipe wasn't strong enough
        setShowIndicator(null)
        setSwipeX(0)
        setSwipeY(0)
        setIsSwiping(false)
      }
    },
    trackMouse: true,
    delta: 10,
    swipeDuration: 500,
    preventScrollOnSwipe: true,
  })

  const cardStyle = {
    transform: `translate(${swipeX}px, ${swipeY}px) rotate(${swipeX * 0.1}deg)`,
    transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
  }

  const currentCar = carQueue[currentIndex]

  const handleCloseModal = () => {
    setSelectedCar(null)
  }

  const handleImageSwipe = (direction: 'left' | 'right') => {
    if (!selectedCar?.images) return
    if (direction === 'left') {
      setCurrentImageIndex((prev) => (prev + 1) % selectedCar.images.length)
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + selectedCar.images.length) % selectedCar.images.length)
    }
  }

  const imageSwipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (selectedCar?.images && currentImageIndex < selectedCar.images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
    },
    onSwipedRight: () => {
      if (currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    delta: 100,
    swipeDuration: 500,
    touchEventOptions: { passive: false },
    trackTouch: true,
    rotationAngle: 0,
    threshold: 100,
    velocity: 0.3,
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Backlot
          </h1>
          <nav className="flex gap-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
            <Link to="/garage" className="text-gray-600 hover:text-blue-600">Garage</Link>
            <Link to="/submit" className="text-gray-600 hover:text-blue-600">Submit</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        <div className="relative h-[600px]">
          {carQueue.map((car, index) => (
            <div
              key={car.id}
              className={`absolute w-full h-full transition-all duration-300 ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              {...swipeHandlers}
              style={index === currentIndex ? cardStyle : undefined}
              onClick={(e) => handleCardClick(car, e)}
              onTouchEnd={(e) => handleCardClick(car, e)}
            >
              <div className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden relative">
                <img
                  src={car.image}
                  alt={`${car.year} ${car.make} ${car.model}`}
                  className="w-full h-[500px] object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/600x400?text=No+Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold whitespace-nowrap truncate max-w-[70%]">
                      {car.year} {car.make} {car.model}
                    </h2>
                    {car.priceRating && (
                      <span className="px-3 py-1 text-sm font-medium bg-green-500/90 rounded-full">
                        {car.priceRating}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{car.mileage.toLocaleString()} miles</p>
                    <p className="text-sm font-medium">{car.location || 'Location Unknown'}</p>
                    <p className="text-xl font-bold">${car.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Action Buttons */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center items-center gap-8 px-4">
          <button
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-red-50 to-red-100 shadow-[0_8px_16px_rgba(239,68,68,0.2)] flex items-center justify-center transform hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-red-500 hover:shadow-[0_12px_20px_rgba(239,68,68,0.3)] hover:from-red-100 hover:to-red-200"
            aria-label="Dislike"
          >
            <X className="w-8 h-8 text-red-500" />
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-green-50 to-green-100 shadow-[0_8px_16px_rgba(34,197,94,0.2)] flex items-center justify-center transform hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-green-500 hover:shadow-[0_12px_20px_rgba(34,197,94,0.3)] hover:from-green-100 hover:to-green-200"
            aria-label="Like"
          >
            <CheckCircle className="w-8 h-8 text-green-500" />
          </button>
        </div>
      </main>

      {/* Vehicle Details Modal */}
      {selectedCar && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-xl">
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image Carousel */}
              <div {...imageSwipeHandlers} className="relative h-[300px] bg-gray-100">
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SwipeDeck 