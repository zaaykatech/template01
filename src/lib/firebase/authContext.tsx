'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './config';

export interface UserRole {
  role: string;
  restaurantId?: string; // Legacy single assignment
  restaurantIds?: string[]; // Modern multi-assignment
}

interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let roleUnsubscribe: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: any) => {
      setUser(firebaseUser);
      
      // Clean up previous role listener if any
      if (roleUnsubscribe) {
        roleUnsubscribe();
        roleUnsubscribe = undefined;
      }
      
      if (firebaseUser) {
        // Listen to the user document in real-time
        roleUnsubscribe = onSnapshot(
          doc(db, 'users', firebaseUser.uid), 
          (userDoc) => {
            if (userDoc.exists()) {
              setUserRole(userDoc.data() as UserRole);
            } else {
              setUserRole(null);
            }
            setLoading(false);
          }, 
          (error) => {
            console.error("Error fetching user role:", error);
            setUserRole(null);
            setLoading(false);
          }
        );
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (roleUnsubscribe) roleUnsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
