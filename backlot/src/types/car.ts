export interface Car {
  id: number
  image: string
  make: string
  model: string
  year: number
  mileage: number
  price: number
  deal: 'good' | 'fair' | 'bad'
  location: string
  priceRating: string
  sellerName: string
  sellerContact?: string
  transmission: string
  listedDate: string
  exteriorColor: string
  interiorColor: string
  fuelType: string
  seats: number
  trim: string
  vin?: string
  description: string
  pros: string[]
  cons: string[]
  images?: string[]
  titleStatus: 'Clean' | 'Salvage' | 'Rebuilt' | 'Lien'
} 