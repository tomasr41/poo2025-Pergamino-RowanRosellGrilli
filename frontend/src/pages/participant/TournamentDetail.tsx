import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { participantService } from '../../services/participantService';
import { Torneo, Competencia } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';

const TournamentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Torneo | null>(null);
  const [competitions, setCompetitions] = useState<Competencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [inscribing, setInscribing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<Competencia | null>(null);
  const [inscriptionResult, setInscriptionResult] = useState<{ precioPagado: number } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const tournamentData = await participantService.getTournamentById(Number(id));
        const competitionsData = await participantService.getCompetitions(Number(id));
        setTournament(tournamentData);
        setCompetitions(competitionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInscribeClick = (competition: Competencia) => {
    setSelectedCompetition(competition);
    setShowModal(true);
  };

  const handleInscribe = async () => {
    if (!selectedCompetition) return;

    setInscribing(true);
    try {
      const result = await participantService.inscribe(
        Number(id),
        selectedCompetition.idCompetencia
      );
      setInscriptionResult(result);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al inscribirse');
      setShowModal(false);
    } finally {
      setInscribing(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCompetition(null);
    setInscriptionResult(null);
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
        <Button
          variant="secondary"
          onClick={() => navigate('/participant/tournaments')}
          size="sm"
        >
          Volver a Torneos
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{tournament?.nombre}</h1>
        <p className="text-gray-600 mt-2">{tournament?.descripcion}</p>
        <div className="flex gap-4 mt-4 text-sm text-gray-500">
          <p>
            <span className="font-medium">Inicio:</span>{' '}
            {tournament && new Date(tournament.fechaInicio).toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">Fin:</span>{' '}
            {tournament && new Date(tournament.fechaFin).toLocaleDateString()}
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Competencias Disponibles</h2>

      {competitions.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          No hay competencias disponibles para este torneo
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitions.map((competition) => (
            <Card key={competition.idCompetencia} className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {competition.nombre}
              </h3>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>
                  <span className="font-medium">Precio:</span> ${competition.precioBase}
                </p>
                <p>
                  <span className="font-medium">Cupos disponibles:</span> {competition.cupo}
                </p>
              </div>
              <Button
                className="w-full"
                onClick={() => handleInscribeClick(competition)}
              >
                Inscribirse
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={inscriptionResult ? 'Inscripción Exitosa' : 'Confirmar Inscripción'}
      >
        {inscriptionResult ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Te has inscrito correctamente
            </h3>
            <p className="text-gray-600">
              Competencia: <span className="font-medium">{selectedCompetition?.nombre}</span>
            </p>
            <p className="text-2xl font-bold text-primary-600 mt-4">
              Precio pagado: ${inscriptionResult.precioPagado.toFixed(2)}
            </p>
            <Button className="mt-6" onClick={handleCloseModal}>
              Aceptar
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-gray-700 mb-4">
              ¿Estás seguro de inscribirte en la competencia{' '}
              <span className="font-semibold">{selectedCompetition?.nombre}</span>?
            </p>
            <p className="text-lg font-medium text-gray-900 mb-6">
              Precio: ${selectedCompetition?.precioBase}
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={handleCloseModal} disabled={inscribing}>
                Cancelar
              </Button>
              <Button onClick={handleInscribe} disabled={inscribing}>
                {inscribing ? 'Inscribiendo...' : 'Confirmar'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TournamentDetail;
