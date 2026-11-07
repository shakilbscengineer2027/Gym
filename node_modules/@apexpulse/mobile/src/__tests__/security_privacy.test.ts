import { describe, it } from 'node:test';
import assert from 'node:assert';
import { cryptoService } from '../security/cryptoService.ts';
import { gdprService } from '../security/gdprService.ts';
import { createSecurityAuditEntry, sanitizeLogDetails } from '../security/auditLogService.ts';
import {
  isRecordExpired,
  evaluateBreachNotification,
  OFFICIAL_SUB_PROCESSORS,
} from '../security/retentionPolicyService.ts';

describe('Phase 07: Security & GDPR Privacy Verification', () => {
  // Test Secret Key (32 bytes / 256 bits in hex)
  const TEST_KEY_HEX = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

  describe('Cryptographic Engine (AES-256-GCM)', () => {
    it('successfully encrypts and decrypts sensitive health payload with authentic authTag', () => {
      const sensitiveData = JSON.stringify({
        weightKg: 82.5,
        bodyFatPercent: 12.8,
        heartRateBpm: 145,
      });

      const encrypted = cryptoService.encryptAES256GCM(sensitiveData, TEST_KEY_HEX);
      assert.ok(encrypted.cipherText.length > 0);
      assert.ok(encrypted.iv.length > 0);
      assert.ok(encrypted.authTag.length > 0);

      const decrypted = cryptoService.decryptAES256GCM(encrypted, TEST_KEY_HEX);
      assert.strictEqual(decrypted, sensitiveData);
    });

    it('rejects tampered ciphertext, preventing cipher manipulation', () => {
      const plainText = 'ConfidentialProgressPhotoKey.jpg';
      const encrypted = cryptoService.encryptAES256GCM(plainText, TEST_KEY_HEX);

      // Tamper with the ciphertext
      const tamperedBytes = Buffer.from(encrypted.cipherText, 'base64');
      tamperedBytes[0] = tamperedBytes[0] ^ 0xff; // Flip bits
      const tamperedPayload = {
        ...encrypted,
        cipherText: tamperedBytes.toString('base64'),
      };

      assert.throws(() => {
        cryptoService.decryptAES256GCM(tamperedPayload, TEST_KEY_HEX);
      });
    });

    it('pseudonymizes client IP addresses with rotating salt', () => {
      const ip = '192.168.1.105';
      const salt = 'rotation_salt_2026_q4';
      const hash1 = cryptoService.pseudonymizeIp(ip, salt);
      const hash2 = cryptoService.pseudonymizeIp(ip, salt);

      // Consistent hash with identical salt
      assert.strictEqual(hash1, hash2);
      assert.strictEqual(hash1.length, 64); // SHA-256 64 hex chars

      // Different salt produces completely different pseudonym
      const hashDifferentSalt = cryptoService.pseudonymizeIp(ip, 'different_salt');
      assert.notStrictEqual(hash1, hashDifferentSalt);
    });

    it('prevents timing attacks using constant-time comparison', () => {
      const tokenA = 'f7c3bc5e8a9d1234567890abcdef1234';
      const tokenB = 'f7c3bc5e8a9d1234567890abcdef1234';
      const tokenC = '00000000000000000000000000000000';

      assert.strictEqual(cryptoService.constantTimeCompare(tokenA, tokenB), true);
      assert.strictEqual(cryptoService.constantTimeCompare(tokenA, tokenC), false);
    });
  });

  describe('GDPR Privacy Controls & Lawful Basis', () => {
    it('enforces Article 9 explicit consent guard before writing health data', () => {
      // 1. Consent revoked -> Must throw
      const revokedConsents = {
        HEALTH_DATA_ART9: false,
        PROGRESS_PHOTOS: false,
        LEADERBOARD_COMMUNITY: false,
        TELEMETRY_ANALYTICS: false,
        MARKETING: false,
      };

      assert.throws(() => {
        gdprService.assertHealthConsent(revokedConsents);
      }, /GDPR_CONSENT_REQUIRED/);

      // 2. Consent granted -> Must allow
      const grantedConsents = {
        ...revokedConsents,
        HEALTH_DATA_ART9: true,
      };

      assert.doesNotThrow(() => {
        gdprService.assertHealthConsent(grantedConsents);
      });
    });

    it('compiles compliant DSAR data portability archive under Article 20', () => {
      const mockUser = {
        id: 'usr_019304a1',
        displayName: 'Michael Law',
        email: 'michael.law@example.com',
        joinedDate: '2026-01-15',
      };

      const archive = gdprService.compileDsarArchive(mockUser, {
        measurements: [{ weightKg: 82.5, date: '2026-06-30' }],
        sessions: [{ title: 'Biceps Workout', durationMinutes: 60 }],
        consents: [
          {
            id: 'c_1',
            userId: mockUser.id,
            category: 'HEALTH_DATA_ART9',
            granted: true,
            policyVersion: 'v1.4',
            timestamp: new Date().toISOString(),
            ipHash: 'abc123hash',
          },
        ],
      });

      assert.strictEqual(archive.exportMetadata.gdprArticle, 'Article 20 - Right to Data Portability');
      assert.strictEqual(archive.identity.email, mockUser.email);
      assert.strictEqual(archive.healthAndFitness.bodyMeasurements.length, 1);
      assert.strictEqual(archive.consentsAuditTrail.length, 1);
    });

    it('irreversibly anonymizes personal data under Article 17 (Right to Erasure)', () => {
      const user = {
        id: 'usr_019304a1',
        email: 'michael.law@example.com',
        fullName: 'Michael Law',
      };

      const anonymized = gdprService.anonymizeUserData(user);
      assert.strictEqual(anonymized.id, user.id);
      assert.strictEqual(anonymized.fullName, 'Anonymous Athlete');
      assert.ok(anonymized.email.includes('@erased.apexpulse.app'));
      assert.notStrictEqual(anonymized.email, user.email);
    });

    it('enforces Resource-Level Authorization (IDOR Defense)', () => {
      const ownerId = 'usr_owner_123';
      const attackerId = 'usr_attacker_999';
      const assignedTrainerId = 'trn_coach_narez';

      // 1. Owner accessing their own resource -> ALLOW
      assert.strictEqual(
        gdprService.verifyResourceOwnership(ownerId, 'USER', ownerId),
        true
      );

      // 2. Attacker attempting IDOR access -> REJECT
      assert.strictEqual(
        gdprService.verifyResourceOwnership(attackerId, 'USER', ownerId),
        false
      );

      // 3. Trainer without active assignment -> REJECT
      assert.strictEqual(
        gdprService.verifyResourceOwnership(assignedTrainerId, 'TRAINER', ownerId, false),
        false
      );

      // 4. Certified trainer with active client assignment -> ALLOW
      assert.strictEqual(
        gdprService.verifyResourceOwnership(assignedTrainerId, 'TRAINER', ownerId, true),
        true
      );

      // 5. Compliance Administrator -> ALLOW
      assert.strictEqual(
        gdprService.verifyResourceOwnership('admin_001', 'ADMIN', ownerId),
        true
      );
    });
  });

  describe('Audit Logging, Retention Policies & Incident Response', () => {
    it('sanitizes passwords and bearer tokens from security logs (OWASP MASVS)', () => {
      const sensitiveDetails = {
        username: 'athlete_john',
        password: 'SuperSecretPassword!2026',
        bearerToken: 'eyJh...token...123',
        nestedData: {
          clientSecret: 'secret_abc123',
          weightKg: 80,
        },
      };

      const sanitized = sanitizeLogDetails(sensitiveDetails);
      assert.strictEqual(sanitized.password, '[REDACTED_BY_SECURITY_POLICY]');
      assert.strictEqual(sanitized.bearerToken, '[REDACTED_BY_SECURITY_POLICY]');
      assert.strictEqual((sanitized.nestedData as any).clientSecret, '[REDACTED_BY_SECURITY_POLICY]');
      assert.strictEqual((sanitized.nestedData as any).weightKg, 80);
      assert.strictEqual(sanitized.username, 'athlete_john');
    });

    it('creates immutable audit log entry with pseudonymized IP', () => {
      const entry = createSecurityAuditEntry('AUTH_LOGIN_SUCCESS', '203.0.113.195', {
        deviceModel: 'iPhone 15 Pro',
      }, { userId: 'usr_777' });

      assert.ok(entry.id.startsWith('audit-'));
      assert.strictEqual(entry.eventType, 'AUTH_LOGIN_SUCCESS');
      assert.strictEqual(entry.userId, 'usr_777');
      assert.strictEqual(entry.pseudonymizedIp.length, 64); // HMAC-SHA256
      assert.notStrictEqual(entry.pseudonymizedIp, '203.0.113.195');
    });

    it('enforces retention policies and flags expired records under Article 5(1)(e)', () => {
      const oneDayMs = 24 * 60 * 60 * 1000;
      const now = Date.now();

      // Soft deleted account 45 days ago (grace period is 30 days) -> Expired
      const oldSoftDeleteTime = now - 45 * oneDayMs;
      assert.strictEqual(
        isRecordExpired('SOFT_DELETED_ACCOUNT_GRACE_PERIOD', oldSoftDeleteTime, now),
        true
      );

      // Audit log created 100 days ago (retention is 365 days) -> Not Expired
      const recentAuditTime = now - 100 * oneDayMs;
      assert.strictEqual(
        isRecordExpired('AUDIT_SECURITY_LOGS', recentAuditTime, now),
        false
      );

      // DSAR archive created 30 hours ago (limit is 24 hours / 1 day) -> Expired
      const oldDsarTime = now - 30 * 60 * 60 * 1000;
      assert.strictEqual(
        isRecordExpired('TEMPORARY_DSAR_EXPORT_ARCHIVES', oldDsarTime, now),
        true
      );
    });

    it('correctly assesses breach notification requirements under Article 33 and 34', () => {
      // 1. Health data exposure -> Mandatory DPA notification + User notification
      const healthBreach = evaluateBreachNotification(['HEALTH_METRICS'], 50);
      assert.strictEqual(healthBreach.dpaNotificationRequired, true);
      assert.strictEqual(healthBreach.userNotificationRequired, true);

      // 2. Minor anonymous telemetry glitch -> No mandatory user notification
      const minorIncident = evaluateBreachNotification(['USER_PII'], 10);
      assert.strictEqual(minorIncident.dpaNotificationRequired, true);
      assert.strictEqual(minorIncident.userNotificationRequired, false);

      // 3. Register of Sub-Processors contains valid entries
      assert.ok(OFFICIAL_SUB_PROCESSORS.length >= 3);
      assert.strictEqual(OFFICIAL_SUB_PROCESSORS.every((p) => p.dpaSigned), true);
    });
  });
});
