'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/firebase/authContext';
import { Store, Link as LinkIcon, Loader2 } from 'lucide-react';

export default function OnboardingPage() {
  const [restaurantName, setRestaurantName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, userRole, loading } = useAuth();

  // If already an owner with a restaurant, bounce to dashboard
  useEffect(() => {
    if (!loading && userRole) {
      if (userRole.role === 'super_admin' || (userRole.role === 'owner' && userRole.restaurantIds?.length > 0)) {
        router.push('/admin/dashboard');
      }
    }
  }, [loading, userRole, router]);

  // Auto-generate slug from name
  useEffect(() => {
    if (restaurantName) {
      const generated = restaurantName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    } else {
      setSlug('');
    }
  }, [restaurantName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setError('');
    setIsSubmitting(true);

    try {
      const finalSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (!finalSlug) {
        throw new Error('Please enter a valid link name.');
      }

      // Check if slug is taken
      const restaurantRef = doc(db, 'restaurants', finalSlug);
      const snap = await getDoc(restaurantRef);
      if (snap.exists()) {
        throw new Error('This link is already taken. Please choose another one.');
      }

      // 1. Update the user document to make them an owner
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        role: 'owner',
        restaurantIds: arrayUnion(finalSlug),
        restaurantId: finalSlug // Legacy support
      }, { merge: true });

      // 2. Create the restaurant document (now that we have permissions)
      await setDoc(restaurantRef, {
        name: restaurantName,
        slug: finalSlug,
        isPublished: false,
        createdAt: new Date().toISOString(),
        ownerId: user.uid,
        theme: 'light',
        font: 'inter'
      });

      // 3. Force reload or redirect
      // We'll use window.location.href to force the auth context to re-fetch the new role
      window.location.href = '/admin/dashboard';
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create restaurant.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-black text-white flex items-center justify-center rounded-xl mb-4">
            <Store size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create your restaurant</h2>
          <p className="text-gray-500 mt-2 text-sm">Let's set up your menu. You can change these details later.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Restaurant Name
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-gray-900"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="e.g. Cafe 9:50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Menu Link
            </label>
            <div className="flex rounded-lg shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                <LinkIcon size={14} className="mr-1" /> /menu/
              </span>
              <input
                type="text"
                required
                className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-gray-900 sm:text-sm"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="cafe-950"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-500">
              This is the URL where customers will view your menu.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !restaurantName || !slug}
            className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Creating...
              </>
            ) : (
              'Create Restaurant'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
