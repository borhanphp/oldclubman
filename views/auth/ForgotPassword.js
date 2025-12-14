"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import OldInput from '@/components/custom/OldInput'
import { useDispatch, useSelector } from 'react-redux'
import { handleResetPassword } from './store'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const {loading} = useSelector(({auth}) => auth);
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')
    // Simulate API call
    dispatch(handleResetPassword({email}))
    .then((res) => {
      toast.success('A password reset link sent to your email');
      return;
    })
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50">
      <div className="w-30 h-30 rounded-full overflow-hidden flex items-center justify-center mr-2">
            <img src="/oldman-logo.png" className='w-full'/>
          </div>
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2">Forgot password?</h1>
        <p className="text-center text-gray-600 mb-6">Enter the email address associated with account.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <OldInput
              type="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter Email"
              className="w-full bg-white"
              required
              disabled={loading}
            />
          </div>
          <div className="text-center mb-4">
            <Link href="/auth/login" className="text-gray-700 hover:underline text-sm">Back to Sign in</Link>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Password Reset Link'}
          </button>
          {message && <div className="mt-4 text-green-600 text-center text-sm">{message}</div>}
          {error && <div className="mt-4 text-red-600 text-center text-sm">{error}</div>}
        </form>
        <div className="text-center mt-6 text-sm text-gray-500">
          ©2024 <span className="text-blue-600 font-semibold">OLD CLUB MAN</span>. All rights reserved
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword