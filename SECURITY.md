# Security Architecture & Threat Defense Blueprint

This document specifies the end-to-end security architecture, cryptographic standards, access control models, and threat mitigations for the **ApexPulse** platform, adhering to **OWASP ASVS (Application Security Verification Standard) Level 2**.

---

## 1. Threat Modeling (STRIDE Analysis)

| Threat Category | Potential Threat Vector | Architectural Countermeasure |
| :--- | :--- | :--- |
| **Spoofing** | Adversary imitates a user or trainer using intercepted tokens. | Short-lived JWTs (15 min), cryptographically hashed refresh tokens with rotation and reuse detection; hardware-backed Keystore/Keychain. |
| **Tampering** | Modifying workout logs, subscription claims, or client-side pricing requests. | Server-authoritative validation; HMAC request integrity verification on sync payloads; signed JWT claims; Prisma parameterized queries. |
| **Repudiation** | User or trainer denies performing an administrative or financial action. | Append-only immutable `AuditLog` table capturing actor ID, action type, IP hash, user agent, and timestamp. |
| **Information Disclosure** | Interception of health metrics, body weight, or progress photos. | TLS 1.3 in transit; AES-256-GCM encryption at rest for sensitive fields; pre-signed, short-lived S3 URLs (15 min) for photo retrieval. |
| **Denial of Service** | Flooding workout logging endpoints or brute-forcing authentication. | Redis-backed distributed rate limiting via `@nestjs/throttler`; Cloudflare WAF; PgBouncer connection pooling. |
| **Elevation of Privilege** | Normal user accesses trainer dashboards or another user's private data. | Strict Role-Based Access Control (RBAC) combined with resource-level ownership validation guards. |

---

## 2. Authentication & Credential Architecture

### 2.1 Password Hashing Specification
User passwords never enter persistence in plaintext. The system enforces **Argon2id**, the winner of the Password Hashing Competition (PHC):
- **Algorithm**: `Argon2id`
- **Memory Cost (`m`)**: 65,536 KiB (64 MiB)
- **Time Cost (`t`)**: 3 iterations
- **Parallelism (`p`)**: 4 threads
- **Salt**: 16 bytes cryptographically secure random bytes generated per user via `crypto.randomBytes()`.

### 2.2 Password Policy Enforcement
- Minimum length: 12 characters.
- Must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (`!@#$%^&*()_+-=[]{}|;:,.<>?`).
- Checked against the **HaveIBeenPwned (HIBP)** k-Anonymity API during registration to block known breached passwords.

### 2.3 JWT Lifecycle & Refresh Token Rotation
```
Client                       API Gateway / Auth Controller                  Database (Postgres)
  |                                       |                                          |
  |--- POST /auth/login ----------------->|                                          |
  |    (email, password)                  |--- Validate credentials (Argon2id) ---->|
  |                                       |<-- User record OK -----------------------|
  |                                       |                                          |
  |                                       |--- Generate Access Token (15m TTL)       |
  |                                       |--- Generate Refresh Token (30d TTL)      |
  |                                       |--- Hash Refresh Token (SHA-256) -------->|
  |                                       |    Store session record                  |
  |<-- 200 OK ----------------------------|                                          |
  |    { accessToken, refreshToken }      |                                          |
  |                                       |                                          |
  |=== (After 15 minutes: Access Token Expires) =====================================|
  |                                       |                                          |
  |--- POST /auth/refresh --------------->|                                          |
  |    (refreshToken)                     |--- Hash incoming token (SHA-256) ------->|
  |                                       |    Find matching active session          |
  |                                       |<-- Session valid ------------------------|
  |                                       |                                          |
  |                                       |--- INVALIDATE OLD REFRESH TOKEN -------->|
  |                                       |--- Generate NEW token pair               |
  |                                       |--- Save new hashed refresh token ------->|
  |<-- 200 OK ----------------------------|                                          |
  |    { newAccessToken, newRefreshToken }|                                          |
```

### 2.4 Token Reuse Detection & Revocation Playbook
If an invalidated refresh token is presented:
1. The backend assumes the token family was compromised.
2. The entire session tree for that user is immediately revoked in the database.
3. An urgent security notification is queued via BullMQ to the user's verified email.
4. An entry with severity `CRITICAL` is written to `AuditLog`.

---

## 3. Authorization & Access Control

### 3.1 Role Hierarchy (RBAC)
```
SUPER_ADMIN (System oversight, audit review, database maintenance)
     │
     ▼
ADMIN (Gym manager, member disputes, trainer verification)
     │
     ▼
TRAINER (Client management, workout assignment, review logs)
     │
     ▼
USER (Standard athlete: workout tracking, nutrition, profile)
```

### 3.2 Resource-Level Authorization (Ownership Model)
A role alone does not grant access to a record. Every request touching personal data executes through an **Ownership Guard**:
- A `USER` can only access their own profile, workout logs, nutrition records, and measurements (`WHERE userId = request.user.sub`).
- A `TRAINER` can only access client records if an active, accepted `TrainerClientAssignment` relationship exists between them and the target client.
- Violations immediately yield `403 Forbidden` and trigger an audit entry.

---

## 4. Mobile Device Security Architecture

### 4.1 Secure Credential Storage
- **iOS**: Refresh tokens, encryption keys, and session identifiers are stored in the **iOS Keychain** with accessibility set to `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly`. This ensures keys are hardware-encrypted by the Secure Enclave and cannot be extracted via iTunes backups or moved to another device.
- **Android**: Credentials are stored in **Android Keystore / EncryptedSharedPreferences**, leveraging hardware-backed Keystore (TEE / StrongBox) with AES-256-GCM.
- Plaintext `AsyncStorage` is strictly prohibited from storing tokens, biometric credentials, or health data.

### 4.2 Local SQLite Encryption & Tamper Defense
- Local `OP-SQLite` database utilizes SQLCipher encryption (AES-256 in CBC mode) with key derivation using PBKDF2 (256,000 iterations).
- The encryption key is generated on device initialization and stored inside the native secure keychain.

### 4.3 Network & Transport Protections
- **TLS 1.3**: Plain HTTP is permanently rejected at ingress.
- **Certificate Pinning**: The mobile client pins the SHA-256 hash of the backend server's public key (SubjectPublicKeyInfo). Any attempt by a rogue proxy or man-in-the-middle to intercept traffic triggers an immediate connection drop.

---

## 5. API Protection & Network Hardening

### 5.1 Rate Limiting Architecture
Configured via `@nestjs/throttler` backed by an in-memory Redis token bucket:
- **Global API Rate Limit**: 120 requests per minute per authenticated user / IP.
- **Authentication Endpoints (`/auth/login`, `/auth/register`)**: 5 requests per minute per IP.
- **Password Reset / Verification Endpoints**: 3 requests per hour per target email.
- **Exceeded Threshold Response**: `429 Too Many Requests` with `Retry-After` header.

### 5.2 HTTP Security Headers (Helmet)
```typescript
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://cdn.apexpulse.app"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true,
})
```

### 5.3 Input Sanitization & Parameterization
- **SQL Injection Prevention**: All queries pass through Prisma ORM using prepared and parameterized queries. No raw string interpolation is permitted.
- **Payload Validation**: NestJS `ValidationPipe` configured with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true`. Any unexpected properties in request payloads are instantly rejected with `400 Bad Request`.

---

## 6. Audit Logging & Security Event Tracing

The platform implements an append-only `AuditLog` table. The following events trigger mandatory audit logs:
- `AUTH_LOGIN_SUCCESS` / `AUTH_LOGIN_FAILURE` (capturing failed password attempts).
- `AUTH_REFRESH_TOKEN_REUSED` (security alert).
- `AUTH_PASSWORD_CHANGED` / `AUTH_EMAIL_CHANGED`.
- `GDPR_CONSENT_GRANTED` / `GDPR_CONSENT_REVOKED`.
- `GDPR_DATA_EXPORT_REQUESTED`.
- `GDPR_ACCOUNT_DELETION_REQUESTED`.
- `SUBSCRIPTION_UPGRADED` / `SUBSCRIPTION_CANCELLED`.
- `TRAINER_CLIENT_ACCESS_GRANTED` / `REVOKED`.

Every audit record captures:
- `id`: UUIDv7
- `userId`: Nullable UUID (null if unauthenticated)
- `action`: Canonical event enum
- `resource`: Affected entity (e.g. `User:123`, `WorkoutSession:456`)
- `ipHash`: SHA-256 hash of client IP address (to maintain GDPR compliance while preserving forensic utility)
- `userAgent`: Client user-agent string
- `metadata`: JSONB containing before/after diffs (excluding passwords/tokens)
- `createdAt`: UTC Timestamp

