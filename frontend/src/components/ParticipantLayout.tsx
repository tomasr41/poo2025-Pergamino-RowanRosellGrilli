import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

const ParticipantLayout: React.FC = () => {
  const { logout, userEmail } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-primary-600 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">Torneos Deportivos</h1>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              <NavLink
                to="/participant/tournaments"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-white text-primary-600 shadow-md'
                      : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Torneos
              </NavLink>
              <NavLink
                to="/participant/inscriptions"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-white text-primary-600 shadow-md'
                      : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Mis Inscripciones
              </NavLink>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 rounded-lg">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white">{userEmail}</span>
              </div>
              <Button size="sm" variant="secondary" onClick={handleLogout} className="opacity-90 hover:opacity-100">
                Salir
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ParticipantLayout;
