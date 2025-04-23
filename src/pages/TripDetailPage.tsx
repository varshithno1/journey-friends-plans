
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTrip, Activity } from '@/context/TripContext';
import MainLayout from '@/components/layout/MainLayout';
import ActivityItem from '@/components/trips/ActivityItem';
import AddActivityForm from '@/components/trips/AddActivityForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Calendar, MapPin, User, Users, Share2, ArrowLeft, Plus } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const tripId = parseInt(id || '0');
  const { user } = useAuth();
  const { getTrip, shareTrip, isLoading } = useTrip();
  const { users, getUserById } = useUser();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState(getTrip(tripId));
  const [activeDays, setActiveDays] = useState<number[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  
  const isOwner = trip && user && trip.userId === user.id;
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Set trip from context
    const currentTrip = getTrip(tripId);
    setTrip(currentTrip);
    
    if (!currentTrip) {
      navigate('/trips');
      toast.error('Trip not found');
      return;
    }
    
    // Check if user has access to this trip
    const hasAccess = currentTrip.userId === user.id || currentTrip.sharedWith.includes(user.id);
    if (!hasAccess) {
      navigate('/trips');
      toast.error("You don't have access to this trip");
      return;
    }
    
    // Calculate trip days and activities per day
    if (currentTrip) {
      const startDate = new Date(currentTrip.startDate);
      const endDate = new Date(currentTrip.endDate);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      const days = Array.from({ length: diffDays }, (_, i) => i + 1);
      setActiveDays(days);
      
      // Set the first day with activities as the active day, or just day 1
      const activitiesByDay = days.map(day => ({
        day,
        hasActivities: currentTrip.activities.some(a => a.day === day)
      }));
      
      const firstDayWithActivities = activitiesByDay.find(d => d.hasActivities)?.day || 1;
      setSelectedDay(firstDayWithActivities);
    }
  }, [user, tripId, getTrip, navigate]);
  
  const handleShareTrip = async () => {
    if (!trip) return;
    
    const userToShare = users.find(u => u.email === shareEmail);
    if (!userToShare) {
      toast.error('User not found');
      return;
    }
    
    if (trip.sharedWith.includes(userToShare.id)) {
      toast.error('Trip is already shared with this user');
      return;
    }
    
    if (trip.userId === userToShare.id) {
      toast.error('Cannot share with the trip owner');
      return;
    }
    
    const success = await shareTrip(trip.id, userToShare.id);
    if (success) {
      setTrip(getTrip(tripId));
      setShareEmail('');
      setIsShareDialogOpen(false);
    }
  };
  
  if (!trip) {
    return (
      <MainLayout>
        <div className="container px-4 py-8 text-center">
          <p>Trip not found</p>
        </div>
      </MainLayout>
    );
  }
  
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const tripDuration = Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  const selectedDayActivities = trip.activities
    .filter(activity => activity.day === selectedDay)
    .sort((a, b) => {
      // Sort by start time
      return a.startTime.localeCompare(b.startTime);
    });
  
  return (
    <MainLayout>
      <div className="bg-gray-50 border-b">
        <div className="container px-4 py-4">
          <button 
            onClick={() => navigate('/trips')}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to trips
          </button>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img 
                src={trip.imageUrl} 
                alt={trip.title} 
                className="w-full h-64 object-cover rounded-lg shadow-sm"
              />
            </div>
            
            <div className="md:w-2/3">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <h1 className="text-3xl font-bold mb-2">{trip.title}</h1>
                
                {isOwner && (
                  <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Share2 className="mr-2 h-4 w-4" /> Share Trip
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Share Trip</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Enter user email to share with</Label>
                          <Input
                            id="email"
                            placeholder="user@example.com"
                            value={shareEmail}
                            onChange={(e) => setShareEmail(e.target.value)}
                          />
                        </div>
                        <Button className="w-full" onClick={handleShareTrip} disabled={isLoading}>
                          Share
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              
              <p className="text-gray-700 mb-4">{trip.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2 text-travel-teal" />
                  <span>{trip.destination}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2 text-travel-teal" />
                  <span>
                    {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
                    <span className="ml-1">({tripDuration} days)</span>
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="flex -space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs text-white ring-2 ring-background">
                    {getUserById(trip.userId)?.name.charAt(0) || '?'}
                  </div>
                  {trip.sharedWith.slice(0, 3).map((userId) => (
                    <div 
                      key={userId}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs ring-2 ring-background"
                    >
                      {getUserById(userId)?.name.charAt(0) || '?'}
                    </div>
                  ))}
                  {trip.sharedWith.length > 3 && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs ring-2 ring-background">
                      +{trip.sharedWith.length - 3}
                    </div>
                  )}
                </div>
                <span className="ml-3 text-sm text-gray-600">
                  Created by {getUserById(trip.userId)?.name || 'Unknown'}
                  {trip.sharedWith.length > 0 && ` • Shared with ${trip.sharedWith.length} people`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
              <h3 className="text-lg font-medium mb-4">Trip Days</h3>
              <div className="space-y-2">
                {activeDays.map((day) => {
                  const dayDate = new Date(startDate);
                  dayDate.setDate(startDate.getDate() + day - 1);
                  const hasActivities = trip.activities.some(a => a.day === day);
                  
                  return (
                    <Button
                      key={day}
                      variant={selectedDay === day ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedDay(day)}
                    >
                      <div className="flex flex-col items-start">
                        <span>Day {day}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(dayDate, 'EEE, MMM d')}
                        </span>
                      </div>
                      {hasActivities && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-green-500"></div>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-4">Shared With</h3>
              {trip.sharedWith.length === 0 ? (
                <p className="text-sm text-gray-600">This trip is not shared with anyone yet.</p>
              ) : (
                <div className="space-y-3">
                  {trip.sharedWith.map((userId) => {
                    const sharedUser = getUserById(userId);
                    return (
                      <div key={userId} className="flex items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs">
                          {sharedUser?.name.charAt(0) || '?'}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{sharedUser?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-600">{sharedUser?.email || ''}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          <div className="md:w-3/4">
            <Card className="mb-6">
              <CardContent className="p-6">
                {selectedDay !== null && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold">
                        Day {selectedDay}: {format(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + selectedDay - 1), 'EEEE, MMMM d, yyyy')}
                      </h2>
                    </div>
                    
                    <div>
                      {selectedDayActivities.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
                          <h3 className="text-lg font-medium mb-2">No activities planned for this day</h3>
                          <p className="text-gray-600 mb-4">Add some activities to your itinerary!</p>
                          {isOwner && (
                            <Button onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Activity
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {selectedDayActivities.map((activity) => (
                            <ActivityItem 
                              key={activity.id}
                              activity={activity}
                              isOwner={isOwner}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {isOwner && selectedDay !== null && (
              <div>
                <h3 className="text-xl font-bold mb-4">Add New Activity</h3>
                <AddActivityForm 
                  tripId={trip.id} 
                  day={selectedDay}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TripDetailPage;
