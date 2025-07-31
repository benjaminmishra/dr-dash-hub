import { render, screen, fireEvent, waitFor } from '../test-utils';
import { Auth } from '@/pages/Auth';

// Mock the Navbar component
jest.mock('@/components/Navbar', () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>
}));

describe('Auth Page', () => {
  const mockOnBack = jest.fn();
  const mockOnAuth = jest.fn();
  const mockOnModeChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders login form correctly', () => {
    render(
      <Auth 
        mode="login" 
        onBack={mockOnBack} 
        onAuth={mockOnAuth} 
        onModeChange={mockOnModeChange} 
      />
    );
    
    // Check if the navbar is rendered
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    
    // Check if the back button is rendered
    expect(screen.getByText('Back to Home')).toBeInTheDocument();
    
    // Check if the login form title is rendered
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    
    // Check if the form description is rendered
    expect(screen.getByText('Enter your credentials to access your TLDR feed')).toBeInTheDocument();
    
    // Check if the form inputs are rendered
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    
    // Check if the submit button is rendered with correct text
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    
    // Check if the mode toggle link is rendered
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument();
  });
  
  test('renders signup form correctly', () => {
    render(
      <Auth 
        mode="signup" 
        onBack={mockOnBack} 
        onAuth={mockOnAuth} 
        onModeChange={mockOnModeChange} 
      />
    );
    
    // Check if the signup form title is rendered
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    
    // Check if the form description is rendered
    expect(screen.getByText('Start getting smarter news summaries today')).toBeInTheDocument();
    
    // Check if the submit button is rendered with correct text
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    
    // Check if the mode toggle link is rendered
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });
  
  test('calls onBack when back button is clicked', () => {
    render(
      <Auth 
        mode="login" 
        onBack={mockOnBack} 
        onAuth={mockOnAuth} 
        onModeChange={mockOnModeChange} 
      />
    );
    
    // Click on the back button
    fireEvent.click(screen.getByText('Back to Home'));
    
    // Check if onBack was called
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
  
  test('calls onModeChange when mode toggle link is clicked', () => {
    render(
      <Auth 
        mode="login" 
        onBack={mockOnBack} 
        onAuth={mockOnAuth} 
        onModeChange={mockOnModeChange} 
      />
    );
    
    // Click on the mode toggle link
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));
    
    // Check if onModeChange was called with the correct mode
    expect(mockOnModeChange).toHaveBeenCalledTimes(1);
    expect(mockOnModeChange).toHaveBeenCalledWith('signup');
  });
  
  test('submits form with correct values', async () => {
    render(
      <Auth 
        mode="login" 
        onBack={mockOnBack} 
        onAuth={mockOnAuth} 
        onModeChange={mockOnModeChange} 
      />
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
    // Check if onAuth was called with the correct values
    await waitFor(() => {
      expect(mockOnAuth).toHaveBeenCalledTimes(1);
      expect(mockOnAuth).toHaveBeenCalledWith('test@example.com', 'password123', false);
    });
  });
  
  test('displays loading state during form submission', async () => {
    // Mock onAuth to return a promise that doesn't resolve immediately
    const mockOnAuthLoading = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(
      <Auth 
        mode="login" 
        onBack={mockOnBack} 
        onAuth={mockOnAuthLoading} 
        onModeChange={mockOnModeChange} 
      />
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
    // Check if the button shows loading state
    expect(screen.getByRole('button', { name: 'Please wait...' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Please wait...' })).toBeDisabled();
  });
  
  test('displays error message when authentication fails', async () => {
    // Mock onAuth to throw an error
    const mockError = new Error('Invalid credentials');
    const mockOnAuthError = jest.fn(() => Promise.reject(mockError));
    
    render(
      <Auth 
        mode="login" 
        onBack={mockOnBack} 
        onAuth={mockOnAuthError} 
        onModeChange={mockOnModeChange} 
      />
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
    // Check if the error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});