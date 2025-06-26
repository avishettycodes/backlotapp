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

export const initialCars: Car[] = [
  {
    id: 1,
    year: 2021,
    make: "BMW",
    model: "X5",
    price: 65000,
    mileage: 28000,
    location: "Pleasanton, CA",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    priceRating: "Great Deal",
    titleStatus: "Clean",
    sellerName: "Pleasanton BMW",
    listedDate: "2024-12-10",
    transmission: "Automatic",
    exteriorColor: "Alpine White",
    interiorColor: "Black",
    fuelType: "Gasoline",
    seats: 5,
    trim: "xDrive40i",
    description: "Luxurious BMW X5 in pristine condition with premium features including panoramic sunroof, heated seats, and advanced driver assistance systems. Single owner, full service history.",
    pros: ["Luxury features", "Excellent performance", "Premium interior", "Advanced safety tech"],
    cons: ["High maintenance costs", "Premium fuel required", "Expensive parts"],
    deal: "good"
  },
  {
    id: 2,
    year: 2022,
    make: "Audi",
    model: "A4",
    price: 42000,
    mileage: 18500,
    location: "Dublin, CA",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    priceRating: "Good Deal",
    titleStatus: "Clean",
    sellerName: "Dublin Audi",
    listedDate: "2024-12-08",
    transmission: "Automatic",
    exteriorColor: "Glacier White",
    interiorColor: "Black",
    fuelType: "Gasoline",
    seats: 5,
    trim: "Premium Plus",
    description: "Sophisticated Audi A4 with Quattro all-wheel drive, premium sound system, and advanced technology package. Low mileage, excellent condition.",
    pros: ["Quattro AWD", "Premium interior", "Great handling", "Advanced tech"],
    cons: ["Tight rear seats", "Small trunk", "Premium fuel required"],
    deal: "good"
  },
  {
    id: 3,
    year: 2020,
    make: "Mercedes",
    model: "C300",
    price: 38000,
    mileage: 32000,
    location: "Livermore, CA",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    priceRating: "Fair",
    titleStatus: "Clean",
    sellerName: "Livermore Luxury Motors",
    listedDate: "2024-12-12",
    transmission: "Automatic",
    exteriorColor: "Obsidian Black",
    interiorColor: "Cream Beige",
    fuelType: "Gasoline",
    seats: 5,
    trim: "Luxury",
    description: "Elegant Mercedes C300 with premium features including panoramic sunroof, heated and ventilated seats, and advanced driver assistance. Well maintained with service records.",
    pros: ["Luxury brand", "Comfortable ride", "Premium features", "Good resale value"],
    cons: ["Expensive maintenance", "Small back seat", "Premium fuel required"],
    deal: "fair"
  },
  {
    id: 4,
    year: 2021,
    make: "Subaru",
    model: "Outback",
    price: 32000,
    mileage: 25000,
    location: "Danville, CA",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    priceRating: "Great Deal",
    titleStatus: "Clean",
    sellerName: "Danville Subaru",
    listedDate: "2024-12-05",
    transmission: "Automatic",
    exteriorColor: "Crystal White Pearl",
    interiorColor: "Black",
    fuelType: "Gasoline",
    seats: 5,
    trim: "Limited",
    description: "Adventure-ready Subaru Outback with Symmetrical AWD, EyeSight driver assistance, and generous cargo space. Perfect for outdoor enthusiasts and family trips.",
    pros: ["Excellent AWD", "Great reliability", "Spacious interior", "Good safety ratings"],
    cons: ["Slower acceleration", "Basic interior", "CVT transmission"],
    deal: "good"
  },
  {
    id: 5,
    year: 2019,
    make: "Volkswagen",
    model: "Golf",
    price: 22000,
    mileage: 35000,
    location: "Walnut Creek, CA",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    priceRating: "Good Deal",
    titleStatus: "Clean",
    sellerName: "Walnut Creek VW",
    listedDate: "2024-12-15",
    transmission: "Manual",
    exteriorColor: "Pure White",
    interiorColor: "Black",
    fuelType: "Gasoline",
    seats: 5,
    trim: "SE",
    description: "Fun-to-drive Volkswagen Golf with manual transmission, excellent fuel economy, and European handling. Perfect for city driving and weekend getaways.",
    pros: ["Fun to drive", "Great fuel economy", "Compact size", "Manual transmission"],
    cons: ["Small cargo space", "Limited rear legroom", "Basic features"],
    deal: "good"
  },
  {
    id: 6,
    year: 2022,
    make: "Kia",
    model: "Telluride",
    price: 45000,
    mileage: 18000,
    location: "Concord, CA",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    priceRating: "Great Deal",
    titleStatus: "Clean",
    sellerName: "Concord Kia",
    listedDate: "2024-12-03",
    transmission: "Automatic",
    exteriorColor: "Sangria",
    interiorColor: "Black",
    fuelType: "Gasoline",
    seats: 8,
    trim: "SX",
    description: "Premium Kia Telluride with three rows of seating, advanced safety features, and upscale interior. Perfect for large families with excellent reliability ratings.",
    pros: ["Three-row seating", "Excellent value", "Premium features", "Great warranty"],
    cons: ["Large size", "Lower fuel economy", "Premium price for Kia"],
    deal: "good"
  },
  {
    id: 7,
    year: 2021,
    make: "Hyundai",
    model: "Sonata",
    price: 28000,
    mileage: 22000,
    location: "Fremont, CA",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    priceRating: "Good Deal",
    titleStatus: "Clean",
    sellerName: "Fremont Hyundai",
    listedDate: "2024-12-07",
    transmission: "Automatic",
    exteriorColor: "Machine Gray",
    interiorColor: "Black",
    fuelType: "Gasoline",
    seats: 5,
    trim: "SEL Plus",
    description: "Stylish Hyundai Sonata with modern design, excellent fuel economy, and comprehensive safety features. Great value for money with outstanding warranty coverage.",
    pros: ["Excellent value", "Great warranty", "Modern design", "Good fuel economy"],
    cons: ["Resale value", "Brand perception", "Limited performance"],
    deal: "good"
  }
];

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