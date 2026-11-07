import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Trophy, Calendar, MessageSquare } from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { colors, typography, radii, spacing } from '../../theme';

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();

  const notifications = [
    {
      id: 'notif_1',
      title: 'New Feedback from Coach Narez',
      body: 'Coach Narez reviewed your Barbell Deadlift sets and left notes.',
      time: '15m ago',
      icon: <MessageSquare size={16} color={colors.primary} />,
      unread: true,
    },
    {
      id: 'notif_2',
      title: 'Scheduled Session: Biceps Workout',
      body: 'Your scheduled session starts in 45 minutes.',
      time: '1h ago',
      icon: <Calendar size={16} color={colors.goldYellow} />,
      unread: true,
    },
    {
      id: 'notif_3',
      title: 'New Personal Record Achieved!',
      body: 'You crushed your previous Barbell Bench Press PR with 140kg.',
      time: '1d ago',
      icon: <Trophy size={16} color={colors.primary} />,
      unread: false,
    },
  ];

  return (
    <ScreenContainer scrollable={true}>
      <Header
        title="Notifications"
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.list}>
        {notifications.map((item) => (
          <Card key={item.id} style={styles.notifCard}>
            <View style={styles.cardRow}>
              <View style={styles.iconCircle}>{item.icon}</View>
              <View style={styles.content}>
                <View style={styles.titleRow}>
                  <Text style={styles.titleText}>{item.title}</Text>
                  {item.unread && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.bodyText}>{item.body}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: spacing.md,
  },
  notifCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: '#202026',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '700',
    flex: 1,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
  bodyText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  timeText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 4,
  },
});
