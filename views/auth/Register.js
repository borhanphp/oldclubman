"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import OldInput from '@/components/custom/OldInput'
import OldSelect from '@/components/custom/OldSelect'
import { IoMdEye, IoMdEyeOff } from "react-icons/io"
import api from '@/helpers/axios'
import { handleLoginFunc } from './store'
import { useDispatch } from 'react-redux'

const Register = () => {
  const router = useRouter()
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fname: '',
    last_name: '',
    contact_or_email: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    password: '',
    password_confirmation: '',
    keepSignedIn: false
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Generate options for days (1-31)
  const dayOptions = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1).padStart(2),
    label: String(i + 1).padStart(2)
  }))

  // Generate options for months
  const monthOptions = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ]

  // Generate options for years (1900-2050)
  const yearOptions = Array.from({ length: 151 }, (_, i) => ({
    value: String(1900 + i),
    label: String(1900 + i)
  }))

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    if (name === 'password') {
      calculatePasswordStrength(value)
    }
  }

  const calculatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(0)
      return
    }
    
    let strength = 0
    
    // Length check
    if (password.length >= 8) strength += 1
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1
    
    // Contains number
    if (/[0-9]/.test(password)) strength += 1
    
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    
    setPasswordStrength(strength)
  }

  const getStrengthLabel = () => {
    if (passwordStrength <= 1) return "That is a simple one"
    if (passwordStrength <= 3) return "Getting better"
    return "Strong password"
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Format the data for the API
      const formattedData = {
        ...formData,
        birthMonth: formData.birthMonth
      }

      const response = await api.post('/client/regi', formattedData)
      
      // Store token if keepSignedIn is true
      if (formData.keepSignedIn && response.data.token) {
        localStorage.setItem('token', response.data.token)
      }

      console.log('response',response)
      // Redirect to login or dashboard

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
      dispatch(handleLoginFunc({username: formData.contact_or_email, password: formData.password}));
      router.push('/user/gathering');

    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50">
       <div className="w-30 h-30 rounded-full overflow-hidden flex items-center justify-center mr-2">
            <img src="/oldman-logo.png" className='w-full'/>
          </div>
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
    <h2 className="text-center text-2xl font-bold">Create a new account</h2>
        <p className="text-center mb-6">
          Already have an account? <Link href="/auth/login" className="text-blue-500 hover:underline">Sign in here</Link>
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <OldInput
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              placeholder="Your First Name"
              required
            />
            <OldInput
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Your Last Name"
              required
            />
          </div>
          
          <div className="mb-4">
            <OldInput
              type="email"
              name="contact_or_email"
              className='w-full'
              value={formData.contact_or_email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          
          <div className="mb-2">
            <label className="block text-sm mb-1">Birthday</label>
            <div className="grid grid-cols-3 gap-4">
            <OldSelect
                name="birthMonth"
                value={formData.birthMonth}
                onChange={handleChange}
                placeholder="Month"
                options={monthOptions}
                required
              />
              
              <OldSelect
                name="birthDay"
                value={formData.birthDay}
                onChange={handleChange}
                placeholder="Day"
                options={dayOptions}
                required
              />
             
              <OldSelect
                name="birthYear"
                value={formData.birthYear}
                onChange={handleChange}
                placeholder="Year"
                options={yearOptions}
                required
              />
            </div>
          </div>
          
          <div className="mb-2 relative">
            <OldInput
              type={showPassword ? "text" : "password"}
              name="password"
              className='w-full'
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <IoMdEyeOff size={20}/>
              ) : (
                <IoMdEye size={20}/>
              )}
            </button>
          </div>
          
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  passwordStrength <= 1 ? 'bg-yellow-500' : 
                  passwordStrength <= 3 ? 'bg-blue-500' : 'bg-green-500'
                }`}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1 flex">
              <span>{getStrengthLabel()}</span>
              {passwordStrength >= 3 && (
                <span className="ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-blue-500" viewBox="0 0 16 16">
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                  </svg>
                </span>
              )}
            </p>
          </div>
          
          <div className="mb-4">
            <OldInput
              type="password"
              name="password_confirmation"
              className='w-full'
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="flex items-center ">
              <input
                type="checkbox"
                name="keepSignedIn"
                checked={formData.keepSignedIn}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Keep me signed in</span>
            </label>
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-10 bg-green-600 text-white py-[.4rem] font-semibold rounded-md hover:bg-blue-600 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
                        >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </div>
          </form>
        
        <div className="text-center mt-6 text-sm text-gray-600">
          ©2025 <span className="text-blue-500">OLD CLUB MAN</span>. All rights reserved
        </div>
      </div>
    </div>
  )
}

export default Register