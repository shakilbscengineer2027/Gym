import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  Home,
  Dumbbell,
  Flame,
  Calendar,
  User,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, radii, shadows } from '../../theme';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  const getIcon = (routeName: string, isFocused: boolean) => {
    const size = 20;
    const color = isFocused ? colors.tabBarActive : colors.tabBarInactive;

    switch (routeName) {
      case 'Home':
        return <Home size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;
      case 'Workout':
        return <Dumbbell size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;
      case 'Progress':
        // Progress is handled by the center button
        return <Flame size={24} color={colors.textOnPrimary} strokeWidth={2.5} fill={colors.textOnPrimary} />;
      case 'Schedule':
        return <Calendar size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;
      case 'Profile':
      default:
        return <User size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;
    }
  };

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          paddingBottom: Math.max(insets.bottom, 10),
          height: 64 + Math.max(insets.bottom, 10),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const isCenter = route.name === 'Progress';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (isCenter) {
          return (
            <View key={route.key} style={styles.centerButtonContainer}>
              <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.85}
                style={styles.centerButton}
              >
                {getIcon(route.name, isFocused)}
              </TouchableOpacity>
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                Progress
              </Text>
            </View>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.tabItem}
          >
            {getIcon(route.name, isFocused)}
            <Text
              style={[
                styles.tabLabel,
                isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              {typeof label === 'string' ? label : route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#0E0E12',
    borderTopWidth: 1,
    borderTopColor: '#1A1A22',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
    ...shadows.card,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    ...typography.caption,
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  tabLabelInactive: {
    color: colors.textMuted,
  },
  centerButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
  },
  centerButton: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#0E0E12',
    ...shadows.floatingButton,
  },
});
