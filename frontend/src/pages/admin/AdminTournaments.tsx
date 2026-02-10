import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Torneo } from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import TournamentFormModal from './TournamentFormModal';

const AdminTournaments: React.FC = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Torneo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Torneo | null>(null);

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const data = await adminService.getTournaments();
      setTournaments(data);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este torneo?')) return;
    try {
      await adminService.deleteTournament(id);
      fetchTournaments();
    } catch (error: any) {
      alert(error.response?.data?.error || error.response?.data || 'Error al eliminar el torneo');
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await adminService.publishTournament(id);
      fetchTournaments();
    } catch (error) {
      alert('Error al publicar el torneo');
    }
  };

  const handleEdit = (tournament: Torneo) => {
    setEditingTournament(tournament);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTournament(null);
  };

  const handleSuccess = () => {
    handleCloseModal();
    fetchTournaments();
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Torneos</h1>
            <p className="text-gray-600">Crea, edita y publica los torneos deportivos disponibles</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Crear Torneo
          </Button>
        </div>
      </div>

      {tournaments.length === 0 ? (
        <Card className="p-12 text-center">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Sin torneos aún</h3>
          <p className="text-gray-500 mb-6">No hay torneos creados. Crea el primero para empezar.</p>
          <Button onClick={() => setShowModal(true)}>Crear Primer Torneo</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {tournaments.map((tournament) => (
            <Card
              key={tournament.idTorneo}
              className="overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Stripe de color según estado */}
              <div
                className={`h-1 ${
                  tournament.publicado
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500'
                }`}
              />

              <div className="p-6">
                <div className="flex justify-between items-start gap-4">
                  {/* Información del torneo */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">{tournament.nombre}</h3>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          tournament.publicado
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          {tournament.publicado ? (
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          )}
                        </svg>
                        {tournament.publicado ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">{tournament.descripcion}</p>

                    {/* Fechas */}
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
                        <span>
                          <span className="font-medium">Inicio:</span> {formatDate(tournament.fechaInicio)}
                        </span>
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
                        <span>
                          <span className="font-medium">Fin:</span> {formatDate(tournament.fechaFin)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-2 flex-wrap justify-end">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => navigate(`/admin/tournaments/${tournament.idTorneo}`)}
                      className="flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Competencias
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEdit(tournament)}
                      disabled={tournament.publicado}
                      className="flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant={tournament.publicado ? 'secondary' : 'success'}
                      onClick={() => handlePublish(tournament.idTorneo)}
                      className="flex items-center gap-1"
                    >
                      {tournament.publicado ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7S3.732 16.057 2.458 12z"
                            />
                          </svg>
                          Ocultar
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7S3.732 16.057 2.458 12z"
                            />
                          </svg>
                          Publicar
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(tournament.idTorneo)}
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
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <TournamentFormModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        tournament={editingTournament}
      />
    </div>
  );
};

export default AdminTournaments;
