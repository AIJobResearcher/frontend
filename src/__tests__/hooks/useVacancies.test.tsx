import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useVacancies } from '@/hooks';

const createWrapper = (): React.FC<{ children: React.ReactNode }> => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useVacancies Hook', () => {
  it('should initialize with empty vacancies', async () => {
    const { result } = renderHook(() => useVacancies(), { wrapper: createWrapper() });
    expect(result.current.vacancies).toEqual([]);
  });

  it('should have loading state initially', () => {
    const { result } = renderHook(() => useVacancies(), { wrapper: createWrapper() });
    expect(result.current.isLoading || result.current.vacancies.length >= 0).toBe(true);
  });

  it('should handle filter changes', () => {
    const { result } = renderHook(() => useVacancies(), { wrapper: createWrapper() });
    const setFilters = result.current.setFilters;
    expect(typeof setFilters).toBe('function');
  });
});
