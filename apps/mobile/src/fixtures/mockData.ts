import {
  UserProfile,
  UserHealthStats,
  TrainerInfo,
  ScheduleDay,
  DailyFocusWorkout,
  CommunityPost,
} from '@apexpulse/types';

export const mockUserProfile: UserProfile = {
  id: 'usr_019304a1',
  fullName: 'Michael Law',
  email: 'michael.law@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  fitnessLevel: 'Advance',
  joinedDate: 'Jan 2024',
  heightCm: 182,
  weightKg: 82.5,
  targetWeightKg: 80.0,
  bodyFatPercent: 12.8,
};

export const mockHealthStats: UserHealthStats = {
  healthGradeScore: 85,
  healthGradeLabel: 'Health Grade',
  healthGradeDescription:
    'Your fitness journey is on track. Stay consistent to achieve even better results.',
  currentHeartRateBpm: 120,
  weeklyWorkoutTimeHours: 5,
  weeklyWorkoutTimeMinutes: 40,
  completedWorkoutsThisWeek: 3,
  totalWorkoutsTargetThisWeek: 6,
};

export const mockTrainer: TrainerInfo = {
  id: 'trn_coach_narez',
  name: 'Coach Narez',
  avatarUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150&auto=format&fit=crop&q=80',
  specialization: 'Hypertrophy & Functional Conditioning',
  feedbackStatus: 'New Feedback Available',
  unreadFeedback: true,
  rating: 4.95,
};

export const mockWorkoutCategories = [
  {
    id: 'cat_strength',
    title: 'Strength Training',
    sessionsCount: 42,
    description:
      'Build muscle, increase strength, and improve your overall performance with guided workouts.',
    imageUrl:
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80',
    fitnessLevel: 'Advance' as const,
  },
  {
    id: 'cat_functional',
    title: 'Functional Fitness',
    sessionsCount: 28,
    description:
      'Enhance your mobility, balance, and endurance through full-body functional exercises.',
    imageUrl:
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    fitnessLevel: 'Intermediate' as const,
  },
  {
    id: 'cat_mobility',
    title: 'Mind & Mobility',
    sessionsCount: 34,
    description:
      'Improve flexibility, reduce muscle tension, and support recovery with guided mobility routines.',
    imageUrl:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
    fitnessLevel: 'Beginner' as const,
  },
  {
    id: 'cat_core',
    title: 'Core Strength',
    sessionsCount: 36,
    description:
      'Strengthen your core muscles to improve balance, stability, and posture.',
    imageUrl:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80',
    fitnessLevel: 'Advance' as const,
  },
];

export const mockScheduleDays: ScheduleDay[] = [
  { dayOfWeek: 'Mon', dateNumber: 29, monthName: 'Jun', fullDate: '2026-06-29', hasWorkout: true, isCompleted: true },
  { dayOfWeek: 'Tue', dateNumber: 30, monthName: 'Jun', fullDate: '2026-06-30', hasWorkout: true, isCompleted: false },
  { dayOfWeek: 'Wed', dateNumber: 1, monthName: 'Jul', fullDate: '2026-07-01', hasWorkout: false, isCompleted: false },
  { dayOfWeek: 'Thu', dateNumber: 2, monthName: 'Jul', fullDate: '2026-07-02', hasWorkout: true, isCompleted: false },
  { dayOfWeek: 'Fri', dateNumber: 3, monthName: 'Jul', fullDate: '2026-07-03', hasWorkout: true, isCompleted: false },
  { dayOfWeek: 'Sat', dateNumber: 4, monthName: 'Jul', fullDate: '2026-07-04', hasWorkout: false, isCompleted: false },
  { dayOfWeek: 'Sun', dateNumber: 5, monthName: 'Jul', fullDate: '2026-07-05', hasWorkout: true, isCompleted: false },
];

export const mockTodayFocus: DailyFocusWorkout = {
  id: 'focus_biceps_01',
  focusTitle: 'Biceps Workout',
  subtitle: "Today's Focus",
  caloriesBurned: 1900,
  durationMinutes: 60,
  statusBadge: 'Mid-Level',
  heroImageUrl:
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
  exercises: [
    {
      id: 'ex_barbell_curl',
      name: 'Barbell Curl',
      sets: 4,
      repsRange: '10-12 Reps',
      targetWeightKg: 42.5,
      completedSets: 4,
      isCompleted: true,
      status: 'Completed',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&auto=format&fit=crop&q=80',
      orderNumber: 1,
      restTimeSeconds: 90,
      muscleGroup: 'Biceps',
      instructions: [
        'Stand tall with feet shoulder-width apart.',
        'Grip barbell with supinated hands.',
        'Curl bar toward chest keeping elbows pinned to ribs.',
        'Squeeze biceps at the top peak contraction, then lower slowly with 3-second eccentric tempo.',
      ],
    },
    {
      id: 'ex_hammer_curl',
      name: 'Hammer Curl',
      sets: 3,
      repsRange: '10-12 Reps',
      targetWeightKg: 20.0,
      completedSets: 0,
      isCompleted: false,
      status: 'Upcoming',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=80',
      orderNumber: 2,
      restTimeSeconds: 60,
      muscleGroup: 'Biceps',
      instructions: [
        'Hold dumbbells with neutral grip (palms facing each other).',
        'Keep upper arms stationary and curl weights upward.',
        'Contract brachialis and forearm flexors at apex.',
      ],
    },
    {
      id: 'ex_preacher_curl',
      name: 'Preacher Curl',
      sets: 3,
      repsRange: '10-12 Reps',
      targetWeightKg: 30.0,
      completedSets: 0,
      isCompleted: false,
      status: 'Upcoming',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&auto=format&fit=crop&q=80',
      orderNumber: 3,
      restTimeSeconds: 75,
      muscleGroup: 'Biceps',
      instructions: [
        'Position armpits securely against the angled preacher pad.',
        'Extend arms without hyperextending elbows at the bottom.',
        'Curl EZ-bar upwards squeezing biceps intensely.',
      ],
    },
  ],
};

export const mockPopularPlans = [
  { id: 'plan_strength', label: 'Strength', iconName: 'dumbbell', active: true },
  { id: 'plan_fat_loss', label: 'Fat Loss', iconName: 'flame', active: false },
  { id: 'plan_cardio', label: 'Cardio', iconName: 'heart', active: false },
  { id: 'plan_stretch', label: 'Stretch', iconName: 'activity', active: false },
];

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'post_01',
    authorName: 'Alex Thorne',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    timeAgo: '2h ago',
    workoutSummary: 'Hit a new PR on Deadlifts! 210kg x 3 reps. Consistency is everything.',
    likesCount: 42,
    commentsCount: 6,
    isLiked: true,
  },
  {
    id: 'post_02',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    timeAgo: '5h ago',
    workoutSummary: 'Completed 60min Functional Conditioning & Mobility session with Coach Narez.',
    likesCount: 28,
    commentsCount: 4,
    isLiked: false,
  },
];
