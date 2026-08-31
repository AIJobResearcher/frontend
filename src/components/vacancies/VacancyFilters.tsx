import React, { useState, useCallback } from 'react';
import { FilterParams } from '@/types/vacancy';
import { SORT_OPTIONS } from '@/utils/constants';

interface VacancyFiltersProps {
  onFilterChange: (filters: Partial<FilterParams>) => void;
  currentFilters: Partial<FilterParams>;
  isLoading?: boolean;
}

export const VacancyFilters: React.FC<VacancyFiltersProps> = ({
  onFilterChange,
  currentFilters,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState(currentFilters.title || '');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);

      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(() => {
        onFilterChange({ title: value });
      }, 500);

      setSearchTimeout(timeout);
    },
    [searchTimeout, onFilterChange]
  );

  const handleCountryChange = useCallback(
    (value: string) => {
      onFilterChange({ country: value });
    },
    [onFilterChange]
  );

  const handleCityChange = useCallback(
    (value: string) => {
      onFilterChange({ city: value });
    },
    [onFilterChange]
  );

  const handleSalaryMinChange = useCallback(
    (value: string) => {
      onFilterChange({ salary_min: value ? parseInt(value, 10) : undefined });
    },
    [onFilterChange]
  );

  const handleSalaryMaxChange = useCallback(
    (value: string) => {
      onFilterChange({ salary_max: value ? parseInt(value, 10) : undefined });
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
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <input
          id="search"
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Job title, company..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          disabled={isLoading}
        />
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
          <label htmlFor="salary-min" className="block text-sm font-medium text-gray-700 mb-2">
            Salary From (USD)
          </label>
          <input
            id="salary-min"
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Min"
            value={currentFilters.salary_min || ''}
            onChange={(e) => handleSalaryMinChange(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="salary-max" className="block text-sm font-medium text-gray-700 mb-2">
            Salary To (USD)
          </label>
          <input
            id="salary-max"
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Max"
            value={currentFilters.salary_max || ''}
            onChange={(e) => handleSalaryMaxChange(e.target.value)}
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
