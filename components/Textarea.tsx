import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  id: string;
  error?: string;
  icon?: React.ReactNode; // Added icon prop
}

const Textarea: React.FC<TextareaProps> = ({ label, id, error, className, icon, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center">
            {icon && <span className="mr-1.5">{icon}</span>}
            {label}
          </span>
        </label>
      )}
      <textarea
        id={id}
        {...props}
        rows={4}
        className={`mt-1 block w-full px-3 py-2 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm 
                    focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm
                    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed ${className || ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && <p id={`${id}-error`} className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Textarea;