import { fireEvent, screen } from '@testing-library/react';
import { workplaceTag } from '@/entities/vacancy/model/vacancyTags';
import { VacancyFilterBar } from '@/features/vacancies-market/ui/VacancyFilterBar';
import { renderWithProviders } from '@/shared/test-utils/renderWithProviders';

const baseProps = {
  appliedFilters: [],
  filters: {},
  onToggleTag: jest.fn(),
  onPostedRangeChange: jest.fn(),
  onClearAll: jest.fn(),
};

describe('VacancyFilterBar', () => {
  it('hints at tag filtering when nothing is applied', () => {
    renderWithProviders(<VacancyFilterBar {...baseProps} />);

    expect(screen.getByText(/Select a tag/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Clear all' })).toBeNull();
  });

  it('shows applied filters and clears them', () => {
    const onClearAll = jest.fn();
    renderWithProviders(
      <VacancyFilterBar
        {...baseProps}
        appliedFilters={[workplaceTag('remote')]}
        filters={{ workplace: 'remote' }}
        onClearAll={onClearAll}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));

    expect(onClearAll).toHaveBeenCalled();
  });

  it('removes a single applied filter through its chip', () => {
    const onToggleTag = jest.fn();
    renderWithProviders(
      <VacancyFilterBar
        {...baseProps}
        appliedFilters={[workplaceTag('remote')]}
        filters={{ workplace: 'remote' }}
        onToggleTag={onToggleTag}
      />
    );

    fireEvent.click(screen.getByText('remote'));

    expect(onToggleTag).toHaveBeenCalledWith(expect.objectContaining({ field: 'workplace' }));
  });

  it('reports the posted range from the date inputs', () => {
    const onPostedRangeChange = jest.fn();
    renderWithProviders(
      <VacancyFilterBar {...baseProps} onPostedRangeChange={onPostedRangeChange} />
    );

    fireEvent.change(screen.getByLabelText('Posted from'), {
      target: { value: '2026-09-01' },
    });

    expect(onPostedRangeChange).toHaveBeenCalledWith('2026-09-01', '');
  });
});
