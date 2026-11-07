import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, CheckCircle2 } from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Header } from '../../components/common/Header';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { registerSchema, RegisterFormData } from '../../validation/auth.schema';
import { secureStorage } from '../../storage/secureStorage';
import { colors, typography, spacing } from '../../theme';

type RegisterNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterNavigationProp>();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      healthConsent: false,
    },
  });

  const onSubmit = async (_data: RegisterFormData) => {
    setLoading(true);
    try {
      await secureStorage.saveTokens(`reg_jwt_${Date.now()}`, `reg_refresh_${Date.now()}`);
      Alert.alert('Registration Complete', 'Your account has been created.', [
        { text: 'Start Journey', onPress: () => navigation.replace('MainTabs', { screen: 'Home' }) },
      ]);
    } catch {
      Alert.alert('Registration Failed', 'An error occurred during account creation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scrollable={true}>
      <Header
        title="Create Account"
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Join SK Gym</Text>
        <Text style={styles.subtitle}>
          Build strength, track progress, and reach elite performance
        </Text>

        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Full Name"
              placeholder="e.g. Michael Law"
              value={value}
              onChangeText={onChange}
              error={errors.fullName?.message}
              leftIcon={<User size={18} color={colors.textSecondary} />}
            />
          )}
        />

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

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Password (min 12 chars, 1 uppercase, 1 special)"
              placeholder="Create secure password"
              value={value}
              onChangeText={onChange}
              secureTextEntry={true}
              error={errors.password?.message}
              leftIcon={<Lock size={18} color={colors.textSecondary} />}
            />
          )}
        />

        {/* GDPR Special Category Health Data Explicit Consent */}
        <Controller
          control={control}
          name="healthConsent"
          render={({ field: { onChange, value } }) => (
            <View>
              <TouchableOpacity
                onPress={() => onChange(!value)}
                activeOpacity={0.8}
                style={styles.consentRow}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: value }}
              >
                <View style={[styles.checkbox, value && styles.checkboxActive]}>
                  {value && <CheckCircle2 size={16} color={colors.textOnPrimary} />}
                </View>
                <Text style={styles.consentText}>
                  I consent to the processing of my fitness and health data (workouts, body weight, heart rate) under GDPR Article 9.
                </Text>
              </TouchableOpacity>
              {errors.healthConsent && (
                <Text style={styles.errorText}>{errors.healthConsent.message}</Text>
              )}
            </View>
          )}
        />

        <Button
          title="Create Account"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          fullWidth={true}
          size="lg"
          style={styles.registerBtn}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    paddingVertical: spacing.lg,
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
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#303038',
    backgroundColor: '#16161A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  consentText: {
    flex: 1,
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  errorText: {
    ...typography.caption,
    color: colors.heartRed,
    marginBottom: spacing.sm,
  },
  registerBtn: {
    marginTop: spacing.md,
  },
});
