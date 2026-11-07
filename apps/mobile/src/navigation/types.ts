import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Workout: undefined;
  Progress: undefined;
  Schedule: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  // Auth Stack
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;

  // Main Tab Container
  MainTabs: NavigatorScreenParams<MainTabParamList>;

  // Sub-screens & Modals
  WorkoutDetails: { categoryId: string; title: string };
  ExerciseDetails: { exerciseId: string; title: string };
  ExerciseLibrary: undefined;
  CreateWorkout: undefined;
  BodyMeasurements: undefined;
  ActiveWorkout: { workoutTitle?: string };
  WorkoutHistory: undefined;
  Nutrition: undefined;
  Trainer: undefined;
  Community: undefined;
  Notifications: undefined;
  Settings: undefined;
  PrivacySecurity: undefined;
};
