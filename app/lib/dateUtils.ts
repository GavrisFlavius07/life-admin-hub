/**
 * Date Utility Functions
 * Handles date formatting and comparison logic
 */

/**
 * Formats a date to a readable string (Italian locale)
 * @param date - Date to format or null
 * @returns Formatted date string or empty string
 */
export function formatDate(date: Date | null): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('it-IT', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Normalizes a date to midnight for fair date comparison
 */
function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

/**
 * Gets the number of days between two dates
 */
function getDaysDifference(date1: Date, date2: Date): number {
  const normalized1 = normalizeDate(date1);
  const normalized2 = normalizeDate(date2);
  const diffTime = normalized2.getTime() - normalized1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determines if a task is overdue
 * @param dueDate - Due date or null
 * @returns true if task is past due date
 */
export function isOverdue(dueDate: Date | null): boolean {
  if (!dueDate) return false;
  const today = normalizeDate(new Date());
  const due = normalizeDate(new Date(dueDate));
  return due < today;
}

/**
 * Determines if a task is due within 2 days (not including overdue)
 * @param dueDate - Due date or null
 * @returns true if task is due within 2 days but not overdue
 */
export function isDueSoon(dueDate: Date | null): boolean {
  if (!dueDate || isOverdue(dueDate)) return false;
  const daysUntil = getDaysUntilDue(dueDate);
  return daysUntil !== null && daysUntil <= 2 && daysUntil >= 0;
}

/**
 * Gets the number of days until due date
 * @param dueDate - Due date or null
 * @returns Number of days until due or null
 */
export function getDaysUntilDue(dueDate: Date | null): number | null {
  if (!dueDate) return null;
  const today = new Date();
  const due = new Date(dueDate);
  return getDaysDifference(today, due);
}
