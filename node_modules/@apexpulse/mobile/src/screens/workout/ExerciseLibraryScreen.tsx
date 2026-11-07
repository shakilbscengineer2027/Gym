import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Dumbbell } from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { SearchBar } from '../../components/common/SearchBar';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/feedback/EmptyState';
import { useDebounce } from '../../hooks/useDebounce';
import { colors, typography, radii, spacing, shadows } from '../../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

interface ExerciseCatalogItem {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  thumbnailUrl: string;
}

const CATALOG_DATA: ExerciseCatalogItem[] = [
  {
    id: 'ex_barbell_curl',
    name: 'Barbell Biceps Curl',
    muscle: 'Biceps',
    equipment: 'Barbell',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex_hammer_curl',
    name: 'Dumbbell Hammer Curl',
    muscle: 'Biceps',
    equipment: 'Dumbbell',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex_preacher_curl',
    name: 'EZ-Bar Preacher Curl',
    muscle: 'Biceps',
    equipment: 'Barbell',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex_bench_press',
    name: 'Barbell Bench Press',
    muscle: 'Chest',
    equipment: 'Barbell',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex_incline_dumbbell',
    name: 'Incline Dumbbell Press',
    muscle: 'Chest',
    equipment: 'Dumbbell',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex_cable_fly',
    name: 'Cable Chest Fly',
    muscle: 'Chest',
    equipment: 'Cable',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex_deadlift',
    name: 'Conventional Barbell Deadlift',
    muscle: 'Back',
    equipment: 'Barbell',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex_lat_pulldown',
    name: 'Cable Lat Pulldown',
    muscle: 'Back',
    equipment: 'Cable',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'ex_barbell_squat',
    name: 'Barbell Back Squat',
    muscle: 'Legs',
    equipment: 'Barbell',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&auto=format&fit=crop&q=80',
  },
];

const MUSCLE_FILTERS = ['All', 'Chest', 'Back', 'Biceps', 'Legs'];

export const ExerciseLibraryScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');

  const debouncedSearch = useDebounce(search, 250);

  const filteredExercises = useMemo(() => {
    return CATALOG_DATA.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.equipment.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchMuscle = selectedMuscle === 'All' || item.muscle === selectedMuscle;
      return matchSearch && matchMuscle;
    });
  }, [debouncedSearch, selectedMuscle]);

  return (
    <ScreenContainer scrollable={false}>
      <Header
        title="Exercise Library"
        onBackPress={() => navigation.goBack()}
      />

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Filter by exercise name or equipment..."
        style={styles.searchBar}
      />

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {MUSCLE_FILTERS.map((m) => {
          const isActive = selectedMuscle === m;
          return (
            <TouchableOpacity
              key={m}
              onPress={() => setSelectedMuscle(m)}
              activeOpacity={0.8}
              style={[
                styles.filterPill,
                isActive ? styles.filterPillActive : styles.filterPillInactive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  isActive ? styles.filterTextActive : styles.filterTextInactive,
                ]}
              >
                {m}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* List */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No Exercises Found"
            description={`No movement matching "${debouncedSearch}" in category ${selectedMuscle}.`}
            icon={<Dumbbell size={28} color={colors.textSecondary} />}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ExerciseDetails', {
                exerciseId: item.id,
                title: item.name,
              })
            }
            activeOpacity={0.8}
            style={styles.exerciseRow}
          >
            <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
            <View style={styles.info}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <View style={styles.badges}>
                <Badge label={item.muscle} variant="lime" size="sm" />
                <View style={styles.badgeSpacer} />
                <Badge label={item.equipment} variant="neutral" size="sm" />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    marginVertical: spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    marginRight: spacing.sm,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
  },
  filterPillInactive: {
    backgroundColor: '#16161A',
    borderWidth: 1,
    borderColor: '#24242B',
  },
  filterText: {
    ...typography.caption,
    fontWeight: '700',
  },
  filterTextActive: {
    color: colors.textOnPrimary,
  },
  filterTextInactive: {
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: spacing.xxl * 2,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16161A',
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#24242B',
    ...shadows.card,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: radii.lg,
    backgroundColor: colors.backgroundElevated,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  exerciseName: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  badges: {
    flexDirection: 'row',
    marginTop: 6,
  },
  badgeSpacer: {
    width: 6,
  },
});
