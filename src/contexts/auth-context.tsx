
'use client';

import type { User } from '@/types';
import { useRouter, usePathname } from 'next/navigation'; // Added usePathname
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('linkedup-auth');
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        if (parsedAuth.isAuthenticated && parsedAuth.user) {
          setUser(parsedAuth.user);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error("Error loading auth from localStorage:", error);
      localStorage.removeItem('linkedup-auth');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    const mockUser: User = { email, name: email.split('@')[0] || 'User' };
    setUser(mockUser);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('linkedup-auth', JSON.stringify({ isAuthenticated: true, user: mockUser }));
    } catch (error) {
      console.error("Error saving auth to localStorage:", error);
    }
    router.push('/');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('linkedup-auth');
    } catch (error) {
      console.error("Error removing auth from localStorage:", error);
    }
    // Only redirect to /login if not already on a public page or login page itself
    if (pathname !== '/login') { // Check current path
        router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
