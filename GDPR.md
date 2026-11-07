# GDPR & Privacy-by-Design Architecture

This document formalizes the data protection framework for the **ApexPulse** platform under the European Union General Data Protection Regulation (Regulation EU 2016/679 - GDPR) and UK GDPR.

---

## 1. Privacy by Design & Privacy by Default (Article 25)

ApexPulse incorporates privacy safeguards into every layer of its engineering lifecycle:
- **Default Stance**: All privacy settings default to the most restrictive tier. Profiles are private by default; leaderboard participation, social sharing, and marketing communications require explicit, unbundled opt-in.
- **Zero Third-Party Ad Trackers**: No third-party ad attribution SDKs (e.g., Facebook SDK, AppsFlyer) are embedded in the mobile binary. Product analytics use self-hosted, pseudonymized event telemetry.
- **Local Storage Partitioning**: Personal workout drafts and biometric templates remain on the user's physical device in an encrypted SQLite store until the user initiates cloud synchronization.

---

## 2. Classification of Personal Data & Lawful Bases (Articles 6 & 9)

Personal data processed by ApexPulse is bifurcated into standard personal data and sensitive health data:

| Data Category | Examples | GDPR Classification | Lawful Basis (Article) |
| :--- | :--- | :--- | :--- |
| **Account Identity** | Email, hashed password, display name | Standard Personal Data | **Art. 6(1)(b)**: Performance of a contract |
| **Payment Records** | Last 4 digits, expiry, transaction ID | Standard Personal Data | **Art. 6(1)(b)** & **Art. 6(1)(c)**: Legal compliance (Tax) |
| **Fitness Health Data** | Body weight, body fat %, circumferences, caloric intake, heart rate, physical fatigue ratings | **Special Category Data** (Health Data - Art. 9) | **Art. 9(2)(a)**: Explicit, freely given, informed consent |
| **Progress Photos** | Front/side physique photographs | **Special Category Data** (Biometric / Health Data) | **Art. 9(2)(a)**: Explicit, separate granular consent |
| **Community Feed** | Public comments, shared workout PRs | Standard Personal Data | **Art. 6(1)(a)**: User consent (opt-in per post) |
| **Security Audit Logs** | IP hash, login timestamps, device OS | Telemetry / Security Data | **Art. 6(1)(f)**: Legitimate interest (System defense) |

---

## 3. Consent Management Architecture (Article 7)

Consent is never bundled, pre-checked, or made a condition for basic account creation.

### 3.1 Granular Consent Model
Users manage consents individually through the in-app **Privacy Management Center**:
1. `CONSENT_HEALTH_DATA_PROCESSING` (Required for logging weight, workouts, and nutrition).
2. `CONSENT_PROGRESS_PHOTOS` (Required to use photo progress tracker).
3. `CONSENT_COMMUNITY_LEADERBOARDS` (Required to appear on public rankings).
4. `CONSENT_ANALYTICS_IMPROVEMENT` (Optional anonymous performance telemetry).
5. `CONSENT_MARKETING_NOTIFICATIONS` (Optional promotional push notifications).

### 3.2 Immutable Consent Audit Ledger
Every consent event (grant or revocation) is appended to the `UserConsent` database table:
```prisma
model UserConsent {
  id           String      @id @default(uuid(7))
  userId       String
  consentType  ConsentType
  granted      Boolean
  policyVersion String     // e.g., "v1.4.0"
  ipHash       String      // SHA-256 hash of IP
  userAgent    String
  timestamp    DateTime    @default(now())
  
  user         User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, consentType])
}
```

---

## 4. Data Subject Rights Automation

### 4.1 Right of Access & Data Portability (Articles 15 & 20)
Users can request an end-to-end archive of their personal data directly from the mobile app (`POST /api/v1/gdpr/export`).
- **Processing Engine**: The request dispatches an asynchronous job to the `gdpr-export` BullMQ queue.
- **Worker Execution**:
  1. Gathers all relational entities tied to `userId` (Profile, Exercises, WorkoutTemplates, WorkoutSessions, SetLogs, NutritionLogs, BodyMeasurements, Consents).
  2. Compiles data into standardized machine-readable formats (`profile.json`, `workouts.csv`, `measurements.csv`).
  3. Archives files into a password-protected `.zip` container.
  4. Uploads archive to private Cloudflare R2 / S3 storage with an encrypted pre-signed download URL valid for **24 hours**.
  5. Dispatches an email notification and in-app alert with the secure download link.

### 4.2 Right to Rectification (Article 16)
Users retain full in-app ability to modify inaccurate profile attributes, correct historical workout logs, or adjust logged body measurements via standardized `PATCH` endpoints. Changes are tracked with update timestamps.

### 4.3 Right to Erasure / "To Be Forgotten" (Article 17)
Account deletion operates through a two-phase protocol:

```
[User triggers Deletion via App]
              │
              ▼
   [Phase 1: Soft-Delete (30-Day Grace Period)]
   - Set user.deletedAt = NOW()
   - Set user.status = 'PENDING_DELETION'
   - Revoke all active JWT sessions and refresh tokens
   - Hide profile from community feeds, trainer dashboards, and leaderboards
   - User can abort deletion by logging in within 30 days
              │
              ▼ (30 Days Elapse: Scheduled Cron Worker executes)
   [Phase 2: Permanent Cryptographic Erasure & Anonymization]
   - Cascade DELETE: BodyMeasurements, NutritionLogs, ProgressPhotos (from S3), SetLogs, WorkoutSessions
   - Anonymize User Record:
     * email = "anonymized-" + hash(userId) + "@deleted.apexpulse.app"
     * displayName = "Deleted Athlete"
     * passwordHash = null
     * avatarUrl = null
   - Retain Financial Invoices in decoupled `BillingRecord` table with PII detached (Legal obligation under EU Tax Directives for 7-10 years).
   - Write confirmation record to `AuditLog`.
```

---

## 5. Data Minimization & Retention Schedules (Article 5)

| Data Type | Active Retention | Post-Inactivity Policy |
| :--- | :--- | :--- |
| **Active Workout & Set Logs** | Duration of active subscription/account | Retained until user triggers Right to Erasure. |
| **Progress Photos** | User-controlled | Purged immediately from disk/S3 upon user deletion. |
| **Ephemeral Session Tokens** | 15 min (access), 30 days (refresh) | Automatic Redis TTL expiration & Postgres cleanup cron. |
| **Security Audit Logs** | 12 months rolling | Automated monthly partitioning drop after 365 days. |
| **Unverified Registrations** | 48 hours | Hard-deleted if email confirmation is not completed. |

---

## 6. Sub-Processor Management & Data Transfers (Article 28 & Chapter V)

All sub-processors are bound by GDPR-compliant Data Processing Agreements (DPAs) incorporating standard contractual clauses (SCCs):

| Sub-Processor | Role / Function | Data Transferred | Hosting Region |
| :--- | :--- | :--- | :--- |
| **AWS / GCP** | Primary Cloud Hosting & Database | Encrypted database records | EU (Frankfurt / Ireland) |
| **Cloudflare** | CDN, Edge Caching, DDoS Protection | IP addresses (ephemeral), static media | Global Edge (EU PoPs prioritized) |
| **Stripe / Apple / Google** | Payment & In-App Subscriptions | Tokenized payment identifiers, invoices | EU / US (Under EU-US Data Privacy Framework) |
| **Postmark / Resend** | Transactional Emails | Email address, first name | EU Region / US (SCC Compliant) |

---

## 7. Data Breach Notification Protocol (Articles 33 & 34)

In the event of a confirmed or suspected security incident involving personal health or credential data:

1. **Detection & Triage (T+0 to T+4 Hours)**:
   - Security incident identified; incident response team activated.
   - Immediate containment: isolation of compromised services, rotation of database credentials, revocation of active JWT sessions.
2. **Assessment (T+4 to T+24 Hours)**:
   - Determination of severity and scope: number of affected data subjects and data classification (Standard vs Special Category Health data).
3. **Supervisory Authority Notification (Within 72 Hours - Art. 33)**:
   - Formal notification submitted to the Lead Supervisory Authority (e.g., CNIL, DPC, or ICO) detailing the nature of the breach, affected categories, likely consequences, and remediation measures taken.
4. **Data Subject Notification (Art. 34)**:
   - If the breach presents a high risk to individual rights and freedoms, immediate direct communication is sent to affected users via email and in-app banner explaining the breach and providing actionable defensive instructions (e.g., password reset).

