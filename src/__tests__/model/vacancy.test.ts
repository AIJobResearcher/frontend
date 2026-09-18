import { formatSalaryRange } from '@/entities/vacancy/model/salary';
import {
  activeTags,
  isTagActive,
  salaryTag,
  workplaceTag,
} from '@/entities/vacancy/model/vacancyTags';

describe('formatSalaryRange', () => {
  it('renders a range, an open upper bound and an open lower bound', () => {
    expect(formatSalaryRange(1000, 2000)).toBe('$1000 - $2000');
    expect(formatSalaryRange(1000, null)).toBe('$1000+');
    expect(formatSalaryRange(undefined, 2000)).toBe('Up to $2000');
  });

  it('returns null when no salary is known', () => {
    expect(formatSalaryRange(null, undefined)).toBeNull();
  });
});

describe('vacancy tags', () => {
  it('builds a tag with the criteria it applies', () => {
    expect(workplaceTag('remote')).toMatchObject({
      key: 'workplace:remote',
      field: 'workplace',
      label: 'remote',
      patch: { workplace: 'remote' },
    });
  });

  it('carries both salary bounds in one tag', () => {
    expect(salaryTag(1000, 2000)).toMatchObject({
      field: 'salary',
      patch: { min_salary: 1000, max_salary: 2000 },
    });
  });

  it('detects an already active tag', () => {
    const tag = workplaceTag('remote');

    expect(isTagActive(tag, { workplace: 'remote' })).toBe(true);
    expect(isTagActive(tag, { workplace: 'hybrid' })).toBe(false);
    expect(isTagActive(tag, {})).toBe(false);
  });

  it('lists the applied filters as tags and ignores the posted range', () => {
    const tags = activeTags({
      workplace: 'remote',
      min_salary: 1000,
      posted_from: '2026-09-01T00:00:00.000Z',
    });

    expect(tags.map((tag) => tag.field)).toEqual(['workplace', 'salary']);
  });
});
