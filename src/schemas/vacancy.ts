import { z } from 'zod';

/**
 * Zod validation schemas
 */

export const FilterParamsSchema = z.object({
  job_id: z.string().optional(),
  employer_id: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  min_salary: z.number().int().optional(),
  max_salary: z.number().int().optional(),
  status: z.enum(['open', 'closed']).optional(),
  sort: z.enum(['date', 'salary_asc', 'salary_desc']).optional(),
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(100).optional(),
});

export const VacancyPreviewSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  company_logo: z.string().optional(),
  country: z.string(),
  city: z.string(),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  employment_type: z.string(),
  posted_at: z.string(),
  status: z.enum(['open', 'closed']),
});

export const VacancyDetailSchema = VacancyPreviewSchema.extend({
  description: z.string(),
  requirements: z.array(z.string()),
  workplace_type: z.string(),
  company_description: z.string(),
  company_website: z.string().optional(),
  company_phone: z.string().optional(),
  company_email: z.string().optional(),
});

export type FilterParams = z.infer<typeof FilterParamsSchema>;
export type VacancyPreview = z.infer<typeof VacancyPreviewSchema>;
export type VacancyDetail = z.infer<typeof VacancyDetailSchema>;
