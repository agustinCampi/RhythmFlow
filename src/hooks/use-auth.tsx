"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<User | null>;
  register: (fullName: string, email: string, pass: string) => Promise<User | null>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const mockUsers: User[] = [
  { id: '1', fullName: 'Alice Johnson', email: 'student@test.com', role: 'student' },
  { id: '3', fullName: 'Charlie Brown', email: 'admin@test.com', role: 'admin' },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Persist user login state
    const storedUser = localStorage.getItem('rhythmflow-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('rhythmflow-user', JSON.stringify(foundUser));
      setLoading(false);
      return foundUser;
    }
    setLoading(false);
    return null;
  };

  const register = async (fullName: string, email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: User = { id: Date.now().toString(), fullName, email, role: 'student' };
    mockUsers.push(newUser); // Add to our mock DB
    setUser(newUser);
    localStorage.setItem('rhythmflow-user', JSON.stringify(newUser));
    setLoading(false);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rhythmflow-user');
    router.push('/login');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
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
