import crypto from "crypto";

export class GeneratorUtil {
  static generateOrderId(): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  static generateRandom(): string {
    return crypto.randomBytes(16).toString('hex');
  }
}
