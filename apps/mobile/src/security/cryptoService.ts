import crypto from 'node:crypto';

export interface EncryptedPayload {
  cipherText: string; // Base64
  iv: string;         // Base64 (12 bytes for GCM)
  authTag: string;    // Base64 (16 bytes)
}

export const cryptoService = {
  /**
   * Encrypts sensitive health metrics or progress photo keys using AES-256-GCM.
   * GCM provides authenticated encryption, guaranteeing confidentiality and integrity.
   */
  encryptAES256GCM(plainText: string, secretKeyHex: string): EncryptedPayload {
    const key = Buffer.from(secretKeyHex, 'hex');
    if (key.length !== 32) {
      throw new Error('Encryption key must be exactly 32 bytes (256 bits).');
    }

    const iv = crypto.randomBytes(12); // Standard 96-bit IV for AES-GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const authTag = cipher.getAuthTag();

    return {
      cipherText: encrypted,
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
    };
  },

  /**
   * Decrypts AES-256-GCM ciphertext, verifying the cryptographic auth tag.
   * Throws if the ciphertext or tag has been tampered with.
   */
  decryptAES256GCM(payload: EncryptedPayload, secretKeyHex: string): string {
    const key = Buffer.from(secretKeyHex, 'hex');
    const iv = Buffer.from(payload.iv, 'base64');
    const authTag = Buffer.from(payload.authTag, 'base64');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(payload.cipherText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  },

  /**
   * Pseudonymizes client IP addresses using HMAC-SHA256 with a rotating salt.
   * Enables forensic anomaly detection and rate limiting without persisting raw PII under GDPR.
   */
  pseudonymizeIp(rawIp: string, salt: string): string {
    return crypto.createHmac('sha256', salt).update(rawIp.trim()).digest('hex');
  },

  /**
   * Generates cryptographically secure random session tokens and UUIDs.
   */
  generateSecureToken(bytes: number = 32): string {
    return crypto.randomBytes(bytes).toString('hex');
  },

  /**
   * Performs constant-time comparison to prevent timing attack vulnerabilities.
   */
  constantTimeCompare(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  },
};
