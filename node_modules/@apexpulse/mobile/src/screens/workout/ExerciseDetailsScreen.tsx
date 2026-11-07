import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Award } from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { mockTodayFocus } from '../../fixtures/mockData';
import { colors, typography, radii, spacing } from '../../theme';

type ExerciseDetailsRouteProp = RouteProp<RootStackParamList, 'ExerciseDetails'>;

export const ExerciseDetailsScreen: React.FC = () => {
  const route = useRoute<ExerciseDetailsRouteProp>();
  const navigation = useNavigation();
  const { title } = route.params;

  const exercise =
    mockTodayFocus.exercises.find((ex) => ex.id === route.params.exerciseId) ||
    mockTodayFocus.exercises[0];

  return (
    <ScreenContainer scrollable={true}>
      <Header
        title={title}
        onBackPress={() => navigation.goBack()}
      />

      {/* Exercise Demonstration Media */}
      <View style={styles.mediaContainer}>
        <Image
          source={{ uri: exercise.thumbnailUrl }}
          style={styles.exerciseImage}
        />
        <View style={styles.badgeWrapper}>
          <Badge label={exercise.muscleGroup} variant="lime" />
        </View>
      </View>

      {/* Target Metrics */}
      <View style={styles.targetRow}>
        <Card style={styles.targetBox}>
          <Text style={styles.targetLabel}>Target Sets</Text>
          <Text style={styles.targetValue}>{exercise.sets}</Text>
        </Card>
        <Card style={styles.targetBox}>
          <Text style={styles.targetLabel}>Reps Range</Text>
          <Text style={styles.targetValue}>{exercise.repsRange}</Text>
        </Card>
        <Card style={styles.targetBox}>
          <Text style={styles.targetLabel}>Rest Timer</Text>
          <Text style={styles.targetValue}>{exercise.restTimeSeconds}s</Text>
        </Card>
      </View>

      {/* Personal Best Record */}
      <Card variant="elevated" style={styles.prCard}>
        <Award size={22} color={colors.primary} />
        <View style={styles.prInfo}>
          <Text style={styles.prTitle}>Personal Best</Text>
          <Text style={styles.prDetails}>
            {exercise.targetWeightKg} kg × 10 reps (Estimated 1RM: 55 kg)
          </Text>
        </View>
      </Card>

      {/* Execution Instructions */}
      <Text style={styles.sectionTitle}>Movement Execution</Text>
      <Card style={styles.instructionsCard}>
        {exercise.instructions?.map((step, idx) => (
          <View key={idx} style={styles.stepRow}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumber}>{idx + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </Card>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  mediaContainer: {
    height: 220,
    borderRadius: radii.xxl,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: spacing.md,
    backgroundColor: '#16161A',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgeWrapper: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  targetBox: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  targetLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  targetValue: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '800',
    marginTop: 4,
  },
  prCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  prInfo: {
    marginLeft: spacing.md,
  },
  prTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  prDetails: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  instructionsCard: {
    padding: spacing.md,
    marginBottom: spacing.xxl,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  stepNumber: {
    ...typography.caption,
    color: colors.textOnPrimary,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
