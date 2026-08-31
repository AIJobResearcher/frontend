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
      result.current.setFilters({ title: 'React Developer' });
    });
    expect(result.current.filters.title).toBe('React Developer');
  });

  it('should reset filters', () => {
    const { result } = renderHook(() => useVacancyFilterStore());
    act(() => {
      result.current.setFilters({ title: 'React Developer' });
    });
    expect(result.current.filters.title).toBe('React Developer');

    act(() => {
      result.current.resetFilters();
    });
    expect(result.current.filters.title).toBeUndefined();
  });
});
