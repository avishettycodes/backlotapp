import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Car } from '../types/car'

interface GarageStore {
  garageCars: Car[]
  addToGarage: (car: Car) => void
  removeFromGarage: (carId: string) => void
}

export const useGarageStore = create<GarageStore>()(
  persist(
    (set) => ({
      garageCars: [],
      addToGarage: (car) => {
        console.log('Store: Adding car to garage:', car)
        set((state) => {
          // Check if car already exists
          if (state.garageCars.some((c) => c.id === car.id)) {
            console.log('Store: Car already in garage')
            return state
          }
          const newState = { garageCars: [...state.garageCars, car] }
          console.log('Store: New garage state:', newState)
          return newState
        })
      },
      removeFromGarage: (carId) => {
        console.log('Store: Removing car from garage:', carId)
        set((state) => {
          const newState = {
            garageCars: state.garageCars.filter((car) => car.id !== carId),
          }
          console.log('Store: New garage state after removal:', newState)
          return newState
        })
      },
    }),
    {
      name: 'garage-storage', // stored in localStorage
      onRehydrateStorage: () => (state) => {
        console.log('Store: Hydrated state:', state)
      },
    }
  )
) 