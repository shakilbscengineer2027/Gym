import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';
import { Button } from '../common/Button';
import { colors, typography, radii, spacing } from '../../theme';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something Went Wrong',
  message = 'An unexpected error occurred while loading this view.',
  onRetry,
  style,
}) => {
  return (
    <View style={[styles.container, style]} accessibilityRole="alert">
      <View style={styles.iconCircle}>
        <AlertTriangle size={32} color={colors.heartRed} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button
          title="Retry"
          onPress={onRetry}
          leftIcon={<RefreshCw size={14} color={colors.textOnPrimary} />}
          size="sm"
          style={styles.retryBtn}
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
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 20,
    maxWidth: 280,
  },
  retryBtn: {
    marginTop: spacing.lg,
  },
});
