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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="secondary" onClick={() => navigate('/admin/tournaments')} size="sm">
          Volver a Torneos
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{tournament?.nombre}</h1>
        <p className="text-gray-600 mt-2">{tournament?.descripcion}</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Competencias</h2>
        <Button onClick={() => setShowModal(true)}>Agregar Competencia</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {competitions.length === 0 ? (
          <Card className="p-8 text-center text-gray-500 col-span-full">
            No hay competencias creadas aún
          </Card>
        ) : (
          competitions.map((competition) => (
            <Card key={competition.idCompetencia} className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {competition.nombre}
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Precio Base:</span> ${competition.precioBase}
                </p>
                <p>
                  <span className="font-medium">Cupo:</span> {competition.cupo} participantes
                </p>
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
