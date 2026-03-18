import api from './api';
import type { LoginCredentials, LoginResponse } from '../types';

export const loginApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/login', credentials);
  return response.data;
};

export const logoutApi = async (): Promise<void> => {
  // No server call needed for mock
};
