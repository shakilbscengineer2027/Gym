import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'apexpulse_access_token';
const REFRESH_TOKEN_KEY = 'apexpulse_refresh_token';
const USER_SESSION_KEY = 'apexpulse_user_session';

// Memory fallback for Web environment where SecureStore is not native
const webMemoryStore = new Map<string, string>();

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
      } catch {
        webMemoryStore.set(key, value);
      }
      return;
    }
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    });
  },

  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch {
        return webMemoryStore.get(key) || null;
      }
    }
    return await SecureStore.getItemAsync(key);
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(key);
      } catch {
        webMemoryStore.delete(key);
      }
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },

  // Auth Specific Helpers
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await this.setItem(ACCESS_TOKEN_KEY, accessToken);
    await this.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  async getAccessToken(): Promise<string | null> {
    return await this.getItem(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return await this.getItem(REFRESH_TOKEN_KEY);
  },

  async clearTokens(): Promise<void> {
    await this.removeItem(ACCESS_TOKEN_KEY);
    await this.removeItem(REFRESH_TOKEN_KEY);
    await this.removeItem(USER_SESSION_KEY);
  },
};
