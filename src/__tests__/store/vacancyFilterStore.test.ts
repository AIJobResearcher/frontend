import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVacancyFilterStore } from '@/store/vacancyFilterStore';

describe('useVacancyFilterStore', () => {
  it('should initialize with default filters', () => {
    const { result } = renderHook(() => useVacancyFilterStore());
    expect(result.current.filters.status).toBe('open');
    expect(result.current.filters.sort).toBe('date');
  });

  it('should update filters', () => {
    const { result } = renderHook(() => useVacancyFilterStore());
    act(() => {
      result.current.setFilters({ job_id: 'job-1' });
    });
    expect(result.current.filters.job_id).toBe('job-1');
  });

  it('should reset filters', () => {
    const { result } = renderHook(() => useVacancyFilterStore());
    act(() => {
      result.current.setFilters({ job_id: 'job-1' });
    });
    expect(result.current.filters.job_id).toBe('job-1');

    act(() => {
      result.current.resetFilters();
    });
    expect(result.current.filters.job_id).toBeUndefined();
  });
});
