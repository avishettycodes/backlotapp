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
      addToGarage: (car) =>
        set((state) => {
          // Check if car already exists in garage
          if (state.garageCars.some((c) => c.id === car.id)) {
            return state
          }
          return { garageCars: [...state.garageCars, car] }
        }),
      removeFromGarage: (carId) =>
        set((state) => ({
          garageCars: state.garageCars.filter((car) => car.id !== carId),
        })),
    }),
    {
      name: 'garage-storage', // key in localStorage
    }
  )
) 