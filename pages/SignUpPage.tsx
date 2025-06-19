
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { AppSettings } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants';
import { AcademicCapIcon, UserCircleIcon, EnvelopeIcon, LockClosedIcon, CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface SignUpPageProps {
  appSettings: AppSettings;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ appSettings }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { 
    appName = DEFAULT_APP_SETTINGS.appName, 
    collegeAddress = DEFAULT_APP_SETTINGS.collegeAddress, 
    collegeLogo,
    signUpPageHeading = DEFAULT_APP_SETTINGS.signUpPageHeading,
    signUpPageSubText = DEFAULT_APP_SETTINGS.signUpPageSubText,
  } = appSettings;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Invalid email format.');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would make an API call here to register the user.
      // For this demo, we'll just show a success message.
      // No actual user is created or stored in this frontend-only example.
      setSuccessMessage('Sign up successful! You can now try logging in (Note: This is a demo; new accounts are not functional for login).');
      setIsLoading(false);
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
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

        <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-xl p-8 space-y-5">
          <h2 className="text-xl font-semibold text-center text-slate-700 mb-2">{signUpPageHeading}</h2>
          {signUpPageSubText && <p className="text-sm text-center text-slate-500 mb-5 -mt-2">{signUpPageSubText}</p>}


          {successMessage && (
            <div role="alert" className="p-3 bg-green-50 border border-green-300 text-green-700 rounded-md text-sm flex items-start">
              <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <div>
                {successMessage}
                 <Link to="/login" className="block mt-2 font-semibold text-green-800 hover:text-green-900 underline">
                    Go to Login Page
                </Link>
              </div>
            </div>
          )}
          
          {!successMessage && (
            <>
              <div>
                <label htmlFor="fullName" className="sr-only">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircleIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="!pl-10"
                    aria-label="Full Name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="!pl-10"
                    aria-label="Email Address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password (min. 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="!pl-10"
                    aria-label="Password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="!pl-10"
                    aria-label="Confirm Password"
                  />
                </div>
              </div>

              {error && <p role="alert" className="text-sm text-red-600 text-center bg-red-100 p-2 rounded-md">{error}</p>}

              <Button type="submit" variant="primary" className="w-full !py-2.5 !text-base" isLoading={isLoading}>
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </>
          )}
        </form>

        {!successMessage && (
          <div className="mt-6 text-center">
            <Link to="/login" className="group inline-flex items-center text-sm font-medium text-sky-200 hover:text-white transition-colors duration-150">
              <ArrowLeftIcon className="h-4 w-4 mr-1 transition-transform duration-150 group-hover:-translate-x-1" />
              Already have an account? Log In
            </Link>
          </div>
        )}
        
        <p className="text-center text-xs text-slate-300 mt-8">&copy; {new Date().getFullYear()} {appName}. All rights reserved.</p>
      </div>
    </div>
  );
};

export default SignUpPage;
