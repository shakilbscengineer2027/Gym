import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, typography, radii, spacing, shadows } from '../../theme';

export interface WorkoutCategoryCardProps {
  title: string;
  sessionsCount: number;
  description: string;
  imageUrl: string;
  onPress?: () => void;
}

export const WorkoutCategoryCard: React.FC<WorkoutCategoryCardProps> = ({
  title,
  sessionsCount,
  description,
  imageUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.card}
    >
      <Image source={{ uri: imageUrl }} style={styles.thumbnail} />

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.sessionsBadge}>
          <Text style={styles.sessionsText}>{sessionsCount} Sessions</Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#16161A',
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#24242B',
    alignItems: 'center',
    ...shadows.card,
  },
  thumbnail: {
    width: 88,
    height: 88,
    borderRadius: radii.lg,
    backgroundColor: colors.backgroundElevated,
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  sessionsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#262208',
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#4A3D0B',
    marginVertical: 4,
  },
  sessionsText: {
    ...typography.caption,
    color: colors.goldYellow,
    fontWeight: '700',
    fontSize: 10,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
});
