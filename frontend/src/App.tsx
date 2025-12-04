import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import ParticipantLayout from './components/ParticipantLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Unauthorized from './pages/Unauthorized';

import AdminTournaments from './pages/admin/AdminTournaments';
import TournamentCompetitions from './pages/admin/TournamentCompetitions';
import AdminAccounts from './pages/admin/AdminAccounts';

import ParticipantTournaments from './pages/participant/ParticipantTournaments';
import TournamentDetail from './pages/participant/TournamentDetail';
import ParticipantInscriptions from './pages/participant/ParticipantInscriptions';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/tournaments" replace />} />
            <Route path="tournaments" element={<AdminTournaments />} />
            <Route path="tournaments/:id" element={<TournamentCompetitions />} />
            <Route path="accounts" element={<AdminAccounts />} />
          </Route>

          <Route
            path="/participant"
            element={
              <ProtectedRoute requiredRole="participant">
                <ParticipantLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/participant/tournaments" replace />} />
            <Route path="tournaments" element={<ParticipantTournaments />} />
            <Route path="tournaments/:id" element={<TournamentDetail />} />
            <Route path="inscriptions" element={<ParticipantInscriptions />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
