import React, { useState, useEffect } from 'react'
import { useGarageStore } from '../store/garageStore'
import { useSwipeQueueStore } from '../store/swipeQueueStore'
import { Car } from '../types/car'
import { X, MessageCircle, Trash2, XCircle, CheckCircle, LogOut } from 'lucide-react'
import { useSwipeable } from 'react-swipeable'
import { useNavigate, useLocation } from 'react-router-dom'

const Garage = () => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()
  
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            My Garage
          </h1>
          <div className="relative group">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-full transition-all duration-200 ease-in-out active:scale-95 active:bg-gray-100"
              aria-label="Exit My Garage"
              role="button"
              tabIndex={0}
            >
              <LogOut className="w-6 h-6 text-gray-600 transition-colors duration-200 active:text-red-500" />
            </button>
            <div className="absolute right-0 top-full mt-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Return to browsing
              <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        {garageCars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Your garage is empty</p>
            <p className="text-gray-400 text-sm mt-2">Swipe right on cars to add them to your garage</p>
          </div>
        ) : (
          <div className="space-y-4">
            {garageCars.map((car) => (
              <div
                key={car.id}
                className="w-full max-w-sm mx-auto"
              >
                <div
                  className="flex flex-row bg-white rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 py-4"
                  onClick={() => setSelectedCar(car)}
                >
                  {/* Left side - Image */}
                  <div className="w-36 flex-shrink-0">
                    <img
                      src={car.image}
                      alt={`${car.make} ${car.model}`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Right side - Content */}
                  <div className="flex flex-col min-h-full px-4 flex-1">
                    {/* Text content */}
                    <div className="space-y-2">
                      <h2 className="text-lg font-bold text-gray-900">
                        {car.year} {car.make} {car.model}
                      </h2>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">{car.mileage.toLocaleString()} miles</p>
                        <p className="text-sm text-gray-600">{car.location || 'Location Unknown'}</p>
                        <p className="text-lg font-bold text-blue-600">${car.price.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // TODO: Implement message seller functionality
                          console.log('Message seller:', car.id)
                        }}
                        className="w-10 h-10 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                        aria-label="Message Seller"
                      >
                        <MessageCircle className="w-full h-full" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFromGarage(car.id)
                          addToQueue(car)
                        }}
                        className="w-10 h-10 p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        aria-label="Remove from Garage"
                      >
                        <Trash2 className="w-full h-full" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

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
                    removeFromGarage(selectedCar.id)
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
    </div>
  )
}

export default Garage 