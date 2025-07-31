import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft, Mail, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Note: Account deletion requires admin privileges or a server function
        // For now, we'll just sign out the user
        await supabase.auth.signOut();
        navigate('/');
      } catch (error) {
        console.error('Account deletion error:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-content-bg">
      <Navbar 
        isLoggedIn={true}
        userEmail={user?.email || ''}
        onLogout={handleLogout}
        onSettings={() => navigate('/settings')}
      />
      
      <div className="container px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-6 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-2">
                Manage your account preferences and settings
              </p>
            </div>

            {/* Account Information */}
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Your current account details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Email Address</label>
                    <div className="mt-1 p-3 bg-muted rounded-md">
                      <span className="text-foreground">{user?.email}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground">Subscription</label>
                    <div className="mt-1 p-3 bg-muted rounded-md">
                      <span className="text-foreground">Free Plan</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Reading Preferences</CardTitle>
                <CardDescription>
                  Customize your news consumption experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Get daily summary emails</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Coming Soon
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Preferred Reading Time</p>
                      <p className="text-sm text-muted-foreground">When you prefer to read summaries</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Coming Soon
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-destructive">
                  <Trash2 className="h-5 w-5 mr-2" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible account actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Sign Out</p>
                      <p className="text-sm text-muted-foreground">Sign out of your account</p>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                      Sign Out
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Delete Account</p>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};