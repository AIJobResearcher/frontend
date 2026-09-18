'use client';

import { useTranslations } from 'next-intl';
import type { ReactElement, ReactNode } from 'react';
import { ApiError } from '@/shared/api/errors';
import type { Vacancy, VacancyFilters } from '@/entities/vacancy/api/vacancies';
import { usePostedAt } from '@/entities/vacancy/model/usePostedAt';
import { useSalaryText } from '@/entities/vacancy/model/useSalaryText';
import { isTagActive, vacancyTags } from '@/entities/vacancy/model/vacancyTags';
import type { VacancyTag, VacancyTagField } from '@/entities/vacancy/model/vacancyTags';
import { Chip, CompanyLogo, ErrorFallback } from '@/shared/ui';
import { safeEmailHref, safeExternalUrl, safePhoneHref } from '@/shared/lib/url';
import { DetailSection } from './DetailSection';

interface VacancyDetailProps {
  vacancy: Vacancy | null;
  isLoading: boolean;
  error: Error | null;
  filters: VacancyFilters;
  onRetry: () => void;
  onTagClick: (tag: VacancyTag) => void;
  onRefreshList?: () => void;
}

/** Details block: vacancy, employer and interviewer (ui 3.5-3.7). */
export const VacancyDetail = ({
  vacancy,
  isLoading,
  error,
  filters,
  onRetry,
  onTagClick,
  onRefreshList,
}: VacancyDetailProps): ReactElement => {
  const t = useTranslations('Vacancies.detail');
  const salary = useSalaryText(vacancy?.min_salary, vacancy?.max_salary);
  const postedAt = usePostedAt(vacancy?.posted_at);

  if (isLoading) {
    return (
      <div className="rounded-card bg-surface p-6 shadow-panel" aria-busy="true">
        <div className="flex gap-4">
          <div className="h-16 w-16 shrink-0 animate-pulse rounded-field bg-line" />
          <div className="flex-1">
            <div className="h-6 w-2/3 animate-pulse rounded-field bg-line" />
            <div className="mt-3 h-4 w-1/2 animate-pulse rounded-field bg-line" />
          </div>
        </div>
        <div className="mt-6 h-24 w-full animate-pulse rounded-card bg-line" />
        <span className="sr-only">{t('loading')}</span>
      </div>
    );
  }

  if (error) {
    const isNotFound = error instanceof ApiError && error.kind === 'not_found';

    // A vanished vacancy offers a list refresh instead of a detail retry
    // (ui 7.1).
    if (isNotFound && onRefreshList) {
      return (
        <div className="rounded-card bg-surface p-6 shadow-panel">
          <ErrorFallback
            title={t('notFoundTitle')}
            message={error.message}
            onRetry={onRefreshList}
            retryLabel={t('refreshList')}
          />
        </div>
      );
    }

    return (
      <div className="rounded-card bg-surface p-6 shadow-panel">
        <ErrorFallback
          title={isNotFound ? t('notFoundTitle') : t('errorTitle')}
          message={error.message}
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (!vacancy) {
    return (
      <div className="rounded-card bg-surface p-6 text-center text-ink-muted shadow-panel">
        {t('empty')}
      </div>
    );
  }

  const location = [vacancy.city, vacancy.country]
    .filter((part): part is string => Boolean(part))
    .join(', ');
  const tags = vacancyTags(vacancy);
  const tagFor = (field: VacancyTagField): VacancyTag | undefined =>
    tags.find((tag) => tag.field === field);

  /** Renders a clickable tag, or the plain value when the field is not filterable. */
  const renderTag = (tag: VacancyTag | undefined, fallback: ReactNode): ReactElement => {
    if (!tag) return <>{fallback}</>;

    return (
      <Chip variant="outline" isActive={isTagActive(tag, filters)} onClick={() => onTagClick(tag)}>
        {tag.label ?? salary}
      </Chip>
    );
  };

  const employer = vacancy.employer;
  const website = safeExternalUrl(employer?.website);
  const email = safeEmailHref(employer?.email);
  const phone = safePhoneHref(employer?.phone);
  const profiles = Object.entries(vacancy.interviewer?.profile_urls ?? {}).flatMap(
    ([label, url]) => {
      const href = safeExternalUrl(url);
      return href ? [{ label, href }] : [];
    }
  );

  return (
    <article className="rounded-card bg-surface p-6 shadow-panel">
      <header className="flex gap-4">
        <CompanyLogo name={employer?.title ?? vacancy.employer_title} size="lg" />
        <div className="min-w-0">
          <h2 className="text-[22px] leading-tight font-semibold text-ink">{vacancy.title}</h2>
          <p className="mt-1 text-[15px] text-ink">{vacancy.employer_title}</p>
          {location || postedAt ? (
            <p className="mt-1 flex flex-wrap items-center gap-2 text-[13.5px] text-ink-muted">
              {location ? <span>{location}</span> : null}
              {location && postedAt ? (
                <span aria-hidden="true" className="h-[3px] w-[3px] rounded-full bg-ink-faint" />
              ) : null}
              {postedAt ? <span>{postedAt}</span> : null}
            </p>
          ) : null}
        </div>
      </header>

      <dl className="mt-5 grid grid-cols-[130px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 text-sm">
        {location ? (
          <>
            <dt className="text-ink-muted">{t('location')}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {vacancy.city ? renderTag(tagFor('city'), vacancy.city) : null}
              {vacancy.country ? renderTag(tagFor('country'), vacancy.country) : null}
            </dd>
          </>
        ) : null}
        <dt className="text-ink-muted">{t('salary')}</dt>
        <dd className="flex flex-wrap gap-1.5">{renderTag(tagFor('salary'), salary)}</dd>
        {vacancy.employment_type ? (
          <>
            <dt className="text-ink-muted">{t('employmentType')}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {renderTag(tagFor('employment_type'), vacancy.employment_type)}
            </dd>
          </>
        ) : null}
        {vacancy.workplace ? (
          <>
            <dt className="text-ink-muted">{t('workplace')}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {renderTag(tagFor('workplace'), vacancy.workplace)}
            </dd>
          </>
        ) : null}
      </dl>

      {vacancy.description ? (
        <DetailSection title={t('description')}>
          <p className="text-sm whitespace-pre-line text-ink">{vacancy.description}</p>
        </DetailSection>
      ) : null}

      {vacancy.requirements.length > 0 ? (
        <DetailSection title={t('requirements')}>
          <ul className="flex flex-wrap gap-2">
            {vacancy.requirements.map((requirement) => (
              <li
                key={requirement}
                className="rounded-full border border-line-strong px-3 py-1.5 text-[13.5px] text-ink"
              >
                {requirement}
              </li>
            ))}
          </ul>
        </DetailSection>
      ) : null}

      {employer ? (
        <DetailSection title={t('employer')}>
          <div className="flex items-center gap-3 rounded-card border border-line p-3.5">
            <CompanyLogo name={employer.title} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{employer.title}</p>
              {employer.description ? (
                <p className="mt-1 text-sm whitespace-pre-line text-ink-muted">
                  {employer.description}
                </p>
              ) : null}
              <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[13px]">
                {website ? (
                  <li>
                    <a href={website} rel="noreferrer noopener" target="_blank">
                      <span className="sr-only">{t('website')}: </span>
                      {employer.website}
                    </a>
                  </li>
                ) : null}
                {email ? (
                  <li>
                    <a href={email}>
                      <span className="sr-only">{t('email')}: </span>
                      {employer.email}
                    </a>
                  </li>
                ) : null}
                {phone ? (
                  <li>
                    <a href={phone}>
                      <span className="sr-only">{t('phone')}: </span>
                      {employer.phone}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </DetailSection>
      ) : null}

      {vacancy.interviewer ? (
        <DetailSection title={t('interviewer')}>
          <div className="flex items-center gap-3 rounded-card border border-line p-3.5">
            <CompanyLogo name={vacancy.interviewer.full_name} size="sm" shape="circle" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{vacancy.interviewer.full_name}</p>
              {vacancy.interviewer.position ? (
                <p className="mt-0.5 text-[13px] text-ink-muted">{vacancy.interviewer.position}</p>
              ) : null}
              {profiles.length > 0 ? (
                <ul className="mt-1 flex flex-wrap gap-x-3 text-[13px]">
                  {profiles.map((profile) => (
                    <li key={profile.label}>
                      <a href={profile.href} rel="noreferrer noopener" target="_blank">
                        {profile.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </DetailSection>
      ) : null}
    </article>
  );
};
