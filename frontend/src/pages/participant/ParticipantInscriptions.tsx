import React, { useState, useEffect } from 'react';
import { participantService } from '../../services/participantService';
import { Inscripcion } from '../../types';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';

const ParticipantInscriptions: React.FC = () => {
  const [inscriptions, setInscriptions] = useState<Inscripcion[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  useEffect(() => {
    const fetchInscriptions = async () => {
      try {
        setLoading(true);
        const data = await participantService.getInscriptions();
        setInscriptions(data);
      } catch (error) {
        console.error('Error fetching inscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInscriptions();
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Inscripciones</h1>
        <p className="text-gray-600">
          Aquí puedes ver todos los torneos en los que te has inscrito y las competencias en las que participas
        </p>
      </div>

      {inscriptions.length === 0 ? (
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Sin inscripciones aún
          </h3>
          <p className="text-gray-500">
            No estás inscripto en ninguna competencia. ¡Ve a la sección de torneos y regístrate!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
            {inscriptions.map((inscription) => (
              <Card
                key={inscription.idInscripcion}
                className="overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="h-1 bg-gradient-to-r from-primary-500 to-blue-500" />

                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Information */}
                    <div className="flex-1">
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          Inscripto
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {inscription.nombreTorneo}
                      </h3>

                      <p className="text-lg text-primary-600 font-semibold mb-3">
                        {inscription.nombreCompetencia}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm">
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
                          {formatDate(inscription.fechaInscripcion)}
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="md:text-right md:border-l md:border-gray-200 md:pl-6">
                      <p className="text-sm text-gray-600 mb-1">Precio Pagado</p>
                      <p className="text-3xl font-bold text-primary-600">
                        ${inscription.precioPagado.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
      )}
    </div>
  );
};

export default ParticipantInscriptions;
