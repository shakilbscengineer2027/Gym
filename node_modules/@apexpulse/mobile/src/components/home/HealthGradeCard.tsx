import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, typography, radii, spacing, shadows } from '../../theme';

export interface HealthGradeCardProps {
  score?: number; // e.g. 85
  title?: string;
  description?: string;
  onPress?: () => void;
}

export const HealthGradeCard: React.FC<HealthGradeCardProps> = ({
  score = 85,
  title = 'Health Grade',
  description = 'Your fitness journey is on track. Stay consistent to achieve even better results.',
  onPress,
}) => {
  // Circular progress calculations
  const size = 68;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * score) / 100;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.card}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.progressContainer}>
        <Svg width={size} height={size}>
          {/* Background Track */}
          <Circle
            stroke="rgba(0, 0, 0, 0.15)"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Progress Indicator */}
          <Circle
            stroke="#000000"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.scoreTextWrapper}>
          <Text style={styles.scoreNumber}>{score}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: radii.xxl,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.neonGlow,
    marginVertical: spacing.md,
  },
  textContainer: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.textOnPrimary,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.bodySmall,
    color: '#263405',
    lineHeight: 18,
    fontWeight: '600',
  },
  progressContainer: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  scoreTextWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    ...typography.h4,
    color: colors.textOnPrimary,
    fontWeight: '900',
  },
});
