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
  const [inscribedMap, setInscribedMap] = useState<Record<number, boolean>>({});
  const [pricePreview, setPricePreview] = useState<{ precioBase: number; descuento: number; precioFinal: number } | null>(null);

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const tournamentData = await participantService.getTournamentById(Number(id));
        const competitionsData = await participantService.getCompetitions(Number(id));
        setTournament(tournamentData);
        setCompetitions(competitionsData);
        const entries = await Promise.all(
          competitionsData.map(async (c) => {
            try {
              const inscripto = await participantService.isInscribed(Number(id), c.idCompetencia);
              return [c.idCompetencia, inscripto] as const;
            } catch (e) {
              return [c.idCompetencia, false] as const;
            }
          })
        );
        setInscribedMap(Object.fromEntries(entries));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInscribeClick = async (competition: Competencia) => {
    setSelectedCompetition(competition);
    setShowModal(true);

    try {
      const preview = await participantService.previewInscription(Number(id), competition.idCompetencia);
      setPricePreview(preview);
    } catch (error: any) {
      setPricePreview(null);
    }
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
      setInscribedMap(prev => ({ ...prev, [selectedCompetition.idCompetencia]: true }));
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
    setPricePreview(null);
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
      {/* Botón Volver */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/participant/tournaments')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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

      {/* Header del Torneo */}
      <Card className="mb-8 p-8 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary-500 to-blue-500 -mx-8 mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{tournament?.nombre}</h1>
        <p className="text-lg text-gray-600 mb-6">{tournament?.descripcion}</p>

        {/* Información del torneo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <svg
                className="w-8 h-8 text-primary-500"
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
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha de Inicio</p>
              <p className="text-lg font-semibold text-gray-900">
                {tournament && formatDate(tournament.fechaInicio)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <svg
                className="w-8 h-8 text-green-500"
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
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha de Finalización</p>
              <p className="text-lg font-semibold text-gray-900">
                {tournament && formatDate(tournament.fechaFin)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Competencias */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Competencias Disponibles</h2>
        <p className="text-gray-600">
          {competitions.length} {competitions.length === 1 ? 'competencia' : 'competencias'} disponible{competitions.length === 1 ? '' : 's'}
        </p>
      </div>

      {competitions.length === 0 ? (
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
            No hay competencias disponibles
          </h3>
          <p className="text-gray-500">
            Este torneo aún no tiene competencias publicadas
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitions.map((competition) => {
            const isInscribed = inscribedMap[competition.idCompetencia];

            return (
              <Card
                key={competition.idCompetencia}
                className="overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Stripe superior */}
                <div className={`h-1 ${isInscribed ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-primary-500 to-blue-500'}`} />

                <div className="p-6">
                  {/* Badge de estado */}
                  {isInscribed && (
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Ya inscripto
                      </span>
                    </div>
                  )}

                  {/* Nombre de competencia */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {competition.nombre}
                  </h3>

                  {/* Información detallada */}
                  <div className="space-y-4 mb-6 py-4 border-t border-b border-gray-100">
                    {/* Precio */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">Precio</span>
                      </div>
                      <span className="text-2xl font-bold text-primary-600">
                        ${competition.precioBase.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Botón de acción */}
                  <Button
                    className="w-full"
                    variant={isInscribed ? 'success' : 'primary'}
                    onClick={() => handleInscribeClick(competition)}
                    disabled={isInscribed}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isInscribed ? (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Inscripto
                        </>
                      ) : (
                        <>
                          Inscribirse
                          <svg
                            className="w-4 h-4"
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
                        </>
                      )}
                    </span>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de inscripción */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={inscriptionResult ? 'Inscripción Exitosa' : 'Confirmar Inscripción'}
      >
        {inscriptionResult ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ¡Inscripción Exitosa!
            </h3>
            <p className="text-gray-600 mb-1">Te has inscrito en:</p>
            <p className="text-lg font-semibold text-gray-900 mb-4">
              {selectedCompetition?.nombre}
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Precio pagado</p>
              <p className="text-3xl font-bold text-primary-600">
                ${inscriptionResult.precioPagado.toFixed(2)}
              </p>
            </div>
            <Button className="w-full" onClick={handleCloseModal}>
              Aceptar
            </Button>
          </div>
        ) : (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-gray-700">
                ¿Estás seguro de inscribirte en la competencia{' '}
                <span className="font-semibold text-gray-900">{selectedCompetition?.nombre}</span>?
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-1">Importante</p>
                  <p className="text-sm text-amber-700">
                    Una vez confirmada tu inscripción, <strong>no podrás darte de baja</strong> de esta competencia. Por favor verifica que es la decisión correcta.
                  </p>
                </div>
              </div>
            </div>

            {/* Detalles de precio */}
            <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Precio base:</span>
                <span className="font-semibold text-gray-900">
                  ${pricePreview?.precioBase ?? selectedCompetition?.precioBase}
                </span>
              </div>

              {pricePreview && pricePreview.descuento > 0 && (
                <>
                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="text-green-600 font-medium">
                      Descuento ({Math.round(pricePreview.descuento * 100)}%):
                    </span>
                    <span className="text-green-600 font-semibold">
                      -${(pricePreview.precioBase - pricePreview.precioFinal).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-green-700">
                    Descuento aplicado por inscribirte en mas de una competencia de este torneo.
                  </p>

                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total a pagar:</span>
                    <span className="text-2xl font-bold text-primary-600">
                      ${pricePreview.precioFinal.toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={handleCloseModal} disabled={inscribing}>
                Cancelar
              </Button>
              <Button onClick={handleInscribe} disabled={inscribing}>
                {inscribing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Inscribiendo...
                  </>
                ) : (
                  'Confirmar Inscripción'
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TournamentDetail;
