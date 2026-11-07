import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Send, Star, ShieldCheck, CheckCheck } from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { mockTrainer } from '../../fixtures/mockData';
import { colors, typography, radii, spacing, shadows } from '../../theme';

export const TrainerScreen: React.FC = () => {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'msg_1',
      sender: 'trainer',
      text: 'Great form on those Barbell Deadlifts yesterday, Michael! Your hip hinge was clean.',
      time: '10:30 AM',
    },
    {
      id: 'msg_2',
      sender: 'trainer',
      text: 'For today\'s Biceps Workout, ensure you slow down the eccentric descent on preacher curls to 3 full seconds.',
      time: '10:32 AM',
    },
    {
      id: 'msg_3',
      sender: 'user',
      text: 'Thanks Coach! Will focus on controlling the negative tempo.',
      time: '10:45 AM',
    },
  ]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      time: 'Just now',
    };
    setMessages([...messages, newMsg]);
    setInputText('');
  };

  return (
    <ScreenContainer scrollable={false}>
      <Header
        title={mockTrainer.name}
        subtitle="Certified Strength Coach"
        onBackPress={() => navigation.goBack()}
      />

      {/* Trainer Profile Ribbon */}
      <Card style={styles.trainerRibbon}>
        <Image source={{ uri: mockTrainer.avatarUrl }} style={styles.avatar} />
        <View style={styles.ribbonInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.trainerName}>{mockTrainer.name}</Text>
            <ShieldCheck size={16} color={colors.primary} style={styles.verifiedIcon} />
          </View>
          <Text style={styles.specializationText}>{mockTrainer.specialization}</Text>
          <View style={styles.ratingRow}>
            <Star size={12} color={colors.goldYellow} fill={colors.goldYellow} />
            <Text style={styles.ratingText}> {mockTrainer.rating} Client Rating</Text>
          </View>
        </View>
      </Card>

      {/* Message Chat Feed */}
      <ScrollView
        style={styles.chatScroll}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m) => {
          const isMe = m.sender === 'user';
          return (
            <View
              key={m.id}
              style={[
                styles.bubbleWrapper,
                isMe ? styles.bubbleRight : styles.bubbleLeft,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  isMe ? styles.bubbleUser : styles.bubbleTrainer,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isMe ? styles.messageTextUser : styles.messageTextTrainer,
                  ]}
                >
                  {m.text}
                </Text>
                <View style={styles.messageFooter}>
                  <Text style={styles.timeText}>{m.time}</Text>
                  {isMe && <CheckCheck size={12} color={colors.textOnPrimary} />}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Message Input Box */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Ask Coach Narez a question..."
          placeholderTextColor={colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          style={styles.textInput}
        />
        <TouchableOpacity
          onPress={handleSend}
          activeOpacity={0.8}
          style={styles.sendButton}
        >
          <Send size={16} color={colors.textOnPrimary} />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  trainerRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginVertical: spacing.xs,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ribbonInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trainerName: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  specializationText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    ...typography.caption,
    color: colors.goldYellow,
    fontSize: 10,
    fontWeight: '700',
  },
  chatScroll: {
    flex: 1,
    marginVertical: spacing.sm,
  },
  chatContent: {
    paddingVertical: spacing.sm,
  },
  bubbleWrapper: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  bubbleLeft: {
    justifyContent: 'flex-start',
  },
  bubbleRight: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '82%',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radii.xl,
  },
  bubbleTrainer: {
    backgroundColor: '#1C1C22',
    borderWidth: 1,
    borderColor: '#292934',
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  messageText: {
    ...typography.bodyMedium,
    lineHeight: 20,
  },
  messageTextTrainer: {
    color: colors.textPrimary,
  },
  messageTextUser: {
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    ...typography.caption,
    fontSize: 9,
    color: 'rgba(0,0,0,0.5)',
    marginRight: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16161A',
    borderRadius: radii.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: '#26262E',
    marginBottom: spacing.sm,
  },
  textInput: {
    flex: 1,
    color: colors.textPrimary,
    ...typography.bodyMedium,
    height: 44,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.neonGlow,
  },
});
