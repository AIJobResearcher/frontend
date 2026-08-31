import { useState, useEffect, useCallback } from 'react';
import { getVacancies } from '@/api/vacancies';
import { VacancyPreview, FilterParams } from '@/types/vacancy';

interface UseVacanciesResult {
  vacancies: VacancyPreview[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalVacancies: number;
  fetchVacancies: (filters: Partial<FilterParams>) => Promise<void>;
  fetchMoreVacancies: () => Promise<void>;
  retry: () => Promise<void>;
}

/**
 * Hook to manage vacancies list, pagination, and filtering
 */
export const useVacancies = (initialFilters: Partial<FilterParams>): UseVacanciesResult => {
  const [vacancies, setVacancies] = useState<VacancyPreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalVacancies, setTotalVacancies] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    per_page: 20,
    status: 'open',
    ...initialFilters,
  });

  const hasMore = currentPage < lastPage;

  const fetchVacancies = useCallback(
    async (newFilters: Partial<FilterParams> = {}) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedFilters: FilterParams = {
          ...filters,
          ...newFilters,
          page: 1,
          per_page: 20,
        };
        setFilters(updatedFilters);
        setCurrentPage(1);

        const response = await getVacancies(updatedFilters);
        setVacancies(response.data);
        setTotalVacancies(response.meta.total);
        setLastPage(response.meta.last_page);
      } catch (err) {
        console.error('Failed to fetch vacancies:', err);
        setError('Failed to load vacancies. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  const fetchMoreVacancies = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    setError(null);
    try {
      const nextPage = currentPage + 1;
      const response = await getVacancies({
        ...filters,
        page: nextPage,
      });
      setVacancies((prev) => [...prev, ...response.data]);
      setCurrentPage(nextPage);
      setLastPage(response.meta.last_page);
    } catch (err) {
      console.error('Failed to fetch more vacancies:', err);
      setError('Failed to load more vacancies.');
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, filters, hasMore, isLoadingMore]);

  const retry = useCallback(async () => {
    await fetchVacancies(filters);
  }, [filters, fetchVacancies]);

  return {
    vacancies,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    currentPage,
    totalVacancies,
    fetchVacancies,
    fetchMoreVacancies,
    retry,
  };
};
