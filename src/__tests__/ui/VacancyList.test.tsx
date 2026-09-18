import { fireEvent, screen } from '@testing-library/react';
import type { VacancyPreview } from '@/entities/vacancy/api/vacancies';
import { VacancyList } from '@/entities/vacancy/ui/VacancyList';
import { renderWithProviders } from '@/shared/test-utils/renderWithProviders';

const buildVacancy = (id: string, title: string): VacancyPreview => ({
  id,
  title,
  employer_id: `e-${id}`,
  employer_title: 'Acme',
  min_salary: 1000,
  workplace: 'remote',
  employment_type: 'full-time',
  status: 'open',
  posted_at: '2026-09-01T00:00:00Z',
});

const baseProps = {
  vacancies: [],
  isLoading: false,
  isLoadingMore: false,
  error: null,
  hasMore: false,
  selectedId: null,
  filters: {},
  hasFilters: false,
  onSelect: jest.fn(),
  onTagClick: jest.fn(),
  onClearFilters: jest.fn(),
  onLoadMore: jest.fn(),
  onRetry: jest.fn(),
};

describe('VacancyList', () => {
  it('shows the empty state', () => {
    renderWithProviders(<VacancyList {...baseProps} />);

    expect(screen.getByText('No vacancies found.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Clear filters' })).toBeNull();
  });

  it('offers to clear the filters on an empty filtered list (ui 7.5)', () => {
    const onClearFilters = jest.fn();
    renderWithProviders(<VacancyList {...baseProps} hasFilters onClearFilters={onClearFilters} />);

    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));

    expect(onClearFilters).toHaveBeenCalled();
  });

  it('shows the loading state', () => {
    renderWithProviders(<VacancyList {...baseProps} isLoading />);

    expect(screen.getByText('Loading vacancies...')).toBeTruthy();
  });

  it('shows the per-code error copy with a retry action', () => {
    renderWithProviders(
      <VacancyList {...baseProps} error={new Error('Load error')} onRetry={jest.fn()} />
    );

    expect(screen.getByRole('alert').textContent).toContain('Could not load vacancies');
    expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy();
  });

  it('renders a list item per vacancy', () => {
    renderWithProviders(
      <VacancyList
        {...baseProps}
        vacancies={[buildVacancy('v1', 'First'), buildVacancy('v2', 'Second')]}
      />
    );

    expect(screen.getByRole('list', { name: 'Vacancies' })).toBeTruthy();
    expect(document.querySelectorAll('[data-vacancy-select]')).toHaveLength(2);
  });
});
