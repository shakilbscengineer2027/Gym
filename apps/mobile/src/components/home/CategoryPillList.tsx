import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Dumbbell, Flame, Heart, Activity } from 'lucide-react-native';
import { colors, typography, radii, spacing } from '../../theme';

export interface CategoryItem {
  id: string;
  label: string;
  iconName: string;
  active?: boolean;
}

export interface CategoryPillListProps {
  categories: CategoryItem[];
  selectedId: string;
  onSelectCategory: (id: string) => void;
  title?: string;
}

export const CategoryPillList: React.FC<CategoryPillListProps> = ({
  categories,
  selectedId,
  onSelectCategory,
  title = 'Popular Plans',
}) => {
  const renderIcon = (iconName: string, isActive: boolean) => {
    const iconColor = isActive ? colors.textOnPrimary : colors.textSecondary;
    const size = 15;

    switch (iconName) {
      case 'dumbbell':
        return <Dumbbell size={size} color={iconColor} style={styles.icon} />;
      case 'flame':
        return <Flame size={size} color={iconColor} style={styles.icon} />;
      case 'heart':
        return <Heart size={size} color={iconColor} style={styles.icon} />;
      case 'activity':
      default:
        return <Activity size={size} color={iconColor} style={styles.icon} />;
    }
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.header}>{title}</Text>}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => {
          const isActive = cat.id === selectedId;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onSelectCategory(cat.id)}
              activeOpacity={0.8}
              style={[
                styles.pill,
                isActive ? styles.pillActive : styles.pillInactive,
              ]}
            >
              {renderIcon(cat.iconName, isActive)}
              <Text
                style={[
                  styles.pillText,
                  isActive ? styles.pillTextActive : styles.pillTextInactive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  header: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  scrollContent: {
    paddingRight: spacing.lg,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.full,
    marginRight: spacing.sm,
  },
  pillActive: {
    backgroundColor: colors.primary,
  },
  pillInactive: {
    backgroundColor: '#18181C',
    borderWidth: 1,
    borderColor: '#26262E',
  },
  icon: {
    marginRight: 6,
  },
  pillText: {
    ...typography.buttonText,
    fontSize: 13,
  },
  pillTextActive: {
    color: colors.textOnPrimary,
    fontWeight: '800',
  },
  pillTextInactive: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
