import React from 'react';
import { useMutation, useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { FilterParams, VacancyPreview, Vacancy } from '@/types/vacancy';
import { apiClient } from '@/api/client';

interface UseVacanciesReturn {
  vacancies: VacancyPreview[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  totalVacancies: number;
  setFilters: React.Dispatch<React.SetStateAction<Partial<FilterParams>>>;
  fetchMoreVacancies: () => void;
  retry: () => void;
}

export const useVacancies = (filters?: Partial<FilterParams>): UseVacanciesReturn => {
  const [currentFilters, setCurrentFilters] = React.useState<Partial<FilterParams>>(filters || {});

  const { data, isLoading, isFetching, error, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['vacancies', currentFilters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get<{
        data: VacancyPreview[];
        total: number;
        page: number;
        per_page: number;
      }>('/vacancies', {
        params: {
          ...currentFilters,
          page: pageParam,
          per_page: 20,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const { page, per_page, total } = lastPage;
      const nextPage = page + 1;
      const totalPages = Math.ceil(total / per_page);
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });

  const vacancies = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const totalVacancies = data?.pages[0]?.total || 0;

  return {
    vacancies,
    isLoading,
    isLoadingMore: isFetching && !isLoading,
    error: error?.message || null,
    hasMore: !!hasNextPage,
    totalVacancies,
    setFilters: setCurrentFilters,
    fetchMoreVacancies: () => fetchNextPage(),
    retry: () => fetchNextPage(),
  };
};

interface UseVacancyDetailReturn {
  vacancy: Vacancy | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useVacancyDetail = (id?: string): UseVacancyDetailReturn => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['vacancy', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get<{ data: Vacancy }>(`/vacancies/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });

  return {
    vacancy: data || null,
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

interface UseApplyVacancyReturn {
  apply: (vacancyId: string) => void;
  isApplying: boolean;
}

export const useApplyVacancy = (): UseApplyVacancyReturn => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (vacancyId: string) => {
      return await apiClient.post(`/vacancies/${vacancyId}/apply`, {});
    },
  });

  return {
    apply: mutate,
    isApplying: isPending,
  };
};