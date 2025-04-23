
import React, { useState } from 'react';
import { useTrip, Activity } from '@/context/TripContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface AddActivityFormProps {
  tripId: number;
  day: number;
  onActivityAdded?: () => void;
}

const AddActivityForm: React.FC<AddActivityFormProps> = ({ tripId, day, onActivityAdded }) => {
  const { addActivity, isLoading } = useTrip();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('');
  const [cost, setCost] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<Activity['category']>('Sightseeing');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast.error('Title is required');
      return;
    }
    
    const activityData = {
      day,
      title,
      description,
      startTime,
      endTime,
      location,
      cost,
      category,
    };
    
    await addActivity(tripId, activityData);
    
    // Reset form
    setTitle('');
    setDescription('');
    setStartTime('09:00');
    setEndTime('10:00');
    setLocation('');
    setCost(undefined);
    setCategory('Sightseeing');
    
    if (onActivityAdded) {
      onActivityAdded();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-md p-4">
      <h3 className="text-lg font-medium">Add New Activity</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Visit Eiffel Tower"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Address or place name"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Additional details about this activity..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cost">Cost ($)</Label>
          <Input
            id="cost"
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={cost === undefined ? '' : cost}
            onChange={(e) => setCost(e.target.value ? parseFloat(e.target.value) : undefined)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value as Activity['category'])}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sightseeing">Sightseeing</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Transportation">Transportation</SelectItem>
              <SelectItem value="Accommodation">Accommodation</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Activity'}
        </Button>
      </div>
    </form>
  );
};

export default AddActivityForm;
