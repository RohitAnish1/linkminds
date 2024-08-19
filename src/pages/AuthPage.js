// src/pages/AuthPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase'; // Assuming you have Firebase and Google Auth provider setup
import { signInWithPopup } from 'firebase/auth';

export const AuthPage = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      alert('Logged in successfully!');
      navigate('/survey'); // Redirect to the survey page after successful login
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
    </div>
  );
};
