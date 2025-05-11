import React from 'react';
import { Link } from 'react-router-dom';
import { LifeBuoy } from 'lucide-react';
import Button from '../components/UI/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary-100 p-3 rounded-full">
            <LifeBuoy className="h-12 w-12 text-primary-500" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <Link to="/dashboard">
            <Button variant="primary" size="lg">
              Back to Dashboard
            </Button>
          </Link>
          <Link to="/ships">
            <Button variant="outline" size="lg">
              View Ships
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;