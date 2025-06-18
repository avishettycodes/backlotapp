import React from 'react';
import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { GarageDoorButton } from '../GarageDoorButton';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('GarageDoorButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders the garage door button', () => {
    renderWithRouter(<GarageDoorButton />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has correct SVG attributes', () => {
    renderWithRouter(<GarageDoorButton />);
    const svg = document.querySelector('svg');
    
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
    expect(svg).toHaveAttribute('viewBox', '0 0 32 32');
    expect(svg).toHaveStyle({ cursor: 'pointer' });
  });

  it('renders garage door slats', () => {
    renderWithRouter(<GarageDoorButton />);
    const rects = document.querySelectorAll('rect');
    expect(rects).toHaveLength(4); // 4 slats
  });

  it('renders garage door outline', () => {
    renderWithRouter(<GarageDoorButton />);
    const paths = document.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  it('handles click and triggers animation', () => {
    renderWithRouter(<GarageDoorButton />);
    const svg = document.querySelector('svg');
    
    userEvent.click(svg!);
    
    // Check that navigation is called after timeout
    expect(mockNavigate).not.toHaveBeenCalled(); // Not called immediately
    
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/mygarage');
  });

  it('resets state after navigation', () => {
    renderWithRouter(<GarageDoorButton />);
    const svg = document.querySelector('svg');
    
    userEvent.click(svg!);
    
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    
    // State should be reset after navigation
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('has correct clip path definition', () => {
    renderWithRouter(<GarageDoorButton />);
    const clipPath = document.querySelector('#garageDoorClip');
    expect(clipPath).toBeInTheDocument();
  });

  it('applies clip path to garage door slats', () => {
    renderWithRouter(<GarageDoorButton />);
    const g = document.querySelector('g[clip-path="url(#garageDoorClip)"]');
    expect(g).toBeInTheDocument();
  });
}); 