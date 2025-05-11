import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserById, getSession, setSession, clearSession, getUserByEmail } from '../utils/localStorageUtils';
import { AuthState, User } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  });

  // Check for existing session on initial load
  useEffect(() => {
    checkAuth().finally(() => {
      setAuthState(prev => ({ ...prev, loading: false }));
    });
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    const session = getSession();
    if (!session) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
      return false;
    }

    const user = getUserById(session.userId);
    if (!user) {
      clearSession();
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: 'Session invalid'
      });
      return false;
    }

    setAuthState({
      isAuthenticated: true,
      user,
      loading: false,
      error: null
    });
    return true;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const user = getUserByEmail(email);

      if (!user || user.password !== password) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: 'Invalid email or password'
        });
        return false;
      }

      // Store session in localStorage
      setSession(user);

      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null
      });

      return true;
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: 'An error occurred during login'
      });
      return false;
    }
  };

  const logout = () => {
    clearSession();
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    });
  };

  const value = {
    ...authState,
    login,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};