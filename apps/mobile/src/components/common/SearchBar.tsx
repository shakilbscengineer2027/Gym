import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { colors, typography, radii, spacing } from '../../theme';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search workouts, exercises...',
  onFilterPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchWrapper}>
        <Search size={18} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        {onFilterPress && (
          <TouchableOpacity
            onPress={onFilterPress}
            activeOpacity={0.7}
            style={styles.filterButton}
          >
            <SlidersHorizontal size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16161A',
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#24242A',
    paddingHorizontal: spacing.md,
    height: 48,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    ...typography.bodyMedium,
    height: '100%',
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: '#202026',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
});
