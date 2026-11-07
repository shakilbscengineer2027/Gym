import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { WorkoutDetailsScreen } from '../screens/workout/WorkoutDetailsScreen';
import { ExerciseDetailsScreen } from '../screens/workout/ExerciseDetailsScreen';
import { ExerciseLibraryScreen } from '../screens/workout/ExerciseLibraryScreen';
import { CreateWorkoutScreen } from '../screens/workout/CreateWorkoutScreen';
import { BodyMeasurementsScreen } from '../screens/profile/BodyMeasurementsScreen';
import { ActiveWorkoutScreen } from '../screens/workout/ActiveWorkoutScreen';
import { WorkoutHistoryScreen } from '../screens/progress/WorkoutHistoryScreen';
import { NutritionScreen } from '../screens/nutrition/NutritionScreen';
import { TrainerScreen } from '../screens/trainer/TrainerScreen';
import { CommunityScreen } from '../screens/community/CommunityScreen';
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { PrivacySecurityScreen } from '../screens/settings/PrivacySecurityScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        contentStyle: { backgroundColor: '#0B0B0C' },
      }}
    >
      {/* Main Tabs Container */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />

      {/* Auth Screens */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

      {/* Detail, Sub-screens & Modals */}
      <Stack.Screen name="WorkoutDetails" component={WorkoutDetailsScreen} />
      <Stack.Screen name="ExerciseDetails" component={ExerciseDetailsScreen} />
      <Stack.Screen name="ExerciseLibrary" component={ExerciseLibraryScreen} />
      <Stack.Screen name="CreateWorkout" component={CreateWorkoutScreen} />
      <Stack.Screen name="BodyMeasurements" component={BodyMeasurementsScreen} />
      <Stack.Screen
        name="ActiveWorkout"
        component={ActiveWorkoutScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} />
      <Stack.Screen name="Nutrition" component={NutritionScreen} />
      <Stack.Screen name="Trainer" component={TrainerScreen} />
      <Stack.Screen name="Community" component={CommunityScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
    </Stack.Navigator>
  );
};
