import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Fingerprint } from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { loginSchema, LoginFormData } from '../../validation/auth.schema';
import { secureStorage } from '../../storage/secureStorage';
import { colors, typography, radii, spacing } from '../../theme';

type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'michael.law@example.com',
      password: 'Password123!',
    },
  });

  const onSubmit = async (_data: LoginFormData) => {
    setLoading(true);
    try {
      // Save tokens securely to hardware keychain / Keystore
      await secureStorage.saveTokens(`demo_jwt_${Date.now()}`, `demo_refresh_${Date.now()}`);
      navigation.replace('MainTabs', { screen: 'Home' });
    } catch {
      Alert.alert('Authentication Failed', 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setLoading(true);
    await secureStorage.saveTokens(`bio_jwt_${Date.now()}`, `bio_refresh_${Date.now()}`);
    setLoading(false);
    navigation.replace('MainTabs', { screen: 'Home' });
  };

  return (
    <ScreenContainer scrollable={true}>
      <View style={styles.content}>
        {/* Logo / Brand Header */}
        <View style={styles.brandContainer}>
          <View style={styles.logoPill}>
            <Text style={styles.logoText}>SK GYM</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to access your workouts and analytics
          </Text>
        </View>

        {/* Input Fields with Form Controller & Validation */}
        <View style={styles.formContainer}>
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
                label="Password"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                secureTextEntry={true}
                error={errors.password?.message}
                leftIcon={<Lock size={18} color={colors.textSecondary} />}
              />
            )}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotBtn}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            fullWidth={true}
            size="lg"
            style={styles.signInBtn}
          />

          {/* Biometric Quick Unlock */}
          <TouchableOpacity
            onPress={handleBiometricLogin}
            activeOpacity={0.7}
            style={styles.biometricBtn}
          >
            <Fingerprint size={22} color={colors.primary} />
            <Text style={styles.biometricText}>Unlock with Face ID / Biometrics</Text>
          </TouchableOpacity>
        </View>

        {/* Footer switch to Register */}
        <View style={styles.footerRow}>
          <Text style={styles.footerPrompt}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoPill: {
    backgroundColor: '#1E280A',
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#303E12',
    marginBottom: spacing.md,
  },
  logoText: {
    ...typography.badgeText,
    color: colors.primary,
    letterSpacing: 2,
    fontSize: 10,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  formContainer: {
    width: '100%',
    marginVertical: spacing.md,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  signInBtn: {
    marginVertical: spacing.sm,
  },
  biometricBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16161A',
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#24242B',
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  biometricText: {
    ...typography.buttonText,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    fontSize: 13,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerPrompt: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  registerLink: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '800',
  },
});
