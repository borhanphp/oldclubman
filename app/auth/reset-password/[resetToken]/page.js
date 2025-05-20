"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/helpers/axios';

const ResetPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const params = useParams()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!email) return setError('Email is required');
    if (!password) return setError('Password is required');
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (password.length < 8) return setError('Password must be at least 8 characters');

    setLoading(true);
    
    try {
      const response = await axios.post(`/client/reset-password/${params?.resetToken}`, {
        email,
        password,
        password_confirmation: confirmPassword
      });
      
      if (response.data.success) {
        setSuccess('Password reset instructions have been sent to your email.');
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setError(response.data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600 mb-6">Enter the email address associated with account.</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Enter Confirm Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md transition duration-200"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 