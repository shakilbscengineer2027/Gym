import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import { colors, typography, radii, spacing, shadows } from '../../theme';

export interface TrainerCardProps {
  name?: string;
  avatarUrl?: string;
  feedbackText?: string;
  hasUnreadFeedback?: boolean;
  onPress?: () => void;
  onMessagePress?: () => void;
}

export const TrainerCard: React.FC<TrainerCardProps> = ({
  name = 'Coach Narez',
  avatarUrl = 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150&auto=format&fit=crop&q=80',
  feedbackText = 'New Feedback Available',
  onPress,
  onMessagePress,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeader}>Trainer</Text>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={styles.card}
      >
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <View style={styles.infoWrapper}>
          <Text style={styles.trainerName}>{name}</Text>
          <Text style={styles.feedbackSubtitle}>{feedbackText}</Text>
        </View>

        <TouchableOpacity
          onPress={onMessagePress || onPress}
          activeOpacity={0.7}
          style={styles.messageButton}
        >
          <MessageSquare size={18} color={colors.textOnPrimary} fill={colors.textOnPrimary} />
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardSurface,
    borderRadius: radii.xl,
    padding: spacing.md + 2,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    backgroundColor: colors.backgroundElevated,
  },
  infoWrapper: {
    flex: 1,
    marginLeft: spacing.md,
  },
  trainerName: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  feedbackSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.neonGlow,
  },
});
