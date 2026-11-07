# ApexPulse Mobile UI & Design System Specification

## 1. Visual Identity & Reference Alignment

The mobile client user interface faithfully implements the design language established in the reference specification:

| Design Token | Specification | Implementation Token |
| :--- | :--- | :--- |
| **Primary Background** | Deep black | `colors.background` (`#0B0B0C`) |
| **Secondary Background** | Dark charcoal | `colors.backgroundSecondary` (`#121214`) |
| **Card Surface** | Rounded dark surface with subtle 1px border | `colors.cardSurface` (`#19191C`, border: `#27272A`) |
| **Primary Accent** | Electric neon lime green | `colors.primary` (`#D0FD3E`) |
| **Secondary Accents** | Gold/yellow for badges & "See All >" | `colors.goldYellow` (`#FCD34D`) |
| **Status Completed** | Emerald green checkmark & badge | `colors.statusCompleted` (`#34D399`) |
| **Typography** | Modern sans-serif, bold tabular figures | `typography.h1` to `caption` |
| **Button Geometry** | Fully rounded pill buttons | `radii.full` (9999px) |

---

## 2. Reference Screen Match Breakdown

### Screen 1: Home Dashboard (`HomeScreen.tsx`)
1. **User Header**:
   - Circular athlete avatar (`Michael Law`).
   - Subdued greeting ("Welcome Back!").
   - Dark circular notification bell button with neon lime notification indicator dot.
2. **Search Bar**:
   - Rounded dark pill input with magnifying glass icon and right filter sliders button.
3. **Popular Plans**:
   - Horizontal pill strip: "Strength" (active neon lime with dumbbell icon), "Fat Loss" (inactive dark pill with flame icon), "Cardio", "Stretch".
4. **Health Grade Hero Card**:
   - High-contrast neon lime card (`#D0FD3E`).
   - Bold black typography: "Health Grade" + "Your fitness journey is on track. Stay consistent to achieve even better results."
   - Circular SVG progress ring displaying **85%**.
5. **Metric Cards**:
   - **Heart Rate**: Lime heart icon badge, "120 BPM".
   - **Workout Time**: Lime speedometer gauge icon badge, "5h 40m", "this week" subtitle.
6. **Trainer Card**:
   - Coach avatar ("Coach Narez"), "New Feedback Available" subtitle.
   - Neon lime circular message bubble button.
7. **Today's Workout**:
   - Dark card with athlete background imagery, "Mid-Level" badge with lime dot, "Biceps Workout" title, and circular play button.

### Screen 2: Workout Screen (`WorkoutScreen.tsx`)
1. **Navigation Header**:
   - Circular back button `<` and centered "Workout" title.
2. **Fitness Level Header**:
   - "Advance" (large bold white text), "Fitness Level" (small subdued grey), right "See All >" gold button.
3. **Vertical Category Cards**:
   - **Strength Training**: 42 Sessions (gold tag), barbell deadlift imagery.
   - **Functional Fitness**: 28 Sessions, athletic movement imagery.
   - **Mind & Mobility**: 34 Sessions, mobility/flexibility imagery.
   - **Core Strength**: 36 Sessions, core stability imagery.

### Screen 3: Schedule Screen (`ScheduleScreen.tsx`)
1. **Navigation Header**:
   - Circular back button `<` and centered "Schedule" title.
2. **Workout Plan Header**:
   - "Workout Plan" + "Track, train, and improve" + "See All >" gold button.
3. **Weekly Calendar Strip**:
   - 7-day horizontal strip: Mon 29 Jun, **Tue 30 Jun (Selected: neon lime pill with black text)**, Wed 1 Jul, Thu 2 Jul, Fri 3 Jul, Sat 4 Jul, Sun 5 Jun.
4. **Today's Focus Hero Card**:
   - "Today's Focus" badge with yellow dot.
   - "Biceps Workout" title.
   - Stats: "1900 Kcal", "60 Min".
   - Pill button: **"Start Workout >"** (neon lime with black text).
   - Athlete curl photo on the right.
5. **Today's Plan Exercise List**:
   - **Barbell Curl**: Circle badge "1", "4 Sets • 10-12 Reps", green **"Completed"** badge with checkmark.
   - **Hammer Curl**: Circle badge "2", "3 Sets • 10-12 Reps", grey **"Upcoming"** badge with clock.
   - **Preacher Curl**: Circle badge "3", "3 Sets • 10-12 Reps", grey **"Upcoming"** badge with clock.
6. **Weekly Progress Card**:
   - "Weekly Progress" with "3 of 6 Workouts" counter and lime progress bar.

---

## 3. Navigation & Floating Tab Bar

The application features a custom tab bar (`CustomTabBar.tsx`):
- **5 Bottom Tabs**: Home, Workout, Center Progress (floating neon lime pill with flame icon and glow), Schedule, Profile.
- **Deep Dark Aesthetic**: Positioned absolute over deep black background with safe area inset handling.
- **Root Stack**: Smooth transitions to Detail views, Live Workout session, Nutrition, Trainer chat, Notifications, Settings, and GDPR Privacy Hub.

---

## 4. Component Hierarchy

```
apps/mobile/src/
├── theme/                     # Tokens: colors, typography, spacing, shadows
├── components/
│   ├── common/                # Button, IconButton, Card, Badge, Input, SearchBar, ScreenContainer, Header, Modal, Skeleton
│   ├── home/                  # HealthGradeCard, StatMetricCard, TrainerCard, TodayWorkoutCard, CategoryPillList
│   ├── workout/               # WorkoutCategoryCard
│   ├── schedule/              # WeeklyCalendarStrip, TodayFocusCard, ExerciseListItem, WeeklyProgressCard
│   └── navigation/            # CustomTabBar (elevated center flame button)
├── store/                     # Zustand store (active live workout, rest timer, selected dates)
├── fixtures/                  # Type-safe mockup datasets matching reference designs
├── navigation/                # RootNavigator, TabNavigator, route parameter interfaces
└── screens/                   # 15 Implemented Screens
```
