import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format date to readable format (e.g., "Jan 15, 2024")
 */
export function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch (error) {
    console.warn('Invalid date string:', dateString);
    return 'Invalid Date';
  }
}

/**
 * Format date to relative time (e.g., "2 days ago", "3 months ago")
 */
export function formatRelativeDate(dateString: string): string {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (error) {
    console.warn('Invalid date string:', dateString);
    return 'Recently';
  }
}

/**
 * Format date to ISO string for API calls
 */
export function formatISODate(date: Date): string {
  return date.toISOString();
}

/**
 * Check if date is today
 */
export function isToday(dateString: string): boolean {
  try {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  } catch (error) {
    return false;
  }
}

/**
 * Check if date is yesterday
 */
export function isYesterday(dateString: string): boolean {
  try {
    const date = new Date(dateString);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  } catch (error) {
    return false;
  }
}

/**
 * Get date range label (Today, Yesterday, or formatted date)
 */
export function getDateRangeLabel(dateString: string): string {
  if (isToday(dateString)) {
    return 'Today';
  }
  if (isYesterday(dateString)) {
    return 'Yesterday';
  }
  return formatDate(dateString);
}
