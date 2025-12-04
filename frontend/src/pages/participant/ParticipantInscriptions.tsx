import React, { useState, useEffect } from 'react';
import { participantService } from '../../services/participantService';
import { Inscripcion } from '../../types';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';

const ParticipantInscriptions: React.FC = () => {
  const [inscriptions, setInscriptions] = useState<Inscripcion[]>([]);
  const [loading, setLoading] = useState(true);

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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Inscripciones</h1>

      {inscriptions.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          No tienes inscripciones aún
        </Card>
      ) : (
        <div className="space-y-4">
          {inscriptions.map((inscription) => (
            <Card key={inscription.idInscripcion} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {inscription.nombreTorneo}
                  </h3>
                  <p className="text-gray-600 mt-1">{inscription.nombreCompetencia}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Fecha de inscripción:{' '}
                    {new Date(inscription.fechaInscripcion).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Precio pagado</p>
                  <p className="text-2xl font-bold text-primary-600">
                    ${inscription.precioPagado.toFixed(2)}
                  </p>
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
