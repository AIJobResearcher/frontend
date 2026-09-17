import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FilterParams } from '@/types/vacancy';
import { SEARCH_DEBOUNCE_MS, SORT_OPTIONS } from '@/utils/constants';

interface VacancyFiltersProps {
  onFilterChange: (filters: Partial<FilterParams>) => void;
  currentFilters: Partial<FilterParams>;
  isLoading?: boolean;
}

const toOptionalNumber = (value: string): number | undefined => {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const VacancyFilters: React.FC<VacancyFiltersProps> = ({
  onFilterChange,
  currentFilters,
  isLoading = false,
}) => {
  const [jobId, setJobId] = useState(currentFilters.job_id || '');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setJobId(currentFilters.job_id || '');
  }, [currentFilters.job_id]);

  useEffect(() => {
    return (): void => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleJobIdChange = useCallback(
    (value: string) => {
      setJobId(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        onFilterChange({ job_id: value.trim() || undefined });
      }, SEARCH_DEBOUNCE_MS);
    },
    [onFilterChange]
  );

  const handleEmployerChange = useCallback(
    (value: string) => {
      onFilterChange({ employer_id: value.trim() || undefined });
    },
    [onFilterChange]
  );

  const handleCountryChange = useCallback(
    (value: string) => {
      onFilterChange({ country: value.trim() || undefined });
    },
    [onFilterChange]
  );

  const handleCityChange = useCallback(
    (value: string) => {
      onFilterChange({ city: value.trim() || undefined });
    },
    [onFilterChange]
  );

  const handleMinSalaryChange = useCallback(
    (value: string) => {
      onFilterChange({ min_salary: toOptionalNumber(value) });
    },
    [onFilterChange]
  );

  const handleMaxSalaryChange = useCallback(
    (value: string) => {
      onFilterChange({ max_salary: toOptionalNumber(value) });
    },
    [onFilterChange]
  );

  const handleStatusChange = useCallback(
    (checked: boolean) => {
      onFilterChange({ status: checked ? 'open' : undefined });
    },
    [onFilterChange]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      onFilterChange({ sort: value as FilterParams['sort'] });
    },
    [onFilterChange]
  );

  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="job-id" className="block text-sm font-medium text-gray-700 mb-2">
            Job ID
          </label>
          <input
            id="job-id"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., job-123"
            value={jobId}
            onChange={(e) => handleJobIdChange(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="employer-id" className="block text-sm font-medium text-gray-700 mb-2">
            Employer ID
          </label>
          <input
            id="employer-id"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., emp-42"
            value={currentFilters.employer_id || ''}
            onChange={(e) => handleEmployerChange(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <input
            id="country"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Ukraine"
            value={currentFilters.country || ''}
            onChange={(e) => handleCountryChange(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            id="city"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Kyiv"
            value={currentFilters.city || ''}
            onChange={(e) => handleCityChange(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="min-salary" className="block text-sm font-medium text-gray-700 mb-2">
            Salary From (USD)
          </label>
          <input
            id="min-salary"
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Min"
            value={currentFilters.min_salary ?? ''}
            onChange={(e) => handleMinSalaryChange(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="max-salary" className="block text-sm font-medium text-gray-700 mb-2">
            Salary To (USD)
          </label>
          <input
            id="max-salary"
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Max"
            value={currentFilters.max_salary ?? ''}
            onChange={(e) => handleMaxSalaryChange(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-end">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={currentFilters.status === 'open'}
              onChange={(e) => handleStatusChange(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">Open Positions Only</span>
          </label>
        </div>

        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            id="sort"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={currentFilters.sort || 'date'}
            onChange={(e) => handleSortChange(e.target.value)}
            disabled={isLoading}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
