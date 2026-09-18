const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s()-]{5,20}$/;

/**
 * Sanitises untrusted API values before they reach `href` (standard 1.1, 7.3).
 * Returns `null` when the value is not a safe URL of the expected kind.
 */
export const safeExternalUrl = (value: string | null | undefined): string | null => {
  if (!value) return null;

  try {
    const url = new URL(value);
    return ALLOWED_PROTOCOLS.has(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
};

export const safeEmailHref = (value: string | null | undefined): string | null => {
  if (!value || !EMAIL_PATTERN.test(value)) return null;

  return `mailto:${value}`;
};

export const safePhoneHref = (value: string | null | undefined): string | null => {
  if (!value || !PHONE_PATTERN.test(value)) return null;

  return `tel:${value.replace(/[^\d+]/g, '')}`;
};
