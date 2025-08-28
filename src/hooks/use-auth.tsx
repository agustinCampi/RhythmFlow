"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in, get their custom data from Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data() as Omit<User, 'id'>;
          setUser({ id: firebaseUser.uid, ...userData });
        } else {
          // This case might happen if a user is created in Auth but not in Firestore
          // Or you might want to create a default profile here
           setUser({ id: firebaseUser.uid, email: firebaseUser.email!, fullName: firebaseUser.displayName || 'New User', role: 'student' });
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // The onAuthStateChanged listener will handle setting the user state
      // We can return the user from there if needed, but for now, the state change will trigger UI updates
      // To get the user data immediately after login, we can fetch it here as well
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data() as Omit<User, 'id'>;
          const loggedInUser = { id: firebaseUser.uid, ...userData };
          setUser(loggedInUser);
          setLoading(false);
          return loggedInUser;
        }
      }
      return null;
    } catch (error) {
      console.error("Error logging in:", error);
      setLoading(false);
      return null;
    }
  };

  const register = async (fullName: string, email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;

      // Now, create the user profile in Firestore
      const newUser: User = {
        id: firebaseUser.uid,
        fullName,
        email,
        role: 'student' // Default role
      };

      await setDoc(doc(db, "users", firebaseUser.uid), {
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role
      });

      setUser(newUser);
      setLoading(false);
      return newUser;
    } catch (error) {
      console.error("Error registering:", error);
      setLoading(false);
      return null;
    }
  };

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setLoading(false);
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
