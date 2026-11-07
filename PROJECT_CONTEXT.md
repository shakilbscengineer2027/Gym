# Project Context & Domain Scope

## 1. Executive Summary & Vision

**ApexPulse** is an enterprise-grade mobile fitness and gym ecosystem designed to deliver an elite-level workout tracking, coaching, and body-transformation experience. The platform bridges the gap between self-directed gym athletes, certified personal trainers, and gym facility management.

The system is built around three uncompromising tenets:
1. **Uninterrupted Offline Performance**: Gym basements and weight rooms suffer from poor network connectivity. Workout logging, timer operations, and local progress tracking must operate with zero network latency and automatically synchronize when connectivity resumes.
2. **Strict Health Data Privacy (GDPR Compliance)**: Body measurements, health metrics, workout histories, and nutritional diaries constitute sensitive personal data (GDPR Special Category Data under Article 9). The system implements privacy-by-design, cryptographic protection, and self-service privacy controls.
3. **Maintainable Modular Monolith Architecture**: The platform begins as an intentionally structured, clean-architecture modular monolith on NestJS. This eliminates distributed systems overhead while ensuring modular boundaries are clean enough to extract into dedicated microservices if scale dictates.

---

## 2. Target Personas & Stakeholders

| Persona | Primary Needs | Key Device / Touchpoint |
| :--- | :--- | :--- |
| **Gym Athlete (Free Tier)** | Track reps/weights without paper, exercise discovery, basic analytics, countdown rest timers. | Mobile (iOS / Android) |
| **Gym Athlete (Premium Pro)** | Advanced progressive overload analytics, 1RM estimations, nutrition tracking, video form checks, custom training plans. | Mobile (iOS / Android) |
| **Personal Trainer / Coach** | Assign custom routines, monitor client compliance, review workout logs, chat, analyze progress metrics. | Mobile + Web Portal (Future) |
| **Gym Administrator / Owner** | Member management, trainer schedule oversight, subscription revenue tracking, facility audit logs. | Admin Dashboard / REST API |
| **Compliance Officer / DPO** | Audit logs, consent verification, data subject requests (SAR / erasure), security incident response. | Backend API & Audit Store |

---

## 3. Core Functional Modules Breakdown

### Module 01: Authentication & User Profiles
- **Capabilities**: Email/password registration, OAuth2 (Apple Sign-In, Google Sign-In), biometric unlock (Face ID / Fingerprint) linked to secure local tokens.
- **Profile Attributes**: Display name, avatar, bio, fitness experience level (Beginner, Intermediate, Advanced), primary fitness goal (Hypertrophy, Strength, Weight Loss, Endurance), training split preference, metric/imperial unit preferences.
- **Account State**: Active, suspended, pending email verification, marked for deletion (GDPR 30-day grace period).

### Module 02: Home Dashboard
- **Capabilities**: Daily readiness score, quick "Resume Workout" banner, next scheduled training session, daily caloric/macro progress rings, weekly streak counter, personal record (PR) alerts, community spotlight feed.
- **Dynamic Aggregation**: Aggregated via high-speed Redis cached view with client-side optimistic rendering.

### Module 03: Exercise Library
- **Capabilities**: 1,200+ pre-seeded exercise movements with multi-angle instructional video/GIF assets, muscle group taxonomy (Primary, Secondary, Stabilizer), equipment filters (Barbell, Dumbbell, Cable, Machine, Bodyweight, Bands), mechanics (Compound, Isolation), and movement patterns (Push, Pull, Squat, Hinge, Carry).
- **Custom User Exercises**: Ability to create private user-defined exercises with custom muscle target mapping.

### Module 04: Workout Management & Templates
- **Capabilities**: Creation, editing, and sharing of multi-day training routines (e.g., Push-Pull-Legs, Upper-Lower, 5/3/1).
- **Template Configuration**: Superset grouping, drop-set flags, rest interval definitions, target RPE (Rate of Perceived Exertion) / RIR (Reps in Reserve), percentage of 1RM targets.
- **Public & Trainer Templates**: Curated official plans, trainer-shared routines, and community template cloning.

### Module 05: Active Workout Tracking
- **Capabilities**: Live session execution with offline persistence to SQLite after every completed set.
- **Logging Attributes**: Set type (Warm-up, Working, Drop-set, Failure), Weight (kg/lb), Reps performed, RPE (1-10), RIR, Rest timer countdown with background local notifications, previous session set-by-set ghost comparisons.
- **Calculations**: Live volume load calculation, auto-detection of new Estimated 1RM (E1RM) using Brzycki and Epley algorithms.

### Module 06: Schedule & Calendar
- **Capabilities**: Interactive monthly, weekly, and daily calendar views. Scheduling routines to future dates, recurring workout events, rest day markers, gym booking integrations.
- **Notifications**: Configurable workout reminders sent via Push Notification (FCM / APNs) 30–60 minutes before scheduled time.

### Module 07: Nutrition & Diet Tracking
- **Capabilities**: Daily macronutrient (Protein, Carbohydrate, Fat) and calorie target configuration. Meal logging (Breakfast, Lunch, Dinner, Snacks).
- **Food Database**: Food item search, barcode scanning integration endpoint, custom meal recipes, water intake tracker.

### Module 08: Body Measurements & Vitals
- **Capabilities**: Body weight logging with rolling 7-day average smoothing, body fat percentage, circumference measurements (Chest, Arms, Waist, Hips, Thighs, Calves), progress photo gallery with secure on-device/encrypted storage.

### Module 09: Fitness Progress & Analytics
- **Capabilities**: Longitudinal volume trends per muscle group, frequency heatmaps, strength progression curves per exercise, power-to-weight ratios, fatigue index calculation.
- **Export Formats**: PDF workout summaries and CSV exports for external analysis.

### Module 10: Trainers & Coaching
- **Capabilities**: Trainer-client binding via invitation codes or directory search. Trainer access to client workout logs, real-time feedback comments on completed sets, programmatic routine assignment.
- **Billing**: Trainer tier billing configuration and session scheduling.

### Module 11: Notifications & Reminders
- **Capabilities**: Transactional notifications (account alerts, security alerts), operational notifications (workout scheduled, streak at risk), motivational coaching prompts, trainer comments.
- **Delivery**: Push notifications (APNs / FCM via BullMQ queue) + in-app notification inbox.

### Module 12: Community & Leaderboards
- **Capabilities**: Opt-in social feed for sharing workout achievements and milestone badges. Monthly opt-in challenges (e.g., Total Volume, Monthly Active Days).
- **Privacy Gating**: Leaderboard participation requires explicit opt-in consent; users can mask real identities with custom gamer tags.

### Module 13: Subscription Management
- **Capabilities**: Free Tier, Pro Athlete Monthly/Annual, Trainer Tier.
- **Payment Ingestion**: In-App Purchases (Apple StoreKit 2 & Google Play Billing) synchronized via RevenueCat or direct server webhook verification, alongside Stripe integration for web-based gym memberships.
- **Entitlement Engine**: Server-authoritative feature gating based on active entitlement claims.

### Module 14: Settings & Privacy Management (GDPR Hub)
- **Capabilities**: Centralized privacy cockpit:
  - Granular consent toggles (Analytics, Marketing, Health Data Processing, Community Visibility).
  - Self-service **Data Subject Access Request (DSAR)**: Automated machine-readable JSON data export generation.
  - Self-service **Right to Erasure ("Delete My Account")**: 30-day soft-delete grace period followed by permanent cryptographic shredding / anonymization.
  - Unit switching (Metric/Imperial), Dark/Light theme, Push notification preferences.

---

## 4. Non-Functional Requirements (NFRs)

### Performance & Latency Targets
- **Mobile Startup (Time-To-Interactive)**: `< 1.2s` cold start, `< 300ms` warm start on mid-range Android (Snapdragon 680) and iPhone 11+.
- **Active Workout Input Latency**: `< 16ms` (single frame budget at 60fps) for set completion checkbox and keyboard entry.
- **API Response Latency**: `P95 < 120ms`, `P99 < 300ms` for cached read endpoints; `P95 < 250ms` for transactional writes.
- **Background Sync**: Incremental sync delta processing completed within `< 2.5s` upon network reconnection.

### High Availability & Scalability
- **Availability Target**: 99.95% uptime SLA for backend core services.
- **Scalability Target**: Capable of horizontally scaling to 50,000 concurrent active workout sessions without database connection exhaustion (enforced via PgBouncer and Redis read replicas).

### Data Integrity & Durability
- Zero workout data loss guarantee during network dropouts or sudden app termination.
- Write-Ahead Logging (WAL) enabled in PostgreSQL with daily continuous archiving and Point-In-Time-Recovery (PITR).

