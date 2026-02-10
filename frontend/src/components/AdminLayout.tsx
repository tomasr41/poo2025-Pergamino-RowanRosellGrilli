import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

const AdminLayout: React.FC = () => {
  const { logout, userEmail } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-xl flex flex-col">
        {/* Header del Sidebar */}
        <div className="bg-gradient-to-b from-primary-600 to-primary-700 p-6">
          <div className="flex items-center gap-3 mb-4">
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
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Panel Admin</h1>
              <p className="text-xs text-primary-100 mt-1">Administrador</p>
            </div>
          </div>
          <div className="pt-4 border-t border-primary-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-primary-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-primary-50 truncate">{userEmail}</span>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink
            to="/admin/tournaments"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                isActive
                  ? 'bg-primary-100 text-primary-700 shadow-md border-l-4 border-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Torneos</span>
          </NavLink>
          <NavLink
            to="/admin/accounts"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                isActive
                  ? 'bg-primary-100 text-primary-700 shadow-md border-l-4 border-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3.645A2.645 2.645 0 011 18.355V6.645A2.645 2.645 0 013.645 4h10.71a2.645 2.645 0 012.645 2.645v11.71a2.645 2.645 0 01-2.645 2.645z"
              />
            </svg>
            <span>Administradores</span>
          </NavLink>
        </nav>

        {/* Botón de Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium group"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
