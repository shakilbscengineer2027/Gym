import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRight } from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { WeeklyCalendarStrip } from '../../components/schedule/WeeklyCalendarStrip';
import { TodayFocusCard } from '../../components/schedule/TodayFocusCard';
import { ExerciseListItem } from '../../components/schedule/ExerciseListItem';
import { WeeklyProgressCard } from '../../components/schedule/WeeklyProgressCard';
import { useAppStore } from '../../store/workoutStore';
import { colors, typography, spacing } from '../../theme';

type ScheduleScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ScheduleScreen: React.FC = () => {
  const navigation = useNavigation<ScheduleScreenNavigationProp>();
  const {
    scheduleDays,
    selectedDate,
    setSelectedDate,
    todayFocus,
    startWorkout,
  } = useAppStore();

  const handleStartWorkout = () => {
    startWorkout(todayFocus.focusTitle);
    navigation.navigate('ActiveWorkout', { workoutTitle: todayFocus.focusTitle });
  };

  return (
    <ScreenContainer scrollable={true}>
      {/* Header with Back button and "Schedule" title */}
      <Header
        title="Schedule"
        onBackPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
      />

      {/* Workout Plan Section Header */}
      <View style={styles.planHeaderRow}>
        <View>
          <Text style={styles.planTitle}>Workout Plan</Text>
          <Text style={styles.planSubtitle}>Track, train, and improve</Text>
        </View>

        <TouchableOpacity
          onPress={() => {}}
          activeOpacity={0.7}
          style={styles.seeAllButton}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={14} color={colors.goldYellow} />
        </TouchableOpacity>
      </View>

      {/* 7-Day Horizontal Calendar Strip */}
      <WeeklyCalendarStrip
        days={scheduleDays}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {/* Today's Focus Card */}
      <TodayFocusCard
        title={todayFocus.focusTitle}
        calories={todayFocus.caloriesBurned}
        durationMinutes={todayFocus.durationMinutes}
        imageUrl={todayFocus.heroImageUrl}
        onStartPress={handleStartWorkout}
      />

      {/* Today's Plan Section */}
      <View style={styles.todayPlanHeaderRow}>
        <Text style={styles.sectionTitle}>Today's Plan</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.sectionSeeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* List of Exercises */}
      {todayFocus.exercises.map((exercise) => (
        <ExerciseListItem
          key={exercise.id}
          exercise={exercise}
          onPress={() =>
            navigation.navigate('ExerciseDetails', {
              exerciseId: exercise.id,
              title: exercise.name,
            })
          }
        />
      ))}

      {/* Weekly Progress Card */}
      <WeeklyProgressCard completed={3} total={6} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  planTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  planSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  seeAllText: {
    ...typography.caption,
    color: colors.goldYellow,
    fontWeight: '700',
    fontSize: 12,
    marginRight: 2,
  },
  todayPlanHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  sectionSeeAll: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
