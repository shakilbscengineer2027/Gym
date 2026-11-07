import { apiClient } from '../client';

export interface BodyMeasurementEntry {
  id: string;
  recordedDate: string;
  weightKg: number;
  bodyFatPercent?: number;
  chestCm?: number;
  waistCm?: number;
  leftArmCm?: number;
  rightArmCm?: number;
}

export interface CreateMeasurementPayload {
  weightKg: number;
  bodyFatPercent?: number;
  chestCm?: number;
  waistCm?: number;
  leftArmCm?: number;
  rightArmCm?: number;
  recordedDate?: string;
}

export const measurementsApi = {
  async getHistory(): Promise<BodyMeasurementEntry[]> {
    return apiClient.get<BodyMeasurementEntry[]>('/measurements');
  },

  async logEntry(payload: CreateMeasurementPayload): Promise<BodyMeasurementEntry> {
    return apiClient.post<BodyMeasurementEntry>('/measurements', payload);
  },
};
