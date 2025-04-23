
import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { CheckCircle, XCircle, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UserList: React.FC = () => {
  const { getUsers, validateUser, invalidateUser, isLoading } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  
  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    };
    
    fetchUsers();
  }, [getUsers]);
  
  const handleValidate = async (id: number) => {
    await validateUser(id);
    setUsers(users.map(user => 
      user.id === id ? { ...user, validated: true } : user
    ));
  };
  
  const handleInvalidate = async (id: number) => {
    await invalidateUser(id);
    setUsers(users.map(user => 
      user.id === id ? { ...user, validated: false } : user
    ));
  };
  
  const filteredUsers = activeTab === 'all' 
    ? users 
    : activeTab === 'pending' 
      ? users.filter(user => !user.validated) 
      : users.filter(user => user.validated);
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="validated">Validated</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <UserTable 
            users={filteredUsers} 
            onValidate={handleValidate} 
            onInvalidate={handleInvalidate} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="validated" className="space-y-4">
          <UserTable 
            users={filteredUsers} 
            onValidate={handleValidate} 
            onInvalidate={handleInvalidate} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <UserTable 
            users={filteredUsers} 
            onValidate={handleValidate} 
            onInvalidate={handleInvalidate} 
            isLoading={isLoading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface UserTableProps {
  users: User[];
  onValidate: (id: number) => void;
  onInvalidate: (id: number) => void;
  isLoading: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ users, onValidate, onInvalidate, isLoading }) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize bg-gray-100">
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  {user.validated ? (
                    <span className="inline-flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Validated
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-amber-600">
                      <XCircle className="h-4 w-4 mr-1" />
                      Pending
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {user.validated ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onInvalidate(user.id)}
                      disabled={isLoading || user.role === 'admin'}
                      className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Invalidate
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onValidate(user.id)}
                      disabled={isLoading}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Validate
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserList;
