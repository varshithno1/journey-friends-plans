
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { API_URL } from '@/config/api';

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
    setIsLoading(true);
    try {
      // Real API call to register a user
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: password, // Laravel typically requires password confirmation
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle validation errors from the API
        if (data.errors) {
          Object.values(data.errors).forEach((errorArray: any) => {
            errorArray.forEach((error: string) => {
              toast.error(error);
            });
          });
        } else {
          toast.error(data.message || 'Registration failed');
        }
        return false;
      }
      
      toast.success('Registration successful! Please wait for admin validation.');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register. Please try again later.');
      return false;
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
