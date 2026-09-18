'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { DesiredJobsBar } from '@/entities/desired-job/ui';
import { VacancyDetail, VacancyList } from '@/entities/vacancy/ui';
import { useVacanciesMarketPage } from '@/features/vacancies-market/model/useVacanciesMarketPage';
import { VacancyFilterBar } from '@/features/vacancies-market/ui/VacancyFilterBar';
import { ErrorFallback, Panel, Spinner } from '@/shared/ui';

/** Vacancies Market page: desired jobs, filters, list and details (ui 2). */
export const VacanciesMarketPage = (): ReactElement => {
  const t = useTranslations('Vacancies');
  const tHeader = useTranslations('Header');
  const tDesired = useTranslations('DesiredJobs');
  const market = useVacanciesMarketPage();
  const [openJobId, setOpenJobId] = useState<string | null>(null);
  const listPanelRef = useRef<HTMLDivElement>(null);

  // Mobile-only flag, reset whenever the desired job changes (rule 3.1).
  const isDetailOpen = openJobId !== null && openJobId === market.activeJobId;
  const activeJobTitle =
    market.desiredJobs.find((job) => job.jobId === market.activeJobId)?.title ?? null;

  // Any filter change reloads from page 1 and returns to the top (ui 6.4).
  const runFilterChange = (apply: () => void): void => {
    apply();
    listPanelRef.current?.scrollIntoView({ block: 'start' });
  };

  const handleSelectVacancy = (id: string): void => {
    market.selectVacancy(id);
    setOpenJobId(market.activeJobId);
  };

  if (market.isDesiredJobsLoading) {
    return (
      <main className="shell py-12">
        <Spinner label={tDesired('loading')} />
      </main>
    );
  }

  if (market.desiredJobsError) {
    // The page is blocked when the desired-jobs bar fails (ui 7.6).
    return (
      <main className="shell py-6">
        <Panel className="p-6">
          <ErrorFallback
            title={tDesired('errorTitle')}
            message={market.desiredJobsError.message}
            onRetry={market.retryDesiredJobs}
          />
        </Panel>
      </main>
    );
  }

  return (
    <main className="shell py-5">
      <DesiredJobsBar
        jobs={market.desiredJobs}
        activeJobId={market.activeJobId}
        onSelectJob={market.selectJob}
      />

      <nav aria-label={t('breadcrumbsLabel')} className="mb-3 text-[13px] text-ink-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/vacancies-market">{tHeader('vacanciesMarket')}</Link>
          </li>
          {market.vacancy?.title ? (
            <>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-ink">
                {market.vacancy.title}
              </li>
            </>
          ) : null}
        </ol>
      </nav>

      <VacancyFilterBar
        appliedFilters={market.appliedFilters}
        filters={market.filters}
        onToggleTag={(tag) => runFilterChange(() => market.toggleTag(tag))}
        onPostedRangeChange={(from, to) => runFilterChange(() => market.setPostedRange(from, to))}
        onClearAll={() => runFilterChange(market.clearFilters)}
      />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div ref={listPanelRef} className={isDetailOpen ? 'hidden lg:block' : ''}>
          <Panel>
            <header className="border-b border-line px-4 py-4">
              <h1 className="text-base font-semibold text-ink">
                {t('title', { count: market.total })}
              </h1>
              {activeJobTitle ? (
                <p className="mt-0.5 text-[13px] text-ink-muted">
                  {t('basedOnJob', { title: activeJobTitle })}
                </p>
              ) : null}
            </header>
            <VacancyList
              vacancies={market.vacancies}
              isLoading={market.isListLoading}
              isLoadingMore={market.isLoadingMore}
              error={market.listError}
              hasMore={market.hasMore}
              selectedId={market.selectedId}
              filters={market.filters}
              hasFilters={market.hasFilters}
              onSelect={handleSelectVacancy}
              onTagClick={(tag) => runFilterChange(() => market.toggleTag(tag))}
              onClearFilters={() => runFilterChange(market.clearFilters)}
              onLoadMore={market.loadMore}
              onRetry={market.retryList}
            />
          </Panel>
        </div>
        <div className={isDetailOpen ? 'block' : 'hidden lg:block'}>
          <button
            type="button"
            onClick={() => setOpenJobId(null)}
            className="mb-3 text-sm font-semibold text-brand lg:hidden"
          >
            ← {t('backToList')}
          </button>
          <VacancyDetail
            vacancy={market.vacancy}
            isLoading={market.isDetailLoading}
            error={market.detailError}
            filters={market.filters}
            onRetry={market.retryDetail}
            onTagClick={(tag) => runFilterChange(() => market.toggleTag(tag))}
            onRefreshList={market.retryList}
          />
        </div>
      </div>
    </main>
  );
};
