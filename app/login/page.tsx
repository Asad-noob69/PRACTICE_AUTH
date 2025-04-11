"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();

  const handleGithubLogin = () => {
    window.location.href = '/api/auth/login';
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const handleViewProfile = () => {
    router.push('/profile');
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleGithubLogin}>Login with GitHub</button>
      <button onClick={handleGoogleLogin}>Login with Google</button>
      <button onClick={handleViewProfile}>View Profile</button>
    </div>
  );
};

export default Login;