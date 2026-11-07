import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Flame, Clock, ChevronRight } from 'lucide-react-native';
import { colors, typography, radii, spacing, shadows } from '../../theme';

export interface TodayFocusCardProps {
  badgeLabel?: string;
  title?: string;
  calories?: number;
  durationMinutes?: number;
  imageUrl?: string;
  onStartPress?: () => void;
}

export const TodayFocusCard: React.FC<TodayFocusCardProps> = ({
  badgeLabel = "Today's Focus",
  title = 'Biceps Workout',
  calories = 1900,
  durationMinutes = 60,
  imageUrl = 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
  onStartPress,
}) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.backgroundImage} />
      <View style={styles.gradientOverlay} />

      <View style={styles.content}>
        <View style={styles.badge}>
          <View style={styles.dot} />
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Flame size={14} color={colors.goldYellow} style={styles.statIcon} />
            <Text style={styles.statText}>{calories} Kcal</Text>
          </View>
          <View style={styles.statItem}>
            <Clock size={14} color={colors.textSecondary} style={styles.statIcon} />
            <Text style={styles.statText}>{durationMinutes} Min</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onStartPress}
          activeOpacity={0.8}
          style={styles.startButton}
        >
          <Text style={styles.startButtonText}>Start Workout</Text>
          <ChevronRight size={16} color={colors.textOnPrimary} strokeWidth={3} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 185,
    borderRadius: radii.xxl,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#16161A',
    borderWidth: 1,
    borderColor: '#24242B',
    marginVertical: spacing.sm,
    ...shadows.card,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.5,
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11, 11, 12, 0.7)',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 3,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.goldYellow,
    marginRight: 6,
  },
  badgeText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '800',
    marginVertical: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  statIcon: {
    marginRight: 4,
  },
  statText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
    ...shadows.neonGlow,
  },
  startButtonText: {
    ...typography.buttonText,
    color: colors.textOnPrimary,
    fontWeight: '800',
    fontSize: 12,
    marginRight: 4,
  },
});
