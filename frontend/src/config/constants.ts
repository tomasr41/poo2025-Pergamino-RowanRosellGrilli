export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  AUTH: {
    ADMIN_LOGIN: '/admin/auth',
    PARTICIPANT_LOGIN: '/participant/auth',
    REGISTER: '/participant',
  },
  ADMIN: {
    ACCOUNTS: '/admin/accounts',
    TOURNAMENTS: '/admin/tournaments',
    TOURNAMENT_BY_ID: (id: number) => `/admin/tournaments/${id}`,
    PUBLISH_TOURNAMENT: (id: number) => `/admin/tournaments/${id}/published`,
    COMPETITIONS: (tournamentId: number) => `/admin/tournaments/${tournamentId}/competitions`,
  },
  PARTICIPANT: {
    TOURNAMENTS: '/tournaments',
    TOURNAMENT_BY_ID: (id: number) => `/tournament/${id}`,
    COMPETITIONS: (tournamentId: number) => `/tournament/${tournamentId}/competitions`,
    INSCRIPTIONS: '/inscriptions',
    INSCRIBE: (tournamentId: number, competitionId: number) =>
      `/tournament/${tournamentId}/competitions/${competitionId}/inscription`,
    IS_INSCRIBED: (tournamentId: number, competitionId: number) =>
    `/tournament/${tournamentId}/competitions/${competitionId}/is-inscribed`,
  },
};

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER_ROLE: 'user_role',
  USER_EMAIL: 'user_email',
};
