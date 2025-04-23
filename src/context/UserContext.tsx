
import React, { createContext, useContext, useState } from 'react';
import { User } from './AuthContext';
import { toast } from 'sonner';

// Mock users for demo
const mockUsers: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', validated: true },
  { id: 2, name: 'Regular User', email: 'user@example.com', role: 'user', validated: true },
  { id: 3, name: 'Pending User', email: 'pending@example.com', role: 'user', validated: false },
  { id: 4, name: 'John Doe', email: 'john@example.com', role: 'user', validated: true },
  { id: 5, name: 'Jane Smith', email: 'jane@example.com', role: 'user', validated: true },
  { id: 6, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', validated: false },
];

type UserContextType = {
  users: User[];
  isLoading: boolean;
  getUsers: () => Promise<User[]>;
  getUserById: (id: number) => User | undefined;
  getPendingUsers: () => Promise<User[]>;
  validateUser: (id: number) => Promise<boolean>;
  invalidateUser: (id: number) => Promise<boolean>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getUsers = async (): Promise<User[]> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      return users;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserById = (id: number): User | undefined => {
    return users.find(user => user.id === id);
  };

  const getPendingUsers = async (): Promise<User[]> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      return users.filter(user => !user.validated);
    } finally {
      setIsLoading(false);
    }
  };

  const validateUser = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUsers(prevUsers => prevUsers.map(user => {
        if (user.id === id) {
          return { ...user, validated: true };
        }
        return user;
      }));
      
      toast.success("User validated successfully");
      return true;
    } catch (error) {
      toast.error("Failed to validate user");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const invalidateUser = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUsers(prevUsers => prevUsers.map(user => {
        if (user.id === id) {
          return { ...user, validated: false };
        }
        return user;
      }));
      
      toast.success("User invalidated successfully");
      return true;
    } catch (error) {
      toast.error("Failed to invalidate user");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ 
      users,
      isLoading,
      getUsers,
      getUserById,
      getPendingUsers,
      validateUser,
      invalidateUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
