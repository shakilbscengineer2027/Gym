import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ScheduleDay } from '@apexpulse/types';
import { colors, typography, radii, spacing, shadows } from '../../theme';

export interface WeeklyCalendarStripProps {
  days: ScheduleDay[];
  selectedDate: string; // e.g. '2026-06-30'
  onSelectDate: (fullDate: string) => void;
}

export const WeeklyCalendarStrip: React.FC<WeeklyCalendarStripProps> = ({
  days,
  selectedDate,
  onSelectDate,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {days.map((day) => {
          const isSelected = day.fullDate === selectedDate;
          return (
            <TouchableOpacity
              key={day.fullDate}
              onPress={() => onSelectDate(day.fullDate)}
              activeOpacity={0.8}
              style={[
                styles.dayCard,
                isSelected ? styles.dayCardSelected : styles.dayCardNormal,
              ]}
            >
              <Text
                style={[
                  styles.dayOfWeekText,
                  isSelected
                    ? styles.dayOfWeekTextSelected
                    : styles.dayOfWeekTextNormal,
                ]}
              >
                {day.dayOfWeek}
              </Text>
              <Text
                style={[
                  styles.dateNumberText,
                  isSelected
                    ? styles.dateNumberTextSelected
                    : styles.dateNumberTextNormal,
                ]}
              >
                {day.dateNumber}
              </Text>
              <Text
                style={[
                  styles.monthText,
                  isSelected
                    ? styles.monthTextSelected
                    : styles.monthTextNormal,
                ]}
              >
                {day.monthName}
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
    marginVertical: spacing.md,
  },
  scrollContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: spacing.sm,
  },
  dayCard: {
    width: 46,
    height: 72,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  dayCardNormal: {
    backgroundColor: '#16161A',
    borderWidth: 1,
    borderColor: '#24242B',
  },
  dayCardSelected: {
    backgroundColor: colors.primary,
    ...shadows.neonGlow,
  },
  dayOfWeekText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '600',
  },
  dayOfWeekTextNormal: {
    color: colors.textSecondary,
  },
  dayOfWeekTextSelected: {
    color: colors.textOnPrimary,
  },
  dateNumberText: {
    ...typography.h3,
    fontSize: 16,
    fontWeight: '800',
    marginVertical: 2,
  },
  dateNumberTextNormal: {
    color: colors.textPrimary,
  },
  dateNumberTextSelected: {
    color: colors.textOnPrimary,
  },
  monthText: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '600',
  },
  monthTextNormal: {
    color: colors.textMuted,
  },
  monthTextSelected: {
    color: colors.textOnPrimary,
  },
});
