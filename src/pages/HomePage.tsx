
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { Calendar, Compass, Share2, Filter, MapPin, Users } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="hero-pattern relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-0"></div>
        <div className="container px-4 py-16 md:py-24 lg:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-6">
              Plan Your Perfect Trip Together
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-600">
              Create, share, and collaborate on travel plans with friends and family.
              Make your group travel experience seamless and enjoyable.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-travel-teal hover:bg-travel-teal/90 text-white">
                <Link to="/trips/new">Start Planning</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/trips">Browse Trips</Link>
              </Button>
            </div>
            
            <div className="mt-12 relative">
              <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-travel-blue/20 animate-float delay-100"></div>
              <div className="absolute -bottom-8 -right-10 w-20 h-20 rounded-full bg-travel-coral/20 animate-float delay-300"></div>
              
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop"
                alt="People traveling"
                className="rounded-xl shadow-lg mx-auto"
              />
              
              <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-travel-coral" />
                <span className="font-medium">60+ Popular Destinations</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Plan Better Trips Together</h2>
            <p className="text-gray-600">
              Our platform makes it easy for groups to coordinate travel plans, ensuring everyone's preferences are considered.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-travel-teal/20 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-travel-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaborative Planning</h3>
              <p className="text-gray-600">
                Create detailed itineraries and share them with your travel companions for input and suggestions.
              </p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-travel-blue/20 rounded-lg flex items-center justify-center mb-4">
                <Compass className="h-6 w-6 text-travel-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Destination Discovery</h3>
              <p className="text-gray-600">
                Explore popular destinations and get inspiration for your next adventure with friends and family.
              </p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-travel-coral/20 rounded-lg flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-travel-coral" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Sharing</h3>
              <p className="text-gray-600">
                Invite friends to view and edit your travel plans with simple sharing options.
              </p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
                <Filter className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Filters</h3>
              <p className="text-gray-600">
                Filter travel options by destination, dates, and activities to find the perfect match for your group.
              </p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Activity Planning</h3>
              <p className="text-gray-600">
                Add activities, restaurants, and points of interest to your trip for a comprehensive itinerary.
              </p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Admin Validation</h3>
              <p className="text-gray-600">
                Administrators validate users to ensure a trusted community of travelers.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-travel-navy text-white py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Next Adventure?</h2>
            <p className="text-xl mb-8 text-gray-300">
              Join our community of travelers and start creating memorable trips with your friends and family.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-travel-teal hover:bg-travel-teal/90 text-white">
                <Link to="/register">Sign Up for Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="bg-white py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-600">
              Hear from travelers who have used our platform to plan their group trips.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "This platform made planning our family reunion trip so much easier! Everyone could contribute ideas and see the plan come together."
              </p>
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-travel-blue/10 text-travel-blue font-bold">
                  JD
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold">Jane Doe</h4>
                  <p className="text-xs text-gray-500">Family Trip to Paris</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "We used Journey to plan our bachelor party trip and it was a game-changer. Everyone could see the itinerary and add their preferred activities."
              </p>
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-travel-coral/10 text-travel-coral font-bold">
                  MS
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold">Mike Smith</h4>
                  <p className="text-xs text-gray-500">Friends Trip to Tokyo</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(4)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <p className="text-gray-600 mb-4">
                "As someone who plans trips for groups often, this platform has made the process so much more efficient and collaborative."
              </p>
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-travel-teal/10 text-travel-teal font-bold">
                  AJ
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold">Alex Johnson</h4>
                  <p className="text-xs text-gray-500">Group Trip to Rome</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
