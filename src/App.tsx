import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Landing } from "./pages/Landing";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Settings } from "./pages/Settings";

const queryClient = new QueryClient();

type AppState = 'landing' | 'login' | 'signup' | 'dashboard' | 'settings';

const App = () => {
  const [currentPage, setCurrentPage] = useState<AppState>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setCurrentPage('dashboard');
        } else if (currentPage === 'dashboard' || currentPage === 'settings') {
          setCurrentPage('landing');
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setCurrentPage('dashboard');
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignUp = () => {
    setAuthMode('signup');
    setCurrentPage('signup');
  };

  const handleLogin = () => {
    setAuthMode('login');
    setCurrentPage('login');
  };

  const handleAuth = async (email: string, password: string, isSignUp: boolean) => {
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      }
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentPage('landing');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Note: Account deletion requires admin privileges or a server function
        // For now, we'll just sign out the user
        await supabase.auth.signOut();
        setCurrentPage('landing');
      } catch (error) {
        console.error('Account deletion error:', error);
      }
    }
  };

  const renderCurrentPage = () => {
    // Show loading while checking authentication
    if (isLoading) {
      return (
        <div className="min-h-screen bg-content-bg flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      );
    }

    // Redirect unauthenticated users from protected pages
    if (!user && (currentPage === 'dashboard' || currentPage === 'settings')) {
      setCurrentPage('landing');
      return null;
    }

    switch (currentPage) {
      case 'landing':
        return (
          <Landing 
            onSignUp={handleSignUp}
            onLogin={handleLogin}
          />
        );
      
      case 'login':
      case 'signup':
        return (
          <Auth
            mode={authMode}
            onBack={() => setCurrentPage('landing')}
            onAuth={handleAuth}
            onModeChange={(mode) => {
              setAuthMode(mode);
              setCurrentPage(mode);
            }}
          />
        );
      
      case 'dashboard':
        return user ? (
          <Dashboard
            userEmail={user.email!}
            onLogout={handleLogout}
            onSettings={() => setCurrentPage('settings')}
          />
        ) : null;
      
      case 'settings':
        return user ? (
          <Settings
            userEmail={user.email!}
            onBack={() => setCurrentPage('dashboard')}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="*" element={renderCurrentPage()} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;