import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Inbox } from 'lucide-react-native';
import { Button } from '../common/Button';
import { colors, typography, radii, spacing } from '../../theme';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionTitle?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionTitle,
  onActionPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]} accessibilityRole="text">
      <View style={styles.iconCircle}>
        {icon || <Inbox size={32} color={colors.textSecondary} />}
      </View>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionTitle && onActionPress && (
        <Button
          title={actionTitle}
          onPress={onActionPress}
          variant="secondary"
          size="sm"
          style={styles.actionBtn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginVertical: spacing.lg,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: radii.full,
    backgroundColor: '#16161A',
    borderWidth: 1,
    borderColor: '#24242B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 20,
    maxWidth: 280,
  },
  actionBtn: {
    marginTop: spacing.lg,
  },
});
