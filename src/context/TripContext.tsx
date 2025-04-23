
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type Activity = {
  id: number;
  tripId: number;
  day: number; // Day of the trip (1, 2, 3, etc.)
  title: string;
  description: string;
  startTime: string; // "09:00"
  endTime: string; // "11:00"
  location: string;
  cost?: number;
  category: 'Sightseeing' | 'Food' | 'Transportation' | 'Accommodation' | 'Other';
};

export type Trip = {
  id: number;
  title: string;
  description: string;
  destination: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  imageUrl: string;
  userId: number; // Creator
  sharedWith: number[]; // User IDs
  activities: Activity[];
};

type TripContextType = {
  trips: Trip[];
  userTrips: Trip[];
  isLoading: boolean;
  createTrip: (trip: Omit<Trip, 'id' | 'activities'>) => Promise<Trip>;
  updateTrip: (id: number, trip: Partial<Omit<Trip, 'id' | 'activities'>>) => Promise<Trip>;
  deleteTrip: (id: number) => Promise<boolean>;
  getTrip: (id: number) => Trip | undefined;
  addActivity: (tripId: number, activity: Omit<Activity, 'id' | 'tripId'>) => Promise<Activity>;
  updateActivity: (activityId: number, activity: Partial<Omit<Activity, 'id' | 'tripId'>>) => Promise<Activity>;
  deleteActivity: (activityId: number) => Promise<boolean>;
  shareTrip: (tripId: number, userId: number) => Promise<boolean>;
  unshareTrip: (tripId: number, userId: number) => Promise<boolean>;
  filterTrips: (filters: { destination?: string, startDate?: string, endDate?: string, category?: Activity['category'] }) => Trip[];
  setCurrentUserId: (userId: number | null) => void;
};

// Mock data
const mockTrips: Trip[] = [
  {
    id: 1,
    title: "Summer in Paris",
    description: "Exploring the city of lights",
    destination: "Paris, France",
    startDate: "2025-06-15",
    endDate: "2025-06-22",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop",
    userId: 2,
    sharedWith: [1],
    activities: [
      {
        id: 1,
        tripId: 1,
        day: 1,
        title: "Eiffel Tower Visit",
        description: "Visit the iconic Eiffel Tower",
        startTime: "10:00",
        endTime: "12:00",
        location: "Champ de Mars, 5 Av. Anatole France",
        cost: 25,
        category: "Sightseeing"
      },
      {
        id: 2,
        tripId: 1,
        day: 1,
        title: "Lunch at Le Jules Verne",
        description: "Fine dining experience in the Eiffel Tower",
        startTime: "12:30",
        endTime: "14:00",
        location: "Eiffel Tower, 2nd floor",
        cost: 150,
        category: "Food"
      }
    ]
  },
  {
    id: 2,
    title: "Tokyo Adventure",
    description: "Exploring Japan's capital",
    destination: "Tokyo, Japan",
    startDate: "2025-09-10",
    endDate: "2025-09-20",
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop",
    userId: 1,
    sharedWith: [2, 3],
    activities: [
      {
        id: 3,
        tripId: 2,
        day: 1,
        title: "Tokyo Skytree",
        description: "Visit the tallest tower in Japan",
        startTime: "09:00",
        endTime: "11:00",
        location: "1 Chome-1-2 Oshiage",
        cost: 20,
        category: "Sightseeing"
      }
    ]
  },
  {
    id: 3,
    title: "New York City Weekend",
    description: "Weekend getaway to the Big Apple",
    destination: "New York, USA",
    startDate: "2025-05-22",
    endDate: "2025-05-25",
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop",
    userId: 2,
    sharedWith: [],
    activities: [
      {
        id: 4,
        tripId: 3,
        day: 1,
        title: "Central Park Bike Tour",
        description: "Bike tour around Central Park",
        startTime: "10:00",
        endTime: "12:00",
        location: "Central Park",
        cost: 45,
        category: "Sightseeing"
      }
    ]
  }
];

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children }: { children: React.ReactNode }) => {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const userTrips = currentUserId 
    ? trips.filter(trip => 
        trip.userId === currentUserId || 
        trip.sharedWith.includes(currentUserId)
      )
    : [];

  const createTrip = async (tripData: Omit<Trip, 'id' | 'activities'>): Promise<Trip> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newTrip: Trip = {
        ...tripData,
        id: trips.length + 1,
        activities: []
      };
      
      setTrips(prevTrips => [...prevTrips, newTrip]);
      toast.success("Trip created successfully!");
      return newTrip;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTrip = async (id: number, tripData: Partial<Omit<Trip, 'id' | 'activities'>>): Promise<Trip> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedTrips = trips.map(trip => {
        if (trip.id === id) {
          return { ...trip, ...tripData };
        }
        return trip;
      });
      
      setTrips(updatedTrips);
      const updatedTrip = updatedTrips.find(trip => trip.id === id);
      
      if (!updatedTrip) {
        throw new Error('Trip not found');
      }
      
      toast.success("Trip updated successfully!");
      return updatedTrip;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTrip = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setTrips(prevTrips => prevTrips.filter(trip => trip.id !== id));
      toast.success("Trip deleted successfully!");
      return true;
    } catch (error) {
      toast.error("Failed to delete trip");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getTrip = (id: number): Trip | undefined => {
    return trips.find(trip => trip.id === id);
  };

  const addActivity = async (tripId: number, activityData: Omit<Activity, 'id' | 'tripId'>): Promise<Activity> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newActivity: Activity = {
        ...activityData,
        id: Math.max(0, ...trips.flatMap(t => t.activities.map(a => a.id))) + 1,
        tripId
      };
      
      setTrips(prevTrips => prevTrips.map(trip => {
        if (trip.id === tripId) {
          return {
            ...trip,
            activities: [...trip.activities, newActivity]
          };
        }
        return trip;
      }));
      
      toast.success("Activity added successfully!");
      return newActivity;
    } finally {
      setIsLoading(false);
    }
  };

  const updateActivity = async (activityId: number, activityData: Partial<Omit<Activity, 'id' | 'tripId'>>): Promise<Activity> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let updatedActivity: Activity | null = null;
      
      setTrips(prevTrips => prevTrips.map(trip => {
        const activityIndex = trip.activities.findIndex(a => a.id === activityId);
        
        if (activityIndex !== -1) {
          const updatedActivities = [...trip.activities];
          updatedActivities[activityIndex] = {
            ...updatedActivities[activityIndex],
            ...activityData
          };
          
          updatedActivity = updatedActivities[activityIndex];
          
          return {
            ...trip,
            activities: updatedActivities
          };
        }
        
        return trip;
      }));
      
      if (!updatedActivity) {
        throw new Error('Activity not found');
      }
      
      toast.success("Activity updated successfully!");
      return updatedActivity;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteActivity = async (activityId: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTrips(prevTrips => prevTrips.map(trip => {
        const activityIndex = trip.activities.findIndex(a => a.id === activityId);
        
        if (activityIndex !== -1) {
          const updatedActivities = [...trip.activities];
          updatedActivities.splice(activityIndex, 1);
          
          return {
            ...trip,
            activities: updatedActivities
          };
        }
        
        return trip;
      }));
      
      toast.success("Activity deleted successfully!");
      return true;
    } catch (error) {
      toast.error("Failed to delete activity");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const shareTrip = async (tripId: number, userId: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTrips(prevTrips => prevTrips.map(trip => {
        if (trip.id === tripId && !trip.sharedWith.includes(userId)) {
          return {
            ...trip,
            sharedWith: [...trip.sharedWith, userId]
          };
        }
        return trip;
      }));
      
      toast.success("Trip shared successfully!");
      return true;
    } catch (error) {
      toast.error("Failed to share trip");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const unshareTrip = async (tripId: number, userId: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTrips(prevTrips => prevTrips.map(trip => {
        if (trip.id === tripId) {
          return {
            ...trip,
            sharedWith: trip.sharedWith.filter(id => id !== userId)
          };
        }
        return trip;
      }));
      
      toast.success("Trip unshared successfully!");
      return true;
    } catch (error) {
      toast.error("Failed to unshare trip");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const filterTrips = (filters: { 
    destination?: string, 
    startDate?: string, 
    endDate?: string, 
    category?: Activity['category'] 
  }): Trip[] => {
    return userTrips.filter(trip => {
      let match = true;
      
      if (filters.destination && !trip.destination.toLowerCase().includes(filters.destination.toLowerCase())) {
        match = false;
      }
      
      if (filters.startDate && trip.startDate < filters.startDate) {
        match = false;
      }
      
      if (filters.endDate && trip.endDate > filters.endDate) {
        match = false;
      }
      
      if (filters.category) {
        const hasCategoryActivity = trip.activities.some(activity => activity.category === filters.category);
        if (!hasCategoryActivity) {
          match = false;
        }
      }
      
      return match;
    });
  };

  return (
    <TripContext.Provider value={{ 
      trips, 
      userTrips,
      isLoading, 
      createTrip, 
      updateTrip, 
      deleteTrip, 
      getTrip, 
      addActivity, 
      updateActivity, 
      deleteActivity, 
      shareTrip, 
      unshareTrip, 
      filterTrips,
      setCurrentUserId
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
