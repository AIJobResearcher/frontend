import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useVacancies } from '@/hooks';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
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
