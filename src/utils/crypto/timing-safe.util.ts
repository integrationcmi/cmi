/**
 * Timing-Safe Cryptographic Utilities
 * 
 * Provides secure comparison functions to prevent timing attacks.
 */

import crypto from 'crypto';

/**
 * Perform a constant-time comparison of two strings.
 * This prevents timing attacks when comparing hashes.
 * 
 * @param a - First string to compare
 * @param b - Second string to compare
 * @returns true if strings are equal, false otherwise
 * 
 * @example
 * ```typescript
 * const isValid = timingSafeCompare(receivedHash, calculatedHash);
 * ```
 */
export function timingSafeCompare(a: string, b: string): boolean {
    try {
        const bufA = Buffer.from(a, 'utf8');
        const bufB = Buffer.from(b, 'utf8');

        // If lengths differ, still do comparison to prevent timing leak
        if (bufA.length !== bufB.length) {
            // Compare with self to maintain constant time
            crypto.timingSafeEqual(bufA, bufA);
            return false;
        }

        return crypto.timingSafeEqual(bufA, bufB);
    } catch {
        return false;
    }
}

/**
 * Generate a SHA-512 hash and return as base64
 * 
 * @param data - String to hash
 * @returns Base64-encoded SHA-512 hash
 */
export function sha512Base64(data: string): string {
    const hash = crypto.createHash('sha512').update(data, 'utf8').digest('hex');
    return Buffer.from(hash, 'hex').toString('base64');
}
