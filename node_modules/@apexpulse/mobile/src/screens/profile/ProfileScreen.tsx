import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Settings,
  Shield,
  Apple,
  Users,
  LogOut,
  ChevronRight,
  Sparkles,
  Scale,
  Dumbbell,
} from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { useAppStore } from '../../store/workoutStore';
import { colors, typography, radii, spacing } from '../../theme';

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const { user } = useAppStore();

  const menuItems = [
    {
      id: 'measurements',
      label: 'Body Measurements & Check-Ins',
      icon: <Scale size={18} color={colors.primary} />,
      onPress: () => navigation.navigate('BodyMeasurements'),
    },
    {
      id: 'library',
      label: 'Exercise Movement Library',
      icon: <Dumbbell size={18} color={colors.primary} />,
      onPress: () => navigation.navigate('ExerciseLibrary'),
    },
    {
      id: 'nutrition',
      label: 'Nutrition & Macro Goals',
      icon: <Apple size={18} color={colors.goldYellow} />,
      onPress: () => navigation.navigate('Nutrition'),
    },
    {
      id: 'community',
      label: 'Community & Leaderboards',
      icon: <Users size={18} color="#38BDF8" />,
      onPress: () => navigation.navigate('Community'),
    },
    {
      id: 'settings',
      label: 'App Settings & Preferences',
      icon: <Settings size={18} color={colors.textPrimary} />,
      onPress: () => navigation.navigate('Settings'),
    },
    {
      id: 'privacy',
      label: 'Privacy & GDPR Hub',
      icon: <Shield size={18} color={colors.primary} />,
      onPress: () => navigation.navigate('PrivacySecurity'),
    },
  ];

  return (
    <ScreenContainer scrollable={true}>
      <Header
        title="Profile"
        rightAction={
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={styles.settingsHeaderBtn}
          >
            <Settings size={18} color={colors.textPrimary} />
          </TouchableOpacity>
        }
      />

      {/* User Hero Info */}
      <View style={styles.heroContainer}>
        <Image source={{ uri: user.avatarUrl }} style={styles.largeAvatar} />
        <Text style={styles.nameText}>{user.fullName}</Text>
        <Text style={styles.emailText}>{user.email}</Text>

        <View style={styles.badgeRow}>
          <Badge label={user.fitnessLevel} variant="lime" />
          <View style={styles.badgeSpacer} />
          <Badge label="Pro Athlete" variant="gold" icon={<Sparkles size={10} color={colors.goldYellow} />} />
        </View>
      </View>

      {/* Vitals Summary Card */}
      <Card
        style={styles.vitalsCard}
        onPress={() => navigation.navigate('BodyMeasurements')}
      >
        <View style={styles.vitalCol}>
          <Text style={styles.vitalValue}>{user.weightKg} kg</Text>
          <Text style={styles.vitalLabel}>Current Weight</Text>
        </View>
        <View style={styles.vitalDivider} />
        <View style={styles.vitalCol}>
          <Text style={styles.vitalValue}>{user.heightCm} cm</Text>
          <Text style={styles.vitalLabel}>Height</Text>
        </View>
        <View style={styles.vitalDivider} />
        <View style={styles.vitalCol}>
          <Text style={styles.vitalValue}>{user.bodyFatPercent}%</Text>
          <Text style={styles.vitalLabel}>Body Fat</Text>
        </View>
      </Card>

      {/* Menu Action List */}
      <View style={styles.menuList}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={item.onPress}
            activeOpacity={0.8}
            style={styles.menuRow}
          >
            <View style={styles.menuIconWrapper}>{item.icon}</View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
          style={[styles.menuRow, styles.logoutRow]}
        >
          <View style={[styles.menuIconWrapper, styles.logoutIconWrapper]}>
            <LogOut size={18} color={colors.heartRed} />
          </View>
          <Text style={styles.logoutLabel}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  settingsHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: '#1C1C22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  largeAvatar: {
    width: 84,
    height: 84,
    borderRadius: radii.full,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.backgroundElevated,
    marginBottom: spacing.sm,
  },
  nameText: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  emailText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  badgeSpacer: {
    width: spacing.sm,
  },
  vitalsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    marginVertical: spacing.md,
  },
  vitalCol: {
    flex: 1,
    alignItems: 'center',
  },
  vitalValue: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  vitalLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  vitalDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#26262E',
    alignSelf: 'center',
  },
  menuList: {
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16161A',
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#24242B',
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: '#202026',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuLabel: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  logoutRow: {
    marginTop: spacing.md,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutIconWrapper: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  logoutLabel: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.heartRed,
    fontWeight: '700',
  },
});
