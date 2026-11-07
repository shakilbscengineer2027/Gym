import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, CheckCircle } from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../../validation/auth.schema';
import { colors, typography, spacing } from '../../theme';

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmittedEmail(data.email);
      setSubmitted(true);
    }, 600);
  };

  return (
    <ScreenContainer scrollable={true}>
      <Header
        title="Reset Password"
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        {submitted ? (
          <View style={styles.successBox}>
            <CheckCircle size={48} color={colors.primary} />
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successMessage}>
              We have dispatched a secure password reset link to {submittedEmail}. Follow the instructions to choose a new password.
            </Text>
            <Button
              title="Return to Sign In"
              onPress={() => navigation.goBack()}
              fullWidth={true}
              style={styles.backBtn}
            />
          </View>
        ) : (
          <View>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your registered email address and we'll send you an encrypted link to reset your credentials.
            </Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Email Address"
                  placeholder="name@example.com"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                  leftIcon={<Mail size={18} color={colors.textSecondary} />}
                />
              )}
            />

            <Button
              title="Send Reset Instructions"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              fullWidth={true}
              size="lg"
              style={styles.submitBtn}
            />
          </View>
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  submitBtn: {
    marginTop: spacing.md,
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  successTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  successMessage: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  backBtn: {
    marginTop: spacing.xl,
  },
});
