'use client';

import { useTranslations } from 'next-intl';
import { formatSalaryRange } from '@/entities/vacancy/model/salary';

/** Localised salary label for a vacancy (ui 3.3, 7.3). */
export const useSalaryText = (
  min: number | null | undefined,
  max: number | null | undefined
): string => {
  const t = useTranslations('Vacancies.salary');

  return formatSalaryRange(min, max) ?? t('notSpecified');
};
