import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Flame, Clock, Dumbbell, Play, Bookmark } from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { ExerciseListItem } from '../../components/schedule/ExerciseListItem';
import { mockTodayFocus } from '../../fixtures/mockData';
import { useAppStore } from '../../store/workoutStore';
import { colors, typography, radii, spacing, shadows } from '../../theme';

type WorkoutDetailsRouteProp = RouteProp<RootStackParamList, 'WorkoutDetails'>;
type WorkoutDetailsNavProp = NativeStackNavigationProp<RootStackParamList>;

export const WorkoutDetailsScreen: React.FC = () => {
  const route = useRoute<WorkoutDetailsRouteProp>();
  const navigation = useNavigation<WorkoutDetailsNavProp>();
  const { title } = route.params;
  const { bookmarkedWorkouts, toggleBookmark, startWorkout } = useAppStore();

  const isBookmarked = bookmarkedWorkouts.includes(route.params.categoryId);

  const handleStart = () => {
    startWorkout(title);
    navigation.navigate('ActiveWorkout', { workoutTitle: title });
  };

  return (
    <ScreenContainer scrollable={true}>
      <Header
        title={title}
        onBackPress={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity
            onPress={() => toggleBookmark(route.params.categoryId)}
            style={styles.bookmarkBtn}
          >
            <Bookmark
              size={18}
              color={isBookmarked ? colors.primary : colors.textPrimary}
              fill={isBookmarked ? colors.primary : 'transparent'}
            />
          </TouchableOpacity>
        }
      />

      {/* Hero Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: mockTodayFocus.heroImageUrl }}
          style={styles.bannerImage}
        />
        <View style={styles.gradientOverlay} />
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>{title}</Text>
          <Text style={styles.bannerSubtitle}>
            Designed for hypertrophy and targeted mechanical tension.
          </Text>
        </View>
      </View>

      {/* Quick Stats Grid */}
      <View style={styles.statsRow}>
        <View style={styles.statPill}>
          <Clock size={16} color={colors.primary} />
          <Text style={styles.statText}>60 Min</Text>
        </View>
        <View style={styles.statPill}>
          <Flame size={16} color={colors.goldYellow} />
          <Text style={styles.statText}>1900 Kcal</Text>
        </View>
        <View style={styles.statPill}>
          <Dumbbell size={16} color={colors.primary} />
          <Text style={styles.statText}>3 Exercises</Text>
        </View>
      </View>

      {/* Exercise Routine Breakdown */}
      <Text style={styles.sectionTitle}>Exercises In Routine</Text>
      {mockTodayFocus.exercises.map((exercise) => (
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

      {/* Start Workout Primary Action Button */}
      <Button
        title="Start Workout Session"
        onPress={handleStart}
        leftIcon={<Play size={18} color={colors.textOnPrimary} fill={colors.textOnPrimary} />}
        fullWidth={true}
        size="lg"
        style={styles.startBtn}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  bookmarkBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: '#1C1C22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerContainer: {
    height: 200,
    borderRadius: radii.xxl,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: spacing.md,
    ...shadows.card,
  },
  bannerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11, 11, 12, 0.65)',
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.xl,
  },
  bannerTitle: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  bannerSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16161A',
    borderRadius: radii.full,
    paddingVertical: spacing.sm,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#24242B',
  },
  statText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '700',
    marginLeft: 6,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  startBtn: {
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },
});
