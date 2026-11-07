import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Scale, CheckCircle2, TrendingDown } from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { bodyMeasurementSchema, BodyMeasurementFormData } from '../../validation/measurement.schema';
import { syncQueue } from '../../storage/syncQueue';
import { colors, typography, radii, spacing, shadows } from '../../theme';

interface MeasurementLogItem {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPercent?: number;
  waistCm?: number;
  chestCm?: number;
}

export const BodyMeasurementsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logs, setLogs] = useState<MeasurementLogItem[]>([
    {
      id: 'm_1',
      date: 'Today, 30 Jun 2026',
      weightKg: 82.5,
      bodyFatPercent: 12.8,
      waistCm: 81.0,
      chestCm: 108.5,
    },
    {
      id: 'm_2',
      date: '15 Jun 2026',
      weightKg: 83.2,
      bodyFatPercent: 13.2,
      waistCm: 82.0,
      chestCm: 108.0,
    },
    {
      id: 'm_3',
      date: '01 Jun 2026',
      weightKg: 84.0,
      bodyFatPercent: 13.8,
      waistCm: 83.5,
      chestCm: 107.5,
    },
  ]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BodyMeasurementFormData>({
    resolver: zodResolver(bodyMeasurementSchema),
    defaultValues: {
      weightKg: 82.5,
      bodyFatPercent: 12.8,
      chestCm: 108.5,
      waistCm: 81.0,
    },
  });

  const onSubmit = async (data: BodyMeasurementFormData) => {
    setIsSubmitting(true);
    try {
      // 1. Enqueue offline mutation
      await syncQueue.enqueueMutation('MEASUREMENT', 'CREATE', {
        ...data,
        recordedDate: new Date().toISOString(),
      });

      // 2. Optimistic local update
      const newEntry = {
        id: `m_${Date.now()}`,
        date: 'Today',
        weightKg: data.weightKg,
        bodyFatPercent: data.bodyFatPercent,
        waistCm: data.waistCm,
        chestCm: data.chestCm,
      };

      setLogs([newEntry, ...logs]);
      reset();
      Alert.alert('Metrics Logged', 'Measurement saved to offline storage and queued for synchronization.');
    } catch {
      Alert.alert('Error', 'Failed to save measurement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer scrollable={true}>
      <Header
        title="Body Measurements"
        onBackPress={() => navigation.goBack()}
      />

      {/* Progress Metric Summary */}
      <Card variant="surface" style={styles.trendCard}>
        <View style={styles.trendRow}>
          <View>
            <Text style={styles.trendLabel}>TOTAL LOSS (4 WEEKS)</Text>
            <Text style={styles.trendNumber}>-1.5 kg</Text>
            <Text style={styles.trendSub}>Body Fat: -1.0% change</Text>
          </View>
          <View style={styles.trendIconBox}>
            <TrendingDown size={24} color={colors.primary} />
          </View>
        </View>
      </Card>

      {/* New Measurement Form */}
      <Text style={styles.sectionTitle}>Log New Check-In</Text>
      <Card style={styles.formCard}>
        <Controller
          control={control}
          name="weightKg"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Body Weight (kg)"
              placeholder="e.g. 82.5"
              keyboardType="decimal-pad"
              value={value ? String(value) : ''}
              onChangeText={(text) => onChange(parseFloat(text) || 0)}
              error={errors.weightKg?.message}
              leftIcon={<Scale size={18} color={colors.textSecondary} />}
            />
          )}
        />

        <View style={styles.inputsRow}>
          <View style={styles.halfInput}>
            <Controller
              control={control}
              name="bodyFatPercent"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Body Fat %"
                  placeholder="e.g. 12.8"
                  keyboardType="decimal-pad"
                  value={value ? String(value) : ''}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  error={errors.bodyFatPercent?.message}
                />
              )}
            />
          </View>
          <View style={styles.halfInput}>
            <Controller
              control={control}
              name="waistCm"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Waist (cm)"
                  placeholder="e.g. 81.0"
                  keyboardType="decimal-pad"
                  value={value ? String(value) : ''}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  error={errors.waistCm?.message}
                />
              )}
            />
          </View>
        </View>

        <Button
          title="Save Check-In"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          leftIcon={<CheckCircle2 size={16} color={colors.textOnPrimary} />}
          fullWidth={true}
          style={styles.saveBtn}
        />
      </Card>

      {/* Historical Entries */}
      <Text style={styles.sectionTitle}>Measurement History</Text>
      {logs.map((item) => (
        <Card key={item.id} style={styles.historyCard}>
          <View style={styles.logHeader}>
            <Text style={styles.logDate}>{item.date}</Text>
            <Text style={styles.logWeight}>{item.weightKg} kg</Text>
          </View>
          <View style={styles.logDetailsRow}>
            {item.bodyFatPercent && (
              <Text style={styles.logDetail}>Body Fat: {item.bodyFatPercent}%</Text>
            )}
            {item.waistCm && (
              <Text style={styles.logDetail}>Waist: {item.waistCm} cm</Text>
            )}
            {item.chestCm && (
              <Text style={styles.logDetail}>Chest: {item.chestCm} cm</Text>
            )}
          </View>
        </Card>
      ))}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  trendCard: {
    padding: spacing.lg,
    marginVertical: spacing.md,
    backgroundColor: '#161C08',
    borderColor: '#303E12',
    ...shadows.card,
  },
  trendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendLabel: {
    ...typography.caption,
    color: colors.primary,
    letterSpacing: 1,
    fontWeight: '700',
  },
  trendNumber: {
    ...typography.h1,
    color: colors.textPrimary,
    fontWeight: '900',
    marginTop: 2,
  },
  trendSub: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  trendIconBox: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    backgroundColor: '#1E280A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  formCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  saveBtn: {
    marginTop: spacing.sm,
  },
  historyCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logDate: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  logWeight: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: '800',
  },
  logDetailsRow: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  logDetail: {
    ...typography.caption,
    color: colors.textSecondary,
    marginRight: spacing.md,
  },
});
