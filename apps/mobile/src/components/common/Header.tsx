import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { colors, typography, radii, spacing } from '../../theme';

export interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  subtitle?: string;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  rightAction,
  subtitle,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContainer}>
        {onBackPress && (
          <TouchableOpacity
            onPress={onBackPress}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <ChevronLeft size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.rightContainer}>
        {rightAction || <View style={styles.placeholder} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: radii.full,
    backgroundColor: '#1C1C22',
    borderWidth: 1,
    borderColor: '#2A2A32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 44,
  },
});
