import { create } from 'zustand'
import { Car } from '../types/car'

interface SwipeQueueStore {
  carQueue: Car[]
  addToQueue: (car: Car) => void
  removeFromQueue: (carId: number) => void
  initializeQueue: (cars: Car[]) => void
}

export const useSwipeQueueStore = create<SwipeQueueStore>()((set) => ({
  carQueue: [],
  addToQueue: (car) => {
    console.log('Store: Adding car to swipe queue:', car)
    set((state) => {
      // Check if car already exists
      if (state.carQueue.some((c) => c.id === car.id)) {
        console.log('Store: Car already in queue')
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
})) 