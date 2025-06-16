import React, { useState } from 'react'
import { useGarageStore } from '../store/garageStore'
import { Car } from '../types/car'
import { X, ArrowLeft } from 'lucide-react'
import { useSwipeable } from 'react-swipeable'
import { useNavigate } from 'react-router-dom'

const Garage = () => {
  const { garageCars, removeFromGarage } = useGarageStore()
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const navigate = useNavigate()

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
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-[400px] mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Backlot
          </h1>
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-[400px] mx-auto px-4 py-8">
        {garageCars.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl text-gray-600">Your garage is empty</h2>
            <p className="text-gray-500 mt-2">Swipe right on cars you like to add them here</p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex space-x-4 min-w-min">
              {garageCars.map((car) => (
                <div
                  key={car.id}
                  className="flex-none w-[280px] bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedCar(car)
                    setCurrentImageIndex(0)
                  }}
                >
                  <div className="relative h-48">
                    <img
                      src={car.image}
                      alt={`${car.year} ${car.make} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-lg font-semibold">
                        {car.year} {car.make} {car.model}
                      </h3>
                      <p className="text-sm opacity-90">${car.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Vehicle Details Modal */}
      {selectedCar && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl w-full max-w-[400px] max-h-[90vh] overflow-hidden shadow-xl">
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

                {/* Remove from Garage Button */}
                <button
                  onClick={() => {
                    removeFromGarage(selectedCar.id)
                    handleCloseModal()
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