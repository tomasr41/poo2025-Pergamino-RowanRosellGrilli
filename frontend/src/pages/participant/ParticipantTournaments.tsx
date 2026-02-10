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
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredTournaments = tournaments.filter(
    (t) =>
      t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDaysRemaining = (fechaInicio: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(fechaInicio);
    start.setHours(0, 0, 0, 0);
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Torneos Disponibles</h1>
        <p className="text-gray-600">
          Explora todos los torneos deportivos y regístrate en las competencias que te interesen
        </p>
      </div>

      {/* Búsqueda */}
      {tournaments.length > 0 && (
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar torneos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      )}

      {filteredTournaments.length === 0 ? (
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm ? 'No se encontraron torneos' : 'No hay torneos disponibles'}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? 'Intenta con otros términos de búsqueda'
              : 'Vuelve pronto para ver nuevos torneos'}
          </p>
        </Card>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Mostrando {filteredTournaments.length}{' '}
            {filteredTournaments.length === 1 ? 'torneo' : 'torneos'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => {
              const daysRemaining = getDaysRemaining(tournament.fechaInicio);
              const isUpcoming = daysRemaining > 0;

              return (
                <Card
                  key={tournament.idTorneo}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                  onClick={() => navigate(`/participant/tournaments/${tournament.idTorneo}`)}
                >
                  {/* Color stripe */}
                  <div className="h-1 bg-gradient-to-r from-primary-500 to-blue-500" />

                  <div className="p-6">
                    {/* Badge */}
                    {isUpcoming && (
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          Por venir en {daysRemaining} {daysRemaining === 1 ? 'día' : 'días'}
                        </span>
                      </div>
                    )}

                    {/* Nombre */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {tournament.nombre}
                    </h3>

                    {/* Descripción */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {tournament.descripcion}
                    </p>

                    {/* Fechas con iconos */}
                    <div className="space-y-2 mb-6 py-4 border-t border-b border-gray-100">
                      <div className="flex items-center text-sm text-gray-700">
                        <svg
                          className="w-4 h-4 text-gray-400 mr-3"
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
                        <span className="font-medium">Inicio:</span>
                        <span className="ml-auto">{formatDate(tournament.fechaInicio)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <svg
                          className="w-4 h-4 text-gray-400 mr-3"
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
                        <span className="font-medium">Fin:</span>
                        <span className="ml-auto">{formatDate(tournament.fechaFin)}</span>
                      </div>
                    </div>

                    {/* Botón */}
                    <Button
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/participant/tournaments/${tournament.idTorneo}`);
                      }}
                    >
                      <span className="flex items-center justify-center">
                        Ver Competencias
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ParticipantTournaments;
