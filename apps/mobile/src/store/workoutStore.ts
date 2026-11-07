import { create } from 'zustand';
import {
  UserProfile,
  ScheduleDay,
  DailyFocusWorkout,
} from '@apexpulse/types';
import {
  mockUserProfile,
  mockScheduleDays,
  mockTodayFocus,
} from '../fixtures/mockData';

export interface ActiveWorkoutState {
  isActive: boolean;
  workoutTitle: string;
  elapsedSeconds: number;
  currentExerciseIndex: number;
  completedSetsMap: Record<string, number>; // exerciseId -> count
}

export interface AppState {
  // User & Profile
  user: UserProfile;
  setUser: (user: UserProfile) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryPill: string;
  setSelectedCategoryPill: (id: string) => void;

  // Schedule
  scheduleDays: ScheduleDay[];
  selectedDate: string; // YYYY-MM-DD
  setSelectedDate: (date: string) => void;
  todayFocus: DailyFocusWorkout;

  // Active Live Workout Session
  activeWorkout: ActiveWorkoutState;
  startWorkout: (title?: string) => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  finishWorkout: () => void;
  incrementElapsed: () => void;
  markSetCompleted: (exerciseId: string, setNumber: number) => void;

  // Bookmarks & Likes
  bookmarkedWorkouts: string[];
  toggleBookmark: (workoutId: string) => void;

  // Modals & Feedback
  isFeedbackModalOpen: boolean;
  setFeedbackModalOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: mockUserProfile,
  setUser: (user) => set({ user }),

  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  selectedCategoryPill: 'plan_strength',
  setSelectedCategoryPill: (selectedCategoryPill) => set({ selectedCategoryPill }),

  scheduleDays: mockScheduleDays,
  selectedDate: '2026-06-30', // Tuesday 30 Jun (matching reference image)
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  todayFocus: mockTodayFocus,

  activeWorkout: {
    isActive: false,
    workoutTitle: 'Biceps Workout',
    elapsedSeconds: 0,
    currentExerciseIndex: 0,
    completedSetsMap: { ex_barbell_curl: 4 },
  },

  startWorkout: (title = 'Biceps Workout') =>
    set({
      activeWorkout: {
        isActive: true,
        workoutTitle: title,
        elapsedSeconds: 0,
        currentExerciseIndex: 0,
        completedSetsMap: {},
      },
    }),

  pauseWorkout: () =>
    set((state) => ({
      activeWorkout: { ...state.activeWorkout, isActive: false },
    })),

  resumeWorkout: () =>
    set((state) => ({
      activeWorkout: { ...state.activeWorkout, isActive: true },
    })),

  finishWorkout: () =>
    set({
      activeWorkout: {
        isActive: false,
        workoutTitle: '',
        elapsedSeconds: 0,
        currentExerciseIndex: 0,
        completedSetsMap: {},
      },
    }),

  incrementElapsed: () =>
    set((state) => ({
      activeWorkout: {
        ...state.activeWorkout,
        elapsedSeconds: state.activeWorkout.elapsedSeconds + 1,
      },
    })),

  markSetCompleted: (exerciseId: string, setNumber: number) =>
    set((state) => ({
      activeWorkout: {
        ...state.activeWorkout,
        completedSetsMap: {
          ...state.activeWorkout.completedSetsMap,
          [exerciseId]: setNumber,
        },
      },
    })),

  bookmarkedWorkouts: ['cat_strength'],
  toggleBookmark: (workoutId: string) =>
    set((state) => {
      const exists = state.bookmarkedWorkouts.includes(workoutId);
      return {
        bookmarkedWorkouts: exists
          ? state.bookmarkedWorkouts.filter((id) => id !== workoutId)
          : [...state.bookmarkedWorkouts, workoutId],
      };
    }),

  isFeedbackModalOpen: false,
  setFeedbackModalOpen: (isFeedbackModalOpen) => set({ isFeedbackModalOpen }),
}));
