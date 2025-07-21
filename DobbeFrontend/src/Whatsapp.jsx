import React, { useState } from 'react';
import qr from "../public/qr_img.png";
import { useNavigate } from 'react-router-dom';
const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function WhatsAppRegistration() {
  const [step, setStep] = useState(1); // 1 for phone input, 2 for QR code
  const [phoneNumber, setPhoneNumber] = useState('+');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate()    
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    
    // Ensure the input always starts with '+'
    if (!value.startsWith('+')) {
      setPhoneNumber('+');
      return;
    }
    
    // Allow only digits after the '+', limit to 12 digits max
    const digitsOnly = value.slice(1).replace(/[^\d]/g, '');
    if (digitsOnly.length <= 12) {
      setPhoneNumber('+' + digitsOnly);
    }
  };

  const handlePhoneSubmit = (e) => {
    if (e) e.preventDefault();
    
    // Validate phone number
    if (!phoneNumber.trim() || phoneNumber === '+') {
      setError('Please enter your WhatsApp number with country code');
      return;
    }
    
    // Must have at least country code + some digits
    if (phoneNumber.length < 4) {
      setError('Please enter a complete phone number with country code');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate processing delay
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleSkip = () => {
    // Skip to main application
    navigate("/")
    // Add your navigation logic here
  };

  const handleComplete = () => {
    fetch('http://localhost:8060/whatsapp', { method:"POST",credentials: 'include',body:JSON.stringify({phone_number:phoneNumber}) })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        if (data.status=="success") {
            navigate("/")
        }else{
            setError(data.data.message)
        }
    });
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-center items-center p-8 bg-blue-50">
        <div className="flex items-center gap-3">
          <div className="text-blue-800">
            <h1 className="text-3xl font-bold">dobbe.ai</h1>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className={`w-12 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-5">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 border border-gray-200">
          
          {/* Step 1: Phone Number Input */}
          {step === 1 && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp Setup</h2>
                <p className="text-gray-600 text-sm">
                  Enter your WhatsApp number to receive appointment notifications and reports
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="+1 415 523 8886"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    disabled={loading}
                    onKeyDown={(e) => e.key === 'Enter' && handlePhoneSubmit(e)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Include country code (e.g., +1 for US, +91 for India)
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handlePhoneSubmit}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl font-medium text-base transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading && <LoadingSpinner />}
                  Continue
                </button>

                <button
                  onClick={handleSkip}
                  className="w-full py-3 px-6 rounded-xl font-medium text-base transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  Skip for now
                </button>
              </div>
            </>
          )}

          {/* Step 2: QR Code Registration */}
          {step === 2 && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Register Your Number</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800 font-medium">
                    As the website is still in testing, you must register your WhatsApp number on our Twilio sandbox to access appointment reports over WhatsApp.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan the QR code on mobile</h3>
                  
                  {/* QR Code Image */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                      <img src={qr} className="w-64 h-64 object-contain" alt="QR Code" />
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    OR
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-gray-900">Send a WhatsApp message</h4>
                  <p className="text-sm text-gray-600">
                    Use WhatsApp and send a message from your device to
                  </p>
                  <div className="flex items-center gap-2 bg-white p-3 rounded border">
                    <div className="text-green-600">📱</div>
                    <span className="font-mono text-lg">+1 415 523 8886</span>
                    <button className="ml-auto text-blue-600 text-sm hover:underline">
                      Copy
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    with code <span className="font-mono bg-white px-2 py-1 rounded border">join floating-interior</span>
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 px-6 border border-gray-300 rounded-xl font-medium text-base transition-all duration-200 bg-white text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleComplete}
                    className="flex-1 py-3 px-6 rounded-xl font-medium text-base transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Complete Setup
                  </button>
                </div>

                <button
                  onClick={handleSkip}
                  className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm"
                >
                  Skip WhatsApp setup
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="text-center p-4 text-xs text-gray-500">
        Twilio WhatsApp Sandbox
      </div>
    </div>
  );
}