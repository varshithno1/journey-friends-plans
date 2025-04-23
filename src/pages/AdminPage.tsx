
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import UserList from '@/components/admin/UserList';
import { UserProvider } from '@/context/UserContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Activity,
  Map,
  AlertTriangle,
  User,
  Users,
  UserCheck,
  UserX,
  Calendar
} from 'lucide-react';
import { useTrip } from '@/context/TripContext';
import { useUser } from '@/context/UserContext';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { trips } = useTrip();
  const { users } = useUser();
  
  // Redirect if user is not admin or not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  // Stats
  const totalTrips = trips.length;
  const totalUsers = users.length;
  const pendingUsers = users.filter(u => !u.validated).length;
  const totalActivities = trips.reduce((acc, trip) => acc + trip.activities.length, 0);
  const upcomingTrips = trips.filter(trip => new Date(trip.startDate) > new Date()).length;
  
  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{totalUsers}</div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{pendingUsers}</div>
                <UserX className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{totalTrips}</div>
                <Map className="h-8 w-8 text-travel-teal" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{upcomingTrips}</div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{totalActivities}</div>
                <Activity className="h-8 w-8 text-travel-coral" />
              </div>
            </CardContent>
          </Card>
          
          {pendingUsers > 0 && (
            <Card className="bg-amber-50 border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-700 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Action Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-amber-800">
                  You have <strong>{pendingUsers}</strong> users waiting for validation.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <Card>
              <CardContent className="pt-6">
                <UserList />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminPage;
