import React from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { VacancyFilters, VacancyList, VacancyDetail } from '@/components/vacancies';
import { useVacancies, useVacancyDetail } from '@/hooks';
import { useVacancyFilterStore } from '@/store/vacancyFilterStore';
import { FilterParams } from '@/types/vacancy';

/**
 * Home page component - main page with vacancy list and detail view
 */
export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: vacancyIdFromUrl } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { filters, setFilters: setStoreFilters } = useVacancyFilterStore();

  // Parse filters from URL
  const initialFilters: Partial<FilterParams> = {
    title: searchParams.get('title') || undefined,
    country: searchParams.get('country') || undefined,
    city: searchParams.get('city') || undefined,
    salary_min: searchParams.get('salary_min')
      ? parseInt(searchParams.get('salary_min')!, 10)
      : undefined,
    salary_max: searchParams.get('salary_max')
      ? parseInt(searchParams.get('salary_max')!, 10)
      : undefined,
    status: (searchParams.get('status') as 'open' | 'closed') || 'open',
    sort: (searchParams.get('sort') as any) || 'date',
  };

  // TanStack Query hook
  const {
    vacancies,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    totalVacancies,
    setFilters,
    fetchMoreVacancies,
    retry,
  } = useVacancies(initialFilters);

  // Vacancy detail hook
  const { vacancy, isLoading: detailLoading, error: detailError, refetch: refetchDetail } =
    useVacancyDetail(vacancyIdFromUrl);

  // Handle filter changes
  const handleFilterChange = React.useCallback(
    (newFilters: Partial<FilterParams>) => {
      // Update URL
      const params = new URLSearchParams();

      if (newFilters.title) params.set('title', newFilters.title);
      if (newFilters.country) params.set('country', newFilters.country);
      if (newFilters.city) params.set('city', newFilters.city);
      if (newFilters.salary_min !== undefined) params.set('salary_min', String(newFilters.salary_min));
      if (newFilters.salary_max !== undefined) params.set('salary_max', String(newFilters.salary_max));
      if (newFilters.status) params.set('status', newFilters.status);
      if (newFilters.sort) params.set('sort', newFilters.sort);

      setSearchParams(params);
      setFilters(newFilters);
      setStoreFilters(newFilters);
    },
    [setSearchParams, setFilters, setStoreFilters]
  );

  // Handle vacancy selection
  const handleSelectVacancy = React.useCallback(
    (id: string) => {
      navigate(`/vacancy/${id}`);
    },
    [navigate]
  );

  // Handle apply button
  const handleApply = React.useCallback(() => {
    alert('This feature will be available in the next version!');
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-fluid py-8">
        {/* Filters */}
        <VacancyFilters
          onFilterChange={handleFilterChange}
          currentFilters={initialFilters}
          isLoading={isLoading}
        />

        {/* Main content - two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - List */}
          <div className="lg:col-span-7">
            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Vacancies ({totalVacancies})
              </h2>
              <VacancyList
                vacancies={vacancies}
                isLoading={isLoading}
                isLoadingMore={isLoadingMore}
                error={error}
                hasMore={hasMore}
                selectedVacancyId={vacancyIdFromUrl}
                onSelectVacancy={handleSelectVacancy}
                onLoadMore={fetchMoreVacancies}
                onRetry={retry}
              />
            </div>
          </div>

          {/* Right column - Detail (hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="flex flex-col">
              <VacancyDetail
                vacancy={vacancy}
                isLoading={detailLoading}
                error={detailError}
                onRetry={refetchDetail}
                onApply={handleApply}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
