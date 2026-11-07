/**
 * ApexPulse GDPR Retention Policy & Processor Management Engine
 * Implements GDPR Article 5(1)(e) Storage Limitation, Article 28 Processor Oversight,
 * and Article 33/34 Breach Notification Response Protocol.
 */

export interface SubProcessorRecord {
  name: string;
  purpose: string;
  dataProcessed: string[];
  location: string;
  transferMechanism: 'EU_STANDARD_CONTRACTUAL_CLAUSES' | 'EU_ADEQUACY_DECISION';
  dpaSigned: boolean;
}

export interface BreachIncidentReport {
  incidentId: string;
  detectedAt: string;
  affectedDataCategories: ('CREDENTIALS' | 'HEALTH_METRICS' | 'USER_PII' | 'PAYMENT_TOKENS')[];
  estimatedUsersAffected: number;
  dpaNotificationRequired: boolean; // Article 33: within 72 hours
  userNotificationRequired: boolean; // Article 34: high risk to rights and freedoms
  mitigationStepsTaken: string[];
  status: 'INVESTIGATING' | 'CONTAINED' | 'NOTIFIED_AUTHORITIES' | 'RESOLVED';
}

/** Official Register of Sub-Processors (GDPR Article 28) */
export const OFFICIAL_SUB_PROCESSORS: SubProcessorRecord[] = [
  {
    name: 'PostgreSQL Cloud Hosting (Supabase/AWS Frankfurt)',
    purpose: 'Primary persistent encrypted relational database',
    dataProcessed: ['Profile', 'Workouts', 'Hashed Credentials', 'Health Metrics (Encrypted)'],
    location: 'Frankfurt, Germany (EU)',
    transferMechanism: 'EU_ADEQUACY_DECISION',
    dpaSigned: true,
  },
  {
    name: 'Cloudflare Inc. (R2 Storage & CDN)',
    purpose: 'Encrypted progress photo storage and DSAR export archives',
    dataProcessed: ['Progress Photographs (AES-256-GCM)', 'Temporary DSAR Export Archives'],
    location: 'EU Region / Global Edge',
    transferMechanism: 'EU_STANDARD_CONTRACTUAL_CLAUSES',
    dpaSigned: true,
  },
  {
    name: 'Stripe Payments Europe, Ltd.',
    purpose: 'PCI-DSS Level 1 subscription payment processing',
    dataProcessed: ['Payment token IDs', 'Tax jurisdiction billing country'],
    location: 'Dublin, Ireland (EU)',
    transferMechanism: 'EU_ADEQUACY_DECISION',
    dpaSigned: true,
  },
];

/** Storage Limitation & Data Retention Thresholds (in Days) */
export const RETENTION_POLICY_DAYS = {
  HEALTH_AND_FITNESS_ACTIVE_USER: -1, // Retained while account active + consented
  SOFT_DELETED_ACCOUNT_GRACE_PERIOD: 30, // Article 17 Erasure grace window
  AUDIT_SECURITY_LOGS: 365, // Article 6(1)(f) Legitimate Interest for defense
  FINANCIAL_TAX_RECORDS: 3650, // 10 years statutory tax compliance (Article 6(1)(c))
  TEMPORARY_DSAR_EXPORT_ARCHIVES: 1, // Deleted after 24 hours
} as const;

/**
 * Assesses whether a record has exceeded its lawful retention threshold
 */
export function isRecordExpired(
  recordType: keyof typeof RETENTION_POLICY_DAYS,
  createdAtTimestamp: number,
  nowTimestamp: number = Date.now()
): boolean {
  const allowedDays = RETENTION_POLICY_DAYS[recordType];
  if (allowedDays === -1) return false;

  const allowedDurationMs = allowedDays * 24 * 60 * 60 * 1000;
  return nowTimestamp - createdAtTimestamp > allowedDurationMs;
}

/**
 * Evaluates whether a security breach triggers mandatory Article 33 (72h) or Article 34 notifications
 */
export function evaluateBreachNotification(
  affectedCategories: ('CREDENTIALS' | 'HEALTH_METRICS' | 'USER_PII' | 'PAYMENT_TOKENS')[],
  estimatedUsers: number
): { dpaNotificationRequired: boolean; userNotificationRequired: boolean } {
  // Any breach involving health data (Article 9) or plaintext credentials represents a high risk
  const involvesSpecialCategory = affectedCategories.includes('HEALTH_METRICS') || affectedCategories.includes('CREDENTIALS');
  const dpaNotificationRequired = estimatedUsers > 0;
  const userNotificationRequired = involvesSpecialCategory || estimatedUsers > 500;

  return {
    dpaNotificationRequired,
    userNotificationRequired,
  };
}
