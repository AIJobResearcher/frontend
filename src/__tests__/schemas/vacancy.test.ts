import { describe, it, expect } from 'vitest';
import { FilterParamsSchema, VacancyPreviewSchema } from '@/schemas/vacancy';

describe('Vacancy Schemas', () => {
  describe('FilterParamsSchema', () => {
    it('should validate correct filter params', () => {
      const data = {
        title: 'React Developer',
        status: 'open',
        sort: 'date',
      };
      const result = FilterParamsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid status', () => {
      const data = {
        status: 'invalid',
      };
      const result = FilterParamsSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('VacancyPreviewSchema', () => {
    it('should validate correct vacancy preview', () => {
      const data = {
        id: '1',
        title: 'React Developer',
        company: 'Tech Corp',
        country: 'Ukraine',
        city: 'Kyiv',
        employment_type: 'Full-time',
        posted_at: new Date().toISOString(),
        status: 'open',
      };
      const result = VacancyPreviewSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should require mandatory fields', () => {
      const data = {
        id: '1',
      };
      const result = VacancyPreviewSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
