
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Profile update functionality is not implemented in this demo");
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Password change functionality is not implemented in this demo");
  };
  
  return (
    <MainLayout>
      <div className="container px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground mb-8">
          Manage your account settings and preferences
        </p>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name"
                    defaultValue={user.name}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    defaultValue={user.email}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <div className="flex items-center">
                    <span 
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Account Status</Label>
                  <div className="flex items-center">
                    <span 
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.validated 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {user.validated ? 'Validated' : 'Pending Validation'}
                    </span>
                  </div>
                  {!user.validated && (
                    <p className="text-xs text-muted-foreground">
                      Your account is awaiting validation by an administrator
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Update Profile</Button>
              </CardFooter>
            </form>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <form onSubmit={handleChangePassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password"
                    type="password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password"
                    type="password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input 
                    id="confirm-password"
                    type="password"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Change Password</Button>
              </CardFooter>
            </form>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-red-500">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="destructive" onClick={() => toast.error("Delete account functionality is not implemented in this demo")}>
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
