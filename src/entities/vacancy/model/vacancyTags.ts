import type {
  EmploymentType,
  VacancyFilters,
  VacancyPreview,
  Workplace,
} from '@/entities/vacancy/api/vacancies';

export type VacancyTagField = 'workplace' | 'employment_type' | 'country' | 'city' | 'salary';

export interface VacancyTag {
  /** Stable key, for example `workplace:remote`. */
  key: string;
  field: VacancyTagField;
  /** Value shown on the chip; `null` when the UI formats it (salary). */
  label: string | null;
  /** Criteria the tag contributes to `POST /vacancies`. */
  patch: VacancyFilters;
}

export const workplaceTag = (value: Workplace): VacancyTag => ({
  key: `workplace:${value}`,
  field: 'workplace',
  label: value,
  patch: { workplace: value },
});

export const employmentTypeTag = (value: EmploymentType): VacancyTag => ({
  key: `employment_type:${value}`,
  field: 'employment_type',
  label: value,
  patch: { employment_type: value },
});

export const countryTag = (value: string): VacancyTag => ({
  key: `country:${value}`,
  field: 'country',
  label: value,
  patch: { country: value },
});

export const cityTag = (value: string): VacancyTag => ({
  key: `city:${value}`,
  field: 'city',
  label: value,
  patch: { city: value },
});

/** A salary tag carries both bounds; the UI renders its label itself. */
export const salaryTag = (
  min: number | null | undefined,
  max: number | null | undefined
): VacancyTag | null => {
  const hasMin = min !== null && min !== undefined;
  const hasMax = max !== null && max !== undefined;

  if (!hasMin && !hasMax) return null;

  const patch: VacancyFilters = {};
  if (hasMin) patch.min_salary = min;
  if (hasMax) patch.max_salary = max;

  return { key: `salary:${min ?? ''}:${max ?? ''}`, field: 'salary', label: null, patch };
};

/** Tags offered by one card or details block (ui 3.2). */
export const vacancyTags = (vacancy: VacancyPreview): VacancyTag[] => {
  const tags: VacancyTag[] = [];

  if (vacancy.workplace) tags.push(workplaceTag(vacancy.workplace));
  if (vacancy.employment_type) tags.push(employmentTypeTag(vacancy.employment_type));
  if (vacancy.country) tags.push(countryTag(vacancy.country));
  if (vacancy.city) tags.push(cityTag(vacancy.city));

  const salary = salaryTag(vacancy.min_salary, vacancy.max_salary);
  if (salary) tags.push(salary);

  return tags;
};

/** Whether the criteria of a tag are already part of the active filters. */
export const isTagActive = (tag: VacancyTag, filters: VacancyFilters): boolean =>
  (Object.keys(tag.patch) as (keyof VacancyFilters)[]).every(
    (key) => filters[key] === tag.patch[key]
  );

/**
 * Filters currently applied, as removable chips (ui 6.4). The posted range is
 * not a tag and is rendered by the date inputs instead.
 */
export const activeTags = (filters: VacancyFilters): VacancyTag[] => {
  const tags: VacancyTag[] = [];

  if (filters.workplace) tags.push(workplaceTag(filters.workplace));
  if (filters.employment_type) tags.push(employmentTypeTag(filters.employment_type));
  if (filters.country) tags.push(countryTag(filters.country));
  if (filters.city) tags.push(cityTag(filters.city));

  const salary = salaryTag(filters.min_salary, filters.max_salary);
  if (salary) tags.push(salary);

  return tags;
};
