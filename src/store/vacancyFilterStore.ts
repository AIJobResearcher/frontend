import { create } from 'zustand';
import { FilterParams } from '@/types/vacancy';

interface VacancyFilterStore {
  filters: Partial<FilterParams>;
  setFilters: (filters: Partial<FilterParams>) => void;
  resetFilters: () => void;
}

const defaultFilters: Partial<FilterParams> = {
  status: 'open',
  sort: 'date',
};

/**
 * Zustand store for vacancy filters
 */
export const useVacancyFilterStore = create<VacancyFilterStore>((set) => ({
  filters: defaultFilters,
  setFilters: (filters) =>
    set({
      filters: {
        ...defaultFilters,
        ...filters,
      },
    }),
  resetFilters: () =>
    set({
      filters: defaultFilters,
    }),
}));
