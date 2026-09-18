'use client';

import { useLocale } from 'next-intl';
import { formatDate } from '@/shared/lib/date';

/** Localised posting date for the active locale (rule 8.3). */
export const usePostedAt = (value: string | null | undefined): string => {
  const locale = useLocale();

  return formatDate(value, locale);
};
