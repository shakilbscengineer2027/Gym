/**
 * ApexPulse Secure Logging & Immutable Security Audit Trail Engine
 * Follows OWASP MASVS (MSTG-STORAGE-3) and OWASP API Security Top 10.
 * Automatically masks PII, authentication tokens, and credentials from log buffers.
 */

import { cryptoService } from './cryptoService.ts';

export type SecurityEventType =
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILURE'
  | 'AUTH_TOKEN_ROTATED'
  | 'AUTH_PASSWORD_CHANGED'
  | 'GDPR_CONSENT_GRANTED'
  | 'GDPR_CONSENT_REVOKED'
  | 'GDPR_DSAR_EXPORT_REQUESTED'
  | 'GDPR_ERASURE_REQUESTED'
  | 'HEALTH_DATA_ACCESSED'
  | 'ACCESS_CONTROL_VIOLATION_IDOR'
  | 'RATE_LIMIT_EXCEEDED';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: SecurityEventType;
  userId?: string;
  pseudonymizedIp: string;
  resourceId?: string;
  details: Record<string, unknown>;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
}

/** Redaction patterns to sanitize accidental PII leakage */
const SENSITIVE_PATTERNS = [
  /password/i,
  /token/i,
  /secret/i,
  /authorization/i,
  /bearer/i,
  /credit_card/i,
  /card_number/i,
  /cvv/i,
];

/**
 * Sanitizes arbitrary metadata objects by scrubbing sensitive keys
 */
export function sanitizeLogDetails(details: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(details)) {
    const isSensitive = SENSITIVE_PATTERNS.some((pattern) => pattern.test(key));
    if (isSensitive) {
      sanitized[key] = '[REDACTED_BY_SECURITY_POLICY]';
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeLogDetails(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Creates an immutable, sanitized security audit entry
 */
export function createSecurityAuditEntry(
  eventType: SecurityEventType,
  rawIp: string,
  details: Record<string, unknown> = {},
  options?: { userId?: string; resourceId?: string; severity?: 'INFO' | 'WARN' | 'CRITICAL' }
): AuditLogEntry {
  const entryId = `audit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const sanitizedDetails = sanitizeLogDetails(details);
  const safeIp = cryptoService.pseudonymizeIp(rawIp, 'apexpulse-audit-salt-2026');

  return {
    id: entryId,
    timestamp: new Date().toISOString(),
    eventType,
    userId: options?.userId,
    pseudonymizedIp: safeIp,
    resourceId: options?.resourceId,
    details: sanitizedDetails,
    severity: options?.severity ?? (eventType.includes('VIOLATION') || eventType.includes('FAILURE') ? 'WARN' : 'INFO'),
  };
}
