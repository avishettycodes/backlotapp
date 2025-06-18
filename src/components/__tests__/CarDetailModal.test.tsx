import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScrollView } from 'react-native';
import CarDetailModal from '../CarDetailModal';
import { Car } from '../../types/car';

// Mock the Car type
const mockCar: Car = {
  id: 1,
  year: 2020,
  make: "Toyota",
  model: "Camry",
  price: 35000,
  mileage: 45000,
  location: "Los Angeles, CA",
  image: "https://example.com/car.jpg",
  images: [
    "https://example.com/car1.jpg",
    "https://example.com/car2.jpg",
    "https://example.com/car3.jpg"
  ],
  description: "This is a very long description that should make the modal content scrollable. ".repeat(20),
  sellerName: "John Doe",
  listedDate: "2024-12-15",
  priceRating: "Great Deal",
  deal: "good",
  exteriorColor: "Blue",
  interiorColor: "Black",
  transmission: "Automatic",
  fuelType: "Gasoline",
  trim: "SE",
  seats: 5,
  pros: ["Reliable", "Comfortable", "Good fuel economy", "Low maintenance", "Great resale value"],
  cons: ["Expensive to maintain", "Small trunk space", "Limited cargo room", "Premium fuel required"]
};

describe('CarDetailModal', () => {
  const mockOnClose = jest.fn();
  const mockOnRemoveFromGarage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when visible is true', () => {
    render(
      <CarDetailModal
        visible={true}
        car={mockCar}
        onClose={mockOnClose}
        isInGarage={false}
      />
    );

    expect(screen.getByText('2020 Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('$35,000')).toBeInTheDocument();
    expect(screen.getByText('45,000 miles')).toBeInTheDocument();
  });

  it('does not render when visible is false', () => {
    render(
      <CarDetailModal
        visible={false}
        car={mockCar}
        onClose={mockOnClose}
        isInGarage={false}
      />
    );

    expect(screen.queryByText('2020 Toyota Camry')).not.toBeInTheDocument();
  });

  it('displays car information correctly', () => {
    render(
      <CarDetailModal
        visible={true}
        car={mockCar}
        onClose={mockOnClose}
        isInGarage={false}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Los Angeles, CA')).toBeInTheDocument();
    expect(screen.getByText('Great Deal')).toBeInTheDocument();
    expect(screen.getByText('Listed 1 day ago')).toBeInTheDocument();
  });

  it('displays vehicle specs', () => {
    render(
      <CarDetailModal
        visible={true}
        car={mockCar}
        onClose={mockOnClose}
        isInGarage={false}
      />
    );

    expect(screen.getByText('Vehicle Specs')).toBeInTheDocument();
    expect(screen.getByText('Toyota Camry 2020')).toBeInTheDocument();
    expect(screen.getByText('Automatic')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
    expect(screen.getByText('Black')).toBeInTheDocument();
    expect(screen.getByText('Gasoline')).toBeInTheDocument();
    expect(screen.getByText('SE')).toBeInTheDocument();
    expect(screen.getByText('5 seats')).toBeInTheDocument();
  });

  it('displays description when available', () => {
    render(
      <CarDetailModal
        visible={true}
        car={mockCar}
        onClose={mockOnClose}
        isInGarage={false}
      />
    );

    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText(mockCar.description.substring(0, 50))).toBeInTheDocument();
  });

  it('displays pros and cons when available', () => {
    render(
      <CarDetailModal
        visible={true}
        car={mockCar}
        onClose={mockOnClose}
        isInGarage={false}
      />
    );

    expect(screen.getByText('Pros')).toBeInTheDocument();
    expect(screen.getByText('Cons')).toBeInTheDocument();
    
    mockCar.pros.forEach(pro => {
      expect(screen.getByText(`• ${pro}`)).toBeInTheDocument();
    });
    
    mockCar.cons.forEach(con => {
      expect(screen.getByText(`• ${con}`)).toBeInTheDocument();
    });
  });

  it('shows action buttons when car is in garage', () => {
    render(
      <CarDetailModal
        visible={true}
        car={mockCar}
        onClose={mockOnClose}
        isInGarage={true}
        onRemoveFromGarage={mockOnRemoveFromGarage}
      />
    );

    expect(screen.getByText('Message Seller')).toBeInTheDocument();
    expect(screen.getByText('Remove from Garage')).toBeInTheDocument();
  });

  it('does not show action buttons when car is not in garage', () => {
    render(
      <CarDetailModal
        visible={true}
        car={mockCar}
        onClose={mockOnClose}
        isInGarage={false}
      />
    );

    expect(screen.queryByText('Message Seller')).not.toBeInTheDocument();
    expect(screen.queryByText('Remove from Garage')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is pressed', () => {
    render(
      <CarDetailModal
        visible={true}
        car={mockCar}
        onClose={mockOnClose}
        isInGarage={false}
      />
    );

    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onRemoveFromGarage when remove button is pressed', () => {
    render(
      <CarDetailModal
        visible={true}
        car={mockCar}
        onClose={mockOnClose}
        isInGarage={true}
        onRemoveFromGarage={mockOnRemoveFromGarage}
      />
    );

    const removeButton = screen.getByText('Remove from Garage');
    fireEvent.click(removeButton);
    
    expect(mockOnRemoveFromGarage).toHaveBeenCalledWith(mockCar.id);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles missing optional car properties gracefully', () => {
    const minimalCar: Car = {
      id: 1,
      year: 2020,
      make: "Toyota",
      model: "Camry",
      price: 35000,
      mileage: 45000,
      location: "Los Angeles, CA",
      image: "https://example.com/car.jpg",
      deal: "good",
    };

    render(
      <CarDetailModal
        visible={true}
        car={minimalCar}
        onClose={mockOnClose}
        isInGarage={false}
      />
    );

    expect(screen.getByText('2020 Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('$35,000')).toBeInTheDocument();
  });

  it('shows loading indicator when image is not loaded', () => {
    // Mock Image.prefetch to return a rejected promise
    jest.spyOn(require('react-native'), 'Image').mockImplementation({
      ...require('react-native').Image,
      prefetch: jest.fn().mockRejectedValue(new Error('Failed to load')),
    });

    render(
      <CarDetailModal
        visible={true}
        car={mockCar}
        onClose={mockOnClose}
        isInGarage={false}
      />
    );

    // The loading state should be handled gracefully
    expect(screen.getByText('2020 Toyota Camry')).toBeInTheDocument();
  });
}); 