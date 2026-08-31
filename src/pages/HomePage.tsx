import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { VacancyFilters, VacancyList, VacancyDetail } from '@/components/vacancies';
import { useVacancies, useVacancyDetail } from '@/hooks';
import { FilterParams } from '@/types/vacancy';
import './HomePage.css';

/**
 * Home page component - main page with vacancy list and detail view
 */
export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: vacancyIdFromUrl } = useParams<{ id?: string }>();
  const navigate = useNavigate();

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

  // Vacancies list hook
  const {
    vacancies,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    totalVacancies,
    fetchVacancies,
    fetchMoreVacancies,
    retry,
  } = useVacancies(initialFilters);

  // Vacancy detail hook
  const { vacancy, isLoading: detailLoading, error: detailError, fetchVacancy, retry: retryDetail, clear } = useVacancyDetail();

  // Initialize on mount
  useEffect(() => {
    fetchVacancies(initialFilters);
  }, []);

  // Load selected vacancy from URL
  useEffect(() => {
    if (vacancyIdFromUrl) {
      fetchVacancy(vacancyIdFromUrl);
    } else {
      clear();
    }
  }, [vacancyIdFromUrl, fetchVacancy, clear]);

  // Handle filter changes
  const handleFilterChange = useCallback(
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

      // Fetch new data
      fetchVacancies(newFilters);
    },
    [fetchVacancies, setSearchParams]
  );

  // Handle vacancy selection
  const handleSelectVacancy = useCallback(
    (id: string) => {
      navigate(`/vacancy/${id}`);
    },
    [navigate]
  );

  // Handle apply button
  const handleApply = useCallback(() => {
    alert('This feature will be available in the next version!');
  }, []);

  return (
    <div className="home-page">
      <div className="container-fluid">
        {/* Filters */}
        <VacancyFilters
          onFilterChange={handleFilterChange}
          currentFilters={initialFilters}
          isLoading={isLoading}
        />

        {/* Main content - two column layout */}
        <div className="row">
          {/* Left column - List */}
          <div className="col-lg-7">
            <div className="vacancy-section">
              <h2 className="vacancy-section__title">
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
          <div className="col-lg-5 d-none d-lg-block">
            <div className="vacancy-section">
              <VacancyDetail
                vacancy={vacancy}
                isLoading={detailLoading}
                error={detailError}
                onRetry={retryDetail}
                onApply={handleApply}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
