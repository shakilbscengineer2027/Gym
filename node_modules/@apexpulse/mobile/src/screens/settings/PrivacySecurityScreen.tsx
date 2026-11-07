import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Download, Trash2, AlertTriangle } from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { colors, typography, spacing } from '../../theme';

export const PrivacySecurityScreen: React.FC = () => {
  const navigation = useNavigation();

  const [healthDataConsent, setHealthDataConsent] = useState(true);
  const [leaderboardConsent, setLeaderboardConsent] = useState(true);
  const [telemetryConsent, setTelemetryConsent] = useState(false);

  const [exportLoading, setExportLoading] = useState(false);
  const [exportReady, setExportReady] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleExportData = () => {
    setExportLoading(true);
    setTimeout(() => {
      setExportLoading(false);
      setExportReady(true);
    }, 1200);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    Alert.alert(
      'Account Deletion Scheduled',
      'Your 30-day grace period has begun. All sensitive data will be permanently anonymized thereafter.'
    );
  };

  return (
    <ScreenContainer scrollable={true}>
      <Header
        title="Privacy & Security"
        onBackPress={() => navigation.goBack()}
      />

      {/* GDPR Consent Management Cockpit */}
      <Text style={styles.sectionTitle}>GDPR Lawful Consent Management</Text>
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Health & Fitness Data (Article 9)</Text>
            <Text style={styles.rowSubtitle}>
              Required to calculate 1RM, volume loads, and track body weight.
            </Text>
          </View>
          <Switch
            value={healthDataConsent}
            onValueChange={setHealthDataConsent}
            trackColor={{ false: '#26262E', true: colors.primary }}
            thumbColor={healthDataConsent ? colors.textOnPrimary : '#71717A'}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Community Leaderboards</Text>
            <Text style={styles.rowSubtitle}>
              Allow your volume stats to appear on opt-in monthly challenges.
            </Text>
          </View>
          <Switch
            value={leaderboardConsent}
            onValueChange={setLeaderboardConsent}
            trackColor={{ false: '#26262E', true: colors.primary }}
            thumbColor={leaderboardConsent ? colors.textOnPrimary : '#71717A'}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Anonymous Product Telemetry</Text>
            <Text style={styles.rowSubtitle}>
              Help improve app responsiveness with pseudonymized crash reports.
            </Text>
          </View>
          <Switch
            value={telemetryConsent}
            onValueChange={setTelemetryConsent}
            trackColor={{ false: '#26262E', true: colors.primary }}
            thumbColor={telemetryConsent ? colors.textOnPrimary : '#71717A'}
          />
        </View>
      </Card>

      {/* Data Portability (Article 20) */}
      <Text style={styles.sectionTitle}>Data Portability (DSAR)</Text>
      <Card style={styles.card}>
        <View style={styles.exportHeader}>
          <Download size={20} color={colors.primary} />
          <Text style={styles.exportTitle}>Download Personal Archive</Text>
        </View>
        <Text style={styles.exportDesc}>
          Export all your workout logs, body measurements, and profile information into machine-readable JSON & CSV files.
        </Text>
        <Button
          title={exportReady ? "Download Archive (.ZIP)" : "Generate Export"}
          variant={exportReady ? "primary" : "secondary"}
          loading={exportLoading}
          onPress={handleExportData}
          fullWidth={true}
          style={styles.exportBtn}
        />
      </Card>

      {/* Right to Erasure (Article 17) */}
      <Text style={styles.sectionTitle}>Right to Erasure</Text>
      <Card style={[styles.card, styles.dangerCard] as any}>
        <View style={styles.exportHeader}>
          <Trash2 size={20} color={colors.heartRed} />
          <Text style={[styles.exportTitle, styles.dangerTitle]}>
            Delete My Account & Personal Data
          </Text>
        </View>
        <Text style={styles.exportDesc}>
          Permanently removes all personal health measurements and anonymizes your identity after a 30-day grace period.
        </Text>
        <Button
          title="Request Account Deletion"
          variant="outline"
          onPress={() => setShowDeleteModal(true)}
          style={styles.deleteBtn}
          textStyle={{ color: colors.heartRed }}
        />
      </Card>

      {/* Deletion Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Account Erasure"
      >
        <View style={styles.modalContent}>
          <AlertTriangle size={36} color={colors.heartRed} />
          <Text style={styles.modalDesc}>
            Under Article 17 of the GDPR, your personal data will be scheduled for permanent erasure. You have 30 days to log back in if you wish to cancel this request.
          </Text>
          <View style={styles.modalBtnRow}>
            <Button
              title="Cancel"
              variant="secondary"
              onPress={() => setShowDeleteModal(false)}
              style={styles.modalBtn}
            />
            <Button
              title="Permanently Delete"
              onPress={handleConfirmDelete}
              style={[styles.modalBtn, { backgroundColor: colors.heartRed }] as any}
              textStyle={{ color: '#FFFFFF' }}
            />
          </View>
        </View>
      </Modal>
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
  rowInfo: {
    flex: 1,
    paddingRight: spacing.md,
  },
  rowTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  rowSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#22222A',
    marginVertical: spacing.sm,
  },
  exportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  exportTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  exportDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginVertical: spacing.xs,
  },
  exportBtn: {
    marginTop: spacing.sm,
  },
  dangerCard: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: spacing.xxl,
  },
  dangerTitle: {
    color: colors.heartRed,
  },
  deleteBtn: {
    marginTop: spacing.sm,
    borderColor: colors.heartRed,
  },
  modalContent: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  modalDesc: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginVertical: spacing.md,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.sm,
  },
  modalBtn: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});
