import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '@/config/api';
import { toast } from 'sonner';

export type Activity = {
  id: number;
  trip_id: number;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  location: string | null;
  cost: number | null;
  day: number;
  category: 'Sightseeing' | 'Food' | 'Transportation' | 'Accommodation' | 'Other';
  get startTime(): string { return this.start_time; }
  get endTime(): string | null { return this.end_time; }
};

export type Trip = {
  id: number;
  title: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  userId: number;
  sharedWith: number[];
  activities: Activity[];
};

type TripContextType = {
  userTrips: Trip[];
  trips: Trip[]; // Alias for userTrips for backwards compatibility
  isLoading: boolean;
  createTrip: (tripData: Omit<Trip, 'id' | 'activities'>) => Promise<Trip>;
  updateTrip: (tripId: number, tripData: Partial<Omit<Trip, 'id' | 'activities'>>) => Promise<boolean>;
  deleteTrip: (tripId: number) => Promise<boolean>;
  shareTrip: (tripId: number, userId: number) => Promise<boolean>;
  getTrip: (id: number) => Trip | undefined;
  filterTrips: (filters: { destination?: string; startDate?: string; endDate?: string; category?: string }) => Trip[];
  currentUserId: number | null;
  setCurrentUserId: (userId: number | null) => void;
  fetchTrips: () => Promise<void>;
  addActivity: (tripId: number, activityData: Partial<Omit<Activity, 'id' | 'trip_id'>>) => Promise<boolean>;
  updateActivity: (activityId: number, activityData: Partial<Omit<Activity, 'id' | 'trip_id'>>) => Promise<boolean>;
  deleteActivity: (activityId: number) => Promise<boolean>;
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children }: { children: React.ReactNode }) => {
  const [userTrips, setUserTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/trips`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }

      const data = await response.json();
      setUserTrips(data);
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast.error('Failed to load trips');
    } finally {
      setIsLoading(false);
    }
  };

  const createTrip = async (tripData: Omit<Trip, 'id' | 'activities'>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) {
        throw new Error('Failed to create trip');
      }

      const newTrip = await response.json();
      setUserTrips(prev => [...prev, newTrip]);
      toast.success('Trip created successfully');
      return newTrip;
    } catch (error) {
      console.error('Error creating trip:', error);
      toast.error('Failed to create trip');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTrip = async (tripId: number, tripData: Partial<Omit<Trip, 'id' | 'activities'>>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) {
        throw new Error('Failed to update trip');
      }

      const updatedTrip = await response.json();
      setUserTrips(prev => prev.map(trip => 
        trip.id === tripId ? { ...trip, ...updatedTrip } : trip
      ));
      toast.success('Trip updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating trip:', error);
      toast.error('Failed to update trip');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTrip = async (tripId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete trip');
      }

      setUserTrips(prev => prev.filter(trip => trip.id !== tripId));
      toast.success('Trip deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast.error('Failed to delete trip');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const shareTrip = async (tripId: number, userId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to share trip');
      }

      const updatedTrip = await response.json();
      setUserTrips(prev => prev.map(trip => 
        trip.id === tripId ? { ...trip, ...updatedTrip } : trip
      ));
      toast.success('Trip shared successfully');
      return true;
    } catch (error) {
      console.error('Error sharing trip:', error);
      toast.error('Failed to share trip');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addActivity = async (tripId: number, activityData: Partial<Omit<Activity, 'id' | 'trip_id'>>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...activityData,
          start_time: activityData.startTime || activityData.start_time,
          end_time: activityData.endTime || activityData.end_time,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add activity');
      }

      const newActivity = await response.json();
      
      setUserTrips(prev => prev.map(trip => {
        if (trip.id === tripId) {
          return {
            ...trip,
            activities: [...trip.activities, newActivity]
          };
        }
        return trip;
      }));
      
      toast.success('Activity added successfully');
      return true;
    } catch (error) {
      console.error('Error adding activity:', error);
      toast.error('Failed to add activity');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateActivity = async (activityId: number, activityData: Partial<Omit<Activity, 'id' | 'trip_id'>>) => {
    setIsLoading(true);
    try {
      const tripWithActivity = userTrips.find(trip => 
        trip.activities.some(activity => activity.id === activityId)
      );
      
      if (!tripWithActivity) {
        throw new Error('Activity not found');
      }
      
      const response = await fetch(`${API_URL}/trips/${tripWithActivity.id}/activities/${activityId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...activityData,
          start_time: activityData.startTime || activityData.start_time,
          end_time: activityData.endTime || activityData.end_time,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update activity');
      }

      const updatedActivity = await response.json();
      
      setUserTrips(prev => prev.map(trip => {
        if (trip.id === tripWithActivity.id) {
          return {
            ...trip,
            activities: trip.activities.map(activity => 
              activity.id === activityId ? { ...activity, ...updatedActivity } : activity
            )
          };
        }
        return trip;
      }));
      
      toast.success('Activity updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating activity:', error);
      toast.error('Failed to update activity');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteActivity = async (activityId: number) => {
    setIsLoading(true);
    try {
      const tripWithActivity = userTrips.find(trip => 
        trip.activities.some(activity => activity.id === activityId)
      );
      
      if (!tripWithActivity) {
        throw new Error('Activity not found');
      }
      
      const response = await fetch(`${API_URL}/trips/${tripWithActivity.id}/activities/${activityId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete activity');
      }
      
      setUserTrips(prev => prev.map(trip => {
        if (trip.id === tripWithActivity.id) {
          return {
            ...trip,
            activities: trip.activities.filter(activity => activity.id !== activityId)
          };
        }
        return trip;
      }));
      
      toast.success('Activity deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getTrip = (id: number): Trip | undefined => {
    return userTrips.find((trip) => trip.id === id);
  };

  const filterTrips = (filters: { 
    destination?: string; 
    startDate?: string; 
    endDate?: string; 
    category?: string 
  }): Trip[] => {
    return userTrips.filter(trip => {
      if (filters.destination && !trip.destination.toLowerCase().includes(filters.destination.toLowerCase())) {
        return false;
      }
      if (filters.startDate && trip.startDate < filters.startDate) {
        return false;
      }
      if (filters.endDate && trip.endDate > filters.endDate) {
        return false;
      }
      
      if (filters.category) {
        const hasActivityWithCategory = trip.activities.some(
          activity => activity.category === filters.category
        );
        if (!hasActivityWithCategory) {
          return false;
        }
      }
      
      return true;
    });
  };

  useEffect(() => {
    if (currentUserId) {
      fetchTrips();
    }
  }, [currentUserId]);

  return (
    <TripContext.Provider value={{
      userTrips,
      trips: userTrips,
      isLoading,
      createTrip,
      updateTrip,
      deleteTrip,
      shareTrip,
      getTrip,
      filterTrips,
      currentUserId,
      setCurrentUserId,
      fetchTrips,
      addActivity,
      updateActivity,
      deleteActivity,
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
