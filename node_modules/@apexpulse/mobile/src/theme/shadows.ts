import { ViewStyle, Platform } from 'react-native';
import { colors } from './colors';

export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }) as ViewStyle,

  neonGlow: Platform.select({
    ios: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.45,
      shadowRadius: 12,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }) as ViewStyle,

  floatingButton: Platform.select({
    ios: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 14,
    },
    android: {
      elevation: 10,
    },
    default: {},
  }) as ViewStyle,
};
