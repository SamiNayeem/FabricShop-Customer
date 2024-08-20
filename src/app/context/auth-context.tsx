"use client";
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Preloader from '@/components/preloader/preloader';

interface AuthState {
  isAuthenticated: boolean;
  user: { username: string; userid: number; image?: string } | null;
}

interface AuthContextProps {
  authState: AuthState;
  login: (user: { username: string; userid: number; image?: string }) => void;
  logout: () => void;
}

const defaultAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const router = useRouter();

  // Load auth state from localStorage when the component mounts
  useEffect(() => {
    const storedAuthState = localStorage.getItem('authState');
    if (storedAuthState) {
      const parsedAuthState = JSON.parse(storedAuthState);
      console.log('Loaded authState from localStorage:', parsedAuthState);
      setAuthState(parsedAuthState);
    }
    setIsInitialized(true); // Mark as initialized
  }, []);
  

  const login = (user: { username: string; userid: number; image?: string }) => {
    console.log('User logging in:', user); // Check what is being passed
    const newAuthState = {
      isAuthenticated: true,
      user: {
        ...user,
        image: user.image || '../images/default_user.png', // Ensure a default image is set if undefined
      },
    };
    console.log('New authState:', newAuthState); // Check the authState after assignment
    setAuthState(newAuthState);
    localStorage.setItem('authState', JSON.stringify(newAuthState)); // Save to localStorage
    router.push('/dashboard'); // Redirect to dashboard after login
  };
  
  const logout = () => {
    setAuthState(defaultAuthState);
    localStorage.removeItem('authState'); // Remove from localStorage
    router.push('/login'); // Redirect to login after logout
  };

  if (!isInitialized) {
    // Optionally, you can return a loading indicator while the auth state is being initialized
    return <div><Preloader/></div>;
  }

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
