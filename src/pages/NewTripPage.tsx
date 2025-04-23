
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import TripForm from '@/components/trips/TripForm';

const NewTripPage: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect if user is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <MainLayout>
      <div className="container px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Create New Trip</h1>
        <p className="text-muted-foreground mb-8">
          Start planning your next adventure. Fill in the details below to create your trip.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <TripForm />
        </div>
      </div>
    </MainLayout>
  );
};

export default NewTripPage;
