
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Activity } from '@/context/TripContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, Clock, MapPin, DollarSign } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTrip } from '@/context/TripContext';

const categoryColors = {
  Sightseeing: 'bg-blue-100 text-blue-700',
  Food: 'bg-green-100 text-green-700',
  Transportation: 'bg-violet-100 text-violet-700',
  Accommodation: 'bg-yellow-100 text-yellow-700',
  Other: 'bg-gray-100 text-gray-700',
};

const categoryIcons = {
  Sightseeing: '🏛️',
  Food: '🍽️',
  Transportation: '🚌',
  Accommodation: '🏨',
  Other: '📌',
};

interface ActivityItemProps {
  activity: Activity;
  isOwner: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, isOwner }) => {
  const { updateActivity, deleteActivity, isLoading } = useTrip();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: activity.title,
    description: activity.description,
    location: activity.location,
    startTime: activity.startTime,
    endTime: activity.endTime,
    cost: activity.cost || 0,
    category: activity.category,
  });

  const handleSave = async () => {
    await updateActivity(activity.id, editData);
    setIsEditDialogOpen(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      await deleteActivity(activity.id);
    }
  };

  return (
    <Card className="relative mb-4 overflow-hidden border-l-4" style={{ borderLeftColor: activity.category === 'Sightseeing' ? '#60a5fa' : activity.category === 'Food' ? '#34d399' : activity.category === 'Transportation' ? '#a78bfa' : activity.category === 'Accommodation' ? '#fbbf24' : '#9ca3af' }}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">{categoryIcons[activity.category]}</span>
              <h3 className="text-lg font-semibold">{activity.title}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                {activity.description && (
                  <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                )}
                {activity.location && (
                  <div className="flex items-center text-gray-600 text-sm mt-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{activity.location}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-start justify-start">
                <div className="flex items-center text-gray-600 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{activity.startTime} - {activity.endTime}</span>
                </div>
                
                {activity.cost !== undefined && (
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>${activity.cost.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${categoryColors[activity.category]}`}>
                    {activity.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {isOwner && (
            <div className="flex space-x-2">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Activity</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input 
                        id="title" 
                        value={editData.title} 
                        onChange={(e) => setEditData({...editData, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        value={editData.description} 
                        onChange={(e) => setEditData({...editData, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        value={editData.location} 
                        onChange={(e) => setEditData({...editData, location: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input 
                          id="startTime" 
                          type="time" 
                          value={editData.startTime} 
                          onChange={(e) => setEditData({...editData, startTime: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime">End Time</Label>
                        <Input 
                          id="endTime" 
                          type="time" 
                          value={editData.endTime} 
                          onChange={(e) => setEditData({...editData, endTime: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cost">Cost</Label>
                        <Input 
                          id="cost" 
                          type="number" 
                          value={editData.cost} 
                          onChange={(e) => setEditData({...editData, cost: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          value={editData.category}
                          onValueChange={(value) => setEditData({...editData, category: value as Activity['category']})}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
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
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isLoading}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityItem;
