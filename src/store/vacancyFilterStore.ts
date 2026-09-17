import { create } from 'zustand';
import { FilterParams } from '@/types/vacancy';
import { DEFAULT_FILTERS } from '@/utils/constants';

interface VacancyFilterStore {
  filters: Partial<FilterParams>;
  setFilters: (filters: Partial<FilterParams>) => void;
  resetFilters: () => void;
}

const defaultFilters: Partial<FilterParams> = DEFAULT_FILTERS;

export const useVacancyFilterStore = create<VacancyFilterStore>((set) => ({
  filters: defaultFilters,
  setFilters: (filters): void =>
    set({
      filters: {
        ...defaultFilters,
        ...filters,
      },
    }),
  resetFilters: (): void =>
    set({
      filters: defaultFilters,
    }),
}));
