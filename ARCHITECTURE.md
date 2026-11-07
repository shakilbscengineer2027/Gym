# Master System Architecture Blueprint

This document sets the architectural foundation for the **ApexPulse** Gym & Fitness platform, spanning mobile clients, backend services, offline synchronization, and infrastructure.

---

## 1. High-Level System Architecture

ApexPulse adopts a **Client-Centric, Offline-First Modular Monolith** topology. The mobile application operates autonomously against an embedded C++ SQLite database (`OP-SQLite`) and communicates with an asynchronous, event-backed NestJS backend via a versioned REST API.

```
+-----------------------------------------------------------------------------------+
|                            MOBILE CLIENT (iOS & Android)                          |
|                                                                                   |
|  +---------------------------+  +------------------------+  +------------------+  |
|  |     React Native UI       |  |     Zustand Store      |  |  TanStack Query  |  |
|  | (Fabric New Architecture) |  |   (Client/UI State)    |  |  (Server State)  |  |
|  +-------------+-------------+  +-----------+------------+  +--------+---------+  |
|                |                            |                        |            |
|  +-------------v----------------------------v------------------------v---------+  |
|  |                     Offline Engine & Sync Coordinator                       |  |
|  |           (Mutation Queue | Vector Clock Tracker | Conflict Engine)         |  |
|  +---------------------+-------------------------------------+-----------------+  |
|                        |                                     |                    |
|          +-------------v-------------+         +-------------v-------------+      |
|          |    OP-SQLite (C++ JSI)    |         |   Secure Store / Keychain |      |
|          | (Local Replica & Cache)   |         |  (Tokens, Biometric Keys) |      |
|          +---------------------------+         +---------------------------+      |
+--------------------------------------|--------------------------------------------+
                                       | HTTPS (TLS 1.3) + HMAC Signature
                                       | REST API (/api/v1) + ETag / Delta Sync
+--------------------------------------v--------------------------------------------+
|                       EDGE & INGRESS INFRASTRUCTURE                               |
|                     (Cloudflare CDN / NGINX Reverse Proxy)                        |
|              - SSL/TLS Termination    - DDoS Mitigation & WAF                     |
|              - Static Media Caching   - Global Rate Limiting                      |
+--------------------------------------|--------------------------------------------+
                                       |
+--------------------------------------v--------------------------------------------+
|                 BACKEND APPLICATION SERVER (NestJS Modular Monolith)             |
|                                                                                   |
|  +--------------------+  +----------------------+  +---------------------------+  |
|  |  API Gateway Layer |  | Domain Modules (14)  |  | Infrastructure Services   |  |
|  | - Throttler Guard  |  | - Auth & Users       |  | - BullMQ Queue Workers    |  |
|  | - JWT / RBAC Guard |  | - Workouts & Track   |  | - Redis Cache Interceptor |  |
|  | - Zod / DTO Pipes  |  | - Nutrition & Sync   |  | - Event Emitter / PubSub  |  |
|  | - Audit Interceptor|  | - GDPR Privacy Hub   |  | - Storage / Mailer Svc    |  |
|  +--------------------+  +-----------+----------+  +-------------+-------------+  |
|                                      |                           |                |
|               +----------------------v---------------------------v---+            |
|               |              Data Access Layer (Prisma ORM 6)        |            |
|               +----------------------+-------------------------------+            |
+--------------------------------------|--------------------------------------------+
                                       |
              +------------------------+------------------------+
              |                                                 |
+-------------v---------------+                 +---------------v---------------+
|    PRIMARY DATABASE ENGINE  |                 |    CACHE & JOB BROKER LAYER   |
|   PostgreSQL 16 (PgBouncer) |                 |         Redis 7 Cluster       |
| - Relational integrity      |                 | - High-throughput session store|
| - ACID transactional writes |                 | - BullMQ background queues    |
| - Write-Ahead Logging (WAL) |                 | - Distributed locks (Redlock) |
| - JSONB exercise schemas    |                 | - Distributed rate limiter    |
+-----------------------------+                 +-------------------------------+
```

---

## 2. Mobile Architecture (React Native)

### 2.1 Engine & Runtime
- **Framework**: React Native 0.76+ configured exclusively with the **New Architecture** enabled:
  - **Fabric Renderer**: High-performance concurrent rendering engine executing directly in C++ via JSI, eliminating asynchronous JSON bridge bottlenecks.
  - **TurboModules**: Direct memory access to native platform capabilities (Camera, Biometrics, SQLite).
- **Tooling**: **Expo SDK 52 (Prebuild / Bare Workflow)**. Combines the maintenance benefits of continuous native generation (`app.json` config plugins) with unrestricted access to custom native modules and C++ dependencies.

### 2.2 Client State Architecture
State is strictly segmented into three explicit tiers:
1. **Server State & Caching**: **TanStack Query v5 (React Query)**
   - Manages API fetch cycles, stale-while-revalidate policies, query caching, and optimistic mutations.
2. **Client Session & UI State**: **Zustand v5**
   - Lightweight, subscription-based state for active screen filters, active workout timer state, audio cue triggers, and navigation parameters.
3. **Persistent Offline Replica**: **OP-SQLite**
   - Direct JSI C++ binding to SQLite 3 engine. Houses user workout histories, exercise definitions, active workout checkpoints, and pending synchronization mutation queues.

### 2.3 Navigation & Design System
- **Navigation**: **React Navigation v7** with Native Stack Navigator for smooth native transitions.
- **Design System**: **NativeWind v4** (Tailwind CSS for React Native compiling to StyleSheet primitives) augmented with strict design tokens (spacing, typography, HSL semantic colors for Dark/Light modes).
- **List Virtualization**: **Shopify FlashList** for smooth 60–120 FPS rendering of 1,200+ exercise libraries and infinite-scroll workout feeds.

---

## 3. Backend Architecture (NestJS Modular Monolith)

### 3.1 Architectural Principles
- **Clean Architecture & Hexagonal Boundaries**: Each module encapsulates its Controllers, Services, Repositories, Domain Entities, and DTOs.
- **Loose Coupling via Events**: Cross-module communication occurs via asynchronous domain events using `@nestjs/event-emitter` or BullMQ message queues rather than tight service injection dependencies.
- **Strict Input Sanitization & Validation**: Validation pipes with `class-validator` / `class-transformer` enforce strict whitelisting (`whitelist: true, forbidNonWhitelisted: true`).

### 3.2 Backend Modular Breakdown
```
apps/backend/src/modules/
├── auth/                 # Identity, OAuth2, JWT generation, Refresh Token rotation
├── users/                # User profile lifecycle, settings, and metrics
├── exercises/            # Seeded catalog, muscle taxonomy, custom movements
├── workouts/             # Routine templates, exercise order, supersets
├── tracking/             # Live session logging, set executions, volume calculations
├── calendar/             # Workout scheduling, periodization plans, reminders
├── nutrition/            # Meal logging, macro goals, food dictionary
├── measurements/         # Weight tracking, body composition, photos
├── analytics/            # Longitudinal strength analytics, 1RM progression
├── coaching/             # Trainer-client bindings, routine assignments, feedback
├── notifications/        # Push notifications (FCM/APNs), in-app messaging
├── community/            # Opt-in leaderboards, challenges, achievements
├── subscriptions/        # Entitlement checks, Stripe & In-App Purchase webhooks
├── gdpr/                 # Consent tracking, DSAR data exports, account erasure
└── sync/                 # Delta sync endpoint, mutation queue conflict resolver
```

---

## 4. Database Architecture (PostgreSQL & Prisma)

- **PostgreSQL 16**: Primary data store running with `pgcrypto` for UUIDv7 support, `citext` for case-insensitive email searches, and composite indexing.
- **Connection Management**: **PgBouncer** connection pooler in transaction mode sits in front of PostgreSQL to prevent connection starvation under high concurrent traffic.
- **Prisma ORM 6**:
  - Full schema-first domain definition with strict TypeScript model emission.
  - Granular database transactions via `prisma.$transaction()` for atomicity during workout set logging and billing events.
  - Soft deletes on all critical entities via `deletedAt` timestamps to ensure compliance with audit and recovery protocols.

---

## 5. API Architecture

- **Protocol**: RESTful API over HTTPS with JSON serialization.
- **Versioning**: URI versioning (`/api/v1/...`) with strict deprecation notices via `Sunset` and `Deprecation` HTTP headers.
- **Documentation**: Automatically generated **OpenAPI 3.0 / Swagger** documentation available at `/api/docs` with bearer token auth integration.
- **Standard Envelope**:
  ```json
  {
    "success": true,
    "data": { ... },
    "error": null,
    "meta": {
      "timestamp": "2026-11-06T21:30:00.000Z",
      "requestId": "uuidv7-string",
      "pagination": { "page": 1, "limit": 20, "total": 120, "hasNext": true }
    }
  }
  ```
- **Idempotency**: All state-modifying write requests (`POST`, `PUT`, `PATCH`) accept an optional `Idempotency-Key` header (UUIDv7) tracked in Redis for 24 hours to prevent duplicate set or payment entries.

---

## 6. Authentication & Authorization Architecture

- **Token Strategy**:
  - **Access Token**: Short-lived (15 minutes), signed using RS256 or EdDSA (or HMAC SHA-256 for symmetric), containing user claims (`sub`, `roles`, `entitlements`, `sessionId`).
  - **Refresh Token**: Long-lived (30 days), stored as cryptographically hashed SHA-256 strings in PostgreSQL.
  - **Rotation & Reuse Detection**: Upon every refresh call, the old refresh token is immediately invalidated and a new pair is issued. If a revoked refresh token is replayed, the entire session family is instantly purged, alerting the security pipeline to potential token theft.
- **Authorization**:
  - **Role-Based Access Control (RBAC)**: `USER`, `TRAINER`, `ADMIN`, `SUPER_ADMIN`.
  - **Resource-Level Authorization**: Enforced via NestJS Guards and CASL (Ability-based authorization) ensuring a user or trainer can only mutate records belonging to them or their assigned clients.

---

## 7. GDPR Privacy Architecture

- **Privacy by Design**:
  - Explicit consent records captured with timestamp, IP hash, and legal policy version.
  - Health data (body measurements, vitals) classified as **Article 9 Special Category Data**, requiring an explicit opt-in checkbox during registration.
- **Self-Service Rights Automation**:
  - **Right of Access / Portability (Art. 15 & 20)**: Users trigger `/api/v1/gdpr/export`. A BullMQ background worker aggregates all user data into an encrypted ZIP file containing structured JSON/CSV files, providing a signed download link expiring in 24 hours.
  - **Right to Erasure (Art. 17)**: Users request account deletion. A 30-day reversible freeze begins. After 30 days, a cron worker permanently scrubs personal identifiers, replaces user records with anonymous hashes (`deleted-user-xxxx`), and cascades deletion across all personal measurement records. Financial records are retained only as legally mandated by tax statutes with identity detached.

---

## 8. Security Architecture

- **Password Cryptography**: Passwords hashed using **Argon2id** (memory cost: 64MB, time cost: 3 iterations, parallelism: 4 threads).
- **Transport Security**: TLS 1.3 enforced across all ingress points. HSTS headers with `max-age=63072000; includeSubDomains; preload`.
- **API Defense-in-Depth**:
  - **Rate Limiting**: Distributed token-bucket algorithm using `@nestjs/throttler` backed by Redis (100 requests/min per IP, 10 requests/min for auth routes).
  - **HTTP Security**: **Helmet** configured with strict CSP, X-Frame-Options (`DENY`), and X-Content-Type-Options (`nosniff`).
  - **CORS**: Strict origin whitelisting.
- **Mobile Device Security**:
  - Tokens and cryptographic keys stored in hardware-backed secure storage via **Keystore (Android)** and **Keychain (iOS)**.
  - Jailbreak / root detection warning on startup.
  - SSL Pinning for backend domains using certificate public key hashes.

---

## 9. Offline-First & Data Synchronization Architecture

### 9.1 The Offline Invariant
The user must be able to launch the app in an underground gym with airplane mode enabled, select or create a workout routine, log 20 sets of exercise data with custom weights/reps, pause/resume rest timers, and close the app without experiencing data loss or UI freezing.

### 9.2 Local Storage Strategy (OP-SQLite)
- Local SQLite database mirrors the critical subset of PostgreSQL schemas:
  - `exercises`, `workout_templates`, `active_sessions`, `set_logs`, `offline_mutation_queue`.
- All writes execute against the local SQLite instance first. UI updates optimistically with `< 16ms` latency.

### 9.3 Synchronization Protocol (Mutation Queue + Last-Write-Wins with Vector Clocks)
```
+-------------------------------------------------------------------------+
|                          OFFLINE MUTATION PIPELINE                      |
|                                                                         |
| 1. User performs action (e.g. Log Set #3: 100kg x 8 reps)               |
| 2. App writes to local SQLite: `set_logs` table (status: 'synced_false')|
| 3. App appends operation to `offline_mutation_queue`:                   |
|    - mutationId: UUIDv7                                                 |
|    - entity: 'set_log'                                                  |
|    - action: 'CREATE' | 'UPDATE' | 'DELETE'                             |
|    - payload: { id, workoutSessionId, weight, reps, completedAt }       |
|    - clientTimestamp: ISO8601                                           |
|    - version: 1                                                         |
|                                                                         |
| 4. Network Status Monitor (NetInfo) detects active connection           |
| 5. Sync Worker drains `offline_mutation_queue` to POST /api/v1/sync/push|
| 6. Backend processes mutations inside a transactional batch:            |
|    - Validates idempotency against `mutationId`                         |
|    - Applies Last-Write-Wins (LWW) resolution based on entity version   |
|    - Emits updated entities + server timestamp                          |
| 7. Mobile receives 200 OK -> Updates local records to 'synced_true'     |
| 8. Mobile trims acknowledged items from `offline_mutation_queue`        |
+-------------------------------------------------------------------------+
```

### 9.4 Conflict Resolution Rules
- **Append-Only Domain Records (Set Logs, Weights, Heart Rate)**: Immune to conflicts. Each completed set possesses a client-generated UUIDv7. The server simply inserts or updates by UUID.
- **Shared Entities (Routines shared with a Trainer)**: Resolved using Last-Write-Wins (LWW) backed by a monotonically increasing `version` counter and server-validated UTC timestamps. If a collision occurs, the server preserves both revisions as distinct drafts and alerts the user.

---

## 10. Performance & Scalability Strategy

- **Database Performance**:
  - Composite indexes on frequently filtered fields (`userId`, `scheduledDate`, `deletedAt`).
  - Read-heavy queries (e.g., global exercise catalog) cached in Redis with a 24-hour TTL and invalidation via cache-tags.
- **Asset Delivery**:
  - Exercise demo videos and avatars stored in AWS S3 / Cloudflare R2 and distributed globally via Cloudflare CDN.
- **Asynchronous Task Offloading**:
  - Heavy calculations (e.g., aggregate 1RM recalculations across all historical workouts, daily streak updates, push notification dispatch) offloaded to BullMQ worker queues to keep API request-response times under 100ms.

---

## 11. Complete Monorepo Project Structure

```
Gym/
├── .github/
│   └── workflows/
│       ├── backend-ci.yml                 # NestJS lint, test, audit, docker build
│       └── mobile-ci.yml                  # React Native / Expo lint, typecheck, prebuild
├── apps/
│   ├── backend/
│   │   ├── Dockerfile
│   │   ├── Dockerfile.dev
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.build.json
│   │   ├── nest-cli.json
│   │   ├── prisma/
│   │   │   ├── schema.prisma              # Comprehensive PostgreSQL domain schema
│   │   │   └── migrations/                # Version-controlled SQL migration scripts
│   │   ├── src/
│   │   │   ├── main.ts                    # Application bootstrap, Swagger & validation init
│   │   │   ├── app.module.ts              # Root NestJS module importing domain modules
│   │   │   ├── common/                    # Cross-cutting concerns
│   │   │   │   ├── constants/             # Error codes, token expiries, regex patterns
│   │   │   │   ├── decorators/            # @CurrentUser(), @Roles(), @Public()
│   │   │   │   ├── filters/               # AllExceptionsFilter, PrismaClientExceptionFilter
│   │   │   │   ├── guards/                # JwtAuthGuard, RolesGuard, ThrottlerGuard
│   │   │   │   ├── interceptors/          # TransformInterceptor, AuditLoggingInterceptor
│   │   │   │   ├── middleware/            # RequestLoggerMiddleware, CorrelationIdMiddleware
│   │   │   │   └── pipes/                 # Custom validation and parsing pipes
│   │   │   ├── config/                    # Configuration validation via Joi / Zod
│   │   │   │   ├── app.config.ts
│   │   │   │   ├── database.config.ts
│   │   │   │   ├── redis.config.ts
│   │   │   │   └── auth.config.ts
│   │   │   ├── core/                      # Global infrastructure services
│   │   │   │   ├── prisma/                # PrismaService with connection hooks
│   │   │   │   ├── redis/                 # RedisService and cache management
│   │   │   │   └── queue/                 # BullMQ configuration module
│   │   │   └── modules/                   # 14 Clean-Architecture Modular Monolith modules
│   │   │       ├── auth/                  # Controllers, Services, Strategies, DTOs
│   │   │       ├── users/
│   │   │       ├── exercises/
│   │   │       ├── workouts/
│   │   │       ├── tracking/
│   │   │       ├── calendar/
│   │   │       ├── nutrition/
│   │   │       ├── measurements/
│   │   │       ├── analytics/
│   │   │       ├── coaching/
│   │   │       ├── notifications/
│   │   │       ├── community/
│   │   │       ├── subscriptions/
│   │   │       ├── gdpr/
│   │   │       └── sync/
│   │   └── test/
│   │       ├── app.e2e-spec.ts
│   │       └── jest-e2e.json
│   │
│   └── mobile/
│       ├── app.json                       # Expo SDK 52 configuration & native plugins
│       ├── package.json
│       ├── tsconfig.json
│       ├── tailwind.config.js             # NativeWind styling tokens
│       ├── metro.config.js                # Metro bundler config with monorepo resolution
│       ├── index.js                       # React Native entry point
│       └── src/
│           ├── App.tsx                    # Root provider tree (QueryClient, Auth, Theme)
│           ├── api/                       # API clients, Axios/Fetch interceptor, React Query hooks
│           ├── assets/                    # Static icons, animations (Lottie), fallback images
│           ├── components/                # Reusable UI component library (Atomic design)
│           │   ├── ui/                    # Button, Input, Modal, Card, Badge, Skeleton
│           │   └── domain/                # SetRow, ExerciseCard, RestTimer, MacroRing
│           ├── database/                  # OP-SQLite local storage & migrations
│           │   ├── client.ts              # SQLite connection instance
│           │   ├── schema.ts              # Local table definitions
│           │   ├── repositories/          # Local CRUD operations
│           │   └── sync/                  # SyncWorker, MutationQueue, DeltaProcessor
│           ├── hooks/                     # Custom React hooks (useTimer, useNetInfo, useAuth)
│           ├── navigation/                # React Navigation stacks, tabs, and type declarations
│           │   ├── RootNavigator.tsx
│           │   ├── AuthNavigator.tsx
│           │   ├── MainTabNavigator.tsx
│           │   └── types.ts
│           ├── screens/                   # Screen views mapped to the 14 modules
│           │   ├── auth/
│           │   ├── dashboard/
│           │   ├── workouts/
│           │   ├── tracking/
│           │   ├── exercises/
│           │   ├── calendar/
│           │   ├── nutrition/
│           │   ├── measurements/
│           │   ├── analytics/
│           │   ├── coaching/
│           │   ├── community/
│           │   ├── subscription/
│           │   └── settings/
│           ├── store/                     # Zustand state slices (session, activeWorkout, settings)
│           ├── types/                     # Mobile-specific interface extensions
│           └── utils/                     # Formatting, math (1RM), date helpers
│
├── packages/
│   ├── shared/                            # Shared utilities and domain calculation logic
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── calculations/              # 1RM formulas (Brzycki, Epley), volume calc
│   │       ├── constants/                 # Enums: MuscleGroup, ExerciseCategory, SetType
│   │       └── validators/                # Shared Zod validation schemas
│   ├── types/                             # Pure TypeScript API contracts & models
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── api.types.ts               # Standard API response & error structures
│   │       ├── user.types.ts
│   │       ├── workout.types.ts
│   │       └── sync.types.ts
│   └── eslint-config/
│       ├── package.json
│       └── index.js
│
├── docker/
│   ├── docker-compose.yml                 # Local dev orchestration: Postgres, Redis, PgBouncer
│   ├── docker-compose.prod.yml            # Production container configuration
│   └── postgres/
│       └── init.sql                       # Extensions init (pgcrypto, citext)
├── .editorconfig
├── .gitignore
├── pnpm-workspace.yaml                    # Workspace definition file
├── package.json                           # Root monorepo orchestrator
├── README.md
├── PROJECT_CONTEXT.md
├── DEVELOPMENT_STATUS.md
├── ARCHITECTURE.md
├── SECURITY.md
├── GDPR.md
├── DATABASE.md
└── API.md
```

---

## 12. Dependency Selection Matrix

All dependencies are selected for stability, active maintenance, TypeScript first-class support, and compliance with the React Native New Architecture.

### 12.1 Backend Dependencies (NestJS)
| Package | Version | Purpose |
| :--- | :--- | :--- |
| `@nestjs/core`, `@nestjs/common` | `^11.0.0` | Core modular backend framework |
| `@nestjs/swagger` | `^11.0.0` | OpenAPI 3.0 specification & Swagger UI |
| `@nestjs/jwt`, `@nestjs/passport` | `^11.0.0` | Authentication & token verification |
| `@nestjs/throttler` | `^6.0.0` | Distributed rate limiting |
| `@nestjs/bullmq`, `bullmq` | `^11.0.0` / `^5.20.0` | Redis-backed asynchronous background queues |
| `prisma`, `@prisma/client` | `^6.0.0` | Database ORM, migration engine, and query builder |
| `argon2` | `^0.41.0` | State-of-the-art password hashing |
| `ioredis` | `^5.4.0` | High-performance Redis client |
| `class-validator`, `class-transformer` | `^0.14.1` / `^0.5.1` | DTO validation and object mapping |
| `helmet` | `^8.0.0` | HTTP security response headers |
| `zod` | `^3.23.8` | Runtime environment & schema validation |

### 12.2 Mobile Client Dependencies (React Native & Expo)
| Package | Version | Purpose |
| :--- | :--- | :--- |
| `react-native` | `0.76.x` | Core mobile framework with New Architecture (Fabric) |
| `expo` | `~52.0.0` | SDK toolchain, prebuild workflow, and config plugins |
| `@tanstack/react-query` | `^5.60.0` | Server state management, query caching, and sync |
| `zustand` | `^5.0.0` | UI & active workout session state management |
| `@op-engineering/op-sqlite` | `^8.0.0` | Blazing fast C++ JSI-backed SQLite engine |
| `react-native-keychain` | `^9.0.0` | Hardware-backed iOS Keychain & Android Keystore access |
| `@react-navigation/native-stack` | `^7.0.0` | Native performance screen transitions |
| `nativewind`, `tailwindcss` | `^4.1.0` / `^3.4.0` | Utility-first styling engine compiled to StyleSheet |
| `@shopify/flash-list` | `^1.7.0` | High-performance virtualized list rendering |
| `react-native-reanimated` | `~3.16.0` | 60+ FPS native gesture and UI animations |
| `lucide-react-native` | `^0.460.0` | Lightweight, scalable vector icons |

---

## 13. Risk Assessment & Architectural Mitigation

| Identified Risk | Severity | Probability | Architectural Mitigation Strategy |
| :--- | :---: | :---: | :--- |
| **Data Loss in Dead Zones** (e.g. basement gym with zero cellular reception) | **CRITICAL** | HIGH | Local-first persistence via `OP-SQLite`. All user input commits locally before network dispatch. Mutations queue in a resilient transactional queue that survives app kills. |
| **Sync Collisions & Overwrites** (Client modifies routine on mobile while trainer edits on web) | HIGH | MEDIUM | Last-Write-Wins with vector clocks. When concurrent edits conflict on shared routines, server preserves both versions as separate revisions and notifies users. |
| **Database Connection Exhaustion** (Spike in concurrent workout set logging) | HIGH | MEDIUM | PgBouncer deployed in front of PostgreSQL. Write endpoints utilize Redis queue offloading for non-critical analytics, while set logs use lean single-row indexed inserts. |
| **Sensitive Health Data Leak** (Body weight, measurements, progress photos) | **CRITICAL** | LOW | End-to-end encryption of sensitive measurements at rest (AES-256-GCM). Pre-signed S3 URLs with short TTLs for progress photos. Strict RBAC and audit logging. |
| **New Architecture Library Incompatibility** (C++ Turbomodule breakages) | MEDIUM | LOW | Strict validation of dependency matrix against React Native 0.76 New Architecture directory before provisioning in Phase 02. |
| **Apple/Google IAP Reconciliation Failure** | HIGH | MEDIUM | Webhook-driven server-authoritative subscription verification with exponential backoff retry via BullMQ. Client entitlements granted only upon cryptographically verified server receipt. |

