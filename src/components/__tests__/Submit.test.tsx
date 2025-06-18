import React from 'react';
import { render, screen } from '@testing-library/react';
import Submit from '../Submit';

describe('Submit', () => {
  it('renders submit header', () => {
    render(<Submit />);
    const header = screen.getByText('Submit a Car');
    expect(header).toBeInTheDocument();
  });

  it('renders coming soon message', () => {
    render(<Submit />);
    const message = screen.getByText('Coming soon!');
    expect(message).toBeInTheDocument();
  });

  it('renders with proper structure', () => {
    render(<Submit />);
    const header = screen.getByText('Submit a Car');
    const subtitle = screen.getByText('Coming soon!');
    
    expect(header).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
  });
}); 