"use client";

import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [user, setUser] = useState<{ name: string; email: string; picture: string } | null>(null);

  useEffect(() => {
    // Fetch user data (replace with actual API call)
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error('Error fetching user data:', err));
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <img src={user.picture} alt={`${user.name}'s profile`} style={{ borderRadius: '50%' }} />
      <p>Email: {user.email}</p>
    </div>
  );
};

export default Profile;
