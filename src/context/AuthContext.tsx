
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type User = {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  validated: boolean;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', validated: true },
  { id: 2, name: 'Regular User', email: 'user@example.com', role: 'user', validated: true },
  { id: 3, name: 'Pending User', email: 'pending@example.com', role: 'user', validated: false },
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check local storage for saved user
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // This would be an API call in a real app
    setIsLoading(true);
    try {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser) {
        if (!foundUser.validated) {
          toast.error('Your account is pending validation by an administrator.');
          setIsLoading(false);
          return false;
        }
        
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        toast.success('Logged in successfully!');
        return true;
      } else {
        toast.error('Invalid email or password');
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // This would be an API call in a real app
    setIsLoading(true);
    try {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        toast.error('User with this email already exists');
        return false;
      }
      
      const newUser: User = {
        id: mockUsers.length + 1,
        name,
        email,
        role: 'user',
        validated: false,
      };
      
      // In a real app, we would save to database
      mockUsers.push(newUser);
      
      toast.success('Registration successful! Please wait for admin validation.');
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
