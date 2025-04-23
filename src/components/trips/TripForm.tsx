
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTrip } from '@/context/TripContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const populateDestinations = [
  { value: 'Paris, France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&auto=format&fit=crop' },
  { value: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&auto=format&fit=crop' },
  { value: 'New York, USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&auto=format&fit=crop' },
  { value: 'Rome, Italy', image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&auto=format&fit=crop' },
  { value: 'London, UK', image: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&auto=format&fit=crop' },
  { value: 'Sydney, Australia', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&auto=format&fit=crop' },
];

const getDestinationImage = (destination: string) => {
  const dest = populateDestinations.find(d => d.value.toLowerCase() === destination.toLowerCase());
  return dest?.image || 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&auto=format&fit=crop';
};

const TripForm: React.FC = () => {
  const { user } = useAuth();
  const { createTrip, isLoading } = useTrip();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [errors, setErrors] = useState<{
    title?: string,
    description?: string,
    destination?: string,
    dates?: string
  }>({});

  const validateForm = () => {
    const newErrors: {
      title?: string,
      description?: string,
      destination?: string,
      dates?: string
    } = {};

    if (!title) {
      newErrors.title = 'Title is required';
    }

    if (!description) {
      newErrors.description = 'Description is required';
    }

    if (!destination) {
      newErrors.destination = 'Destination is required';
    }

    if (!startDate || !endDate) {
      newErrors.dates = 'Both start and end dates are required';
    } else if (endDate < startDate) {
      newErrors.dates = 'End date cannot be before start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user || !startDate || !endDate) {
      return;
    }

    const imageUrl = getDestinationImage(destination);

    const tripData = {
      title,
      description,
      destination,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      imageUrl,
      userId: user.id,
      sharedWith: [],
    };

    const trip = await createTrip(tripData);
    navigate(`/trips/${trip.id}`);
  };

  const handleDestinationSelect = (dest: string) => {
    setDestination(dest);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="title">Trip Title</Label>
        <Input
          id="title"
          placeholder="Summer in Paris"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Tell us about your trip..."
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          placeholder="Paris, France"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          disabled={isLoading}
          list="destinations"
        />
        <datalist id="destinations">
          {populateDestinations.map((dest) => (
            <option key={dest.value} value={dest.value} />
          ))}
        </datalist>
        {errors.destination && <p className="text-sm text-red-500">{errors.destination}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          {populateDestinations.map((dest) => (
            <Card
              key={dest.value}
              className={`overflow-hidden cursor-pointer transition-all ${
                destination === dest.value ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleDestinationSelect(dest.value)}
            >
              <img
                src={dest.image}
                alt={dest.value}
                className="h-24 w-full object-cover"
              />
              <CardContent className="p-2 text-center">
                <p className="text-xs font-medium">{dest.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Trip Dates</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate" className="text-sm text-muted-foreground">
              Start Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="endDate" className="text-sm text-muted-foreground">
              End Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) =>
                    (startDate ? date < startDate : false) || date < new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {errors.dates && <p className="text-sm text-red-500">{errors.dates}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Trip'}
        </Button>
      </div>
    </form>
  );
};

export default TripForm;
