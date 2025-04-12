"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface User {
  name: string;
  email: string;
  picture: string;
  bio?: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [featuredUsers, setFeaturedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current user if logged in
    fetch('/api/user')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not authenticated');
      })
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    // Fetch some featured users to display on the landing page
    fetch('/api/users/featured')
      .then(res => res.json())
      .then(data => setFeaturedUsers(data))
      .catch(err => console.error('Error fetching featured users:', err));
  }, []);

  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
          Welcome to MyProfile
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Create, share, and connect with profiles that represent the real you
        </p>

        {!loading && !user && (
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link href="/signup" className="btn btn-primary text-lg px-8 py-3">
              Create Your Profile
            </Link>
            <Link href="/login" className="btn btn-secondary text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        )}
      </section>

      {/* User Welcome Section - Only shown if logged in */}
      {user && (
        <section className="card max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img 
                src={user.picture || '/default-avatar.png'}
                alt={`${user.name}'s profile picture`}
                className="object-cover h-full w-full"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
              <p className="text-gray-600 mb-4">{user.bio || "You haven't set up your bio yet. Tell the world about yourself!"}</p>
              <Link href="/profile" className="btn btn-primary inline-block">
                Update Your Profile
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Profiles Section */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Featured Profiles</h2>
        
        {featuredUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredUsers.map((featuredUser, index) => (
              <div key={index} className="card flex flex-col items-center p-6 hover:shadow-lg transition-shadow">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  <img
                    src={featuredUser.picture || '/default-avatar.png'} 
                    alt={`${featuredUser.name}'s profile`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{featuredUser.name}</h3>
                <p className="text-gray-600 text-center mb-4 line-clamp-3">
                  {featuredUser.bio || "This user hasn't added a bio yet."}
                </p>
                <Link href={`/profile/${encodeURIComponent(featuredUser.email)}`} className="text-blue-600 hover:underline mt-auto">
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No featured profiles available at the moment.</p>
        )}
      </section>

      {/* Feature Highlights Section */}
      <section className="py-8 bg-gray-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-8 text-center">Why Create a Profile?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Express Yourself</h3>
            <p className="text-gray-600">Create a profile that truly represents who you are and what matters to you.</p>
          </div>
          
          <div className="card text-center">
            <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect with Others</h3>
            <p className="text-gray-600">Share your interests and find others who share your passions and values.</p>
          </div>
          
          <div className="card text-center">
            <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">Control who sees your information with our secure authentication system.</p>
          </div>
        </div>
      </section>
    </div>
  );
}