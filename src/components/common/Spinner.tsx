import React from 'react';
import './Spinner.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

/**
 * Reusable spinner component for loading states
 */
export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', label = 'Loading...' }) => {
  const sizeClass = `spinner-${size}`;

  return (
    <div className={`spinner-container ${sizeClass}`}>
      <div className="spinner"></div>
      {label && <p className="spinner-label">{label}</p>}
    </div>
  );
};
