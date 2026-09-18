/** Formats an ISO timestamp with `Intl` for the active locale (rule 8.3). */
export const formatDate = (value: string | null | undefined, locale: string): string => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};
