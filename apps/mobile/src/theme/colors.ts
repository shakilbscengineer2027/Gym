export const colors = {
  // Backgrounds
  background: '#0B0B0C', // Deep black
  backgroundSecondary: '#121214', // Dark charcoal
  backgroundElevated: '#18181B', // Slightly elevated surface
  cardSurface: '#19191C', // Card background matching mockup
  cardBorder: '#27272A', // Subtle boundary stroke
  cardBorderSubtle: '#1F1F23',

  // Accents - Neon Lime Identity
  primary: '#D0FD3E', // Vivid electric neon lime green
  primaryLight: '#E2FE73',
  primaryDark: '#A8D61A',
  primaryMuted: '#243209', // Dark lime tint for backgrounds
  primaryMutedBorder: '#3E570F',

  // Secondary Accents & Statuses
  goldYellow: '#FCD34D', // Gold/yellow for "See All >" & session counts
  goldMuted: '#382D07',
  heartRed: '#EF4444',
  gaugeGreen: '#10B981',
  blueAccent: '#3B82F6',

  // Status Indicators
  statusCompleted: '#34D399',
  statusCompletedBg: '#064E3B',
  statusUpcoming: '#71717A',
  statusUpcomingBg: '#27272A',
  statusInProgress: '#D0FD3E',

  // Typography
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  textDisabled: '#52525B',
  textOnPrimary: '#000000', // Crisp black text on neon lime buttons

  // Interactive Surfaces & Inputs
  inputBackground: '#19191D',
  inputBorder: '#2C2C32',
  inputPlaceholder: '#71717A',
  pillActiveBg: '#D0FD3E',
  pillActiveText: '#000000',
  pillInactiveBg: '#1C1C20',
  pillInactiveText: '#A1A1AA',
  pillInactiveBorder: '#292930',

  // Navigation
  tabBarBackground: '#0F0F12',
  tabBarBorder: '#1D1D22',
  tabBarActive: '#D0FD3E',
  tabBarInactive: '#71717A',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.75)',
} as const;

export type ColorTokens = typeof colors;
