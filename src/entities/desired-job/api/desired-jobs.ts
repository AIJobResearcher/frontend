import { createServiceClient } from '@/shared/api/clients';
import { unwrap } from '@/shared/api/request';
import { RESEARCHER_CRM_API_URL } from '@/shared/config/env';

/** A desired job resolved to the catalogue title shown in the bar (ui 3.1). */
export interface DesiredJobView {
  jobId: string;
  title: string;
}

/** What `GET /jobs` returns per entry: `Job.id` and `Job.title`. */
interface DesiredJobDto {
  id: string;
  title: string;
}

/**
 * `GET /jobs` of ResearcherCrm is not published in
 * `docs/api/researcher-crm/openapi.yaml` yet. This local path type mirrors the
 * agreed response (`Job.id` + `Job.title`) and must be dropped in favour of the
 * generated type as soon as the operation is documented.
 */
interface DesiredJobsPaths {
  '/jobs': {
    parameters: { query?: never; header?: never; path?: never; cookie?: never };
    get: {
      parameters: { query?: never; header?: never; path?: never; cookie?: never };
      requestBody?: never;
      responses: {
        200: {
          headers: { [name: string]: unknown };
          content: { 'application/json': DesiredJobDto[] };
        };
      };
    };
  };
}

const researcherCrmClient = createServiceClient<DesiredJobsPaths>(RESEARCHER_CRM_API_URL);

/** Desired jobs of the current Researcher, in bar order. */
export const getDesiredJobs = async (): Promise<DesiredJobView[]> => {
  const result = await researcherCrmClient.GET('/jobs');
  const jobs = unwrap(result);

  return jobs.map((job) => ({ jobId: job.id, title: job.title }));
};
