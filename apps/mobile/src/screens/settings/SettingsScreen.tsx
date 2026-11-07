import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Volume2, Vibrate, Clock, Globe, Shield, ChevronRight } from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { colors, typography, spacing } from '../../theme';

type SettingsNavProp = NativeStackNavigationProp<RootStackParamList>;

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsNavProp>();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [autoTimerEnabled, setAutoTimerEnabled] = useState(true);
  const [unitMetric, setUnitMetric] = useState(true);

  return (
    <ScreenContainer scrollable={true}>
      <Header
        title="Settings & Preferences"
        onBackPress={() => navigation.goBack()}
      />

      {/* Workout Timer Configuration */}
      <Text style={styles.sectionTitle}>Workout Audio & Rest Timers</Text>
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Volume2 size={18} color={colors.textPrimary} />
            <Text style={styles.rowLabel}>Rest Timer Sound Cue</Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: '#26262E', true: colors.primary }}
            thumbColor={soundEnabled ? colors.textOnPrimary : '#71717A'}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Vibrate size={18} color={colors.textPrimary} />
            <Text style={styles.rowLabel}>Haptic Feedback on Completion</Text>
          </View>
          <Switch
            value={vibrationEnabled}
            onValueChange={setVibrationEnabled}
            trackColor={{ false: '#26262E', true: colors.primary }}
            thumbColor={vibrationEnabled ? colors.textOnPrimary : '#71717A'}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Clock size={18} color={colors.textPrimary} />
            <Text style={styles.rowLabel}>Auto-Start Rest Timer</Text>
          </View>
          <Switch
            value={autoTimerEnabled}
            onValueChange={setAutoTimerEnabled}
            trackColor={{ false: '#26262E', true: colors.primary }}
            thumbColor={autoTimerEnabled ? colors.textOnPrimary : '#71717A'}
          />
        </View>
      </Card>

      {/* Unit Settings */}
      <Text style={styles.sectionTitle}>Measurement Units</Text>
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Globe size={18} color={colors.textPrimary} />
            <Text style={styles.rowLabel}>Metric System (kg / cm)</Text>
          </View>
          <Switch
            value={unitMetric}
            onValueChange={setUnitMetric}
            trackColor={{ false: '#26262E', true: colors.primary }}
            thumbColor={unitMetric ? colors.textOnPrimary : '#71717A'}
          />
        </View>
      </Card>

      {/* Privacy Hub Link */}
      <Text style={styles.sectionTitle}>Privacy & Security</Text>
      <Card
        style={styles.card}
        onPress={() => navigation.navigate('PrivacySecurity')}
      >
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Shield size={18} color={colors.primary} />
            <Text style={styles.rowLabel}>GDPR Privacy Hub & Data Rights</Text>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </View>
      </Card>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  card: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLabel: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginLeft: spacing.md,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#22222A',
    marginVertical: spacing.sm,
  },
});
