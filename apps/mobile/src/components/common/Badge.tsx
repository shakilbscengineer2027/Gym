import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, typography, radii, spacing } from '../../theme';

export interface BadgeProps {
  label: string;
  variant?: 'lime' | 'success' | 'upcoming' | 'neutral' | 'gold';
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  icon,
  style,
  textStyle,
  size = 'md',
}) => {
  const getBadgeStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.base];
    if (size === 'sm') list.push(styles.sizeSm);
    else list.push(styles.sizeMd);

    switch (variant) {
      case 'lime':
        list.push(styles.lime);
        break;
      case 'success':
        list.push(styles.success);
        break;
      case 'upcoming':
        list.push(styles.upcoming);
        break;
      case 'gold':
        list.push(styles.gold);
        break;
      case 'neutral':
      default:
        list.push(styles.neutral);
        break;
    }

    if (style) list.push(style);
    return list;
  };

  const getTextStyle = (): TextStyle[] => {
    const list: TextStyle[] = [styles.text];
    if (size === 'sm') list.push(styles.textSm);

    switch (variant) {
      case 'lime':
        list.push(styles.textLime);
        break;
      case 'success':
        list.push(styles.textSuccess);
        break;
      case 'upcoming':
        list.push(styles.textUpcoming);
        break;
      case 'gold':
        list.push(styles.textGold);
        break;
      case 'neutral':
      default:
        list.push(styles.textNeutral);
        break;
    }

    if (textStyle) list.push(textStyle);
    return list;
  };

  return (
    <View style={getBadgeStyle()}>
      {icon && <View style={styles.iconWrapper}>{icon}</View>}
      <Text style={getTextStyle()}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.full,
    alignSelf: 'flex-start',
  },
  sizeSm: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  sizeMd: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
  },
  lime: {
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: colors.primaryMutedBorder,
  },
  success: {
    backgroundColor: '#064E3B',
    borderWidth: 1,
    borderColor: '#059669',
  },
  upcoming: {
    backgroundColor: '#202025',
    borderWidth: 1,
    borderColor: '#2D2D35',
  },
  gold: {
    backgroundColor: '#35290A',
    borderWidth: 1,
    borderColor: '#785A0D',
  },
  neutral: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  iconWrapper: {
    marginRight: 4,
  },
  text: {
    ...typography.badgeText,
  },
  textSm: {
    fontSize: 10,
  },
  textLime: {
    color: colors.primary,
  },
  textSuccess: {
    color: '#34D399',
  },
  textUpcoming: {
    color: '#A1A1AA',
  },
  textGold: {
    color: colors.goldYellow,
  },
  textNeutral: {
    color: colors.textSecondary,
  },
});
