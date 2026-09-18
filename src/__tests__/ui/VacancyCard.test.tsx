import { fireEvent, screen } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import type { VacancyPreview } from '@/entities/vacancy/api/vacancies';
import { VacancyCard } from '@/entities/vacancy/ui/VacancyCard';
import { renderWithProviders } from '@/shared/test-utils/renderWithProviders';

const vacancy: VacancyPreview = {
  id: 'v1',
  title: 'Frontend Developer',
  employer_id: 'e1',
  employer_title: 'Acme',
  min_salary: 1000,
  max_salary: 2000,
  city: 'Kyiv',
  country: 'Ukraine',
  workplace: 'remote',
  employment_type: 'full-time',
  status: 'open',
  posted_at: '2026-09-01T00:00:00Z',
};

const renderCard = (
  overrides: Partial<Parameters<typeof VacancyCard>[0]> = {}
): RenderResult & { onSelect: jest.Mock; onTagClick: jest.Mock } => {
  const onSelect = jest.fn();
  const onTagClick = jest.fn();

  const result = renderWithProviders(
    <ul>
      <VacancyCard
        vacancy={vacancy}
        isSelected={false}
        filters={{}}
        onSelect={onSelect}
        onTagClick={onTagClick}
        {...overrides}
      />
    </ul>
  );

  return { ...result, onSelect, onTagClick };
};

describe('VacancyCard', () => {
  it('renders the preview fields and the salary range', () => {
    renderCard();

    expect(screen.getByText('Frontend Developer')).toBeTruthy();
    expect(screen.getByText('Acme')).toBeTruthy();
    expect(screen.getByText('Kyiv, Ukraine')).toBeTruthy();
    expect(screen.getAllByText('$1000 - $2000').length).toBeGreaterThan(0);
    expect(screen.getByText('Posted Sep 1, 2026')).toBeTruthy();
  });

  it('selects the vacancy from the card button', () => {
    const { onSelect } = renderCard();

    const card = document.querySelector('[data-vacancy-select]');
    if (!card) throw new Error('selectable card button not found');
    fireEvent.click(card);

    expect(onSelect).toHaveBeenCalledWith('v1');
  });

  it('marks the selected card for assistive technology', () => {
    renderCard({ isSelected: true });

    const card = document.querySelector('[data-vacancy-select]');
    expect(card?.getAttribute('aria-current')).toBe('true');
  });

  it('reports a clicked tag as a filter', () => {
    const { onTagClick } = renderCard();

    fireEvent.click(screen.getByRole('button', { name: 'remote' }));

    expect(onTagClick).toHaveBeenCalledWith(
      expect.objectContaining({ field: 'workplace', patch: { workplace: 'remote' } })
    );
  });

  it('marks a tag that is already active', () => {
    renderCard({ filters: { workplace: 'remote' } });

    expect(screen.getByRole('button', { name: 'remote' }).className).toContain('border-brand');
  });
});
