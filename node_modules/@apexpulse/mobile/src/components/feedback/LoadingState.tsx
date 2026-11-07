import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing } from '../../theme';

export interface LoadingStateProps {
  message?: string;
  style?: ViewStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  style,
}) => {
  return (
    <View style={[styles.container, style]} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={colors.primary} />
      {message && <Text style={styles.messageText}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    minHeight: 180,
  },
  messageText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.md,
    letterSpacing: 0.5,
  },
});
