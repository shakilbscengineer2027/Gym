import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Play } from 'lucide-react-native';
import { colors, typography, radii, spacing, shadows } from '../../theme';

export interface TodayWorkoutCardProps {
  title?: string;
  levelBadge?: string;
  imageUrl?: string;
  onPress?: () => void;
  onPlayPress?: () => void;
}

export const TodayWorkoutCard: React.FC<TodayWorkoutCardProps> = ({
  title = 'Biceps Workout',
  levelBadge = 'Mid-Level',
  imageUrl = 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
  onPress,
  onPlayPress,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeader}>Today's Workout</Text>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={styles.card}
      >
        <Image source={{ uri: imageUrl }} style={styles.backgroundImage} />
        <View style={styles.gradientOverlay} />

        <View style={styles.content}>
          <View style={styles.badgeContainer}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>{levelBadge}</Text>
          </View>

          <Text style={styles.title}>{title}</Text>

          <TouchableOpacity
            onPress={onPlayPress || onPress}
            activeOpacity={0.8}
            style={styles.playButton}
          >
            <Play size={16} color={colors.textPrimary} fill={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: spacing.md,
  },
  sectionHeader: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  card: {
    height: 160,
    borderRadius: radii.xxl,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#16161A',
    borderWidth: 1,
    borderColor: colors.cardBorder,
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
    opacity: 0.45,
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
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 4,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
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
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
