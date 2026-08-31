import React from 'react';
import './Header.css';

/**
 * Header component
 */
export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container-fluid">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-blue-600">🤖 AIJobResearcher</h1>
          </div>
          <nav className="flex-1 ml-8">
            <ul className="flex gap-8">
              <li>
                <a href="/" className="text-sm font-medium text-gray-900 hover:text-blue-600">
                  Jobs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-sm font-medium text-gray-500 hover:text-blue-600 cursor-not-allowed opacity-50"
                >
                  Applications
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-sm font-medium text-gray-500 hover:text-blue-600 cursor-not-allowed opacity-50"
                >
                  Learning
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-sm font-medium text-gray-500 hover:text-blue-600 cursor-not-allowed opacity-50"
                >
                  Profile
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
