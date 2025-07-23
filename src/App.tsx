import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Landing } from "./pages/Landing";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Settings } from "./pages/Settings";

const queryClient = new QueryClient();

type AppState = 'landing' | 'login' | 'signup' | 'dashboard' | 'settings';

const App = () => {
  const [currentPage, setCurrentPage] = useState<AppState>('landing');
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleSignUp = () => {
    setAuthMode('signup');
    setCurrentPage('signup');
  };

  const handleLogin = () => {
    setAuthMode('login');
    setCurrentPage('login');
  };

  const handleAuth = async (email: string, password: string) => {
    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ email });
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setUser(null);
      setCurrentPage('landing');
    }
  };

  const renderCurrentPage = () => {
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
            onLogin={handleAuth}
            onSignUp={handleAuth}
            onModeChange={(mode) => {
              setAuthMode(mode);
              setCurrentPage(mode);
            }}
          />
        );
      
      case 'dashboard':
        return user ? (
          <Dashboard
            userEmail={user.email}
            onLogout={handleLogout}
            onSettings={() => setCurrentPage('settings')}
          />
        ) : null;
      
      case 'settings':
        return user ? (
          <Settings
            userEmail={user.email}
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