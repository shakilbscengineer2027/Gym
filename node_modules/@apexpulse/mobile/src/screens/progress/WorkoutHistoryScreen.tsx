import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar, Clock, Flame, Dumbbell } from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { colors, typography, spacing } from '../../theme';

export const WorkoutHistoryScreen: React.FC = () => {
  const navigation = useNavigation();

  const history = [
    {
      id: 'hist_01',
      date: 'Monday, 29 Jun 2026',
      title: 'Upper Body Hypertrophy',
      durationMinutes: 55,
      calories: 480,
      totalVolumeKg: 7420,
      exercisesCount: 5,
    },
    {
      id: 'hist_02',
      date: 'Friday, 26 Jun 2026',
      title: 'Leg Day & Posterior Chain',
      durationMinutes: 65,
      calories: 610,
      totalVolumeKg: 9850,
      exercisesCount: 6,
    },
    {
      id: 'hist_03',
      date: 'Wednesday, 24 Jun 2026',
      title: 'Back & Core Stabilization',
      durationMinutes: 50,
      calories: 420,
      totalVolumeKg: 6200,
      exercisesCount: 4,
    },
  ];

  return (
    <ScreenContainer scrollable={true}>
      <Header
        title="Workout History"
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.historyList}>
        {history.map((item) => (
          <Card key={item.id} style={styles.historyCard}>
            <View style={styles.cardHeader}>
              <View style={styles.dateRow}>
                <Calendar size={14} color={colors.primary} />
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
              <Text style={styles.volumeText}>{item.totalVolumeKg} kg volume</Text>
            </View>

            <Text style={styles.sessionTitle}>{item.title}</Text>

            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Clock size={14} color={colors.textSecondary} />
                <Text style={styles.metricText}>{item.durationMinutes} min</Text>
              </View>
              <View style={styles.metricItem}>
                <Flame size={14} color={colors.goldYellow} />
                <Text style={styles.metricText}>{item.calories} kcal</Text>
              </View>
              <View style={styles.metricItem}>
                <Dumbbell size={14} color={colors.primary} />
                <Text style={styles.metricText}>{item.exercisesCount} exercises</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  historyList: {
    paddingVertical: spacing.md,
  },
  historyCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
    marginLeft: 6,
  },
  volumeText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sessionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginVertical: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#22222A',
    paddingTop: spacing.sm,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  metricText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: '600',
  },
});
