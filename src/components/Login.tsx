// @ts-nocheck
import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

const mockUsers = [
  {
    email: "user@example.com",
    password: "password123",
    user: {
      id: "1",
      name: "Demo User",
      email: "user@example.com",
      role: "user"
    }
  },
  {
    email: "admin@example.com",
    password: "admin123",
    user: {
      id: "2",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin"
    }
  }
];

const LoginPage = ({ onSwitchToSignup, onLoginSuccess, isModal = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Find user in mock database
      const user = mockUsers.find(u => u.email === email && u.password === password);

      if (user) {
        setSuccess('Login successful!');
        
        // Generate a mock token (in a real app, this would come from your backend)
        const mockToken = btoa(JSON.stringify({
          email: user.email,
          id: user.user.id,
          exp: Date.now() + 86400000 // Expires in 1 day
        }));

        // Store token and user data
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', mockToken);
          localStorage.setItem('user', JSON.stringify(user.user));
        }
        
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(user.user, mockToken);
          }
        }, 500);
      } else {
        setError('Invalid email or password');
        
        // Show option to switch to signup if no account found
        if (!mockUsers.some(u => u.email === email)) {
          setTimeout(() => {
            if (onSwitchToSignup) {
              onSwitchToSignup();
            }
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className={isModal ? "" : "min-h-screen bg-gray-900 flex items-center justify-center p-4"}>
      <div className={`${isModal ? "w-full" : "w-full max-w-md"}`}>
        <div className={`${isModal ? "" : "bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700"}`}>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-400 text-sm">
              Sign in to your energy monitoring dashboard.
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-100 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-900 border border-green-700 text-green-100 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Login Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Your email address"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Your password"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 pr-12"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !email || !password}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <a
              href="#"
              className="text-emerald-400 hover:text-emerald-300 text-sm hover:underline transition-colors duration-200"
            >
              Forgot your password?
            </a>
            <div>
              <button
                onClick={onSwitchToSignup}
                className="text-emerald-400 hover:text-emerald-300 text-sm hover:underline transition-colors duration-200 bg-transparent border-none cursor-pointer"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
