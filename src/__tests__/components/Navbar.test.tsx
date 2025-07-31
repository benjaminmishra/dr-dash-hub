import { render, screen, fireEvent } from '../test-utils';
import { Navbar } from '@/components/Navbar';

describe('Navbar Component', () => {
  // Test for unauthenticated state
  test('renders login and signup buttons when not logged in', () => {
    const mockSignUp = jest.fn();
    const mockLogin = jest.fn();
    
    render(<Navbar onSignUp={mockSignUp} onLogin={mockLogin} />);
    
    // Check if the logo is rendered
    expect(screen.getByText('TLDR')).toBeInTheDocument();
    
    // Check if login and signup buttons are rendered
    const loginButton = screen.getByText('Login');
    const signUpButton = screen.getByText('Sign Up');
    
    expect(loginButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
    
    // Test button clicks
    fireEvent.click(loginButton);
    expect(mockLogin).toHaveBeenCalledTimes(1);
    
    fireEvent.click(signUpButton);
    expect(mockSignUp).toHaveBeenCalledTimes(1);
  });
  
  // Test for authenticated state
  test('renders user menu when logged in', () => {
    const mockLogout = jest.fn();
    const mockSettings = jest.fn();
    const userEmail = 'test@example.com';
    
    render(
      <Navbar 
        isLoggedIn={true} 
        userEmail={userEmail} 
        onLogout={mockLogout} 
        onSettings={mockSettings} 
      />
    );
    
    // Check if the user email is rendered
    expect(screen.getByText(userEmail)).toBeInTheDocument();
    
    // User menu should be hidden initially
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    
    // Click on the user button to open the menu
    fireEvent.click(screen.getByText(userEmail));
    
    // Now the menu should be visible
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    
    // Test settings button click
    fireEvent.click(screen.getByText('Settings'));
    expect(mockSettings).toHaveBeenCalledTimes(1);
    
    // Menu should be closed after clicking settings
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    
    // Open the menu again
    fireEvent.click(screen.getByText(userEmail));
    
    // Test logout button click
    fireEvent.click(screen.getByText('Logout'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
  
  // Test for mobile view (user email hidden)
  test('hides user email on small screens', () => {
    // Mock window.innerWidth to simulate small screen
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));
    
    render(
      <Navbar 
        isLoggedIn={true} 
        userEmail="test@example.com" 
      />
    );
    
    // The user email should be in the DOM but not visible
    const userEmailElement = screen.getByText('test@example.com');
    expect(userEmailElement).toBeInTheDocument();
    expect(userEmailElement.className).toContain('hidden');
  });
});