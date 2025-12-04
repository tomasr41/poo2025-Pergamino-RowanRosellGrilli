import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { STORAGE_KEYS } from '../config/constants';
import { UserRole } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  token: string | null;
  userRole: UserRole;
  userEmail: string | null;
  isAuthenticated: boolean;
  loginAdmin: (email: string, password: string) => Promise<void>;
  loginParticipant: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem(STORAGE_KEYS.TOKEN)
  );
  const [userRole, setUserRole] = useState<UserRole>(
    (localStorage.getItem(STORAGE_KEYS.USER_ROLE) as UserRole) || null
  );
  const [userEmail, setUserEmail] = useState<string | null>(
    localStorage.getItem(STORAGE_KEYS.USER_EMAIL)
  );

  const isAuthenticated = !!token;

  const loginAdmin = async (email: string, password: string) => {
    const response = await authService.loginAdmin(email, password);
    localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, 'admin');
    localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
    setToken(response.token);
    setUserRole('admin');
    setUserEmail(email);
  };

  const loginParticipant = async (email: string, password: string) => {
    const response = await authService.loginParticipant(email, password);
    localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, 'participant');
    localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
    setToken(response.token);
    setUserRole('participant');
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
    localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
    setToken(null);
    setUserRole(null);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userRole,
        userEmail,
        isAuthenticated,
        loginAdmin,
        loginParticipant,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
