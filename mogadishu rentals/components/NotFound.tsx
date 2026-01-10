import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark text-center px-6">
      <div className="text-6xl mb-4">??</div>
      <h1 className="text-3xl font-bold mb-2">Page not found</h1>
      <p className="text-slate-500 mb-6">The page you are looking for doesn't exist.</p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 rounded-xl bg-primary text-black font-semibold shadow-sm"
      >
        Back to home
      </button>
    </div>
  );
};

export default NotFound;
