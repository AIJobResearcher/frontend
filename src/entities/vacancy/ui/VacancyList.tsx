'use client';

import { useTranslations } from 'next-intl';
import type { KeyboardEvent, ReactElement } from 'react';
import type { VacancyFilters, VacancyPreview } from '@/entities/vacancy/api/vacancies';
import type { VacancyTag } from '@/entities/vacancy/model/vacancyTags';
import { Button, ErrorFallback, Spinner } from '@/shared/ui';
import { useInfiniteScroll } from '@/shared/lib/useInfiniteScroll';
import { VacancyCard } from './VacancyCard';

interface VacancyListProps {
  vacancies: VacancyPreview[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  selectedId: string | null;
  filters: VacancyFilters;
  hasFilters: boolean;
  onSelect: (id: string) => void;
  onTagClick: (tag: VacancyTag) => void;
  onClearFilters: () => void;
  onLoadMore: () => void;
  onRetry: () => void;
}

/** Moves focus between selectable cards with the arrow keys (ui 6.3). */
const handleCardKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

  const list = event.currentTarget.closest('ul');
  if (!list) return;

  const cards = Array.from(list.querySelectorAll<HTMLButtonElement>('[data-vacancy-select]'));
  const currentIndex = cards.indexOf(event.currentTarget);
  const step = event.key === 'ArrowDown' ? 1 : -1;
  const nextCard = cards[currentIndex + step];

  if (nextCard) {
    event.preventDefault();
    nextCard.focus();
  }
};

/** Results list with infinite scroll (ui 3.4) and arrow-key navigation (ui 6.3). */
export const VacancyList = ({
  vacancies,
  isLoading,
  isLoadingMore,
  error,
  hasMore,
  selectedId,
  filters,
  hasFilters,
  onSelect,
  onTagClick,
  onClearFilters,
  onLoadMore,
  onRetry,
}: VacancyListProps): ReactElement => {
  const t = useTranslations('Vacancies');
  const sentinelRef = useInfiniteScroll({
    onIntersect: onLoadMore,
    enabled: hasMore && !isLoadingMore,
  });

  if (isLoading) {
    return (
      <div className="px-4 py-12">
        <Spinner label={t('loading')} />
      </div>
    );
  }

  if (error && vacancies.length === 0) {
    return (
      <div className="p-6">
        <ErrorFallback title={t('errorTitle')} message={error.message} onRetry={onRetry} />
      </div>
    );
  }

  if (vacancies.length === 0) {
    return (
      <div className="p-8 text-center">
        <output className="block text-ink-muted">{t('empty')}</output>
        {hasFilters ? (
          <Button variant="outline" className="mt-3" onClick={onClearFilters}>
            {t('filters.clearFilters')}
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <ul aria-label={t('listLabel')}>
        {vacancies.map((vacancy) => (
          <VacancyCard
            key={vacancy.id}
            vacancy={vacancy}
            isSelected={selectedId === vacancy.id}
            filters={filters}
            onSelect={onSelect}
            onTagClick={onTagClick}
            onKeyDown={handleCardKeyDown}
          />
        ))}
      </ul>
      {hasMore ? (
        <div ref={sentinelRef} className="flex justify-center border-t border-line py-8">
          {isLoadingMore ? <Spinner size="sm" label={t('loadingMore')} /> : null}
        </div>
      ) : null}
    </div>
  );
};
