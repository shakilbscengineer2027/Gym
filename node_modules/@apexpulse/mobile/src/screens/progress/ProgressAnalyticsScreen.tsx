import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TrendingUp, Flame, Award, Heart } from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { colors, typography, radii, spacing } from '../../theme';

type ProgressNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProgressAnalyticsScreen: React.FC = () => {
  const navigation = useNavigation<ProgressNavigationProp>();

  return (
    <ScreenContainer scrollable={true}>
      <Header
        title="Fitness Progress"
        onBackPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
      />

      {/* Main Readiness & Score Banner */}
      <Card variant="accent" style={styles.heroCard}>
        <View style={styles.scoreRow}>
          <View>
            <Text style={styles.scoreTitle}>Daily Readiness</Text>
            <Text style={styles.scoreSubtitle}>Prime condition for heavy lifting</Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreNumber}>94</Text>
            <Text style={styles.scoreMax}>/100</Text>
          </View>
        </View>
      </Card>

      {/* Analytics Overview Grid */}
      <View style={styles.statsGrid}>
        <Card style={styles.statBox}>
          <Flame size={20} color={colors.primary} />
          <Text style={styles.statValue}>14,850</Text>
          <Text style={styles.statLabel}>Calories Burned</Text>
        </Card>

        <Card style={styles.statBox}>
          <TrendingUp size={20} color={colors.primary} />
          <Text style={styles.statValue}>18,400 kg</Text>
          <Text style={styles.statLabel}>Volume Lifted</Text>
        </Card>
      </View>

      {/* Strength PR Progression */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Personal Records</Text>
        <TouchableOpacity onPress={() => navigation.navigate('WorkoutHistory')}>
          <Text style={styles.seeAllText}>History</Text>
        </TouchableOpacity>
      </View>

      <Card style={styles.prCard}>
        <View style={styles.prRow}>
          <View style={styles.prIconBox}>
            <Award size={20} color={colors.primary} />
          </View>
          <View style={styles.prInfo}>
            <Text style={styles.prExercise}>Barbell Deadlift</Text>
            <Text style={styles.prDate}>Achieved 3 days ago</Text>
          </View>
          <Text style={styles.prWeight}>210 kg</Text>
        </View>

        <View style={styles.prDivider} />

        <View style={styles.prRow}>
          <View style={styles.prIconBox}>
            <Award size={20} color={colors.goldYellow} />
          </View>
          <View style={styles.prInfo}>
            <Text style={styles.prExercise}>Barbell Bench Press</Text>
            <Text style={styles.prDate}>Achieved last week</Text>
          </View>
          <Text style={styles.prWeight}>140 kg</Text>
        </View>

        <View style={styles.prDivider} />

        <View style={styles.prRow}>
          <View style={styles.prIconBox}>
            <Award size={20} color={colors.primary} />
          </View>
          <View style={styles.prInfo}>
            <Text style={styles.prExercise}>Barbell Back Squat</Text>
            <Text style={styles.prDate}>Achieved 2 weeks ago</Text>
          </View>
          <Text style={styles.prWeight}>180 kg</Text>
        </View>
      </Card>

      {/* Heart Rate Zones */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Heart Rate Zones</Text>
      </View>

      <Card style={styles.hrCard}>
        <View style={styles.hrHeader}>
          <Heart size={18} color={colors.heartRed} fill={colors.heartRed} />
          <Text style={styles.hrAvgText}>Avg. Active Rate: 138 BPM</Text>
        </View>
        <View style={styles.hrBarContainer}>
          <View style={[styles.hrSegment, { flex: 2, backgroundColor: '#3B82F6' }]} />
          <View style={[styles.hrSegment, { flex: 4, backgroundColor: '#10B981' }]} />
          <View style={[styles.hrSegment, { flex: 3, backgroundColor: colors.primary }]} />
          <View style={[styles.hrSegment, { flex: 1, backgroundColor: colors.heartRed }]} />
        </View>
        <View style={styles.hrLegend}>
          <Text style={styles.legendText}>Warmup: 20%</Text>
          <Text style={styles.legendText}>Aerobic: 40%</Text>
          <Text style={styles.legendText}>Anaerobic: 30%</Text>
          <Text style={styles.legendText}>Peak: 10%</Text>
        </View>
      </Card>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    marginVertical: spacing.md,
    backgroundColor: colors.primary,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreTitle: {
    ...typography.h3,
    color: colors.textOnPrimary,
    fontWeight: '800',
  },
  scoreSubtitle: {
    ...typography.caption,
    color: '#253505',
    fontWeight: '600',
    marginTop: 2,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumber: {
    ...typography.h1,
    color: colors.textOnPrimary,
    fontWeight: '900',
  },
  scoreMax: {
    ...typography.bodySmall,
    color: '#253505',
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.xs,
  },
  statBox: {
    flex: 1,
    marginHorizontal: spacing.xs,
    padding: spacing.md,
  },
  statValue: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  seeAllText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  prCard: {
    padding: spacing.md,
  },
  prRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  prIconBox: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: '#202026',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  prExercise: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  prDate: {
    ...typography.caption,
    color: colors.textMuted,
  },
  prWeight: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: '800',
  },
  prDivider: {
    height: 1,
    backgroundColor: '#22222A',
    marginVertical: spacing.xs,
  },
  hrCard: {
    padding: spacing.md,
    marginBottom: spacing.xxl,
  },
  hrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  hrAvgText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  hrBarContainer: {
    flexDirection: 'row',
    height: 8,
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  hrSegment: {
    height: '100%',
  },
  hrLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  legendText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
});
