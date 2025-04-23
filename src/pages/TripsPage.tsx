
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTrip, Trip } from '@/context/TripContext';
import TripCard from '@/components/trips/TripCard';
import TripFilter from '@/components/trips/TripFilter';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

const TripsPage: React.FC = () => {
  const { user } = useAuth();
  const { userTrips, isLoading, filterTrips, setCurrentUserId } = useTrip();
  const navigate = useNavigate();
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  
  useEffect(() => {
    if (user) {
      setCurrentUserId(user.id);
      setFilteredTrips(userTrips);
    } else {
      // Redirect to login if not authenticated
      navigate('/login');
      toast.error("Please log in to view your trips");
    }
  }, [user, userTrips, setCurrentUserId, navigate]);
  
  const handleFilter = (filters: { 
    destination?: string, 
    startDate?: string, 
    endDate?: string, 
    category?: 'Sightseeing' | 'Food' | 'Transportation' | 'Accommodation' | 'Other' 
  }) => {
    const results = filterTrips(filters);
    setFilteredTrips(results);
  };
  
  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Trips</h1>
            <p className="text-muted-foreground">Manage and view all your travel plans</p>
          </div>
          <Button onClick={() => navigate('/trips/new')} className="md:w-auto w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Trip
          </Button>
        </div>
        
        <div className="mb-6">
          <TripFilter onFilter={handleFilter} />
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-muted-foreground">Loading your trips...</p>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
            <h3 className="text-xl font-medium mb-2">No trips found</h3>
            <p className="text-muted-foreground mb-6">
              {userTrips.length === 0 
                ? "You haven't created any trips yet." 
                : "No trips match your current filters."}
            </p>
            {userTrips.length === 0 && (
              <Button onClick={() => navigate('/trips/new')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Trip
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} currentUserId={user?.id || 0} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TripsPage;
