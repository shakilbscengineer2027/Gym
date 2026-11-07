import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Play, Pause, Check, RotateCcw, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { RootStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useAppStore } from '../../store/workoutStore';
import { mockTodayFocus } from '../../fixtures/mockData';
import { syncQueue } from '../../storage/syncQueue';
import { colors, typography, radii, spacing, shadows } from '../../theme';

type ActiveWorkoutRouteProp = RouteProp<RootStackParamList, 'ActiveWorkout'>;

export const ActiveWorkoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ActiveWorkoutRouteProp>();
  const workoutTitle = route.params?.workoutTitle || 'Biceps Workout';

  const {
    activeWorkout,
    pauseWorkout,
    resumeWorkout,
    finishWorkout,
    incrementElapsed,
    markSetCompleted,
  } = useAppStore();

  const [isResting, setIsResting] = useState(false);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState(60);
  const [showExitModal, setShowExitModal] = useState(false);

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (activeWorkout.isActive) {
      interval = setInterval(() => {
        incrementElapsed();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeWorkout.isActive, incrementElapsed]);

  // Rest Timer loop
  useEffect(() => {
    let restInterval: any = null;
    if (isResting && restSecondsRemaining > 0) {
      restInterval = setInterval(() => {
        setRestSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (restSecondsRemaining <= 0) {
      setIsResting(false);
      setRestSecondsRemaining(60);
    }
    return () => clearInterval(restInterval);
  }, [isResting, restSecondsRemaining]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleSet = async (exerciseId: string, setIndex: number) => {
    const currentCompleted = activeWorkout.completedSetsMap[exerciseId] || 0;
    const nextCompleted = currentCompleted >= setIndex ? setIndex - 1 : setIndex;
    markSetCompleted(exerciseId, nextCompleted);

    // Auto-trigger rest countdown and haptic feedback
    if (nextCompleted >= setIndex) {
      if (Platform.OS !== 'web') {
        try {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch {}
      }

      // Persist set log to offline SQLite mutation queue
      await syncQueue.enqueueMutation('SET_LOG', 'CREATE', {
        exerciseId,
        setNumber: setIndex,
        completedAt: new Date().toISOString(),
        isCompleted: true,
      });

      setIsResting(true);
      setRestSecondsRemaining(60);
    }
  };

  const handleFinish = async () => {
    // Record session completion to offline sync queue
    await syncQueue.enqueueMutation('WORKOUT_SESSION', 'CREATE', {
      workoutTitle,
      elapsedSeconds: activeWorkout.elapsedSeconds,
      completedSets: activeWorkout.completedSetsMap,
      finishedAt: new Date().toISOString(),
    });

    if (Platform.OS !== 'web') {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
    }

    finishWorkout();
    navigation.goBack();
  };

  return (
    <ScreenContainer scrollable={false}>
      <Header
        title={workoutTitle}
        onBackPress={() => setShowExitModal(true)}
        rightAction={
          <TouchableOpacity
            onPress={() => (activeWorkout.isActive ? pauseWorkout() : resumeWorkout())}
            style={styles.playPauseBtn}
          >
            {activeWorkout.isActive ? (
              <Pause size={18} color={colors.primary} />
            ) : (
              <Play size={18} color={colors.primary} fill={colors.primary} />
            )}
          </TouchableOpacity>
        }
      />

      {/* Timer & Session Header */}
      <Card variant="surface" style={styles.timerCard}>
        <Text style={styles.timerLabel}>SESSION DURATION</Text>
        <Text style={styles.timerDigits}>{formatTime(activeWorkout.elapsedSeconds)}</Text>
        <View style={styles.timerStatusRow}>
          <View
            style={[
              styles.pulseDot,
              { backgroundColor: activeWorkout.isActive ? colors.primary : colors.goldYellow },
            ]}
          />
          <Text style={styles.timerStatusText}>
            {activeWorkout.isActive ? 'RECORDING LIVE' : 'PAUSED'}
          </Text>
        </View>
      </Card>

      {/* Rest Countdown Bar (if active) */}
      {isResting && (
        <Card variant="accent" style={styles.restBanner}>
          <View style={styles.restRow}>
            <RotateCcw size={16} color={colors.textOnPrimary} />
            <Text style={styles.restTitle}>
              Rest Interval: {restSecondsRemaining}s
            </Text>
            <TouchableOpacity onPress={() => setIsResting(false)}>
              <X size={16} color={colors.textOnPrimary} />
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {/* Set Tracking List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.exerciseScroll}>
        {mockTodayFocus.exercises.map((exercise) => {
          const completedCount = activeWorkout.completedSetsMap[exercise.id] || 0;

          return (
            <Card key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View>
                  <Text style={styles.exerciseTitle}>{exercise.name}</Text>
                  <Text style={styles.exerciseTarget}>
                    Target: {exercise.targetWeightKg} kg × {exercise.repsRange}
                  </Text>
                </View>
                <Text style={styles.progressCounter}>
                  {completedCount}/{exercise.sets} Sets
                </Text>
              </View>

              {/* Set Checkboxes */}
              <View style={styles.setRows}>
                {Array.from({ length: exercise.sets }).map((_, idx) => {
                  const setNum = idx + 1;
                  const isDone = completedCount >= setNum;

                  return (
                    <TouchableOpacity
                      key={setNum}
                      onPress={() => handleToggleSet(exercise.id, setNum)}
                      activeOpacity={0.7}
                      style={[
                        styles.setCheckPill,
                        isDone ? styles.setPillDone : styles.setPillPending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.setPillText,
                          isDone ? styles.setPillTextDone : styles.setPillTextPending,
                        ]}
                      >
                        Set {setNum}
                      </Text>
                      {isDone && (
                        <Check
                          size={14}
                          color={colors.textOnPrimary}
                          strokeWidth={3}
                          style={styles.checkIcon}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Card>
          );
        })}
      </ScrollView>

      {/* Complete Workout Button */}
      <View style={styles.footerContainer}>
        <Button
          title="Complete Workout Session"
          onPress={handleFinish}
          fullWidth={true}
          size="lg"
          style={styles.completeBtn}
        />
      </View>

      {/* Exit Confirmation Modal */}
      <Modal
        visible={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="Discard Workout?"
      >
        <Text style={styles.modalText}>
          Are you sure you want to stop? Your completed sets will be recorded in local storage.
        </Text>
        <View style={styles.modalActions}>
          <Button
            title="Keep Going"
            variant="secondary"
            onPress={() => setShowExitModal(false)}
            style={styles.modalBtn}
          />
          <Button
            title="Finish & Save"
            onPress={() => {
              setShowExitModal(false);
              handleFinish();
            }}
            style={styles.modalBtn}
          />
        </View>
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  playPauseBtn: {
    width: 38,
    height: 38,
    borderRadius: radii.full,
    backgroundColor: '#1E280A',
    borderWidth: 1,
    borderColor: '#303E12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginVertical: spacing.sm,
  },
  timerLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    letterSpacing: 1.5,
  },
  timerDigits: {
    ...typography.h1,
    fontSize: 44,
    lineHeight: 52,
    color: colors.textPrimary,
    fontWeight: '900',
    letterSpacing: -1,
    marginVertical: 4,
  },
  timerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  timerStatusText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  restBanner: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  restRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  restTitle: {
    ...typography.buttonText,
    color: colors.textOnPrimary,
    fontWeight: '800',
  },
  exerciseScroll: {
    flex: 1,
  },
  exerciseCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  exerciseTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  exerciseTarget: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  progressCounter: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  setRows: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  setCheckPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  setPillDone: {
    backgroundColor: colors.primary,
  },
  setPillPending: {
    backgroundColor: '#202026',
    borderWidth: 1,
    borderColor: '#2D2D36',
  },
  setPillText: {
    ...typography.caption,
    fontWeight: '700',
  },
  setPillTextDone: {
    color: colors.textOnPrimary,
  },
  setPillTextPending: {
    color: colors.textSecondary,
  },
  checkIcon: {
    marginLeft: 4,
  },
  footerContainer: {
    paddingVertical: spacing.md,
  },
  completeBtn: {
    ...shadows.neonGlow,
  },
  modalText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});
