import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, View } from 'react-native';
import { colors, radii, spacing } from '../../theme';

export interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
  hasNotificationDot?: boolean;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 44,
  backgroundColor = colors.backgroundElevated,
  borderColor = colors.cardBorder,
  hasNotificationDot = false,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: radii.full,
          backgroundColor,
          borderColor,
        },
        style,
      ]}
    >
      {icon}
      {hasNotificationDot && <View style={styles.dot} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    top: spacing.xs + 2,
    right: spacing.xs + 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
