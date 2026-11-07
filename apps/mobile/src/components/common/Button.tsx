import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { colors, typography, radii, spacing } from '../../theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getContainerStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.base];

    // Sizes
    if (size === 'sm') list.push(styles.sizeSm);
    else if (size === 'lg') list.push(styles.sizeLg);
    else list.push(styles.sizeMd);

    // Variants
    if (variant === 'primary') list.push(styles.variantPrimary);
    else if (variant === 'secondary') list.push(styles.variantSecondary);
    else if (variant === 'outline') list.push(styles.variantOutline);
    else if (variant === 'ghost') list.push(styles.variantGhost);

    if (fullWidth) list.push(styles.fullWidth);
    if (disabled || loading) list.push(styles.disabled);
    if (style) list.push(style);

    return list;
  };

  const getTextStyle = (): TextStyle[] => {
    const list: TextStyle[] = [styles.textBase];

    if (size === 'sm') list.push(styles.textSm);
    else if (size === 'lg') list.push(styles.textLg);
    else list.push(styles.textMd);

    if (variant === 'primary') list.push(styles.textPrimary);
    else if (variant === 'secondary' || variant === 'outline' || variant === 'ghost') {
      list.push(styles.textLight);
    }

    if (disabled) list.push(styles.textDisabled);
    if (textStyle) list.push(textStyle);

    return list;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={getContainerStyle()}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.textOnPrimary : colors.primary}
        />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
          {rightIcon && <View style={styles.rightIconWrapper}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeSm: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
  },
  sizeMd: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
  },
  sizeLg: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
  },
  variantPrimary: {
    backgroundColor: colors.primary,
  },
  variantSecondary: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  variantOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  variantGhost: {
    backgroundColor: 'transparent',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  leftIconWrapper: {
    marginRight: spacing.xs + 2,
  },
  rightIconWrapper: {
    marginLeft: spacing.xs + 2,
  },
  textBase: {
    ...typography.buttonText,
  },
  textSm: {
    fontSize: 12,
  },
  textMd: {
    fontSize: 14,
  },
  textLg: {
    fontSize: 16,
  },
  textPrimary: {
    color: colors.textOnPrimary,
    fontWeight: '800',
  },
  textLight: {
    color: colors.textPrimary,
  },
  textDisabled: {
    color: colors.textDisabled,
  },
});
