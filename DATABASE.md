# Database Architecture & Relational Schema Specification

This document details the PostgreSQL 16 database design, entity-relationship topology, Prisma ORM 6 schema definition, indexing strategy, and partitioning policies for **ApexPulse**.

---

## 1. Architectural Design Principles

- **Engine**: **PostgreSQL 16** with extensions:
  - `pgcrypto`: Generates standard cryptographic hashes and supports UUIDv7.
  - `citext`: Case-insensitive text storage for user email addresses.
- **Identifier Strategy**: **UUIDv7** across all primary keys. Unlike random UUIDv4, UUIDv7 embeds a millisecond-precision Unix timestamp prefix, eliminating B-tree index fragmentation and yielding sequential insert performance comparable to auto-incrementing integers while preserving global uniqueness.
- **Soft Deletion**: Entities subject to user lifecycle management include nullable `deletedAt DateTime?` columns. Prisma query extensions automatically append `deletedAt: null` to standard query filters.
- **Temporal Auditing**: Every model includes immutable `createdAt DateTime @default(now())` and auto-updating `updatedAt DateTime @updatedAt` timestamps.
- **Connection Pooling**: **PgBouncer** operates in `transaction` pooling mode to support thousands of concurrent mobile client connections without exhausting PostgreSQL memory limits.

---

## 2. Complete Prisma Schema Model Specification

Below is the definitive schema definition covering all 14 application modules:

```prisma
// datasource and generator definitions
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["relationJoins", "fullTextSearchPostgres"]
}

// ==========================================
// ENUMS
// ==========================================

enum UserRole {
  USER
  TRAINER
  ADMIN
  SUPER_ADMIN
}

enum AccountStatus {
  PENDING_VERIFICATION
  ACTIVE
  SUSPENDED
  PENDING_DELETION
}

enum MuscleGroup {
  CHEST
  BACK_LATS
  BACK_UPPER
  BACK_LOWER
  SHOULDERS_ANTERIOR
  SHOULDERS_LATERAL
  SHOULDERS_POSTERIOR
  BICEPS
  TRICEPS
  FOREARMS
  QUADRICEPS
  HAMSTRINGS
  GLUTES
  CALVES
  ABDOMINALS
  OBLIQUES
  CARDIOVASCULAR
  FULL_BODY
}

enum EquipmentType {
  BARBELL
  DUMBBELL
  KETTLEBELL
  MACHINE
  CABLE
  BODYWEIGHT
  RESISTANCE_BAND
  SMITH_MACHINE
  OTHER
}

enum SetType {
  WARMUP
  NORMAL
  DROPSET
  MYO_REP
  FAILURE
}

enum WorkoutSessionStatus {
  IN_PROGRESS
  COMPLETED
  CANCELLED
  ABANDONED
}

enum ConsentType {
  CONSENT_HEALTH_DATA_PROCESSING
  CONSENT_PROGRESS_PHOTOS
  CONSENT_COMMUNITY_LEADERBOARDS
  CONSENT_ANALYTICS_IMPROVEMENT
  CONSENT_MARKETING_NOTIFICATIONS
}

enum SubscriptionTier {
  FREE
  PRO_ATHLETE_MONTHLY
  PRO_ATHLETE_ANNUAL
  TRAINER_TIER
}

enum SubscriptionStatus {
  INCOMPLETE
  TRIALING
  ACTIVE
  PAST_DUE
  CANCELLED
  UNPAID
}

enum AssignmentStatus {
  PENDING
  ACCEPTED
  DECLINED
  TERMINATED
}

// ==========================================
// MODULE 01: AUTHENTICATION & USERS
// ==========================================

model User {
  id              String         @id @default(uuid(7))
  email           String         @unique
  passwordHash    String
  role            UserRole       @default(USER)
  status          AccountStatus  @default(PENDING_VERIFICATION)
  emailVerified   Boolean        @default(false)
  deletedAt       DateTime?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  profile         Profile?
  settings        UserSettings?
  refreshTokens   RefreshToken[]
  consents        UserConsent[]
  auditLogs       AuditLog[]
  workoutSessions WorkoutSession[]
  workoutTemplates WorkoutTemplate[]
  schedules       ScheduleEvent[]
  nutritionGoals  NutritionGoal[]
  mealLogs        MealLog[]
  bodyMeasurements BodyMeasurement[]
  progressPhotos  ProgressPhoto[]
  personalRecords PersonalRecord[]
  notifications   Notification[]
  posts           CommunityPost[]
  postLikes       PostLike[]
  postComments    PostComment[]
  subscription    UserSubscription?
  trainerProfile  TrainerProfile?
  clientRelations TrainerClientAssignment[] @relation("ClientAssignments")

  @@index([email])
  @@index([status, deletedAt])
}

model Profile {
  id             String    @id @default(uuid(7))
  userId         String    @unique
  displayName    String
  avatarUrl      String?
  bio            String?
  experienceLevel String   // Beginner, Intermediate, Advanced
  primaryGoal    String    // Hypertrophy, Strength, WeightLoss, GeneralFitness
  preferredUnit  String    @default("METRIC") // METRIC, IMPERIAL
  birthDate      DateTime?
  gender         String?
  heightCm       Float?
  updatedAt      DateTime  @updatedAt

  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model RefreshToken {
  id         String    @id @default(uuid(7))
  userId     String
  tokenHash  String    @unique
  familyId   String    // Token family identifier for reuse detection
  isRevoked  Boolean   @default(false)
  expiresAt  DateTime
  createdAt  DateTime  @default(now())

  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, isRevoked])
  @@index([tokenHash])
}

model UserSettings {
  id                  String   @id @default(uuid(7))
  userId              String   @unique
  theme               String   @default("DARK")
  restTimerSound      Boolean  @default(true)
  restTimerVibration  Boolean  @default(true)
  autoStartRestTimer  Boolean  @default(true)
  defaultRestSeconds  Int      @default(90)
  pushNotifications   Boolean  @default(true)
  updatedAt           DateTime @updatedAt

  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ==========================================
// MODULE 03: EXERCISES & CATALOG
// ==========================================

model Exercise {
  id               String            @id @default(uuid(7))
  name             String
  slug             String            @unique
  primaryMuscle    MuscleGroup
  equipment        EquipmentType
  instructions     String?           @db.Text
  videoUrl         String?
  thumbnailUrl     String?
  isCustom         Boolean           @default(false)
  createdById      String?
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt

  muscles          ExerciseMuscle[]
  templateItems    WorkoutTemplateExercise[]
  sessionSets      SetLog[]
  personalRecords  PersonalRecord[]

  @@index([primaryMuscle])
  @@index([equipment])
  @@index([isCustom, createdById])
}

model ExerciseMuscle {
  id          String      @id @default(uuid(7))
  exerciseId  String
  muscle      MuscleGroup
  isPrimary   Boolean     @default(false)

  exercise    Exercise    @relation(fields: [exerciseId], references: [id], onDelete: Cascade)
  @@unique([exerciseId, muscle])
}

// ==========================================
// MODULE 04 & 05: WORKOUT TEMPLATES & TRACKING
// ==========================================

model WorkoutTemplate {
  id          String   @id @default(uuid(7))
  userId      String
  name        String
  description String?
  isPublic    Boolean  @default(false)
  version     Int      @default(1)
  deletedAt   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  exercises   WorkoutTemplateExercise[]
  sessions    WorkoutSession[]

  @@index([userId, deletedAt])
}

model WorkoutTemplateExercise {
  id                String          @id @default(uuid(7))
  workoutTemplateId String
  exerciseId        String
  sortOrder         Int
  targetSets        Int             @default(3)
  targetReps        Int             @default(10)
  targetRpe         Float?
  restSeconds       Int             @default(90)
  supersetGroupId   String?

  workoutTemplate   WorkoutTemplate @relation(fields: [workoutTemplateId], references: [id], onDelete: Cascade)
  exercise          Exercise        @relation(fields: [exerciseId], references: [id], onDelete: Restrict)
  @@index([workoutTemplateId, sortOrder])
}

model WorkoutSession {
  id                String               @id @default(uuid(7))
  userId            String
  workoutTemplateId String?
  name              String
  status            WorkoutSessionStatus @default(IN_PROGRESS)
  startedAt         DateTime             @default(now())
  endedAt           DateTime?
  durationSeconds   Int?
  totalVolumeKg     Float?
  ratingNotes       String?
  clientMutationId  String?              @unique
  deletedAt         DateTime?
  createdAt         DateTime             @default(now())
  updatedAt         DateTime             @updatedAt

  user              User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  template          WorkoutTemplate?     @relation(fields: [workoutTemplateId], references: [id], onDelete: SetNull)
  setLogs           SetLog[]

  @@index([userId, startedAt])
  @@index([status])
}

model SetLog {
  id               String         @id @default(uuid(7))
  workoutSessionId String
  exerciseId       String
  setNumber        Int
  setType          SetType        @default(NORMAL)
  weightKg         Float
  reps             Int
  rpe              Float?
  rir              Int?
  isCompleted      Boolean        @default(true)
  restTakenSeconds Int?
  clientSetId      String?        @unique
  completedAt      DateTime       @default(now())

  workoutSession   WorkoutSession @relation(fields: [workoutSessionId], references: [id], onDelete: Cascade)
  exercise         Exercise       @relation(fields: [exerciseId], references: [id], onDelete: Restrict)

  @@index([workoutSessionId, exerciseId])
  @@index([exerciseId, completedAt])
}

// ==========================================
// MODULE 06: SCHEDULE & CALENDAR
// ==========================================

model ScheduleEvent {
  id                String    @id @default(uuid(7))
  userId            String
  workoutTemplateId String?
  title             String
  scheduledDate     DateTime  @db.Date
  scheduledTime     String?   // HH:mm
  isCompleted       Boolean   @default(false)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, scheduledDate])
}

// ==========================================
// MODULE 07: NUTRITION & DIET
// ==========================================

model NutritionGoal {
  id             String    @id @default(uuid(7))
  userId         String    @unique
  dailyCalories  Int
  proteinGrams   Int
  carbGrams      Int
  fatGrams       Int
  waterMl        Int       @default(2500)
  updatedAt      DateTime  @updatedAt

  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model MealLog {
  id           String         @id @default(uuid(7))
  userId       String
  date         DateTime       @db.Date
  mealType     String         // BREAKFAST, LUNCH, DINNER, SNACK
  calories     Int
  proteinGrams Float
  carbGrams    Float
  fatGrams     Float
  createdAt    DateTime       @default(now())

  user         User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  foodItems    MealFoodItem[]

  @@index([userId, date])
}

model MealFoodItem {
  id         String   @id @default(uuid(7))
  mealLogId  String
  foodName   String
  servingQty Float
  servingUnit String
  calories   Int
  protein    Float
  carbs      Float
  fat        Float

  mealLog    MealLog  @relation(fields: [mealLogId], references: [id], onDelete: Cascade)
}

// ==========================================
// MODULE 08: MEASUREMENTS & VITALS
// ==========================================

model BodyMeasurement {
  id              String   @id @default(uuid(7))
  userId          String
  recordedDate    DateTime @db.Date
  weightKg        Float
  bodyFatPercent  Float?
  chestCm         Float?
  waistCm         Float?
  hipsCm          Float?
  leftArmCm       Float?
  rightArmCm      Float?
  leftThighCm     Float?
  rightThighCm    Float?
  createdAt       DateTime @default(now())

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, recordedDate])
}

model ProgressPhoto {
  id           String   @id @default(uuid(7))
  userId       String
  storageKey   String   // Private S3 object key
  photoType    String   // FRONT, SIDE, BACK
  recordedDate DateTime @db.Date
  createdAt    DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, recordedDate])
}

// ==========================================
// MODULE 09: ANALYTICS & PERSONAL RECORDS
// ==========================================

model PersonalRecord {
  id             String   @id @default(uuid(7))
  userId         String
  exerciseId     String
  recordType     String   // ESTIMATED_1RM, MAX_WEIGHT, MAX_VOLUME
  value          Float
  achievedDate   DateTime @default(now())

  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  exercise       Exercise @relation(fields: [exerciseId], references: [id], onDelete: Restrict)
  @@unique([userId, exerciseId, recordType])
}

// ==========================================
// MODULE 10: TRAINERS & COACHING
// ==========================================

model TrainerProfile {
  id             String   @id @default(uuid(7))
  userId         String   @unique
  specialization String
  certification  String
  isVerified     Boolean  @default(false)
  hourlyRate     Float?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  clients        TrainerClientAssignment[] @relation("TrainerAssignments")
}

model TrainerClientAssignment {
  id               String           @id @default(uuid(7))
  trainerProfileId String
  clientId         String
  status           AssignmentStatus @default(PENDING)
  assignedAt       DateTime         @default(now())
  updatedAt        DateTime         @updatedAt

  trainerProfile   TrainerProfile   @relation("TrainerAssignments", fields: [trainerProfileId], references: [id], onDelete: Cascade)
  client           User             @relation("ClientAssignments", fields: [clientId], references: [id], onDelete: Cascade)
  @@unique([trainerProfileId, clientId])
}

// ==========================================
// MODULE 11: NOTIFICATIONS
// ==========================================

model Notification {
  id        String   @id @default(uuid(7))
  userId    String
  title     String
  body      String
  type      String   // WORKOUT_REMINDER, PR_ACHIEVED, COACH_FEEDBACK, SYSTEM
  dataPayload JsonB?
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, isRead])
}

// ==========================================
// MODULE 12: COMMUNITY & LEADERBOARDS
// ==========================================

model CommunityPost {
  id           String        @id @default(uuid(7))
  userId       String
  content      String        @db.Text
  mediaUrl     String?
  likeCount    Int           @default(0)
  commentCount Int           @default(0)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  likes        PostLike[]
  comments     PostComment[]

  @@index([createdAt])
}

model PostLike {
  id        String        @id @default(uuid(7))
  postId    String
  userId    String
  createdAt DateTime      @default(now())

  post      CommunityPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  user      User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([postId, userId])
}

model PostComment {
  id        String        @id @default(uuid(7))
  postId    String
  userId    String
  content   String
  createdAt DateTime      @default(now())

  post      CommunityPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  user      User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([postId, createdAt])
}

// ==========================================
// MODULE 13: SUBSCRIPTIONS & ENTITLEMENTS
// ==========================================

model UserSubscription {
  id                   String             @id @default(uuid(7))
  userId               String             @unique
  tier                 SubscriptionTier   @default(FREE)
  status               SubscriptionStatus @default(ACTIVE)
  provider             String             // STRIPE, APPLE, GOOGLE
  providerSubscriptionId String           @unique
  currentPeriodStart   DateTime
  currentPeriodEnd     DateTime
  cancelAtPeriodEnd    Boolean            @default(false)
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt

  user                 User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([status, currentPeriodEnd])
}

// ==========================================
// MODULE 14: GDPR, AUDIT & SYSTEM INTEGRITY
// ==========================================

model UserConsent {
  id            String      @id @default(uuid(7))
  userId        String
  consentType   ConsentType
  granted       Boolean
  policyVersion String
  ipHash        String
  userAgent     String
  timestamp     DateTime    @default(now())

  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, consentType])
}

model AuditLog {
  id         String   @id @default(uuid(7))
  userId     String?
  action     String
  resource   String
  ipHash     String
  userAgent  String
  metadata   JsonB?
  createdAt  DateTime @default(now())

  user       User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  @@index([action, createdAt])
  @@index([userId, createdAt])
}
```

---

## 3. High-Performance Indexing Strategy

1. **Covering Indexes for Active Sessions**:
   `@@index([userId, startedAt])` on `WorkoutSession` ensures the user's recent workout history loads instantly without table scans.
2. **Compound Filter Indexes**:
   `@@index([workoutSessionId, exerciseId])` on `SetLog` enables instant grouping and retrieval of exercise sets during live tracking.
3. **Session Revocation Lookup**:
   `@@index([userId, isRevoked])` and `@@index([tokenHash])` on `RefreshToken` guarantees microsecond response times for auth token validations.
4. **GDPR Consent Verification**:
   `@@index([userId, consentType])` allows instant capability gating prior to writing health or measurement records.

