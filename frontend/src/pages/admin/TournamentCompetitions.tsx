import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Competencia, Torneo } from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import CompetitionFormModal from './CompetitionFormModal';

const TournamentCompetitions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Torneo | null>(null);
  const [competitions, setCompetitions] = useState<Competencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const tournamentData = await adminService.getTournamentById(Number(id));
      const competitionsData = await adminService.getCompetitions(Number(id));
      setTournament(tournamentData);
      setCompetitions(competitionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSuccess = () => {
    setShowModal(false);
    fetchData();
  };

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDeleteCompetition = async (competitionId: number) => {
    if (!confirm('¿Seguro que querés eliminar esta competencia?')) return;
    try {
      await adminService.deleteCompetition(competitionId);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'No se pudo eliminar la competencia');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Header con botón volver */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/tournaments')}
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver a Torneos
        </button>
      </div>

      {/* Card con información del torneo */}
      <Card className="mb-8 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary-600 to-primary-500" />
        <div className="p-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{tournament?.nombre}</h1>
              <p className="text-gray-600 mb-4">{tournament?.descripcion}</p>
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span><span className="font-medium">Inicio:</span> {formatDate(tournament?.fechaInicio || '')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span><span className="font-medium">Fin:</span> {formatDate(tournament?.fechaFin || '')}</span>
                </div>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                tournament?.publicado
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                {tournament?.publicado ? (
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                )}
              </svg>
              {tournament?.publicado ? 'Publicado' : 'Borrador'}
            </span>
          </div>
        </div>
      </Card>

      {/* Sección de competencias */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Competencias</h2>
          <Button
            onClick={() => setShowModal(true)}
            disabled={tournament?.publicado}
            className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Agregar Competencia
          </Button>
        </div>
        {tournament?.publicado && (
          <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            No puedes agregar competencias a un torneo publicado. Publícalo después.
          </p>
        )}
      </div>

      {/* Competencias Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {competitions.length === 0 ? (
          <Card className="p-12 text-center lg:col-span-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Sin competencias aún</h3>
            <p className="text-gray-500">Agrega competencias para este torneo.</p>
          </Card>
        ) : (
          competitions.map((competition) => (
            <Card
              key={competition.idCompetencia}
              className="p-6 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500 -m-6 mb-4" />
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{competition.nombre}</h3>
                </div>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDeleteCompetition(competition.idCompetencia)}
                  className="flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Button>
              </div>
              <div className="space-y-3 text-sm flex-1">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <span className="font-medium text-green-900">Precio Base:</span>
                    <p className="text-green-700">${competition.precioBase}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 6a3 3 0 11-6 0 3 3 0 016 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zM5 20c0-1.338.24-2.618.68-3.788A3 3 0 015 13c-1.657 0-3 .895-3 2s1.343 2 3 2h6.684C9.8 15.75 9 14.469 9 13c0-1.105-.895-2-2-2-1.657 0-3 .895-3 2s1.343 2 3 2h.5"
                    />
                  </svg>
                  <div>
                    <span className="font-medium text-blue-900">Cupo:</span>
                    <p className="text-blue-700">{competition.cupo} participantes</p>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <CompetitionFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
        tournamentId={Number(id)}
      />
    </div>
  );
};

export default TournamentCompetitions;
