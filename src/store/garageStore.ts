import { create } from 'zustand'
import { Car } from '../types/car'

interface GarageStore {
  cars: Car[]
  addToGarage: (car: Car) => void
  removeFromGarage: (carId: string | number) => void
  clearGarage: () => void
}

// Development mode: clear garage on app reload
if (__DEV__) {
  // Clear any existing garage data on development reloads
  try {
    // This will run on every hot reload in development
    console.log('🔄 Development mode: Clearing garage store')
  } catch (error) {
    console.log('No existing garage data to clear')
  }
}

export const useGarageStore = create<GarageStore>((set) => ({
  cars: [],
  addToGarage: (car: Car) => {
    set((state) => {
      const isAlreadyInGarage = state.cars.some((existingCar) => String(existingCar.id) === String(car.id))
      if (isAlreadyInGarage) {
        if (__DEV__) console.log('Car already in garage, skipping...')
        return state
      }
      if (__DEV__) console.log('Adding car to garage:', car)
      return { cars: [...state.cars, car] }
    })
  },
  removeFromGarage: (carId: string | number) => {
    set((state) => ({
      cars: state.cars.filter((car) => String(car.id) !== String(carId)),
    }))
  },
  clearGarage: () => {
    if (__DEV__) console.log('Clearing garage...')
    set({ cars: [] })
  },
})) 