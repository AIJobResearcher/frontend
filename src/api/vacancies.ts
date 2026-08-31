import { apiClient } from './client';
import { VacanciesListResponse, VacancyDetailResponse, FilterParams } from '@/types/vacancy';

/**
 * Fetch list of vacancies with pagination and filtering
 */
export const getVacancies = async (params: FilterParams): Promise<VacanciesListResponse> => {
  const queryParams: Record<string, any> = {
    page: params.page,
    per_page: params.per_page,
  };

  if (params.title) queryParams.title = params.title;
  if (params.employer_id) queryParams.employer_id = params.employer_id;
  if (params.country) queryParams.country = params.country;
  if (params.city) queryParams.city = params.city;
  if (params.salary_min !== undefined) queryParams.salary_min = params.salary_min;
  if (params.salary_max !== undefined) queryParams.salary_max = params.salary_max;
  if (params.status) queryParams.status = params.status;
  if (params.sort) queryParams.sort = params.sort;

  const response = await apiClient.get<VacanciesListResponse>('/vacancies', {
    params: queryParams,
  });

  return response.data;
};

/**
 * Fetch detailed information about a specific vacancy
 */
export const getVacancyById = async (id: string): Promise<Vacancy> => {
  const response = await apiClient.get<VacancyDetailResponse>(`/vacancies/${id}`);
  return response.data.data;
};

// Re-export Vacancy type for convenience
export { Vacancy } from '@/types/vacancy';
