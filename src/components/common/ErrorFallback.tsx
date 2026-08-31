import React from 'react';
import './ErrorFallback.css';

interface ErrorFallbackProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

/**
 * Reusable error fallback component
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
}) => {
  return (
    <div className="error-fallback">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">{title}</h3>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};
