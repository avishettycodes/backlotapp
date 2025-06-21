import { create } from 'zustand'
import { Car } from '../types/car'

interface GarageStore {
  cars: Car[]
  addToGarage: (car: Car) => void
  removeFromGarage: (carId: string) => void
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
        console.log('Car already in garage, skipping...')
        return state
      }
      console.log('Adding car to garage:', car)
      return { cars: [...state.cars, car] }
    })
  },
  removeFromGarage: (carId: string) => {
    set((state) => ({
      cars: state.cars.filter((car) => String(car.id) !== carId),
    }))
  },
  clearGarage: () => {
    console.log('Clearing garage...')
    set({ cars: [] })
  },
})) 