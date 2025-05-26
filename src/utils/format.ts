import { useMemo } from 'react';

/**
 * Formats a numerical value for display, using the user's locale for thousand separators.
 *
 * @param value - The number to format.
 * @param decimals - The number of decimal places to include (optional, defaults to 0).
 * @returns The formatted number as a string, or an error message if formatting fails.
 *
 * @example
 * formatNumber(12345.678, 2); // Returns "12,345.68" (or locale-specific equivalent)
 */
export const formatNumber = (value: number, decimals: number = 0): string => {
  const formattedValue = useMemo(() => {
    try {
      return value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    } catch (error: any) {
      console.error('Error formatting number:', error);
      return 'Invalid Number';
    }
  }, [value, decimals]);
  return formattedValue;
};

interface FormatDateOptions extends Intl.DateTimeFormatOptions {
  fallback?: string;
}

/**
 * Formats a date value for display, using Intl.DateTimeFormat for locale-sensitive formatting.
 *
 * @param date - The Date object or date string to format.
 * @param formatOptions - Options for Intl.DateTimeFormat, or a fallback message if the date is invalid.
 * @returns The formatted date string, or the fallback message if the date is invalid.
 *
 * @example
 * formatDate(new Date(), { year: 'numeric', month: 'long', day: 'numeric' }); // Returns "December 25, 2024" (or locale-specific equivalent)
 */
export const formatDate = (date: Date | string, formatOptions: FormatDateOptions = {}): string => {
  const formattedDate = useMemo(() => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    const options = { ...defaultOptions, ...formatOptions };

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;

      if (isNaN(dateObj.getTime())) {
        return formatOptions.fallback || 'Invalid Date';
      }

      return new Intl.DateTimeFormat(undefined, options).format(dateObj);
    } catch (error: any) {
      console.error('Error formatting date:', error);
      return formatOptions.fallback || 'Invalid Date';
    }
  }, [date, formatOptions]);
  return formattedDate;
};

/**
 * Truncates a string to a specified maximum length, adding an ellipsis ("...") at the end if necessary.
 *
 * @param text - The string to truncate.
 * @param maxLength - The maximum length of the truncated string.
 * @returns The truncated string, or the original string if it is shorter than the maximum length.
 *
 * @example
 * truncateString("This is a long string", 10); // Returns "This is a..."
 */
export const truncateString = (text: string, maxLength: number): string => {
  return useMemo(() => {
    if (!text) return "";
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength).trim() + "...";
  }, [text, maxLength]);
};

/**
 * Capitalizes the first letter of each word in a string.
 *
 * @param text - The string to capitalize.
 * @returns The capitalized string.
 *
 * @example
 * capitalizeString("this is a string"); // Returns "This Is A String"
 */
export const capitalizeString = (text: string): string => {
  return useMemo(() => {
    if (!text) return "";
    return text
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [text]);
};