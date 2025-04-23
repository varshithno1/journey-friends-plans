
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  LogOut, 
  PlusCircle, 
  Map, 
  User, 
  UserCheck, 
  Settings, 
  Home, 
  Menu, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const routes = [
    { path: '/', label: 'Home', icon: <Home className="mr-2 h-4 w-4" /> },
    { path: '/trips', label: 'My Trips', icon: <Map className="mr-2 h-4 w-4" /> },
    { path: '/trips/new', label: 'Create Trip', icon: <PlusCircle className="mr-2 h-4 w-4" /> },
    ...(user?.role === 'admin' ? [
      { path: '/admin', label: 'Admin Dashboard', icon: <UserCheck className="mr-2 h-4 w-4" /> }
    ] : []),
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop Navigation */}
      {!isMobile && (
        <header className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Link to="/" className="flex items-center gap-2">
                  <Map className="h-6 w-6 text-travel-teal" />
                  <span className="text-xl font-bold text-gray-900">Journey</span>
                </Link>
                <nav className="hidden md:flex items-center space-x-1 ml-10">
                  {routes.map((route) => (
                    <Link 
                      key={route.path} 
                      to={route.path} 
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                        isActive(route.path) 
                          ? 'bg-travel-teal/10 text-travel-teal' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {route.icon}
                      {route.label}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex items-center gap-4">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <User className="h-5 w-5" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => navigate('/login')}>
                      Log in
                    </Button>
                    <Button onClick={() => navigate('/register')}>
                      Sign up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      )}
      
      {/* Mobile Navigation */}
      {isMobile && (
        <header className="bg-white border-b shadow-sm fixed top-0 left-0 right-0 z-10">
          <div className="flex h-16 items-center justify-between px-4">
            <Link to="/" className="flex items-center gap-2">
              <Map className="h-6 w-6 text-travel-teal" />
              <span className="text-xl font-bold text-gray-900">Journey</span>
            </Link>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                      <Map className="h-6 w-6 text-travel-teal" />
                      <span className="text-xl font-bold text-gray-900">Journey</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <nav className="flex flex-col space-y-1 mt-6">
                    {routes.map((route) => (
                      <Link
                        key={route.path}
                        to={route.path}
                        onClick={() => setIsOpen(false)}
                        className={`px-3 py-3 rounded-md text-sm font-medium transition-colors flex items-center ${
                          isActive(route.path)
                            ? 'bg-travel-teal/10 text-travel-teal'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {route.icon}
                        {route.label}
                      </Link>
                    ))}
                  </nav>
                  
                  <div className="mt-auto pb-8">
                    {user ? (
                      <div className="space-y-3">
                        <div className="px-3 py-2">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/profile');
                          }}
                          className="w-full justify-start"
                        >
                          <Settings className="mr-2 h-4 w-4" /> Profile
                        </Button>
                        <Button 
                          variant="ghost" 
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="mr-2 h-4 w-4" /> Log out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2 px-3">
                        <Button 
                          className="w-full" 
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/login');
                          }}
                        >
                          Log in
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/register');
                          }}
                        >
                          Sign up
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>
      )}
      
      {/* Main Content */}
      <main className={`flex-1 ${isMobile ? 'pt-16' : ''}`}>{children}</main>
      
      {/* Footer */}
      <footer className="bg-travel-navy text-white py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Map className="h-6 w-6 text-travel-teal" />
                <span className="text-lg font-bold">Journey</span>
              </div>
              <p className="text-sm text-gray-300">
                Plan your perfect trips with friends and family. Create, share, and explore together.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white text-sm">Home</Link></li>
                <li><Link to="/trips" className="text-gray-300 hover:text-white text-sm">My Trips</Link></li>
                <li><Link to="/trips/new" className="text-gray-300 hover:text-white text-sm">Create Trip</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-300 hover:text-white text-sm">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-300 hover:text-white text-sm">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center text-gray-400">
            &copy; {new Date().getFullYear()} Journey. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
