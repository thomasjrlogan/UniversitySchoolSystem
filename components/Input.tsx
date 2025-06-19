
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input: React.FC<InputProps> = ({ label, id, error, className, icon, iconPosition = 'left', ...props }) => {
  const hasIcon = !!icon;
  const paddingClass = hasIcon && iconPosition === 'left' 
    ? 'pl-10' 
    : (hasIcon && iconPosition === 'right' ? 'pr-10' : 'px-3');

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative mt-1 rounded-md shadow-sm">
        {hasIcon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          {...props}
          className={`block w-full ${paddingClass} py-2 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md
                      focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm
                      disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed ${className || ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {hasIcon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      {error && <p id={`${id}-error`} className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
