import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Bell } from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { SearchBar } from '../../components/common/SearchBar';
import { IconButton } from '../../components/common/IconButton';
import { CategoryPillList } from '../../components/home/CategoryPillList';
import { HealthGradeCard } from '../../components/home/HealthGradeCard';
import { StatMetricCard } from '../../components/home/StatMetricCard';
import { TrainerCard } from '../../components/home/TrainerCard';
import { TodayWorkoutCard } from '../../components/home/TodayWorkoutCard';
import {
  mockHealthStats,
  mockPopularPlans,
  mockTrainer,
} from '../../fixtures/mockData';
import { useAppStore } from '../../store/workoutStore';
import { colors, typography, radii, spacing } from '../../theme';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {
    user,
    searchQuery,
    setSearchQuery,
    selectedCategoryPill,
    setSelectedCategoryPill,
  } = useAppStore();

  return (
    <ScreenContainer scrollable={true}>
      {/* Top Header Row: Avatar, Welcome Back, Name & Notification Button */}
      <View style={styles.topBar}>
        <View style={styles.userInfoWrapper}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' })}
            activeOpacity={0.8}
          >
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          </TouchableOpacity>
          <View style={styles.greetingContainer}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.userName}>{user.fullName}</Text>
          </View>
        </View>

        <IconButton
          icon={<Bell size={18} color={colors.textPrimary} />}
          onPress={() => navigation.navigate('Notifications')}
          hasNotificationDot={true}
          size={42}
          backgroundColor="#18181D"
          borderColor="#26262E"
        />
      </View>

      {/* Search Bar with Filter */}
      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search your workouts..."
          onFilterPress={() => navigation.navigate('WorkoutDetails', { categoryId: 'cat_strength', title: 'Filters' })}
        />
      </View>

      {/* Popular Plans Category Pills */}
      <CategoryPillList
        categories={mockPopularPlans}
        selectedId={selectedCategoryPill}
        onSelectCategory={setSelectedCategoryPill}
      />

      {/* Health Grade Neon Lime Hero Card */}
      <HealthGradeCard
        score={mockHealthStats.healthGradeScore}
        title={mockHealthStats.healthGradeLabel}
        description={mockHealthStats.healthGradeDescription}
        onPress={() => navigation.navigate('MainTabs', { screen: 'Progress' })}
      />

      {/* Metrics Row: Heart Rate & Workout Time */}
      <View style={styles.metricsRow}>
        <StatMetricCard
          type="heartRate"
          value={mockHealthStats.currentHeartRateBpm}
          unit="BPM"
          onPress={() => navigation.navigate('MainTabs', { screen: 'Progress' })}
        />
        <View style={styles.metricSpacer} />
        <StatMetricCard
          type="workoutTime"
          value={`${mockHealthStats.weeklyWorkoutTimeHours}h ${mockHealthStats.weeklyWorkoutTimeMinutes}m`}
          subtitle="this week"
          onPress={() => navigation.navigate('WorkoutHistory')}
        />
      </View>

      {/* Trainer Card */}
      <TrainerCard
        name={mockTrainer.name}
        avatarUrl={mockTrainer.avatarUrl}
        feedbackText={mockTrainer.feedbackStatus}
        hasUnreadFeedback={mockTrainer.unreadFeedback}
        onPress={() => navigation.navigate('Trainer')}
        onMessagePress={() => navigation.navigate('Trainer')}
      />

      {/* Today's Workout Card */}
      <TodayWorkoutCard
        title="Biceps Workout"
        levelBadge="Mid-Level"
        onPress={() =>
          navigation.navigate('WorkoutDetails', {
            categoryId: 'cat_strength',
            title: 'Biceps Workout',
          })
        }
        onPlayPress={() =>
          navigation.navigate('ActiveWorkout', { workoutTitle: 'Biceps Workout' })
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  userInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: '#2D2D36',
    backgroundColor: '#1E1E24',
  },
  greetingContainer: {
    marginLeft: spacing.md,
  },
  welcomeText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
  },
  userName: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  searchSection: {
    marginVertical: spacing.sm,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.xs,
  },
  metricSpacer: {
    width: spacing.md,
  },
});
