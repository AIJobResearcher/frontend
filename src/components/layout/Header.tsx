import React from 'react';
import './Header.css';

/**
 * Header component (placeholder for future enhancements)
 */
export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container-fluid">
        <div className="header__content">
          <div className="header__logo">
            <h1 className="header__title">🤖 AIJobResearcher</h1>
          </div>
          <nav className="header__nav">
            <ul className="header__menu">
              <li>
                <a href="/" className="header__link active">
                  Jobs
                </a>
              </li>
              <li>
                <a href="#" className="header__link" onClick={(e) => e.preventDefault()}>
                  Applications
                </a>
              </li>
              <li>
                <a href="#" className="header__link" onClick={(e) => e.preventDefault()}>
                  Learning
                </a>
              </li>
              <li>
                <a href="#" className="header__link" onClick={(e) => e.preventDefault()}>
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
