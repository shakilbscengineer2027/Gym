import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRight, Plus, Dumbbell } from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { WorkoutCategoryCard } from '../../components/workout/WorkoutCategoryCard';
import { mockWorkoutCategories } from '../../fixtures/mockData';
import { colors, typography, spacing } from '../../theme';

type WorkoutScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const WorkoutScreen: React.FC = () => {
  const navigation = useNavigation<WorkoutScreenNavigationProp>();

  return (
    <ScreenContainer scrollable={true}>
      {/* Header with Back button and "Workout" title */}
      <Header
        title="Workout"
        onBackPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
        rightAction={
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ExerciseLibrary')}
              style={styles.headerBtn}
              accessibilityLabel="Exercise Library"
            >
              <Dumbbell size={18} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateWorkout')}
              style={[styles.headerBtn, styles.createBtn]}
              accessibilityLabel="Create Custom Workout"
            >
              <Plus size={18} color={colors.textOnPrimary} />
            </TouchableOpacity>
          </View>
        }
      />

      {/* Fitness Level Section */}
      <View style={styles.fitnessLevelRow}>
        <View>
          <Text style={styles.levelTitle}>Advance</Text>
          <Text style={styles.levelSubtitle}>Fitness Level</Text>
        </View>

        <TouchableOpacity
          onPress={() => {}}
          activeOpacity={0.7}
          style={styles.seeAllButton}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={14} color={colors.goldYellow} />
        </TouchableOpacity>
      </View>

      {/* Vertical List of Workout Category Cards */}
      <View style={styles.categoriesList}>
        {mockWorkoutCategories.map((item) => (
          <WorkoutCategoryCard
            key={item.id}
            title={item.title}
            sessionsCount={item.sessionsCount}
            description={item.description}
            imageUrl={item.imageUrl}
            onPress={() =>
              navigation.navigate('WorkoutDetails', {
                categoryId: item.id,
                title: item.title,
              })
            }
          />
        ))}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1C1C22',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  createBtn: {
    backgroundColor: colors.primary,
  },
  fitnessLevelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  levelTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  levelSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  seeAllText: {
    ...typography.caption,
    color: colors.goldYellow,
    fontWeight: '700',
    fontSize: 12,
    marginRight: 2,
  },
  categoriesList: {
    paddingBottom: spacing.xxl,
  },
});
