import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const hideNav = location.pathname.startsWith('/property/');

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center w-12 gap-1.5 transition-all duration-200 group ${
      isActive ? 'text-primary' : 'text-text-sub-light dark:text-text-sub-dark'
    }`;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 overflow-y-auto">{children}</div>

      {!hideNav && (
        <nav className="app-nav fixed bottom-0 left-0 right-0 h-20 bg-surface-light dark:bg-surface-dark border-t border-black/5 dark:border-white/5 z-50 safe-area-pb transition-all duration-300">
          <div className="flex items-center justify-around h-full max-w-md mx-auto relative px-2">
            <NavLink to="/" className={({isActive}) => `${linkClasses({isActive})} nav-link`} end>
              <span className="nav-icon group-hover:-translate-y-0.5 transition-transform" aria-hidden>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false">
                  <path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-[10px] nav-label">Home</span>
            </NavLink>

            <NavLink to="/saved" className={({isActive}) => `${linkClasses({isActive})} nav-link`}>
              <span className="nav-icon group-hover:-translate-y-0.5 transition-transform" aria-hidden>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false">
                  <path d="M20.8 6.6a5.4 5.4 0 0 0-8-.6L12 7.2l-0.8-0.6a5.4 5.4 0 1 0-7.2 8.0L12 21l8-6.4a5.4 5.4 0 0 0 .8-7z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-[10px] nav-label">Saved</span>
            </NavLink>

            <NavLink to="/list" className="relative -top-6 flex flex-col items-center group">
              <div className="fab" role="button" aria-label="Create listing">
                <span className="nav-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
              <span className="text-[10px] text-text-sub-light dark:text-text-sub-dark mt-1 nav-label">List</span>
            </NavLink>

            <NavLink to="/profile" className={({isActive}) => `${linkClasses({isActive})} nav-link`}>
              <span className="nav-icon group-hover:-translate-y-0.5 transition-transform" aria-hidden>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false">
                  <path d="M12 12a4 4 0 1 0-0.001-7.999A4 4 0 0 0 12 12zm0 2c-4 0-7 3-7 6v1h14v-1c0-3-3-6-7-6z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-[10px] nav-label">Profile</span>
            </NavLink>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;