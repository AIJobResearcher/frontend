'use client';

import { useTranslations } from 'next-intl';
import type { ReactElement } from 'react';
import type { VacancyFilters } from '@/entities/vacancy/api/vacancies';
import { useSalaryText } from '@/entities/vacancy/model/useSalaryText';
import type { VacancyTag } from '@/entities/vacancy/model/vacancyTags';
import { Button, Chip } from '@/shared/ui';

interface VacancyFilterBarProps {
  appliedFilters: VacancyTag[];
  filters: VacancyFilters;
  onToggleTag: (tag: VacancyTag) => void;
  onPostedRangeChange: (postedFrom: string, postedTo: string) => void;
  onClearAll: () => void;
}

/** `yyyy-MM-dd` value for the date inputs; the contract stores `date-time`. */
const toDateInputValue = (value: string | undefined): string => value?.slice(0, 10) ?? '';

/**
 * Active filter chips, "Clear all" and the posted-at range (ui 3.2, 6.4).
 * `posted_at` is a range, not a tag, so it renders as date inputs.
 */
export const VacancyFilterBar = ({
  appliedFilters,
  filters,
  onToggleTag,
  onPostedRangeChange,
  onClearAll,
}: VacancyFilterBarProps): ReactElement => {
  const t = useTranslations('Vacancies.filters');
  const salary = useSalaryText(filters.min_salary, filters.max_salary);
  const hasApplied = appliedFilters.length > 0 || Boolean(filters.posted_from || filters.posted_to);

  return (
    <section
      aria-label={t('legend')}
      className="mb-4 flex flex-wrap items-end justify-between gap-3"
    >
      <div className="flex flex-wrap items-center gap-2">
        {appliedFilters.map((tag) => (
          <Chip key={tag.key} variant="outline" isActive onClick={() => onToggleTag(tag)}>
            <span className="sr-only">{t('remove', { label: tag.label ?? salary })}</span>
            <span aria-hidden="true">{tag.label ?? salary}</span>
            <span aria-hidden="true">×</span>
          </Chip>
        ))}
        {hasApplied ? (
          <Button variant="ghost" onClick={onClearAll}>
            {t('clearAll')}
          </Button>
        ) : (
          <p className="text-[13px] text-ink-muted">{t('hint')}</p>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-[12.5px] font-semibold text-ink-muted">
          {t('postedFrom')}
          <input
            type="date"
            value={toDateInputValue(filters.posted_from)}
            onChange={(event) =>
              onPostedRangeChange(event.target.value, toDateInputValue(filters.posted_to))
            }
            className="rounded-field border border-line-strong bg-surface px-3 py-1.5 text-[13.5px] font-normal text-ink"
          />
        </label>
        <label className="flex flex-col gap-1 text-[12.5px] font-semibold text-ink-muted">
          {t('postedTo')}
          <input
            type="date"
            value={toDateInputValue(filters.posted_to)}
            onChange={(event) =>
              onPostedRangeChange(toDateInputValue(filters.posted_from), event.target.value)
            }
            className="rounded-field border border-line-strong bg-surface px-3 py-1.5 text-[13.5px] font-normal text-ink"
          />
        </label>
      </div>
    </section>
  );
};
