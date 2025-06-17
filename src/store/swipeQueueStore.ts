import { create } from 'zustand'
import { Car } from '../types/car'

interface SwipeQueueStore {
  carQueue: Car[]
  addToQueue: (car: Car) => void
  removeFromQueue: (carId: number) => void
  initializeQueue: (cars: Car[]) => void
  clearQueue: () => void
}

// Development mode: clear queue on app reload
if (__DEV__) {
  // Clear any existing queue data on development reloads
  try {
    // This will run on every hot reload in development
    console.log('🔄 Development mode: Clearing swipe queue store')
  } catch (error) {
    console.log('No existing queue data to clear')
  }
}

export const useSwipeQueueStore = create<SwipeQueueStore>((set) => ({
  carQueue: [],
  addToQueue: (car) => {
    console.log('Store: Adding car to swipe queue:', car)
    set((state) => {
      // Check if car is already in queue
      const isAlreadyInQueue = state.carQueue.some((existingCar) => existingCar.id === car.id)
      if (isAlreadyInQueue) {
        console.log('Car already in queue, skipping...')
        return state
      }
      
      const newState = { carQueue: [...state.carQueue, car] }
      console.log('Store: New queue state:', newState)
      return newState
    })
  },
  removeFromQueue: (carId) => {
    console.log('Store: Removing car from queue:', carId)
    set((state) => {
      const newState = {
        carQueue: state.carQueue.filter((car) => car.id !== carId),
      }
      console.log('Store: New queue state after removal:', newState)
      return newState
    })
  },
  initializeQueue: (cars) => {
    console.log('Store: Initializing queue with cars:', cars)
    set({ carQueue: cars })
  },
  clearQueue: () => {
    console.log('Clearing swipe queue...')
    set({ carQueue: [] })
  },
})) 