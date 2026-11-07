import { secureStorage } from '../storage/secureStorage';
import { AppError } from './errors';
import { ApiResponse } from './types';

const BASE_URL = 'https://api.apexpulse.app/api/v1';

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  skipAuth?: boolean;
}

export const apiClient = {
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { timeoutMs = 10000, skipAuth = false, headers = {}, ...customConfig } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Client-Platform': 'mobile',
      ...(headers as Record<string, string>),
    };

    if (!skipAuth) {
      const token = await secureStorage.getAccessToken();
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...customConfig,
        headers: requestHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const json: ApiResponse<T> = await response.json().catch(() => ({
        success: response.ok,
        data: null as any,
        error: response.ok
          ? null
          : { code: 'PARSING_ERROR', message: 'Failed to parse server response' },
        meta: { timestamp: new Date().toISOString() },
      }));

      if (!response.ok || !json.success) {
        const errorInfo = json.error || {
          code: 'SERVER_ERROR',
          message: `Server returned status ${response.status}`,
        };

        if (response.status === 401) {
          await secureStorage.clearTokens();
          throw new AppError('AUTH_REQUIRED', errorInfo.message, response.status);
        }

        if (response.status === 400) {
          throw new AppError('VALIDATION_FAILED', errorInfo.message, response.status, errorInfo.details);
        }

        if (response.status === 409) {
          throw new AppError('CONFLICT', errorInfo.message, response.status);
        }

        throw new AppError('SERVER_ERROR', errorInfo.message, response.status);
      }

      return json.data;
    } catch (err: any) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        throw new AppError('NETWORK_ERROR', 'Request timed out. Please check your connection.', 408);
      }

      throw AppError.fromUnknown(err);
    }
  },

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
