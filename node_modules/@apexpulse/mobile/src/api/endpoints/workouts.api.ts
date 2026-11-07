import { apiClient } from '../client';
import { ExerciseItem, WorkoutPlan } from '@apexpulse/types';

export interface CreateWorkoutPayload {
  title: string;
  category: string;
  fitnessLevel: string;
  exercises: Array<{
    exerciseId: string;
    sets: number;
    repsRange: string;
    targetWeightKg?: number;
    restTimeSeconds: number;
  }>;
}

export interface FinishSessionPayload {
  sessionId: string;
  durationSeconds: number;
  totalVolumeKg: number;
  completedSets: Array<{
    exerciseId: string;
    setNumber: number;
    weightKg: number;
    reps: number;
    rpe?: number;
  }>;
}

export const workoutsApi = {
  async getTemplates(): Promise<WorkoutPlan[]> {
    return apiClient.get<WorkoutPlan[]>('/workouts/templates');
  },

  async createTemplate(payload: CreateWorkoutPayload): Promise<WorkoutPlan> {
    return apiClient.post<WorkoutPlan>('/workouts/templates', payload);
  },

  async finishSession(payload: FinishSessionPayload): Promise<{ success: boolean; prsAchieved: string[] }> {
    return apiClient.post('/tracking/sessions/finish', payload);
  },

  async getExerciseLibrary(params?: { search?: string; muscle?: string; equipment?: string }): Promise<ExerciseItem[]> {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.get<ExerciseItem[]>(`/exercises${query ? `?${query}` : ''}`);
  },
};
