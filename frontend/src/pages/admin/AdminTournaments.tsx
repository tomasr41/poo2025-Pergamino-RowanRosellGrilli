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
    } catch (error) {
      alert('Error al eliminar el torneo');
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Torneos</h1>
        <Button onClick={() => setShowModal(true)}>Crear Torneo</Button>
      </div>

      <div className="space-y-4">
        {tournaments.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            No hay torneos creados aún
          </Card>
        ) : (
          tournaments.map((tournament) => (
            <Card key={tournament.idTorneo} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {tournament.nombre}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tournament.publicado
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {tournament.publicado ? 'Publicado' : 'Borrador'}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{tournament.descripcion}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(tournament.fechaInicio).toLocaleDateString()} -{' '}
                    {new Date(tournament.fechaFin).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/admin/tournaments/${tournament.idTorneo}`)}
                  >
                    Ver Competencias
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(tournament)}>
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant={tournament.publicado ? 'secondary' : 'success'}
                    onClick={() => handlePublish(tournament.idTorneo)}
                  >
                    {tournament.publicado ? 'Ocultar' : 'Publicar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(tournament.idTorneo)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

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
