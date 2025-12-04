import axiosInstance from './axios';
import { API_ENDPOINTS } from '../config/constants';
import {
  Administrador,
  Torneo,
  Competencia,
  CreateAdminRequest,
  CreateTournamentRequest,
  CreateCompetitionRequest,
} from '../types';

export const adminService = {
  getAccounts: async (): Promise<Administrador[]> => {
    const response = await axiosInstance.get<Administrador[]>(API_ENDPOINTS.ADMIN.ACCOUNTS);
    return response.data;
  },

  createAccount: async (data: CreateAdminRequest): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.ADMIN.ACCOUNTS, data);
  },

  deleteAccount: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.ADMIN.ACCOUNTS}/${id}`);
  },

  getTournaments: async (): Promise<Torneo[]> => {
    const response = await axiosInstance.get<Torneo[]>(API_ENDPOINTS.ADMIN.TOURNAMENTS);
    return response.data;
  },

  getTournamentById: async (id: number): Promise<Torneo> => {
    const response = await axiosInstance.get<Torneo>(API_ENDPOINTS.ADMIN.TOURNAMENT_BY_ID(id));
    return response.data;
  },

  createTournament: async (data: CreateTournamentRequest): Promise<Torneo> => {
    const response = await axiosInstance.post<Torneo>(API_ENDPOINTS.ADMIN.TOURNAMENTS, data);
    return response.data;
  },

  updateTournament: async (id: number, data: CreateTournamentRequest): Promise<void> => {
    await axiosInstance.put(API_ENDPOINTS.ADMIN.TOURNAMENT_BY_ID(id), data);
  },

  deleteTournament: async (id: number): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.ADMIN.TOURNAMENT_BY_ID(id));
  },

  publishTournament: async (id: number): Promise<void> => {
    await axiosInstance.patch(API_ENDPOINTS.ADMIN.PUBLISH_TOURNAMENT(id));
  },

  getCompetitions: async (tournamentId: number): Promise<Competencia[]> => {
    const response = await axiosInstance.get<Competencia[]>(
      API_ENDPOINTS.ADMIN.COMPETITIONS(tournamentId)
    );
    return response.data;
  },

  createCompetition: async (
    tournamentId: number,
    data: CreateCompetitionRequest
  ): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.ADMIN.COMPETITIONS(tournamentId), data);
  },
};
