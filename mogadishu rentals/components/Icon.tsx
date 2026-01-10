import React from 'react';

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
}

const Icon: React.FC<IconProps> = ({ name, className = '', filled = false }) => {
  switch (name) {
    case 'favorite':
      return (
        <span className={`nav-icon ${className}`} aria-hidden>
          {filled ? (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      );
    case 'location_on':
      return (
        <span className={`nav-icon ${className}`} aria-hidden>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 .001-5.001A2.5 2.5 0 0 1 12 11.5z" stroke="currentColor" strokeWidth="0.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      );
    case 'verified':
      return (
        <span className={`nav-icon ${className}`} aria-hidden>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l2.9 1.9L18 6l2 2-1 2.9L20 14l-2 2-1.1 2.1L12 22l-3-1.9L8 18 6 16l1-2.1L6 11l2-2 2.9-2.1L12 2z" stroke="currentColor" strokeWidth="0.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 13l2 2 4-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      );
    case 'apartment':
      return (
        <span className={`nav-icon ${className}`} aria-hidden>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 21V3h14v18H3zm2-8h3v3H5v-3zm0-5h3v3H5V8zm5 5h3v3h-3v-3zm0-5h3v3h-3V8zM20 21v-7h-2v7h2z" stroke="currentColor" strokeWidth="0.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      );
    case 'home':
      return (
        <span className={`nav-icon ${className}`} aria-hidden>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5z" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      );
    case 'domain':
      return (
        <span className={`nav-icon ${className}`} aria-hidden>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="0.8" fill="none" />
            <path d="M3 10h18" stroke="currentColor" strokeWidth="0.8" />
          </svg>
        </span>
      );
    case 'hotel':
      return (
        <span className={`nav-icon ${className}`} aria-hidden>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 11v6h2v-4h12v4h2v-6" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 7h14v4H5z" stroke="currentColor" strokeWidth="0.8" fill="none" />
          </svg>
        </span>
      );
    case 'meeting_room':
      return (
        <span className={`nav-icon ${className}`} aria-hidden>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="6" width="18" height="10" rx="1" stroke="currentColor" strokeWidth="0.8" fill="none" />
            <path d="M7 12v3M17 12v3" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
          </svg>
        </span>
      );
    case 'calendar_month':
      return (
        <span className={`nav-icon ${className}`} aria-hidden>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="0.8" fill="none" />
            <path d="M16 3v4M8 3v4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
          </svg>
        </span>
      );
    case 'security':
      return (
        <span className={`nav-icon ${className}`} aria-hidden>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l7 4v6c0 5-3.58 9.74-7 11-3.42-1.26-7-6-7-11V6l7-4z" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      );
    case 'event_available':
      return (
        <span className={`nav-icon ${className}`} aria-hidden>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="0.8" fill="none" />
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      );
    case 'home_work':
      return (
        <span className={`nav-icon ${className}`} aria-hidden>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5z" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 21v-6h4v6" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      );
    case 'schedule':
      return (
        <span className={`nav-icon ${className}`} aria-hidden>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="0.8" fill="none" />
            <path d="M12 8v5l3 3" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      );
    case 'tag':
      return (
        <span className={`nav-icon ${className}`} aria-hidden>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2.34 12.33a2 2 0 0 1 0-2.83L9.51 2.34a2 2 0 0 1 2.83 0l8.25 8.25a2 2 0 0 1 0 2.82z" stroke="currentColor" strokeWidth="0.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="7.5" cy="7.5" r="1" fill="currentColor" />
          </svg>
        </span>
      );
    case 'star':
      return (
        <span className={`nav-icon ${className}`} aria-hidden>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 17.3l6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l4.46 4.76L5.82 21z" stroke="currentColor" strokeWidth="0.6" fill="none" />
          </svg>
        </span>
      );
    default:
      return <span className={className} />;
  }
};

export default Icon;
