"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PharmaNavbar from '../pharma-nav';

export default function PharmaLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (email && password) {
      router.push('/dashboard'); 
    } else {
      alert('Please enter both email and password');
    }
  };

  return (
    <div>
        <PharmaNavbar />
 <div className="flex items-center justify-center bg-gradient-to-r from-teal-400 to-teal-600">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 m-36">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-teal-700">Pharmacist Login</h2>
          <p className="mt-2 text-gray-600 text-sm">Sign in to access age and manage your dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-6 py-3 mt-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-6 py-3 mt-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter your password"
            />
          </div>

          {/* <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-teal-600 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">Remember me</label>
            </div>
            <a href="#" className="text-sm text-teal-600 hover:text-teal-700">Forgot your password?</a>
          </div> */}

          <button
            type="submit"
            className="w-full py-3 mt-6 text-white font-medium bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Sign in
          </button>
        </form>

        {/* <div className="text-center mt-6">
          <p className="text-sm text-gray-600">Don't have an account?{' '}
            <a href="#" className="text-teal-600 hover:text-teal-700">Sign up</a>
          </p>
        </div> */}
      </div>
    </div>
    </div>
   
  );
}
