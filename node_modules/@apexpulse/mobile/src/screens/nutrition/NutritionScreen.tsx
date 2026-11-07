import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Droplet, Flame } from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { colors, typography, radii, spacing } from '../../theme';

export const NutritionScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <ScreenContainer scrollable={true}>
      <Header
        title="Nutrition & Macros"
        onBackPress={() => navigation.goBack()}
      />

      {/* Daily Caloric Balance Hero */}
      <Card style={styles.caloricCard}>
        <View style={styles.caloricRow}>
          <View>
            <Text style={styles.caloricLabel}>CALORIE BUDGET</Text>
            <Text style={styles.caloricNumber}>2,450</Text>
            <Text style={styles.caloricRemaining}>780 kcal remaining</Text>
          </View>
          <View style={styles.flameCircle}>
            <Flame size={28} color={colors.primary} />
          </View>
        </View>

        {/* Macro Bars */}
        <View style={styles.macroBarsContainer}>
          <View style={styles.macroItem}>
            <Text style={styles.macroTitle}>Protein</Text>
            <Text style={styles.macroGrams}>165g / 190g</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: '86%', backgroundColor: colors.primary }]} />
            </View>
          </View>

          <View style={styles.macroItem}>
            <Text style={styles.macroTitle}>Carbohydrates</Text>
            <Text style={styles.macroGrams}>210g / 260g</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: '80%', backgroundColor: colors.goldYellow }]} />
            </View>
          </View>

          <View style={styles.macroItem}>
            <Text style={styles.macroTitle}>Healthy Fats</Text>
            <Text style={styles.macroGrams}>55g / 70g</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: '78%', backgroundColor: '#38BDF8' }]} />
            </View>
          </View>
        </View>
      </Card>

      {/* Water Hydration Card */}
      <Card style={styles.waterCard}>
        <View style={styles.waterRow}>
          <View style={styles.waterIconCircle}>
            <Droplet size={20} color="#38BDF8" fill="#38BDF8" />
          </View>
          <View style={styles.waterInfo}>
            <Text style={styles.waterTitle}>Water Hydration</Text>
            <Text style={styles.waterText}>2,250 ml / 3,000 ml Target</Text>
          </View>
          <Button
            title="+250ml"
            size="sm"
            variant="secondary"
            onPress={() => {}}
          />
        </View>
      </Card>

      {/* Meal Breakdown Section */}
      <Text style={styles.sectionTitle}>Logged Meals</Text>

      <Card style={styles.mealCard}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealType}>Breakfast</Text>
          <Text style={styles.mealCalories}>620 kcal</Text>
        </View>
        <Text style={styles.mealDetails}>
          Oatmeal with whey isolate, blueberries, and almond butter.
        </Text>
      </Card>

      <Card style={styles.mealCard}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealType}>Lunch</Text>
          <Text style={styles.mealCalories}>780 kcal</Text>
        </View>
        <Text style={styles.mealDetails}>
          Grilled chicken breast with basmati rice, avocado, and steamed broccoli.
        </Text>
      </Card>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  caloricCard: {
    padding: spacing.lg,
    marginVertical: spacing.md,
  },
  caloricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  caloricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  caloricNumber: {
    ...typography.h1,
    color: colors.textPrimary,
    fontWeight: '900',
    fontSize: 36,
  },
  caloricRemaining: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  flameCircle: {
    width: 54,
    height: 54,
    borderRadius: radii.full,
    backgroundColor: '#1E280A',
    borderWidth: 1.5,
    borderColor: '#303E12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroBarsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#22222A',
    paddingTop: spacing.md,
  },
  macroItem: {
    marginBottom: spacing.sm,
  },
  macroTitle: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  macroGrams: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  barTrack: {
    height: 6,
    borderRadius: radii.full,
    backgroundColor: '#24242C',
    marginTop: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: radii.full,
  },
  waterCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  waterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterIconCircle: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  waterInfo: {
    flex: 1,
  },
  waterTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  waterText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginVertical: spacing.sm,
  },
  mealCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealType: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  mealCalories: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  mealDetails: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
});
