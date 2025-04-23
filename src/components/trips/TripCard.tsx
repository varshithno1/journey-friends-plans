
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, User, Users } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trip } from '@/context/TripContext';
import { format } from 'date-fns';
import { useUser } from '@/context/UserContext';

type TripCardProps = {
  trip: Trip;
  currentUserId: number;
};

const TripCard: React.FC<TripCardProps> = ({ trip, currentUserId }) => {
  const { getUserById } = useUser();
  const creator = getUserById(trip.userId);
  const isOwner = trip.userId === currentUserId;
  
  // Format dates
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  
  // Calculate trip duration
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow group">
      <Link to={`/trips/${trip.id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={trip.imageUrl} 
            alt={trip.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isOwner && (
            <Badge variant="secondary" className="absolute top-3 right-3">
              Your Trip
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="text-lg font-bold line-clamp-1">{trip.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{trip.description}</p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4 text-travel-teal" />
              {trip.destination}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4 text-travel-teal" />
              {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
              <span className="ml-1">({diffDays} days)</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center text-sm">
            <div className="flex -space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white ring-2 ring-background">
                {creator?.name.charAt(0)}
              </div>
              {trip.sharedWith.length > 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs ring-2 ring-background">
                  +{trip.sharedWith.length}
                </div>
              )}
            </div>
            <span className="ml-2 text-muted-foreground">
              {isOwner ? 'You created' : `${creator?.name} invited you`}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-1 h-4 w-4" />
            {trip.sharedWith.length + 1}
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default TripCard;
