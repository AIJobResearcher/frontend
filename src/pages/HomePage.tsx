import React from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { VacancyFilters, VacancyList, VacancyDetail } from '@/components/vacancies';
import { useVacancies, useVacancyDetail } from '@/hooks';
import { useVacancyFilterStore } from '@/store/vacancyFilterStore';
import { FilterParams, VacancySort, VacancyStatus } from '@/types/vacancy';
import { DEFAULT_FILTERS, SORT_OPTIONS, VACANCY_STATUSES } from '@/utils/constants';

const parseNumberParam = (raw: string | null): number | undefined => {
  if (raw === null || raw.trim() === '') return undefined;
  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
};

const isVacancyStatus = (raw: string | null): raw is VacancyStatus =>
  raw !== null && VACANCY_STATUSES.includes(raw as VacancyStatus);

const isVacancySort = (raw: string | null): raw is VacancySort =>
  raw !== null && SORT_OPTIONS.some((option) => option.value === raw);

/**
 * Reads `POST /vacancies` search criteria from the URL query string.
 */
export const parseFiltersFromSearchParams = (
  searchParams: URLSearchParams
): Partial<FilterParams> => {
  const status = searchParams.get('status');
  const sort = searchParams.get('sort');

  return {
    job_id: searchParams.get('job_id') || undefined,
    employer_id: searchParams.get('employer_id') || undefined,
    country: searchParams.get('country') || undefined,
    city: searchParams.get('city') || undefined,
    min_salary: parseNumberParam(searchParams.get('min_salary')),
    max_salary: parseNumberParam(searchParams.get('max_salary')),
    status: isVacancyStatus(status) ? status : DEFAULT_FILTERS.status,
    sort: isVacancySort(sort) ? sort : DEFAULT_FILTERS.sort,
  };
};

/**
 * Serializes search criteria back into the URL query string, skipping empty values.
 */
export const buildSearchParamsFromFilters = (filters: Partial<FilterParams>): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.job_id) params.set('job_id', filters.job_id);
  if (filters.employer_id) params.set('employer_id', filters.employer_id);
  if (filters.country) params.set('country', filters.country);
  if (filters.city) params.set('city', filters.city);
  if (filters.min_salary !== undefined) params.set('min_salary', String(filters.min_salary));
  if (filters.max_salary !== undefined) params.set('max_salary', String(filters.max_salary));
  if (filters.status) params.set('status', filters.status);
  if (filters.sort) params.set('sort', filters.sort);

  return params;
};

/** Drops keys whose value became empty so they are no longer sent to the API */
const withoutEmptyValues = (filters: Partial<FilterParams>): Partial<FilterParams> =>
  Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== '')
  ) as Partial<FilterParams>;

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: vacancyIdFromUrl } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { setFilters: setStoreFilters } = useVacancyFilterStore();

  const currentFilters = React.useMemo(
    () => parseFiltersFromSearchParams(searchParams),
    [searchParams]
  );

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
  } = useVacancies(currentFilters);

  const {
    vacancy,
    isLoading: detailLoading,
    error: detailError,
    refetch: refetchDetail,
  } = useVacancyDetail(vacancyIdFromUrl);

  const handleFilterChange = React.useCallback(
    (newFilters: Partial<FilterParams>) => {
      const nextFilters = withoutEmptyValues({ ...currentFilters, ...newFilters });

      setSearchParams(buildSearchParamsFromFilters(nextFilters));
      setFilters(nextFilters);
      setStoreFilters(nextFilters);
    },
    [currentFilters, setSearchParams, setFilters, setStoreFilters]
  );

  const handleSelectVacancy = React.useCallback(
    (id: string) => {
      navigate(`/vacancy/${id}`);
    },
    [navigate]
  );

  const handleApply = React.useCallback(() => {
    alert('This feature will be available in the next version!');
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-fluid py-8">
        <VacancyFilters
          onFilterChange={handleFilterChange}
          currentFilters={currentFilters}
          isLoading={isLoading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
