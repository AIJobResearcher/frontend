import { useState, useEffect, useCallback } from 'react';
import { getVacancyById, Vacancy } from '@/api/vacancies';

interface UseVacancyDetailResult {
  vacancy: Vacancy | null;
  isLoading: boolean;
  error: string | null;
  fetchVacancy: (id: string) => Promise<void>;
  retry: () => Promise<void>;
  clear: () => void;
}

/**
 * Hook to manage a single vacancy detail view
 */
export const useVacancyDetail = (): UseVacancyDetailResult => {
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedId, setLastFetchedId] = useState<string | null>(null);

  const fetchVacancy = useCallback(async (id: string) => {
    if (lastFetchedId === id && vacancy) {
      return; // Already loaded
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getVacancyById(id);
      setVacancy(data);
      setLastFetchedId(id);
    } catch (err) {
      console.error('Failed to fetch vacancy details:', err);
      setError('Failed to load vacancy details. Please try again.');
      setVacancy(null);
    } finally {
      setIsLoading(false);
    }
  }, [lastFetchedId, vacancy]);

  const retry = useCallback(async () => {
    if (lastFetchedId) {
      await fetchVacancy(lastFetchedId);
    }
  }, [lastFetchedId, fetchVacancy]);

  const clear = useCallback(() => {
    setVacancy(null);
    setLastFetchedId(null);
    setError(null);
  }, []);

  return {
    vacancy,
    isLoading,
    error,
    fetchVacancy,
    retry,
    clear,
  };
};
