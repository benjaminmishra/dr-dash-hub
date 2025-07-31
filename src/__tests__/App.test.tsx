// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Create mock objects first
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2023-01-01T00:00:00.000Z'
};

const mockSession = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  expires_in: 3600,
  user: mockUser
};

const mockSupabase = {
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(() => Promise.resolve({ data: { session: null } })),
    onAuthStateChange: jest.fn((callback) => {
      callback('SIGNED_OUT', null);
      return {
        data: {
          subscription: {
            unsubscribe: jest.fn()
          }
        }
      };
    })
  }
};

// Mock the supabase client before importing App
jest.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}));

// Now import App and test utils
import { render, screen, waitFor } from './App-test-utils';
import App from '@/App';

// Mock the page components
jest.mock('../pages/Landing', () => ({
  Landing: ({ onSignUp, onLogin }: any) => (
    <div data-testid="landing-page">
      <button onClick={onSignUp}>Sign Up</button>
      <button onClick={onLogin}>Login</button>
    </div>
  )
}));

jest.mock('../pages/Auth', () => ({
  Auth: ({ mode, onBack, onAuth, onModeChange }: any) => (
    <div data-testid="auth-page" data-mode={mode}>
      <button onClick={onBack}>Back</button>
      <button onClick={() => onAuth('test@example.com', 'password', mode === 'signup')}>
        Submit
      </button>
      <button onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}>
        Switch Mode
      </button>
    </div>
  )
}));

jest.mock('../pages/Dashboard', () => ({
  Dashboard: ({ userEmail, onLogout, onSettings }: any) => (
    <div data-testid="dashboard-page" data-email={userEmail}>
      <button onClick={onLogout}>Logout</button>
      <button onClick={onSettings}>Settings</button>
    </div>
  )
}));

jest.mock('../pages/Settings', () => ({
  Settings: ({ userEmail, onBack, onLogout, onDeleteAccount }: any) => (
    <div data-testid="settings-page" data-email={userEmail}>
      <button onClick={onBack}>Back</button>
      <button onClick={onLogout}>Logout</button>
      <button onClick={onDeleteAccount}>Delete Account</button>
    </div>
  )
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock implementations
    mockSupabase.auth.getSession.mockImplementation(() => 
      Promise.resolve({ data: { session: null } })
    );
    
    mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
      callback('SIGNED_OUT', null);
      return {
        data: {
          subscription: {
            unsubscribe: jest.fn()
          }
        }
      };
    });
  });
  
  test('renders loading state initially', () => {
    // Don't resolve the getSession promise yet
    mockSupabase.auth.getSession.mockImplementation(() => 
      new Promise(() => {})
    );
    
    render(<App />);
    
    // Check if loading state is rendered
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  test('renders landing page when user is not authenticated', async () => {
    render(<App />);
    
    // Wait for the authentication check to complete
    await waitFor(() => {
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    });
  });
  
  test('renders dashboard page when user is authenticated', async () => {
    // Mock authenticated session
    mockSupabase.auth.getSession.mockImplementation(() => 
      Promise.resolve({ data: { session: mockSession } })
    );
    
    render(<App />);
    
    // Wait for the authentication check to complete
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-page')).toHaveAttribute('data-email', 'test@example.com');
    });
  });
  
  test('navigates to login page when login button is clicked', async () => {
    render(<App />);
    
    // Wait for the landing page to render
    await waitFor(() => {
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    });
    
    // Click on the login button
    screen.getByText('Login').click();
    
    // Check if auth page is rendered with login mode
    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    expect(screen.getByTestId('auth-page')).toHaveAttribute('data-mode', 'login');
  });
  
  test('navigates to signup page when signup button is clicked', async () => {
    render(<App />);
    
    // Wait for the landing page to render
    await waitFor(() => {
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    });
    
    // Click on the signup button
    screen.getByText('Sign Up').click();
    
    // Check if auth page is rendered with signup mode
    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    expect(screen.getByTestId('auth-page')).toHaveAttribute('data-mode', 'signup');
  });
  
  test('navigates back to landing page from auth page', async () => {
    render(<App />);
    
    // Wait for the landing page to render
    await waitFor(() => {
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    });
    
    // Navigate to login page
    screen.getByText('Login').click();
    
    // Check if auth page is rendered
    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    
    // Click on the back button
    screen.getByText('Back').click();
    
    // Check if landing page is rendered again
    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
  });
  
  test('switches between login and signup modes', async () => {
    render(<App />);
    
    // Wait for the landing page to render
    await waitFor(() => {
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    });
    
    // Navigate to login page
    screen.getByText('Login').click();
    
    // Check if auth page is rendered with login mode
    expect(screen.getByTestId('auth-page')).toHaveAttribute('data-mode', 'login');
    
    // Switch to signup mode
    screen.getByText('Switch Mode').click();
    
    // Check if auth page is rendered with signup mode
    expect(screen.getByTestId('auth-page')).toHaveAttribute('data-mode', 'signup');
  });
  
  test('handles login submission', async () => {
    // Mock successful login
    mockSupabase.auth.signInWithPassword.mockImplementation(() => 
      Promise.resolve({ data: { session: mockSession, user: mockUser }, error: null })
    );
    
    render(<App />);
    
    // Wait for the landing page to render
    await waitFor(() => {
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    });
    
    // Navigate to login page
    screen.getByText('Login').click();
    
    // Submit the login form
    screen.getByText('Submit').click();
    
    // Check if signInWithPassword was called with correct parameters
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password'
    });
  });
  
  test('handles signup submission', async () => {
    // Mock successful signup
    mockSupabase.auth.signUp.mockImplementation(() => 
      Promise.resolve({ data: { session: null, user: null }, error: null })
    );
    
    render(<App />);
    
    // Wait for the landing page to render
    await waitFor(() => {
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    });
    
    // Navigate to signup page
    screen.getByText('Sign Up').click();
    
    // Submit the signup form
    screen.getByText('Submit').click();
    
    // Check if signUp was called with correct parameters
    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
      options: {
        emailRedirectTo: expect.any(String)
      }
    });
  });
  
  test('navigates to settings page from dashboard', async () => {
    // Mock authenticated session
    mockSupabase.auth.getSession.mockImplementation(() => 
      Promise.resolve({ data: { session: mockSession } })
    );
    
    render(<App />);
    
    // Wait for the dashboard page to render
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });
    
    // Click on the settings button
    screen.getByText('Settings').click();
    
    // Check if settings page is rendered
    expect(screen.getByTestId('settings-page')).toBeInTheDocument();
  });
  
  test('navigates back to dashboard from settings', async () => {
    // Mock authenticated session
    mockSupabase.auth.getSession.mockImplementation(() => 
      Promise.resolve({ data: { session: mockSession } })
    );
    
    render(<App />);
    
    // Wait for the dashboard page to render
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });
    
    // Navigate to settings page
    screen.getByText('Settings').click();
    
    // Check if settings page is rendered
    expect(screen.getByTestId('settings-page')).toBeInTheDocument();
    
    // Click on the back button
    screen.getByText('Back').click();
    
    // Check if dashboard page is rendered again
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });
  
  test('handles logout', async () => {
    // Mock authenticated session
    mockSupabase.auth.getSession.mockImplementation(() => 
      Promise.resolve({ data: { session: mockSession } })
    );
    
    // Mock successful logout
    mockSupabase.auth.signOut.mockImplementation(() => 
      Promise.resolve({ error: null })
    );
    
    render(<App />);
    
    // Wait for the dashboard page to render
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });
    
    // Click on the logout button
    screen.getByText('Logout').click();
    
    // Check if signOut was called
    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
  });
  
  test('handles account deletion', async () => {
    // Mock authenticated session
    mockSupabase.auth.getSession.mockImplementation(() => 
      Promise.resolve({ data: { session: mockSession } })
    );
    
    // Mock successful logout (used for account deletion)
    mockSupabase.auth.signOut.mockImplementation(() => 
      Promise.resolve({ error: null })
    );
    
    // Mock window.confirm to return true
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);
    
    render(<App />);
    
    // Wait for the dashboard page to render
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });
    
    // Navigate to settings page
    screen.getByText('Settings').click();
    
    // Check if settings page is rendered
    expect(screen.getByTestId('settings-page')).toBeInTheDocument();
    
    // Click on the delete account button
    screen.getByText('Delete Account').click();
    
    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    // Check if signOut was called
    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    
    // Restore original confirm
    window.confirm = originalConfirm;
  });
});