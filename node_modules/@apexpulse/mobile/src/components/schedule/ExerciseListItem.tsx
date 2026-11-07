import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Check, Clock, ChevronRight } from 'lucide-react-native';
import { ExerciseItem } from '@apexpulse/types';
import { colors, typography, radii, spacing, shadows } from '../../theme';

export interface ExerciseListItemProps {
  exercise: ExerciseItem;
  onPress?: () => void;
}

export const ExerciseListItem: React.FC<ExerciseListItemProps> = ({
  exercise,
  onPress,
}) => {
  const isCompleted = exercise.status === 'Completed';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
    >
      <View style={styles.thumbnailWrapper}>
        <Image
          source={{ uri: exercise.thumbnailUrl }}
          style={styles.thumbnail}
        />
        <View style={styles.orderBadge}>
          <Text style={styles.orderNumber}>{exercise.orderNumber}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {exercise.name}
        </Text>
        <Text style={styles.setsReps}>
          {exercise.sets} Sets • {exercise.repsRange}
        </Text>
      </View>

      <View
        style={[
          styles.statusBadge,
          isCompleted ? styles.statusCompleted : styles.statusUpcoming,
        ]}
      >
        {isCompleted ? (
          <Check size={12} color="#34D399" strokeWidth={3} style={styles.statusIcon} />
        ) : (
          <Clock size={12} color={colors.textSecondary} style={styles.statusIcon} />
        )}
        <Text
          style={[
            styles.statusText,
            isCompleted ? styles.statusTextCompleted : styles.statusTextUpcoming,
          ]}
        >
          {exercise.status}
        </Text>
        <ChevronRight
          size={12}
          color={isCompleted ? '#34D399' : colors.textMuted}
          style={styles.chevron}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16161A',
    borderRadius: radii.xl,
    padding: spacing.sm + 2,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#24242B',
    ...shadows.card,
  },
  thumbnailWrapper: {
    position: 'relative',
    width: 52,
    height: 52,
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: radii.md,
    backgroundColor: colors.backgroundElevated,
    resizeMode: 'cover',
  },
  orderBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#16161A',
  },
  orderNumber: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '900',
    color: colors.textOnPrimary,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  name: {
    ...typography.h4,
    color: colors.textPrimary,
    fontSize: 14,
  },
  setsReps: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.full,
  },
  statusCompleted: {
    backgroundColor: 'rgba(6, 78, 59, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.5)',
  },
  statusUpcoming: {
    backgroundColor: '#202026',
    borderWidth: 1,
    borderColor: '#2B2B33',
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextCompleted: {
    color: '#34D399',
  },
  statusTextUpcoming: {
    color: colors.textSecondary,
  },
  chevron: {
    marginLeft: 2,
  },
});
