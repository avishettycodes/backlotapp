import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ModalTest from '../ModalTest';

describe('ModalTest', () => {
  it('renders the open modal button', () => {
    render(<ModalTest />);
    expect(screen.getByText('Open Test Modal')).toBeInTheDocument();
  });

  it('opens modal when button is pressed', () => {
    render(<ModalTest />);
    const button = screen.getByText('Open Test Modal');
    
    fireEvent.press(button);
    
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('This is a test modal!')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('closes modal when close button is pressed', () => {
    render(<ModalTest />);
    const openButton = screen.getByText('Open Test Modal');
    
    // Open modal
    fireEvent.press(openButton);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    
    // Close modal
    const closeButton = screen.getByText('Close');
    fireEvent.press(closeButton);
    
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    expect(screen.queryByText('This is a test modal!')).not.toBeInTheDocument();
  });

  it('has correct button styling', () => {
    render(<ModalTest />);
    const button = screen.getByText('Open Test Modal');
    
    expect(button.parent).toHaveStyle({
      backgroundColor: '#007AFF',
      padding: 20,
      borderRadius: 10,
    });
  });

  it('has correct button text styling', () => {
    render(<ModalTest />);
    const buttonText = screen.getByText('Open Test Modal');
    
    expect(buttonText).toHaveStyle({
      color: 'white',
      fontSize: 18,
    });
  });
}); 