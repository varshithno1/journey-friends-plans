
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import RegisterForm from '@/components/auth/RegisterForm';
import { Map } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/trips" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Map className="h-12 w-12 text-travel-teal" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your Journey account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Start planning trips with friends and family
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <RegisterForm />
        <div className="mt-4 px-4 py-3 bg-blue-50 border border-blue-100 rounded-md">
          <p className="text-sm text-blue-700">
            After registering, your account will be pending until an administrator validates it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
