
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { AppSettings } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants';
import { AcademicCapIcon, EnvelopeIcon, CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface ForgotPasswordPageProps {
  appSettings: AppSettings;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ appSettings }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { 
    appName = DEFAULT_APP_SETTINGS.appName, 
    collegeAddress = DEFAULT_APP_SETTINGS.collegeAddress, 
    collegeLogo,
    forgotPasswordPageHeading = DEFAULT_APP_SETTINGS.forgotPasswordPageHeading,
    forgotPasswordPageSubText = DEFAULT_APP_SETTINGS.forgotPasswordPageSubText,
  } = appSettings;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    if (!email.trim()) {
      setError('Email address is required.');
      setIsLoading(false);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Invalid email format.');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would make an API call here to initiate password reset.
      // For this demo, we'll just show a confirmation message.
      setMessage(`If an account exists for ${email}, a password reset link has been sent. Please check your inbox (and spam folder).`);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 to-slate-800 flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {collegeLogo ? (
            <img src={collegeLogo} alt={`${appName} Logo`} className="h-20 w-auto object-contain mx-auto mb-3 rounded-md" />
          ) : (
            <AcademicCapIcon className="h-16 w-16 text-white mx-auto mb-3" />
          )}
          <h1 className="text-3xl font-bold text-white tracking-tight">{appName}</h1>
           <p className="text-sky-200 mt-1 text-sm">{collegeAddress}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-xl p-8 space-y-6">
          <h2 className="text-xl font-semibold text-center text-slate-700 mb-2">{forgotPasswordPageHeading}</h2>
          {forgotPasswordPageSubText && (
            <p className="text-sm text-center text-slate-500 mb-5 -mt-2">
              {forgotPasswordPageSubText}
            </p>
          )}

          {message && (
            <div role="status" className="p-3 bg-green-50 border border-green-300 text-green-700 rounded-md text-sm flex items-start">
              <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}
          
          {!message && (
            <>
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="!pl-10"
                    aria-label="Email Address"
                  />
                </div>
              </div>

              {error && <p role="alert" className="text-sm text-red-600 text-center bg-red-100 p-2 rounded-md">{error}</p>}

              <Button type="submit" variant="primary" className="w-full !py-2.5 !text-base" isLoading={isLoading}>
                {isLoading ? 'Sending...' : 'Send Password Reset Email'}
              </Button>
            </>
          )}
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="group inline-flex items-center text-sm font-medium text-sky-200 hover:text-white transition-colors duration-150">
            <ArrowLeftIcon className="h-4 w-4 mr-1 transition-transform duration-150 group-hover:-translate-x-1" />
            Back to Log In
          </Link>
        </div>
        
        <p className="text-center text-xs text-slate-300 mt-8">&copy; {new Date().getFullYear()} {appName}. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
