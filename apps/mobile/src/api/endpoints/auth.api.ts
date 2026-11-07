import { apiClient } from '../client';
import { secureStorage } from '../../storage/secureStorage';

export interface LoginPayload {
  email: string;
  passwordHash: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  passwordHash: string;
  healthConsentGranted: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    role: string;
  };
}

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const data = await apiClient.post<AuthResponse>('/auth/login', payload, { skipAuth: true });
    await secureStorage.saveTokens(data.accessToken, data.refreshToken);
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const data = await apiClient.post<AuthResponse>('/auth/register', payload, { skipAuth: true });
    await secureStorage.saveTokens(data.accessToken, data.refreshToken);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      await secureStorage.clearTokens();
    }
  },

  async requestPasswordReset(email: string): Promise<{ sent: boolean }> {
    return apiClient.post('/auth/forgot-password', { email }, { skipAuth: true });
  },
};
