"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name?: string;
  username?: string;
  email: string;
  picture: string;
  bio?: string;
}

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch user data
    fetch('/api/user')
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) {
            // Not authenticated, redirect to login
            router.push('/login');
            throw new Error('Not authenticated');
          }
          throw new Error('Failed to fetch user data');
        }
        return res.json();
      })
      .then(data => {
        setUser(data);
        setBio(data.bio || '');
      })
      .catch(err => console.error('Error fetching user data:', err))
      .finally(() => setLoading(false));
  }, [router]);

  const handleBioSave = async () => {
    if (!user) return;

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio }),
      });

      if (!res.ok) {
        throw new Error('Failed to update bio');
      }

      // Update user state with new bio
      setUser(prev => prev ? { ...prev, bio } : null);
      setEditMode(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image too large. Please upload an image smaller than 5MB.');
      return;
    }

    // Prepare form data for upload
    const formData = new FormData();
    formData.append('profileImage', file);

    setImageUploading(true);
    setError('');

    try {
      const res = await fetch('/api/user/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await res.json();
      
      // Update user state with new profile picture
      setUser(prev => prev ? { ...prev, picture: data.imageUrl } : null);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
        <p>Unable to load user profile. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
              <img
                src={user.picture || '/default-avatar.png'}
                alt={`${user.username || user.name}'s profile`}
                className="object-cover w-full h-full"
              />
              <div 
                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="text-white text-sm font-medium">Change Photo</span>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
              disabled={imageUploading}
            />
            {imageUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-full">
                <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{user.username || user.name}</h1>
            <p className="text-gray-600 mb-2">{user.email}</p>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                {error}
              </div>
            )}
            
            {editMode ? (
              <div className="mt-4">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="input resize-none"
                  placeholder="Tell us about yourself..."
                  maxLength={500}
                ></textarea>
                <div className="text-xs text-gray-500 mb-3 text-right">
                  {bio.length}/500 characters
                </div>
                <div className="flex gap-3">
                  <button
                    className="btn btn-primary"
                    onClick={handleBioSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditMode(false);
                      setBio(user.bio || '');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h2 className="font-medium mb-2">Bio</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {user.bio || "You haven't added a bio yet. Tell us about yourself!"}
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Add more profile sections here as needed */}
    </div>
  );
};

export default Profile;
