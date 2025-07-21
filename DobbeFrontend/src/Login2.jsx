import React, { useState } from 'react';

const DobbeLogo = () => (
  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
    📋
  </div>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function Login() {
  const [loading, setLoading] = useState(null); // 'signin' | 'signup' | null
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const makeAuthRequest = async (authType) => {
    setLoading(authType);
    setError('');
    setSuccess('');

    try {
      // OAuth login should be a redirect, not a fetch
      window.location.href = `${import.meta.env.VITE_API_URL}/login`;
    } catch (err) {
      setError('Failed to initiate authentication. Please try again.');
      setLoading(null);
    }
  };

  const handleSignIn = () => {
    makeAuthRequest('signin');
  };

  const handleSignUp = () => {
    makeAuthRequest('signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-700 flex flex-col mx-[auto]">
      {/* Header */}
      <div className="flex justify-between items-center p-5 md:p-10 bg-black bg-opacity-10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <DobbeLogo />
          <div className="text-white">
            <h1 className="text-2xl md:text-3xl font-bold">Dobbe</h1>
            <p className="text-sm md:text-base opacity-90">AI Doctor Appointment Assistant</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-5 md:p-10">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-12 transform transition-all duration-300 hover:scale-105">
          {/* Welcome Text */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Dobbe</h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Sign in to manage your doctor appointments with AI assistance
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Auth Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleSignIn}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 border-2 border-gray-200 rounded-xl bg-white text-gray-200 font-medium text-base transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading === 'signin' ? (
                <LoadingSpinner />
              ) : (
                <GoogleIcon />
              )}
              Sign in with Google
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-5 bg-white text-gray-500">or</span>
              </div>
            </div>

            <button
              onClick={handleSignUp}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 border-2 border-gray-200 rounded-xl bg-white text-gray-200 font-medium text-base transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading === 'signup' ? (
                <LoadingSpinner />
              ) : (
                <GoogleIcon />
              )}
              Sign up with Google
            </button>
          </div>

          {/* Footer Text */}
          <div className="mt-8 text-center text-sm text-gray-600 leading-relaxed">
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}