import React, { useEffect } from 'react';
import { VacancyPreview, FilterParams } from '@/types/vacancy';
import { VacancyCard } from './VacancyCard';
import { Spinner, ErrorFallback } from '@/components/common';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import './VacancyList.css';

interface VacancyListProps {
  vacancies: VacancyPreview[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  selectedVacancyId?: string;
  onSelectVacancy: (id: string) => void;
  onLoadMore: () => void;
  onRetry: () => void;
}

/**
 * List component for displaying vacancies with infinite scroll
 */
export const VacancyList: React.FC<VacancyListProps> = ({
  vacancies,
  isLoading,
  isLoadingMore,
  error,
  hasMore,
  selectedVacancyId,
  onSelectVacancy,
  onLoadMore,
  onRetry,
}) => {
  const infiniteScrollRef = useInfiniteScroll({
    onIntersect: onLoadMore,
    enabled: hasMore && !isLoadingMore,
  });

  if (isLoading && vacancies.length === 0) {
    return (
      <div className="vacancy-list">
        <Spinner size="md" label="Loading vacancies..." />
      </div>
    );
  }

  if (error && vacancies.length === 0) {
    return (
      <div className="vacancy-list">
        <ErrorFallback message={error} onRetry={onRetry} />
      </div>
    );
  }

  return (
    <div className="vacancy-list">
      {vacancies.length === 0 ? (
        <div className="vacancy-list__empty">
          <p>No vacancies found. Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          {vacancies.map((vacancy) => (
            <VacancyCard
              key={vacancy.id}
              vacancy={vacancy}
              isActive={selectedVacancyId === vacancy.id}
              onClick={() => onSelectVacancy(vacancy.id)}
            />
          ))}

          {hasMore && (
            <div ref={infiniteScrollRef} className="vacancy-list__trigger">
              {isLoadingMore && <Spinner size="sm" label="Loading more..." />}
            </div>
          )}

          {!hasMore && vacancies.length > 0 && (
            <div className="vacancy-list__end-message">
              <p>✓ All vacancies loaded</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
