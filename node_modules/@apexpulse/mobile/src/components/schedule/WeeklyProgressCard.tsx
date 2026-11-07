import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radii, spacing, shadows } from '../../theme';

export interface WeeklyProgressCardProps {
  completed?: number;
  total?: number;
}

export const WeeklyProgressCard: React.FC<WeeklyProgressCardProps> = ({
  completed = 3,
  total = 6,
}) => {
  const percentage = Math.min(100, Math.round((completed / total) * 100));

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Weekly Progress</Text>
        <Text style={styles.countText}>
          {completed} of {total} Workouts
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#16161A',
    borderRadius: radii.xl,
    padding: spacing.md + 2,
    borderWidth: 1,
    borderColor: '#24242B',
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
    ...shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
    fontSize: 14,
  },
  countText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  progressTrack: {
    height: 6,
    borderRadius: radii.full,
    backgroundColor: '#24242C',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radii.full,
    backgroundColor: colors.primary,
  },
});
