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
  const [selectedRole, setSelectedRole] = useState(''); // 'doctor' | 'patient'

  const makeAuthRequest = async () => {
    if (!selectedRole) {
      setError('Please select your role (Doctor or Patient)');
      return;
    }

    setLoading('Signing in');
    setError('');
    setSuccess('');

    try {
        console.log(selectedRole)
        window.location.href = `${import.meta.env.VITE_API_URL}/login?role=${selectedRole}`;
    
    } catch (err) {
        setError('Failed to initiate authentication. Please try again.');
    } finally {
        setLoading(null);
    }
    };

    
    return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-center items-center p-8 bg-blue-50">
        <div className="flex items-center gap-3">
          <div className="text-4xl">🦷</div>
          <div className="text-gray-800">
            <h1 className="text-3xl font-bold">dobbe.ai</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-5">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 border border-gray-200">
          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">Select Your Role</h3>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setSelectedRole('doctor')}
                className={`flex items-center justify-start gap-4 py-4 px-6 rounded-xl border transition-all duration-200 ${
                  selectedRole === 'doctor'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${selectedRole === 'doctor' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className="text-left">
                  <div className="font-medium">Doctor</div>
                  <div className="text-sm text-gray-500">Medical professionals and practitioners</div>
                </div>
              </button>
              
              <button
                onClick={() => setSelectedRole('patient')}
                className={`flex items-center justify-start gap-4 py-4 px-6 rounded-xl border transition-all duration-200 ${
                  selectedRole === 'patient'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${selectedRole === 'patient' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className="text-left">
                  <div className="font-medium">Patient</div>
                  <div className="text-sm text-gray-500">Individuals seeking medical appointments</div>
                </div>
              </button>
            </div>
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
          <div className="space-y-3">
            <button
              onClick={makeAuthRequest}
              disabled={loading !== null || !selectedRole}
              className={`w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl font-medium text-base transition-all duration-200 ${
                !selectedRole
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading === 'signin' ? (
                <LoadingSpinner />
              ) : (
                <GoogleIcon />
              )}
              {selectedRole ? `Sign in as ${selectedRole === 'doctor' ? 'Doctor' : 'Patient'}` : 'Select role to sign in'}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            <button
              onClick={makeAuthRequest}
              disabled={loading !== null || !selectedRole}
              className={`w-full flex items-center justify-center gap-3 py-3 px-6 border rounded-xl font-medium text-base transition-all duration-200 ${
                !selectedRole
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading === 'signup' ? (
                <LoadingSpinner />
              ) : (
                <GoogleIcon />
              )}
              {selectedRole ? `Sign up as ${selectedRole === 'doctor' ? 'Doctor' : 'Patient'}` : 'Select role to sign up'}
            </button>
          </div>

          {/* Footer Text */}
          <div className="mt-6 text-center text-xs text-gray-500 leading-relaxed">
            By clicking continue, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>.
          </div>
        </div>
      </div>
    </div>
  );
}