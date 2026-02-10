import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../config/constants';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      // Solo redirigir si ya hay un token guardado (sesión expirada)
      // Si no hay token, es un error de login, dejar que se maneje en el componente
      if (token) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
        localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
