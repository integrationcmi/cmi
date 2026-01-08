import { normalizeCurrency, normalizeCurrencyCode } from "@constants/currencies";

export class FormatterUtil {
  /**
   * Format and validate amount for CMI gateway
   * 
   * @param amount - The amount as number or string
   * @returns Properly formatted amount string (e.g., "220.00")
   * @throws Error if amount contains non-numeric characters
   */
  static formatAmount(amount: number | string): string {
    // If number, format directly
    if (typeof amount === 'number') {
      if (isNaN(amount) || !isFinite(amount)) {
        throw new Error('Amount must be a valid finite number');
      }
      return amount.toFixed(2);
    }

    // Handle string input
    const trimmedAmount = amount.trim();

    // Check for invalid characters (only allow digits, decimal point, and optional leading minus)
    if (!/^-?\d*\.?\d+$/.test(trimmedAmount)) {
      throw new Error(
        `Invalid amount format: "${amount}". Amount must contain only numeric characters (e.g., "220" or "220.50")`
      );
    }

    // Parse and format - this handles leading zeros like "0220" -> 220.00
    const parsedAmount = parseFloat(trimmedAmount);

    if (isNaN(parsedAmount) || !isFinite(parsedAmount)) {
      throw new Error(`Invalid amount: "${amount}". Could not parse as a valid number.`);
    }

    return parsedAmount.toFixed(2);
  }

  static formatAutoRedirect(autoRedirect: boolean | undefined): string {
    if (autoRedirect === undefined) return "false";
    return autoRedirect ? "true" : "false";
  }

  static formatStoreType(storeType: string): string {
    return storeType.toLowerCase();
  }

  static formatCurrencyCode(currencyCode: string): string {
    return normalizeCurrencyCode(currencyCode) || "";
  }

  static formatCurrencyNumeric(currencyNumeric: string): string {
    return normalizeCurrency(currencyNumeric) || "";
  }

  static formatLanguage(lang: string | undefined): string {
    if (!lang) return "fr";
    return lang.toLowerCase();
  }
}

