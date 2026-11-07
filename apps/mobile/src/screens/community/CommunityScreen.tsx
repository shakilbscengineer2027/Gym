import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Heart, MessageSquare, Award } from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { mockCommunityPosts } from '../../fixtures/mockData';
import { colors, typography, radii, spacing } from '../../theme';

export const CommunityScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <ScreenContainer scrollable={true}>
      <Header
        title="Community Feed"
        onBackPress={() => navigation.goBack()}
      />

      {/* Monthly Challenge Banner */}
      <Card variant="surface" style={styles.challengeCard}>
        <View style={styles.challengeRow}>
          <View style={styles.trophyCircle}>
            <Award size={22} color={colors.primary} />
          </View>
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeTitle}>June 100-Ton Volume Challenge</Text>
            <Text style={styles.challengeSubtitle}>
              Rank #14 • 78.4 Tonnes Lifted
            </Text>
          </View>
        </View>
      </Card>

      {/* Community Activity Posts */}
      <Text style={styles.sectionTitle}>Athlete Activity</Text>
      {mockCommunityPosts.map((post) => (
        <Card key={post.id} style={styles.postCard}>
          <View style={styles.postHeader}>
            <Image source={{ uri: post.authorAvatar }} style={styles.authorAvatar} />
            <View style={styles.authorDetails}>
              <Text style={styles.authorName}>{post.authorName}</Text>
              <Text style={styles.timeAgo}>{post.timeAgo}</Text>
            </View>
          </View>

          <Text style={styles.workoutSummary}>{post.workoutSummary}</Text>

          <View style={styles.postActionsRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <Heart
                size={16}
                color={post.isLiked ? colors.heartRed : colors.textSecondary}
                fill={post.isLiked ? colors.heartRed : 'transparent'}
              />
              <Text style={styles.actionCount}>{post.likesCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <MessageSquare size={16} color={colors.textSecondary} />
              <Text style={styles.actionCount}>{post.commentsCount}</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ))}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  challengeCard: {
    marginVertical: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#303E12',
    backgroundColor: '#161C08',
  },
  challengeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trophyCircle: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: '#1E280A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeInfo: {
    marginLeft: spacing.md,
  },
  challengeTitle: {
    ...typography.h4,
    color: colors.primary,
  },
  challengeSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  postCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
  },
  authorDetails: {
    marginLeft: spacing.md,
  },
  authorName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  timeAgo: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
  workoutSummary: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  postActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#22222A',
    paddingTop: spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.xl,
  },
  actionCount: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: '600',
  },
});
