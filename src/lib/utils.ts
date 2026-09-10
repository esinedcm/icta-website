/**
 * Strips HTML tags from a string.
 * This is useful for cleaning up WordPress excerpt data.
 */
export function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Formats an ISO date string into a readable format.
 * Example: "2026-05-11T12:00:00" -> "May 11, 2026"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Truncates a string to a given length and appends an ellipsis.
 */
export function truncateString(str: string, maxLength: number): string {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + '...';
}
