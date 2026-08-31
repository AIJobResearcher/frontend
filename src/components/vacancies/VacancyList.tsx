import React from 'react';
import { VacancyPreview } from '@/types/vacancy';
import { VacancyCard } from './VacancyCard';
import { Spinner, ErrorFallback } from '@/components/common';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

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
      <div className="flex justify-center py-12">
        <Spinner size="md" label="Loading vacancies..." />
      </div>
    );
  }

  if (error && vacancies.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6">
        <ErrorFallback message={error} onRetry={onRetry} />
      </div>
    );
  }

  return (
    <div>
      {vacancies.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center text-gray-500">
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
            <div ref={infiniteScrollRef} className="flex justify-center py-8">
              {isLoadingMore && <Spinner size="sm" label="Loading more..." />}
            </div>
          )}

          {!hasMore && vacancies.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>✓ All vacancies loaded</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
