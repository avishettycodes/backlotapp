import React, { useState, useEffect } from 'react'
import { useGarageStore } from '../store/garageStore'
import { Car } from '../types/car'
import { X, ArrowLeft } from 'lucide-react'
import { useSwipeable } from 'react-swipeable'
import { useNavigate } from 'react-router-dom'

const Garage = () => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Subscribe to the entire garage state
  const { garageCars, removeFromGarage } = useGarageStore()

  const navigate = useNavigate()

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
        setCurrentImageIndex(currentImageIndex + 1)
      }
    },
    onSwipedRight: () => {
      if (currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1)
      }
    },
    trackMouse: true,
    delta: 100,
    swipeDuration: 500,
    touchEventOptions: { passive: false },
    trackTouch: true,
    rotationAngle: 0,
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">My Garage</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        {garageCars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Your garage is empty</p>
            <p className="text-gray-400 text-sm mt-2">Swipe right on cars to add them to your garage</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {garageCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedCar(car)}
              >
                <div className="relative h-48">
                  <img
                    src={car.image}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {car.year} {car.make} {car.model}
                  </h3>
                  <p className="text-gray-600">${car.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Vehicle Details Modal */}
      {selectedCar && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl w-full max-w-[400px] max-h-[90vh] overflow-hidden shadow-xl">
              {/* Close Button */}
              <button
                onClick={closeModal}
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

                {/* Remove from Garage Button */}
                <button
                  onClick={() => {
                    removeFromGarage(selectedCar.id)
                    closeModal()
                  }}
                  className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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