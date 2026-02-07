import axiosInstance from './axios';
import { API_ENDPOINTS } from '../config/constants';
import { Torneo, Competencia, Inscripcion } from '../types';

export const participantService = {
  getTournaments: async (): Promise<Torneo[]> => {
    const response = await axiosInstance.get<Torneo[]>(API_ENDPOINTS.PARTICIPANT.TOURNAMENTS);
    return response.data;
  },

  getTournamentById: async (id: number): Promise<Torneo> => {
    const response = await axiosInstance.get<Torneo>(
      API_ENDPOINTS.PARTICIPANT.TOURNAMENT_BY_ID(id)
    );
    return response.data;
  },

  getCompetitions: async (tournamentId: number): Promise<Competencia[]> => {
    const response = await axiosInstance.get<Competencia[]>(
      API_ENDPOINTS.PARTICIPANT.COMPETITIONS(tournamentId)
    );
    return response.data;
  },

  inscribe: async (tournamentId: number, competitionId: number): Promise<{ precioPagado: number }> => {
    const response = await axiosInstance.post<{ precioPagado: number }>(
      API_ENDPOINTS.PARTICIPANT.INSCRIBE(tournamentId, competitionId)
    );
    return response.data;
  },

  getInscriptions: async (): Promise<Inscripcion[]> => {
    const response = await axiosInstance.get<Inscripcion[]>(
      API_ENDPOINTS.PARTICIPANT.INSCRIPTIONS
    );
    return response.data;
  },

  isInscribed: async (tournamentId: number, compId: number): Promise<boolean> => {
    const res = await axiosInstance.get<{ inscripto: boolean }>(
      `/competitions/${compId}/is-inscribed`
    );
    return res.data.inscripto;
  },

  previewInscription: async (tournamentId: number, competitionId: number) => {
    const res = await axiosInstance.get<{
      precioBase: number;
      descuento: number;
      precioFinal: number;
    }>(`/tournament/${tournamentId}/competitions/${competitionId}/inscription/preview`);
    return res.data;
  },

};
