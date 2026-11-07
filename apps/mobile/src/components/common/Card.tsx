import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors, radii, shadows, spacing } from '../../theme';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'surface' | 'elevated' | 'accent' | 'outlined';
  onPress?: () => void;
  padding?: keyof typeof spacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'surface',
  onPress,
  padding = 'lg',
}) => {
  const getContainerStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [
      styles.base,
      { padding: spacing[padding] },
    ];

    if (variant === 'surface') list.push(styles.variantSurface);
    else if (variant === 'elevated') list.push(styles.variantElevated);
    else if (variant === 'accent') list.push(styles.variantAccent);
    else if (variant === 'outlined') list.push(styles.variantOutlined);

    if (style) list.push(style);
    return list;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={getContainerStyle()}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={getContainerStyle()}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  variantSurface: {
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
  },
  variantElevated: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.cardBorderSubtle,
    ...shadows.card,
  },
  variantAccent: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  variantOutlined: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
  },
});
