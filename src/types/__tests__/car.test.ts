import { Car } from '../car';

describe('Car type', () => {
  it('should have required properties', () => {
    const car: Car = {
      id: 1,
      image: 'test-image.jpg',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      mileage: 50000,
      price: 25000,
      deal: 'good',
      titleStatus: 'Clean'
    };

    expect(car.id).toBe(1);
    expect(car.image).toBe('test-image.jpg');
    expect(car.make).toBe('Toyota');
    expect(car.model).toBe('Camry');
    expect(car.year).toBe(2020);
    expect(car.mileage).toBe(50000);
    expect(car.price).toBe(25000);
    expect(car.deal).toBe('good');
  });

  it('should accept optional properties', () => {
    const car: Car = {
      id: 1,
      image: 'test-image.jpg',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      mileage: 50000,
      price: 25000,
      deal: 'good',
      location: 'San Ramon, CA',
      priceRating: 'Excellent',
      sellerName: 'John Doe',
      title: 'Clean Title',
      transmission: 'Automatic',
      listedDate: '2024-01-15',
      exteriorColor: 'White',
      interiorColor: 'Black',
      fuelType: 'Gasoline',
      seats: 5,
      trim: 'SE',
      description: 'Well maintained vehicle',
      pros: ['Low mileage', 'Clean interior'],
      cons: ['Minor scratches'],
      images: ['image1.jpg', 'image2.jpg'],
      titleStatus: 'Clean'
    };

    expect(car.location).toBe('San Ramon, CA');
    expect(car.priceRating).toBe('Excellent');
    expect(car.sellerName).toBe('John Doe');
    expect(car.title).toBe('Clean Title');
    expect(car.transmission).toBe('Automatic');
    expect(car.listedDate).toBe('2024-01-15');
    expect(car.exteriorColor).toBe('White');
    expect(car.interiorColor).toBe('Black');
    expect(car.fuelType).toBe('Gasoline');
    expect(car.seats).toBe(5);
    expect(car.trim).toBe('SE');
    expect(car.description).toBe('Well maintained vehicle');
    expect(car.pros).toEqual(['Low mileage', 'Clean interior']);
    expect(car.cons).toEqual(['Minor scratches']);
    expect(car.images).toEqual(['image1.jpg', 'image2.jpg']);
  });

  it('should accept all deal types', () => {
    const goodDeal: Car = {
      id: 1,
      image: 'test-image.jpg',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      mileage: 50000,
      price: 25000,
      deal: 'good',
      titleStatus: 'Clean'
    };

    const fairDeal: Car = {
      id: 2,
      image: 'test-image-2.jpg',
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      mileage: 40000,
      price: 20000,
      deal: 'fair',
      titleStatus: 'Clean'
    };

    const badDeal: Car = {
      id: 3,
      image: 'test-image-3.jpg',
      make: 'Ford',
      model: 'Focus',
      year: 2018,
      mileage: 60000,
      price: 18000,
      deal: 'bad',
      titleStatus: 'Clean'
    };

    expect(goodDeal.deal).toBe('good');
    expect(fairDeal.deal).toBe('fair');
    expect(badDeal.deal).toBe('bad');
  });

  it('should handle numeric properties correctly', () => {
    const car: Car = {
      id: 999,
      image: 'test-image.jpg',
      make: 'Toyota',
      model: 'Camry',
      year: 1995,
      mileage: 150000,
      price: 5000,
      deal: 'fair',
      titleStatus: 'Clean'
    };

    expect(typeof car.id).toBe('number');
    expect(typeof car.year).toBe('number');
    expect(typeof car.mileage).toBe('number');
    expect(typeof car.price).toBe('number');
  });

  it('should handle string properties correctly', () => {
    const car: Car = {
      id: 1,
      image: 'test-image.jpg',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      mileage: 50000,
      price: 25000,
      deal: 'good',
      titleStatus: 'Clean'
    };

    expect(typeof car.image).toBe('string');
    expect(typeof car.make).toBe('string');
    expect(typeof car.model).toBe('string');
  });
}); 