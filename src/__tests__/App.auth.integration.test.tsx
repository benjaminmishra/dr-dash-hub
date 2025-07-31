import { render, screen, fireEvent, waitFor, act } from './App-test-utils';
import App from '@/App';

// Mock BrowserRouter to avoid nesting issues
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// Mock image asset
jest.mock('@/assets/hero-image.jpg', () => 'hero-image-mock');

// Mock other page components to keep tests focused
jest.mock('../pages/Landing', () => ({
  Landing: ({ onSignUp, onLogin }: any) => (
    <div data-testid="landing-page">
      <button onClick={onSignUp}>Sign Up</button>
      <button onClick={onLogin}>Login</button>
    </div>
  ),
}));

// Use real Auth page (no mock)

jest.mock('../pages/Dashboard', () => ({
  Dashboard: ({ onLogout, onSettings }: any) => (
    <div data-testid="dashboard-page">
      <button onClick={onLogout}>Logout</button>
      <button onClick={onSettings}>Settings</button>
    </div>
  ),
}));

jest.mock('../pages/Settings', () => ({
  Settings: ({ onBack, onLogout, onDeleteAccount }: any) => (
    <div data-testid="settings-page">
      <button onClick={onBack}>Back</button>
      <button onClick={onLogout}>Logout</button>
      <button onClick={onDeleteAccount}>Delete Account</button>
    </div>
  ),
}));

const mockSupabase = {
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(() => Promise.resolve({ data: { session: null } })),
    onAuthStateChange: jest.fn((cb: any) => {
      cb('SIGNED_OUT', null);
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    }),
  },
};

jest.mock('@/integrations/supabase/client', () => ({
  get supabase() {
    return mockSupabase;
  },
}));

describe('App auth integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('login submits via handleAuth', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: { session: null }, error: null });

    render(<App />);

    fireEvent.click(screen.getByText('Login'));
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'pass123',
      });
    });
  });

  test('signup submits via handleAuth', async () => {
    mockSupabase.auth.signUp.mockResolvedValue({ data: { session: null }, error: null });

    render(<App />);

    fireEvent.click(screen.getByText('Sign Up'));
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass1234' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(mockSupabase.auth.signUp).toHaveBeenCalled();
    });
  });

  test('handles login error path', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: null, error: new Error('bad') });

    render(<App />);

    fireEvent.click(screen.getByText('Login'));
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Auth error:', expect.any(Error));
    });
    consoleSpy.mockRestore();
  });

  test('handles signup error path', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockSupabase.auth.signUp.mockResolvedValue({ data: null, error: new Error('fail') });

    render(<App />);

    fireEvent.click(screen.getByText('Sign Up'));
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass1234' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Auth error:', expect.any(Error));
    });
    consoleSpy.mockRestore();
  });

  test('auth state change navigates between pages', async () => {
    let callback: any;
    mockSupabase.auth.onAuthStateChange.mockImplementation((cb: any) => {
      callback = cb;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    });

    // simulate login via auth state change
    act(() => callback('SIGNED_IN', { user: { email: 'a@b.c' } }));

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });

    // simulate logout via auth state change
    act(() => callback('SIGNED_OUT', null));

    await waitFor(() => {
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    });
  });

  test('handles logout and delete account errors', async () => {
    let callback: any;
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: { user: { email: 'x@y.z' } } } });
    mockSupabase.auth.onAuthStateChange.mockImplementation((cb: any) => {
      callback = cb;
      cb('SIGNED_IN', { user: { email: 'x@y.z' } });
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockSupabase.auth.signOut.mockRejectedValue(new Error('logout'));
    const originalConfirm = window.confirm;
    // ensure confirm returns true so deletion proceeds
    (window as any).confirm = jest.fn(() => true);

    render(<App />);

    // wait for dashboard
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Logout'));
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Logout error:', expect.any(Error));
    });

    // navigate to settings
    fireEvent.click(screen.getByText('Settings'));
    await waitFor(() => {
      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete Account'));
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Account deletion error:', expect.any(Error));
    });

    consoleSpy.mockRestore();
    window.confirm = originalConfirm;
  });
});
