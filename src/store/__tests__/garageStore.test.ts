import { renderHook, act } from '@testing-library/react-hooks';
import { useGarageStore } from '../garageStore';
import { Car } from '../../types/car';

// Mock console.log to avoid noise in tests
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('garageStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    act(() => {
      useGarageStore.getState().clearGarage();
    });
  });

  const mockCar: Car = {
    id: 1,
    image: 'test-image.jpg',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    mileage: 50000,
    price: 25000,
    deal: 'good',
  };

  const mockCar2: Car = {
    id: 2,
    image: 'test-image-2.jpg',
    make: 'Honda',
    model: 'Civic',
    year: 2019,
    mileage: 40000,
    price: 20000,
    deal: 'fair',
  };

  it('should initialize with empty cars array', () => {
    const { result } = renderHook(() => useGarageStore());
    expect(result.current.cars).toEqual([]);
  });

  it('should add a car to garage', () => {
    const { result } = renderHook(() => useGarageStore());

    act(() => {
      result.current.addToGarage(mockCar);
    });

    expect(result.current.cars).toHaveLength(1);
    expect(result.current.cars[0]).toEqual(mockCar);
  });

  it('should not add duplicate cars to garage', () => {
    const { result } = renderHook(() => useGarageStore());

    act(() => {
      result.current.addToGarage(mockCar);
      result.current.addToGarage(mockCar); // Try to add the same car again
    });

    expect(result.current.cars).toHaveLength(1);
    expect(result.current.cars[0]).toEqual(mockCar);
  });

  it('should add multiple different cars to garage', () => {
    const { result } = renderHook(() => useGarageStore());

    act(() => {
      result.current.addToGarage(mockCar);
      result.current.addToGarage(mockCar2);
    });

    expect(result.current.cars).toHaveLength(2);
    expect(result.current.cars).toContainEqual(mockCar);
    expect(result.current.cars).toContainEqual(mockCar2);
  });

  it('should remove a car from garage', () => {
    const { result } = renderHook(() => useGarageStore());

    act(() => {
      result.current.addToGarage(mockCar);
      result.current.addToGarage(mockCar2);
    });

    expect(result.current.cars).toHaveLength(2);

    act(() => {
      result.current.removeFromGarage(mockCar.id);
    });

    expect(result.current.cars).toHaveLength(1);
    expect(result.current.cars[0]).toEqual(mockCar2);
  });

  it('should handle removing non-existent car', () => {
    const { result } = renderHook(() => useGarageStore());

    act(() => {
      result.current.addToGarage(mockCar);
      result.current.removeFromGarage(999); // Non-existent car ID
    });

    expect(result.current.cars).toHaveLength(1);
    expect(result.current.cars[0]).toEqual(mockCar);
  });

  it('should clear all cars from garage', () => {
    const { result } = renderHook(() => useGarageStore());

    act(() => {
      result.current.addToGarage(mockCar);
      result.current.addToGarage(mockCar2);
    });

    expect(result.current.cars).toHaveLength(2);

    act(() => {
      result.current.clearGarage();
    });

    expect(result.current.cars).toEqual([]);
  });

  it('should maintain state between multiple calls', () => {
    const { result } = renderHook(() => useGarageStore());

    act(() => {
      result.current.addToGarage(mockCar);
    });

    expect(result.current.cars).toHaveLength(1);

    // Simulate another component accessing the store
    const { result: result2 } = renderHook(() => useGarageStore());
    expect(result2.current.cars).toHaveLength(1);
    expect(result2.current.cars[0]).toEqual(mockCar);
  });
}); 