/** A desired job joined with the Vacancies Market `Job.title` for the bar. */
export interface DesiredJobView {
  id: string;
  jobId: string;
  title: string;
}

/**
 * ResearcherCrm exposes `POST /jobs` but no list operation yet, so the bar is
 * fed from this placeholder until the contract is published (migration plan
 * 1.11). Replace the body with a `GET` call once the operation exists.
 */
const DESIRED_JOBS_PLACEHOLDER: DesiredJobView[] = [
  { id: 'placeholder-frontend', jobId: 'placeholder-frontend', title: 'Frontend Developer' },
  { id: 'placeholder-react', jobId: 'placeholder-react', title: 'React Engineer' },
];

/** Desired jobs of the current Researcher (placeholder, see above). */
export const getDesiredJobs = async (): Promise<DesiredJobView[]> => DESIRED_JOBS_PLACEHOLDER;
