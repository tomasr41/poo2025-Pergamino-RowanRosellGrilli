import axiosInstance from './axios';
import { API_ENDPOINTS } from '../config/constants';
import { AuthResponse, CreateParticipantRequest } from '../types';

export const authService = {
  loginAdmin: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.AUTH.ADMIN_LOGIN,
      { email, password }
    );
    return response.data;
  },

  loginParticipant: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.AUTH.PARTICIPANT_LOGIN,
      { email, password }
    );
    return response.data;
  },

  register: async (data: CreateParticipantRequest): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, data);
  },
};
