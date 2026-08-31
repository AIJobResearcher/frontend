import React, { useState, useCallback, useMemo } from 'react';
import { VacancyPreview, FilterParams } from '@/types/vacancy';
import { SORT_OPTIONS, SEARCH_DEBOUNCE_MS } from '@/utils/constants';
import './VacancyFilters.css';

interface VacancyFiltersProps {
  onFilterChange: (filters: Partial<FilterParams>) => void;
  currentFilters: Partial<FilterParams>;
  isLoading?: boolean;
}

/**
 * Filter panel component for vacancies
 */
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
      }, SEARCH_DEBOUNCE_MS);

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
      onFilterChange({ sort: value as any });
    },
    [onFilterChange]
  );

  return (
    <div className="vacancy-filters">
      <div className="vacancy-filters__group">
        <label htmlFor="search" className="vacancy-filters__label">
          Search
        </label>
        <input
          id="search"
          type="text"
          className="form-control"
          placeholder="Job title, company..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="vacancy-filters__row">
        <div className="vacancy-filters__group">
          <label htmlFor="country" className="vacancy-filters__label">
            Country
          </label>
          <input
            id="country"
            type="text"
            className="form-control"
            placeholder="e.g., Ukraine"
            value={currentFilters.country || ''}
            onChange={(e) => handleCountryChange(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="vacancy-filters__group">
          <label htmlFor="city" className="vacancy-filters__label">
            City
          </label>
          <input
            id="city"
            type="text"
            className="form-control"
            placeholder="e.g., Kyiv"
            value={currentFilters.city || ''}
            onChange={(e) => handleCityChange(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="vacancy-filters__row">
        <div className="vacancy-filters__group">
          <label htmlFor="salary-min" className="vacancy-filters__label">
            Salary From
          </label>
          <input
            id="salary-min"
            type="number"
            className="form-control"
            placeholder="Min USD"
            value={currentFilters.salary_min || ''}
            onChange={(e) => handleSalaryMinChange(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="vacancy-filters__group">
          <label htmlFor="salary-max" className="vacancy-filters__label">
            Salary To
          </label>
          <input
            id="salary-max"
            type="number"
            className="form-control"
            placeholder="Max USD"
            value={currentFilters.salary_max || ''}
            onChange={(e) => handleSalaryMaxChange(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="vacancy-filters__row">
        <div className="vacancy-filters__group vacancy-filters__group--checkbox">
          <label className="vacancy-filters__checkbox-label">
            <input
              type="checkbox"
              checked={currentFilters.status === 'open'}
              onChange={(e) => handleStatusChange(e.target.checked)}
              disabled={isLoading}
            />
            <span>Open Positions Only</span>
          </label>
        </div>

        <div className="vacancy-filters__group">
          <label htmlFor="sort" className="vacancy-filters__label">
            Sort By
          </label>
          <select
            id="sort"
            className="form-control"
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
