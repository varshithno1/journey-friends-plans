
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Activity } from '@/context/TripContext';
import { Search, Filter, X } from 'lucide-react';

type TripFilterProps = {
  onFilter: (filters: { 
    destination?: string, 
    startDate?: string, 
    endDate?: string, 
    category?: Activity['category'] 
  }) => void;
};

const activityCategories: Activity['category'][] = [
  'Sightseeing', 
  'Food', 
  'Transportation', 
  'Accommodation', 
  'Other'
];

const TripFilter: React.FC<TripFilterProps> = ({ onFilter }) => {
  const [destination, setDestination] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [category, setCategory] = useState<Activity['category'] | ''>('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const clearFilters = () => {
    setDestination('');
    setStartDate('');
    setEndDate('');
    setCategory('');
    onFilter({});
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filters: {
      destination?: string;
      startDate?: string;
      endDate?: string;
      category?: Activity['category'];
    } = {};
    
    if (destination) filters.destination = destination;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (category) filters.category = category as Activity['category'];
    
    onFilter(filters);
    setIsFiltersOpen(false);
  };
  
  const hasActiveFilters = destination || startDate || endDate || category;
  
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search destinations..."
          className="pl-9"
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value);
            if (e.target.value === '') {
              onFilter({
                startDate,
                endDate,
                category: category as Activity['category'] || undefined
              });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(e);
            }
          }}
        />
        {destination && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => {
              setDestination('');
              onFilter({
                startDate,
                endDate,
                category: category as Activity['category'] || undefined
              });
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                !
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-medium">Filter Trips</h3>
            <div className="space-y-2">
              <Label htmlFor="dates">Dates</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="start-date" className="text-xs">From</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date" className="text-xs">To</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Activity Type</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as Activity['category'] | '')}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {activityCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between pt-2">
              <Button type="button" variant="ghost" onClick={clearFilters}>
                Clear filters
              </Button>
              <Button type="submit">Apply Filters</Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TripFilter;
