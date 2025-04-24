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

  const getTrip = (id: number): Trip | undefined => {
    return userTrips.find((trip) => trip.id === id);
  };

  const filterTrips = (filters: { destination?: string; startDate?: string; endDate?: string; category?: string }): Trip[] => {
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
