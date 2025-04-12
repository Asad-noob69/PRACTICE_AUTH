"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

const NavBar = () => {
  const [user, setUser] = useState<{ name: string; email: string; picture: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch user data when component mounts
    fetch('/api/user')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not authenticated');
      })
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">MyProfile</span>
            </Link>
          </div>
          
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link href="/" className="px-3 py-2 text-gray-700 hover:text-blue-600">
              Home
            </Link>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="relative ml-3">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center"
                >
                  <span className="mr-2 text-sm font-medium text-gray-700">{user.name}</span>
                  <img 
                    className="h-8 w-8 rounded-full" 
                    src={user.picture || '/default-avatar.png'} 
                    alt={`${user.name}'s profile`} 
                  />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-1 bg-white rounded-md shadow-lg z-10">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </Link>
                    <button 
                      onClick={() => fetch('/api/auth/logout', { method: 'POST' }).then(() => window.location.href = '/')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="btn btn-secondary">
                  Sign in
                </Link>
                <Link href="/signup" className="btn btn-primary">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;