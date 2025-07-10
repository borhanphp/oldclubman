"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import OldInput from '@/components/custom/OldInput'
import { IoMdEye , IoMdEyeOff } from "react-icons/io";
import api from '@/app/helpers/axios';
import { setLocal } from '@/utility';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { handleLoginFunc } from './store';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
  const {loading} = useSelector(({auth}) => auth);

  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
 
  const from = '/dashboard'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
      if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(handleLoginFunc(formData));
  }

  return (
    <>
  
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50">
    <div className="w-30 h-30 rounded-full overflow-hidden flex items-center justify-center mr-2">
            <img src="/logo.jpg" className='w-full'/>
          </div>
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
        {/* <h1 className="text-3xl font-bold text-center mb-2">OLD CLUB MAN</h1>
        <h2 className="text-2xl font-bold text-center mb-4">SIGN IN</h2>
         */}
        
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <OldInput
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Email"
              className="w-full bg-slate-100 h-[50px]"
              required
              disabled={loading}
            />
          </div>
          
          <div className="mb-4 relative">
            <OldInput
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-slate-100 h-[50px]"
              required
              disabled={loading}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2"
              disabled={loading}
            >
              {showPassword ? (
                <IoMdEyeOff size={20}/>
              ) : (
                <IoMdEye size={20}/>
              )}
            </button>
          </div>
          
          {/* <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="mr-2"
                disabled={loading}
              />
              <span>Remember me</span>
            </label>
          </div> */}
          
          <button
            type="submit"
            className={`w-full bg-blue-500 h-[50px] text-white py-[.4rem] rounded-md hover:bg-blue-600 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          
          <div className="my-4 text-center">
            <Link href="/auth/forgot-password" className="text-blue-500 hover:underline text-sm">
              Forgotten password?
            </Link>
          </div>

          <p className="text-center my-6 ">
          <Link href="/auth/register" className="text-white bg-green-500 p-3 rounded-md text-[20px] font-bold">Create New Account</Link>
        </p>
        </form>
        
        <div className="text-center mt-6 text-sm text-gray-600">
          ©2025 <span className="text-blue-500">OLD CLUB MAN</span>. All rights reserved
        </div>
      </div>
    </div>
    </>
   
  )
}

export default Login