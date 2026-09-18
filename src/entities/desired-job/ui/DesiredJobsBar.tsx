'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { ReactElement } from 'react';
import type { DesiredJobView } from '@/entities/desired-job/api/desired-jobs';
import { Chip } from '@/shared/ui';

interface DesiredJobsBarProps {
  jobs: DesiredJobView[];
  activeJobId: string | null;
  onSelectJob: (jobId: string) => void;
}

/** Desired-jobs bar (ui 2.6); the page blocks when it fails (ui 7.6). */
export const DesiredJobsBar = ({
  jobs,
  activeJobId,
  onSelectJob,
}: DesiredJobsBarProps): ReactElement | null => {
  const t = useTranslations('DesiredJobs');

  if (jobs.length === 0) return null;

  return (
    <nav aria-label={t('barLabel')} className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-semibold tracking-wide text-ink-faint uppercase">
        {t('barLabel')}
      </span>
      <ul className="flex flex-wrap gap-2">
        {jobs.map((job) => {
          const isActive = job.jobId === activeJobId;

          return (
            <li key={job.jobId}>
              <Chip
                isActive={isActive}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => onSelectJob(job.jobId)}
              >
                {job.title}
              </Chip>
            </li>
          );
        })}
      </ul>
      <Link
        href="/jobs/new"
        className="ml-1 text-[13.5px] font-semibold no-underline hover:underline"
      >
        {t('addJob')}
      </Link>
    </nav>
  );
};
