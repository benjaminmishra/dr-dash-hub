import { Button } from "@/components/ui/button";
import { LogOut, Settings, User } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  isLoggedIn?: boolean;
  userEmail?: string;
  onSignUp?: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
  onSettings?: () => void;
}

export const Navbar = ({ 
  isLoggedIn = false, 
  userEmail,
  onSignUp, 
  onLogin, 
  onLogout,
  onSettings 
}: NavbarProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-primary">TLDR</div>
          <div className="text-sm text-muted-foreground hidden sm:block">News</div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline-block">{userEmail}</span>
              </Button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white shadow-elevated">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onSettings?.();
                        setShowUserMenu(false);
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        onLogout?.();
                        setShowUserMenu(false);
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={onLogin}>
                Login
              </Button>
              <Button variant="default" size="sm" onClick={onSignUp}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};