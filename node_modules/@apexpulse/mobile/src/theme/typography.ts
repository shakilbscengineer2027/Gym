import { TextStyle, Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  h1: {
    fontFamily,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  } as TextStyle,
  h2: {
    fontFamily,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
  } as TextStyle,
  h3: {
    fontFamily,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: -0.2,
  } as TextStyle,
  h4: {
    fontFamily,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  } as TextStyle,
  bodyLarge: {
    fontFamily,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  } as TextStyle,
  bodyMedium: {
    fontFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  } as TextStyle,
  bodySmall: {
    fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  } as TextStyle,
  buttonText: {
    fontFamily,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  } as TextStyle,
  caption: {
    fontFamily,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
  } as TextStyle,
  badgeText: {
    fontFamily,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  } as TextStyle,
  statNumber: {
    fontFamily,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  } as TextStyle,
};

export type TypographyTokens = typeof typography;
