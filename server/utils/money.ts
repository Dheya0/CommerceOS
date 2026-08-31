/**
 * Phase 1: Robust Commercial Money Model & Precision Utility
 * All financial calculations operate on integers in minor units (Halalas / Cents)
 * to eliminate floating point rounding errors (IEEE 754).
 */

export class Money {
  private readonly amount: number; // Integer minor units (e.g. 1999 for 19.99 SAR)
  private readonly currency: string;

  constructor(minorAmount: number, currency: string = 'SAR') {
    if (!Number.isFinite(minorAmount)) {
      throw new Error(`Invalid money amount: ${minorAmount}`);
    }
    this.amount = Math.round(minorAmount);
    this.currency = currency.toUpperCase();
  }

  /**
   * Factory: Create from decimal major amount (e.g. 19.99 -> 1999 Halalas)
   */
  public static fromDecimal(decimalAmount: number, currency: string = 'SAR'): Money {
    return new Money(Math.round(decimalAmount * 100), currency);
  }

  /**
   * Factory: Create directly from minor units (e.g. 1999 Halalas)
   */
  public static fromMinor(minorAmount: number, currency: string = 'SAR'): Money {
    return new Money(minorAmount, currency);
  }

  /**
   * Returns internal integer minor units (Halalas)
   */
  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): string {
    return this.currency;
  }

  /**
   * Converts to standard major decimal (e.g. 1999 -> 19.99)
   */
  public toDecimal(): number {
    return this.amount / 100;
  }

  /**
   * Adds another Money instance or minor integer
   */
  public add(other: Money | number): Money {
    const addend = other instanceof Money ? other.amount : Math.round(other);
    return new Money(this.amount + addend, this.currency);
  }

  /**
   * Subtracts another Money instance or minor integer
   */
  public subtract(other: Money | number): Money {
    const subtrahend = other instanceof Money ? other.amount : Math.round(other);
    return new Money(this.amount - subtrahend, this.currency);
  }

  /**
   * Multiplies by a quantity or factor
   */
  public multiply(factor: number): Money {
    return new Money(Math.round(this.amount * factor), this.currency);
  }

  /**
   * Calculates a percentage rate safely
   */
  public percentage(rate: number): Money {
    if (rate <= 0) return new Money(0, this.currency);
    if (rate >= 100) return new Money(this.amount, this.currency);
    return new Money(Math.round((this.amount * rate) / 100), this.currency);
  }

  /**
   * Distributes total across N parts preserving remainder with zero leak
   */
  public split(parts: number): Money[] {
    if (parts <= 0 || !Number.isInteger(parts)) {
      throw new Error(`Split parts must be a positive integer, received: ${parts}`);
    }

    const baseAmount = Math.floor(this.amount / parts);
    const remainder = this.amount % parts;
    const result: Money[] = [];

    for (let i = 0; i < parts; i++) {
      // Allocate 1 extra minor unit to early parts until remainder is exhausted
      const allocated = i < remainder ? baseAmount + 1 : baseAmount;
      result.push(new Money(allocated, this.currency));
    }

    return result;
  }

  /**
   * Formats into localized currency display
   */
  public format(locale: string = 'ar-SA'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(this.toDecimal());
  }

  // --- Static Helper Utilities for Legacy / Direct Calls ---

  public static toMinor(amount: number): number {
    return Math.round(Number(amount) * 100);
  }

  public static toMajor(minorAmount: number): number {
    return Math.round(minorAmount) / 100;
  }

  public static add(a: number, b: number): number {
    return Math.round(a) + Math.round(b);
  }

  public static subtract(a: number, b: number): number {
    return Math.round(a) - Math.round(b);
  }

  public static multiply(amount: number, factor: number): number {
    return Math.round(amount * factor);
  }

  public static percentage(amount: number, rate: number): number {
    if (rate <= 0) return 0;
    if (rate >= 100) return amount;
    return Math.round((amount * rate) / 100);
  }

  public static compare(a: number, b: number): number {
    const diff = Math.round(a) - Math.round(b);
    if (diff < 0) return -1;
    if (diff > 0) return 1;
    return 0;
  }

  public static isValidNonNegative(minorAmount: any): boolean {
    return typeof minorAmount === 'number' && Number.isInteger(minorAmount) && minorAmount >= 0;
  }
}
