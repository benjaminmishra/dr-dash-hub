import { render, screen, fireEvent } from '../test-utils';

// Mock the heroImage import
jest.mock('@/assets/hero-image.jpg', () => 'hero-image-mock');

import { Landing } from '@/pages/Landing';

// Mock the Navbar component to simplify testing
jest.mock('@/components/Navbar', () => ({
  Navbar: ({ onSignUp, onLogin }: { onSignUp: () => void; onLogin: () => void }) => (
    <div data-testid="navbar">
      <button onClick={onSignUp}>Mock Sign Up</button>
      <button onClick={onLogin}>Mock Login</button>
    </div>
  )
}));

// Mock the TLDRCard component
jest.mock('@/components/TLDRCard', () => ({
  TLDRCard: ({ data }: { data: any }) => (
    <div data-testid="tldr-card">
      <div>Topic: {data.topic}</div>
      <div>Summary: {data.summary}</div>
    </div>
  )
}));

describe('Landing Page', () => {
  test('renders hero section with correct content', () => {
    const mockSignUp = jest.fn();
    const mockLogin = jest.fn();
    
    render(<Landing onSignUp={mockSignUp} onLogin={mockLogin} />);
    
    // Check if the main heading is rendered
    expect(screen.getByText('Your Daily News,')).toBeInTheDocument();
    expect(screen.getByText('Summarized')).toBeInTheDocument();
    
    // Check if the subheading is rendered
    expect(screen.getByText(/Get the essence of tech, AI, and world news/)).toBeInTheDocument();
    
    // Check if the CTA buttons are rendered
    expect(screen.getByText('Get Started for Free')).toBeInTheDocument();
    expect(screen.getByText('See Example')).toBeInTheDocument();
  });
  
  test('renders feature highlights', () => {
    render(<Landing onSignUp={jest.fn()} onLogin={jest.fn()} />);
    
    // Check if feature highlights are rendered
    expect(screen.getByText('5 min daily reads')).toBeInTheDocument();
    expect(screen.getByText('AI-powered summaries')).toBeInTheDocument();
    expect(screen.getByText('Curated topics')).toBeInTheDocument();
  });
  
  test('renders example section with TLDR card', () => {
    render(<Landing onSignUp={jest.fn()} onLogin={jest.fn()} />);
    
    // Check if the example section heading is rendered
    expect(screen.getByText('See What You\'ll Get')).toBeInTheDocument();
    
    // Check if the TLDR card is rendered
    expect(screen.getByTestId('tldr-card')).toBeInTheDocument();
    
    // Check if the example TLDR data is passed to the card
    expect(screen.getByText(/Topic: AI News/)).toBeInTheDocument();
    expect(screen.getByText(/Summary: OpenAI announced GPT-5/)).toBeInTheDocument();
  });
  
  test('renders footer with copyright information', () => {
    render(<Landing onSignUp={jest.fn()} onLogin={jest.fn()} />);
    
    // Check if the footer is rendered
    expect(screen.getByText(/© 2025 TLDR News/)).toBeInTheDocument();
  });
  
  test('calls onSignUp when "Get Started for Free" button is clicked', () => {
    const mockSignUp = jest.fn();
    
    render(<Landing onSignUp={mockSignUp} onLogin={jest.fn()} />);
    
    // Click on the "Get Started for Free" button
    fireEvent.click(screen.getByText('Get Started for Free'));
    
    // Check if onSignUp was called
    expect(mockSignUp).toHaveBeenCalledTimes(1);
  });
  
  test('calls onSignUp when "Start Reading Smarter Today" button is clicked', () => {
    const mockSignUp = jest.fn();
    
    render(<Landing onSignUp={mockSignUp} onLogin={jest.fn()} />);
    
    // Click on the "Start Reading Smarter Today" button
    fireEvent.click(screen.getByText('Start Reading Smarter Today'));
    
    // Check if onSignUp was called
    expect(mockSignUp).toHaveBeenCalledTimes(1);
  });
  
  test('passes onSignUp and onLogin to Navbar component', () => {
    const mockSignUp = jest.fn();
    const mockLogin = jest.fn();
    
    render(<Landing onSignUp={mockSignUp} onLogin={mockLogin} />);
    
    // Check if the Navbar component is rendered
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    
    // Click on the mock buttons in the Navbar
    fireEvent.click(screen.getByText('Mock Sign Up'));
    fireEvent.click(screen.getByText('Mock Login'));
    
    // Check if the callbacks were called
    expect(mockSignUp).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });
});