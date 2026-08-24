import React from 'react';
import { AuthProvider } from '@/lib/firebase/authContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
