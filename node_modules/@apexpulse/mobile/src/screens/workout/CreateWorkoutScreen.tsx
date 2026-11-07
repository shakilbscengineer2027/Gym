import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Check, Dumbbell } from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { createWorkoutSchema, CreateWorkoutFormData } from '../../validation/workout.schema';
import { syncQueue } from '../../storage/syncQueue';
import { colors, typography, radii, spacing } from '../../theme';

const AVAILABLE_EXERCISES = [
  { id: 'ex_bench', name: 'Barbell Bench Press', muscle: 'Chest' },
  { id: 'ex_deadlift', name: 'Barbell Deadlift', muscle: 'Back' },
  { id: 'ex_squat', name: 'Barbell Back Squat', muscle: 'Legs' },
  { id: 'ex_curl', name: 'Dumbbell Hammer Curl', muscle: 'Biceps' },
];

export const CreateWorkoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>(['ex_bench']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWorkoutFormData>({
    resolver: zodResolver(createWorkoutSchema),
    defaultValues: {
      title: '',
      category: 'Strength',
      fitnessLevel: 'Advance',
      estimatedDurationMinutes: 60,
      description: '',
    },
  });

  const toggleExercise = (id: string) => {
    setSelectedExerciseIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const onSubmit = async (data: CreateWorkoutFormData) => {
    if (selectedExerciseIds.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one exercise for this workout routine.');
      return;
    }

    setIsSubmitting(true);
    try {
      const routineId = `routine_${Date.now()}`;
      await syncQueue.enqueueMutation('WORKOUT_TEMPLATE', 'CREATE', {
        id: routineId,
        ...data,
        exerciseIds: selectedExerciseIds,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Workout Created', `"${data.title}" was saved locally and queued for synchronization.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to save workout routine.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer scrollable={true}>
      <Header
        title="Create Custom Routine"
        onBackPress={() => navigation.goBack()}
      />

      <Card style={styles.formCard}>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Routine Title"
              placeholder="e.g. Upper Body Strength A"
              value={value}
              onChangeText={onChange}
              error={errors.title?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="estimatedDurationMinutes"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Duration (Minutes)"
              placeholder="60"
              keyboardType="number-pad"
              value={value ? String(value) : ''}
              onChangeText={(t) => onChange(parseInt(t, 10) || 0)}
              error={errors.estimatedDurationMinutes?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Description (Optional)"
              placeholder="Focus on explosive concentric tempo..."
              value={value}
              onChangeText={onChange}
              multiline={true}
              numberOfLines={3}
            />
          )}
        />
      </Card>

      {/* Select Exercises Section */}
      <Text style={styles.sectionTitle}>Add Exercises</Text>
      {AVAILABLE_EXERCISES.map((ex) => {
        const isSelected = selectedExerciseIds.includes(ex.id);
        return (
          <TouchableOpacity
            key={ex.id}
            onPress={() => toggleExercise(ex.id)}
            activeOpacity={0.8}
            style={[
              styles.exerciseItem,
              isSelected && styles.exerciseItemSelected,
            ]}
          >
            <View style={styles.exerciseLeft}>
              <View style={styles.iconCircle}>
                <Dumbbell size={16} color={isSelected ? colors.primary : colors.textSecondary} />
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <Text style={styles.exerciseMuscle}>{ex.muscle}</Text>
              </View>
            </View>

            <View
              style={[
                styles.checkCircle,
                isSelected && styles.checkCircleSelected,
              ]}
            >
              {isSelected ? (
                <Check size={14} color={colors.textOnPrimary} strokeWidth={3} />
              ) : (
                <Plus size={14} color={colors.textSecondary} />
              )}
            </View>
          </TouchableOpacity>
        );
      })}

      <Button
        title="Save Custom Routine"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        fullWidth={true}
        size="lg"
        style={styles.submitBtn}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  formCard: {
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#16161A',
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: '#24242B',
  },
  exerciseItemSelected: {
    borderColor: colors.primary,
    backgroundColor: '#161C08',
  },
  exerciseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: '#202026',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  exerciseInfo: {
    justifyContent: 'center',
  },
  exerciseName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  exerciseMuscle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#303038',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  submitBtn: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
});
