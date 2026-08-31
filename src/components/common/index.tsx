import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

/**
 * Loading spinner component
 */
export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', label }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <svg className="w-full h-full text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      {label && <p className="mt-4 text-gray-600 text-sm">{label}</p>}
    </div>
  );
};

interface ErrorFallbackProps {
  message: string;
  onRetry: () => void;
}

/**
 * Error fallback component
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ message, onRetry }) => {
  return (
    <div className="text-center py-8">
      <div className="text-red-600 mb-4">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-gray-700 mb-4">{message}</p>
      <button onClick={onRetry} className="btn btn-primary">
        Try Again
      </button>
    </div>
  );
};
