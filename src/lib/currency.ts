
/**
 * Brazilian Real (BRL) currency formatting utilities
 * Timezone: America/Belem (GMT-3)
 */

export const TIMEZONE = 'America/Belem';
export const LOCALE = 'pt-BR';
export const CURRENCY = 'BRL';

/**
 * Format number as BRL currency
 */
export const formatCurrency = (
amount: number,
options: Intl.NumberFormatOptions = {})
: string => {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  }).format(amount);
};

/**
 * Format number as BRL currency without symbol
 */
export const formatCurrencyValue = (amount: number): string => {
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Parse BRL currency string to number
 */
export const parseCurrency = (value: string): number => {
  // Remove currency symbols and convert to number
  const cleanValue = value.
  replace(/[R$\s]/g, '').
  replace(/\./g, '').
  replace(',', '.');

  return parseFloat(cleanValue) || 0;
};

/**
 * Format date according to Brazilian format and timezone
 */
export const formatDate = (
date: Date | string,
options: Intl.DateTimeFormatOptions = {})
: string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options
  }).format(dateObj);
};

/**
 * Format date and time according to Brazilian format and timezone
 */
export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

/**
 * Get current date in Belem timezone
 */
export const getCurrentDate = (): Date => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: TIMEZONE }));
};

/**
 * Format percentage
 */
export const formatPercentage = (
value: number,
decimals: number = 1)
: string => {
  return new Intl.NumberFormat(LOCALE, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
};

/**
 * Get currency class for styling based on value
 */
export const getCurrencyClass = (amount: number): string => {
  if (amount > 0) return 'currency positive';
  if (amount < 0) return 'currency negative';
  return 'currency';
};

/**
 * Format large numbers with abbreviations (K, M, B)
 */
export const formatLargeNumber = (num: number): string => {
  if (Math.abs(num) >= 1e9) {
    return formatCurrency(num / 1e9) + 'B';
  }
  if (Math.abs(num) >= 1e6) {
    return formatCurrency(num / 1e6) + 'M';
  }
  if (Math.abs(num) >= 1e3) {
    return formatCurrency(num / 1e3) + 'K';
  }
  return formatCurrency(num);
};