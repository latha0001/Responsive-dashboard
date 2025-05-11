import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Ship, Anchor } from 'lucide-react';
import { initializeLocalStorage } from '../../utils/localStorageUtils';

const LoginForm: React.FC = () => {
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  // Initialize localStorage with mock data
  React.useEffect(() => {
    initializeLocalStorage();
  }, []);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email) {
      setFormError('Email is required');
      return;
    }

    if (!password) {
      setFormError('Password is required');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  // Demo account information
  const demoAccounts = [
    { role: 'Admin', email: 'admin@entnt.in', password: 'admin123' },
    { role: 'Inspector', email: 'inspector@entnt.in', password: 'inspect123' },
    { role: 'Engineer', email: 'engineer@entnt.in', password: 'engine123' }
  ];

  const setDemoAccount = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-primary-600 to-secondary-500 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-2">
              <Ship className="h-12 w-12 text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome to ENTNT</h2>
            <p className="text-gray-600">Ship Maintenance Dashboard</p>
          </div>

          {(error || formError) && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error || formError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Accounts</h3>
          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <div key={account.role} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setDemoAccount(account.email, account.password)}
                  className="flex items-center text-xs text-gray-600 hover:text-primary-500 transition-colors"
                >
                  <Anchor className="h-3 w-3 mr-1" />
                  <span className="font-medium">{account.role}:</span>
                  <span className="ml-1">{account.email} / {account.password}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;