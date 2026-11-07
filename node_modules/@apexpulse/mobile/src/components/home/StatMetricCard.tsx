import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Heart, Gauge } from 'lucide-react-native';
import { colors, typography, radii, spacing, shadows } from '../../theme';

export interface StatMetricCardProps {
  type: 'heartRate' | 'workoutTime';
  value: string | number;
  unit?: string;
  subtitle?: string;
  onPress?: () => void;
}

export const StatMetricCard: React.FC<StatMetricCardProps> = ({
  type,
  value,
  unit,
  subtitle,
  onPress,
}) => {
  const isHeart = type === 'heartRate';
  const label = isHeart ? 'Heart Rate' : 'Workout Time';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>{label}</Text>
        <View style={styles.iconCircle}>
          {isHeart ? (
            <Heart size={16} color={colors.primary} fill={colors.primary} />
          ) : (
            <Gauge size={16} color={colors.primary} />
          )}
        </View>
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.valueText}>{value}</Text>
        {unit && <Text style={styles.unitText}> {unit}</Text>}
      </View>

      {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.cardSurface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: '#1E280A',
    borderWidth: 1,
    borderColor: '#303E12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  valueText: {
    ...typography.statNumber,
    color: colors.textPrimary,
  },
  unitText: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '700',
  },
  subtitleText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
});
