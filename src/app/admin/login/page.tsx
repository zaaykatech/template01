'use client';

import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/firebase/authContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const { user, userRole, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (userRole?.role === 'super_admin') {
        router.push('/admin/dashboard');
      } else if (userRole?.role === 'owner' && userRole?.restaurantIds?.length > 0) {
        router.push('/admin/dashboard');
      } else {
        // Redirect everyone else (new users, guests, owners without restaurants) to onboarding
        router.push('/admin/onboarding');
      }
    }
  }, [user, userRole, loading, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const userRef = doc(db, 'users', result.user.uid);
        await setDoc(userRef, {
          role: 'guest',
          restaurantIds: [],
          restaurantId: '',
          email: result.user.email
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // navigation happens in useEffect after role check
    } catch (err: any) {
      console.error(err);
      setError(err.message || (isSignUp ? 'Failed to sign up' : 'Failed to login'));
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Auto-register as owner for ease of development
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      const isZaayka = result.user.email === 'zaaykatech@gmail.com';

      if (!userSnap.exists()) {
        const assignedRole = isZaayka ? 'super_admin' : 'guest';
        await setDoc(userRef, {
          role: assignedRole,
          restaurantIds: [],
          restaurantId: '',
          email: result.user.email
        });
      } else if (isZaayka && userSnap.data().role !== 'super_admin') {
        await setDoc(userRef, { role: 'super_admin' }, { merge: true });
      }
      
      // The onAuthStateChanged listener will pick up the new role and the useEffect will redirect
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to login with Google');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-2">Cafe 9:50</h2>
        <p className="text-gray-500 text-center mb-8">Admin Dashboard Login</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? (isSignUp ? 'Signing up...' : 'Signing in...') : (isSignUp ? 'Sign Up with Email' : 'Sign In with Email')}
          </button>
          
          <p className="text-sm text-center text-gray-600 mt-4">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-black font-semibold hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <div className="w-full h-px bg-gray-200"></div>
          <span className="px-4 text-sm text-gray-500">or</span>
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="mt-6 w-full bg-white text-gray-700 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-3"
        >
          <iconify-icon icon="logos:google-icon" width="20"></iconify-icon>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
