
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  ...props
}) => {
  const baseStyle = "font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md";

  const variantStyles = {
    primary: "bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-500",
    secondary: "bg-slate-200 hover:bg-slate-300 text-slate-800 focus:ring-slate-400 border border-slate-300",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-300 border border-slate-300",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const loadingSpinner = (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <button
      type="button"
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <span className={children ? "mr-2" : ""}>{loadingSpinner}</span>}
      {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
      {!isLoading && children}
      {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;
