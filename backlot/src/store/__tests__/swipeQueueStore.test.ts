import { renderHook, act } from '@testing-library/react-hooks';
import { useSwipeQueueStore } from '../swipeQueueStore';
import { Car } from '../../types/car';

// Mock console.log to avoid noise in tests
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('swipeQueueStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    act(() => {
      useSwipeQueueStore.getState().clearQueue();
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

  const mockCars: Car[] = [mockCar, mockCar2];

  it('should initialize with empty carQueue array', () => {
    const { result } = renderHook(() => useSwipeQueueStore());
    expect(result.current.carQueue).toEqual([]);
  });

  it('should add a car to queue', () => {
    const { result } = renderHook(() => useSwipeQueueStore());

    act(() => {
      result.current.addToQueue(mockCar);
    });

    expect(result.current.carQueue).toHaveLength(1);
    expect(result.current.carQueue[0]).toEqual(mockCar);
  });

  it('should not add duplicate cars to queue', () => {
    const { result } = renderHook(() => useSwipeQueueStore());

    act(() => {
      result.current.addToQueue(mockCar);
      result.current.addToQueue(mockCar); // Try to add the same car again
    });

    expect(result.current.carQueue).toHaveLength(1);
    expect(result.current.carQueue[0]).toEqual(mockCar);
  });

  it('should add multiple different cars to queue', () => {
    const { result } = renderHook(() => useSwipeQueueStore());

    act(() => {
      result.current.addToQueue(mockCar);
      result.current.addToQueue(mockCar2);
    });

    expect(result.current.carQueue).toHaveLength(2);
    expect(result.current.carQueue).toContainEqual(mockCar);
    expect(result.current.carQueue).toContainEqual(mockCar2);
  });

  it('should remove a car from queue', () => {
    const { result } = renderHook(() => useSwipeQueueStore());

    act(() => {
      result.current.addToQueue(mockCar);
      result.current.addToQueue(mockCar2);
    });

    expect(result.current.carQueue).toHaveLength(2);

    act(() => {
      result.current.removeFromQueue(mockCar.id);
    });

    expect(result.current.carQueue).toHaveLength(1);
    expect(result.current.carQueue[0]).toEqual(mockCar2);
  });

  it('should handle removing non-existent car from queue', () => {
    const { result } = renderHook(() => useSwipeQueueStore());

    act(() => {
      result.current.addToQueue(mockCar);
      result.current.removeFromQueue(999); // Non-existent car ID
    });

    expect(result.current.carQueue).toHaveLength(1);
    expect(result.current.carQueue[0]).toEqual(mockCar);
  });

  it('should initialize queue with cars', () => {
    const { result } = renderHook(() => useSwipeQueueStore());

    act(() => {
      result.current.initializeQueue(mockCars);
    });

    expect(result.current.carQueue).toHaveLength(2);
    expect(result.current.carQueue).toEqual(mockCars);
  });

  it('should clear all cars from queue', () => {
    const { result } = renderHook(() => useSwipeQueueStore());

    act(() => {
      result.current.addToQueue(mockCar);
      result.current.addToQueue(mockCar2);
    });

    expect(result.current.carQueue).toHaveLength(2);

    act(() => {
      result.current.clearQueue();
    });

    expect(result.current.carQueue).toEqual([]);
  });

  it('should maintain state between multiple calls', () => {
    const { result } = renderHook(() => useSwipeQueueStore());

    act(() => {
      result.current.addToQueue(mockCar);
    });

    expect(result.current.carQueue).toHaveLength(1);

    // Simulate another component accessing the store
    const { result: result2 } = renderHook(() => useSwipeQueueStore());
    expect(result2.current.carQueue).toHaveLength(1);
    expect(result2.current.carQueue[0]).toEqual(mockCar);
  });

  it('should handle initializeQueue with empty array', () => {
    const { result } = renderHook(() => useSwipeQueueStore());

    act(() => {
      result.current.addToQueue(mockCar);
      result.current.initializeQueue([]);
    });

    expect(result.current.carQueue).toEqual([]);
  });

  it('should handle multiple operations in sequence', () => {
    const { result } = renderHook(() => useSwipeQueueStore());

    act(() => {
      result.current.initializeQueue(mockCars);
      result.current.removeFromQueue(mockCar.id);
      result.current.addToQueue(mockCar);
    });

    expect(result.current.carQueue).toHaveLength(2);
    expect(result.current.carQueue).toContainEqual(mockCar);
    expect(result.current.carQueue).toContainEqual(mockCar2);
  });
}); 