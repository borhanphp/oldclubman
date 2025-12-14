"use client";

import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordChange = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    
    // Check password strength
    const hasLowercase = /[a-z]/.test(value);
    const hasUppercase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isLongEnough = value.length >= 8;
    
    let strength = 0;
    if (hasLowercase) strength++;
    if (hasUppercase) strength++;
    if (hasNumber) strength++;
    if (hasSpecialChar) strength++;
    if (isLongEnough) strength++;
    
    setPasswordStrength(strength);
    
    // Set message based on strength
    if (value === '') {
      setPasswordMessage('');
    } else if (strength < 3) {
      setPasswordMessage('Weak password');
    } else if (strength < 5) {
      setPasswordMessage('Moderate password');
    } else {
      setPasswordMessage('Strong password');
    }

    // Check if passwords match whenever new password changes
    if (confirmPassword) {
      setPasswordsMatch(value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordsMatch(newPassword === value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    
    if (!passwordsMatch) {
      alert('New password and confirm password do not match');
      return;
    }
    
    // Here you would typically make an API call to update the password
    alert('Password updated successfully!');
    
    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordStrength(0);
    setPasswordMessage('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-8">Change your password</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-600 mb-2">
            Current password
          </label>
          <input
            type="password"
            id="currentPassword"
            className="w-full h-11 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600 mb-2">
            New password
          </label>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              id="newPassword"
              className="w-full h-11 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter new password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
            <button 
              type="button" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {passwordMessage && newPassword && (
            <div className="text-sm mt-1 text-gray-600">
              Write your password...
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-2">
            Confirm password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className={`w-full h-11 border ${!passwordsMatch && confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
          {!passwordsMatch && confirmPassword && (
            <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
          )}
        </div>
        
        <div className="flex justify-end mt-8">
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-6 py-2.5 rounded-md hover:bg-blue-600 transition"
          >
            Update password
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChange;
