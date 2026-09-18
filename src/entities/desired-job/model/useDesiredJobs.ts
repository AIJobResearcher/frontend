import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { getDesiredJobs } from '@/entities/desired-job/api/desired-jobs';
import type { DesiredJobView } from '@/entities/desired-job/api/desired-jobs';

export const desiredJobKeys = {
  all: ['desired-jobs'] as const,
};

/** Desired jobs of the current Researcher (ui 2.6, 7.6). */
export const useDesiredJobs = (): UseQueryResult<DesiredJobView[], Error> =>
  useQuery({
    queryKey: desiredJobKeys.all,
    queryFn: getDesiredJobs,
  });
