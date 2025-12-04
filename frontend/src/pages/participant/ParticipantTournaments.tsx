import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { participantService } from '../../services/participantService';
import { Torneo } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Spinner from '../../components/Spinner';

const ParticipantTournaments: React.FC = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Torneo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const data = await participantService.getTournaments();
        setTournaments(data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Torneos Disponibles</h1>

      {tournaments.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          No hay torneos disponibles en este momento
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <Card
              key={tournament.idTorneo}
              className="p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate(`/participant/tournaments/${tournament.idTorneo}`)}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {tournament.nombre}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{tournament.descripcion}</p>
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <p>
                  <span className="font-medium">Inicio:</span>{' '}
                  {new Date(tournament.fechaInicio).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Fin:</span>{' '}
                  {new Date(tournament.fechaFin).toLocaleDateString()}
                </p>
              </div>
              <Button
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/participant/tournaments/${tournament.idTorneo}`);
                }}
              >
                Ver Competencias
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticipantTournaments;
