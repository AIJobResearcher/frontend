'use client';

import { useTranslations } from 'next-intl';
import type { KeyboardEvent, ReactElement } from 'react';
import type { VacancyFilters, VacancyPreview } from '@/entities/vacancy/api/vacancies';
import { usePostedAt } from '@/entities/vacancy/model/usePostedAt';
import { useSalaryText } from '@/entities/vacancy/model/useSalaryText';
import { isTagActive, vacancyTags } from '@/entities/vacancy/model/vacancyTags';
import type { VacancyTag } from '@/entities/vacancy/model/vacancyTags';
import { Chip, CompanyLogo } from '@/shared/ui';

interface VacancyCardProps {
  vacancy: VacancyPreview;
  isSelected: boolean;
  filters: VacancyFilters;
  onSelect: (id: string) => void;
  onTagClick: (tag: VacancyTag) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

/** One row of the results list with its clickable tags (ui 3.2, 3.3). */
export const VacancyCard = ({
  vacancy,
  isSelected,
  filters,
  onSelect,
  onTagClick,
  onKeyDown,
}: VacancyCardProps): ReactElement => {
  const t = useTranslations('Vacancies');
  const salary = useSalaryText(vacancy.min_salary, vacancy.max_salary);
  const postedAt = usePostedAt(vacancy.posted_at);
  const location = [vacancy.city, vacancy.country]
    .filter((part): part is string => Boolean(part))
    .join(', ');
  const tags = vacancyTags(vacancy);
  const isClosed = vacancy.status === 'closed';

  return (
    <li className="border-b border-line last:border-b-0">
      <div className={isClosed ? 'opacity-60' : ''}>
        <button
          type="button"
          data-vacancy-select
          aria-current={isSelected ? 'true' : undefined}
          onClick={() => onSelect(vacancy.id)}
          onKeyDown={onKeyDown}
          className={`flex w-full items-start gap-3 p-4 text-left transition hover:bg-canvas-hover ${
            isSelected ? 'bg-canvas-hover shadow-[inset_3px_0_0_var(--color-brand)]' : ''
          }`}
        >
          <CompanyLogo name={vacancy.employer_title} size="sm" />
          <span className="flex min-w-0 flex-1 flex-col">
            <span
              className={`block text-base leading-snug font-semibold ${
                isSelected ? 'text-brand' : 'text-ink'
              }`}
            >
              {vacancy.title}
            </span>
            <span className="mt-0.5 block text-sm text-ink">{vacancy.employer_title}</span>
            {location ? (
              <span className="mt-px block text-[13.5px] text-ink-muted">{location}</span>
            ) : null}
            <span className="mt-1.5 block text-[13.5px] text-ink">{salary}</span>
            {postedAt ? (
              <span className="mt-2 block text-[13px] text-ink-muted">
                {t('postedAt', { date: postedAt })}
              </span>
            ) : null}
          </span>
        </button>
        {tags.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5 px-4 pb-4">
            {tags.map((tag) => (
              <li key={tag.key}>
                <Chip
                  variant="outline"
                  isActive={isTagActive(tag, filters)}
                  onClick={() => onTagClick(tag)}
                >
                  {tag.label ?? salary}
                </Chip>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
};
