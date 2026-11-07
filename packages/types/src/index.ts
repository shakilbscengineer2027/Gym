export type FitnessLevel = 'Beginner' | 'Intermediate' | 'Advance' | 'Elite';

export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Biceps'
  | 'Triceps'
  | 'Legs'
  | 'Core'
  | 'Full Body'
  | 'Mobility';

export type WorkoutCategory =
  | 'Strength'
  | 'Fat Loss'
  | 'Cardio'
  | 'Stretch'
  | 'Functional Fitness'
  | 'Mind & Mobility'
  | 'Core Strength';

export interface ExerciseItem {
  id: string;
  name: string;
  sets: number;
  repsRange: string;
  targetWeightKg?: number;
  completedSets?: number;
  isCompleted?: boolean;
  status: 'Completed' | 'Upcoming' | 'In Progress';
  thumbnailUrl: string;
  orderNumber: number;
  restTimeSeconds: number;
  muscleGroup: MuscleGroup;
  instructions?: string[];
}

export interface WorkoutPlan {
  id: string;
  title: string;
  category: WorkoutCategory;
  fitnessLevel: FitnessLevel;
  totalSessions: number;
  durationMinutes: number;
  estimatedCalories: number;
  description: string;
  heroImageUrl: string;
  exercises: ExerciseItem[];
  isBookmarked?: boolean;
}

export interface ScheduleDay {
  dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  dateNumber: number;
  monthName: string;
  fullDate: string; // YYYY-MM-DD
  hasWorkout: boolean;
  isCompleted: boolean;
}

export interface DailyFocusWorkout {
  id: string;
  focusTitle: string;
  subtitle: string;
  caloriesBurned: number;
  durationMinutes: number;
  heroImageUrl: string;
  statusBadge: string;
  exercises: ExerciseItem[];
}

export interface UserHealthStats {
  healthGradeScore: number; // e.g. 85
  healthGradeLabel: string;
  healthGradeDescription: string;
  currentHeartRateBpm: number;
  weeklyWorkoutTimeHours: number;
  weeklyWorkoutTimeMinutes: number;
  completedWorkoutsThisWeek: number;
  totalWorkoutsTargetThisWeek: number;
}

export interface TrainerInfo {
  id: string;
  name: string;
  avatarUrl: string;
  specialization: string;
  feedbackStatus: string;
  unreadFeedback: boolean;
  rating: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  fitnessLevel: FitnessLevel;
  joinedDate: string;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  bodyFatPercent?: number;
}

export interface NutritionDay {
  date: string;
  targetCalories: number;
  consumedCalories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  waterMl: number;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  timeAgo: string;
  workoutSummary: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}
