"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import OldInput from '@/components/custom/OldInput'
import { IoMdEye , IoMdEyeOff } from "react-icons/io";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
 
  const from = '/dashboard'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user types
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('http://localhost/oldclubman-backend/api/client/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': "*"
        },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to login')
      }
      
      // On successful login
      if (data.success) {
        // Redirect to the appropriate page
        navigate(from, { replace: true })
      } else {
        setError(data.message || 'An unknown error occurred')
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2">OLD CLUB MAN</h1>
        <h2 className="text-2xl font-bold text-center mb-4">SIGN IN</h2>
        
        <p className="text-center mb-6">
          Don't have an account? <Link href="/auth/register" className="text-blue-500 hover:underline">Sign up here</Link>
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <OldInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full bg-slate-100"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-4 relative">
            <OldInput
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-slate-100"
              required
              disabled={isLoading}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2"
              disabled={isLoading}
            >
              {showPassword ? (
                <IoMdEyeOff size={20}/>
              ) : (
                <IoMdEye size={20}/>
              )}
            </button>
          </div>
          
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="mr-2"
                disabled={isLoading}
              />
              <span>Remember me</span>
            </label>
          </div>
          
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-[.4rem] rounded-md hover:bg-blue-600 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
          
          <div className="mt-4 text-center">
            <Link href="/auth/forgot-password" className="text-blue-500 hover:underline text-sm">
              Forgot your password?
            </Link>
          </div>
        </form>
        
        <div className="text-center mt-6 text-sm text-gray-600">
          ©2025 <span className="text-blue-500">OLD CLUB MAN</span>. All rights reserved
        </div>
      </div>
    </div>
  )
}

export default Login