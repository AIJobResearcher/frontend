'use client';

import { useMemo, useState } from 'react';
import type { DesiredJobView } from '@/entities/desired-job/api/desired-jobs';
import { useDesiredJobs } from '@/entities/desired-job/model/useDesiredJobs';
import type { Vacancy, VacancyFilters, VacancyPreview } from '@/entities/vacancy/api/vacancies';
import { useVacancyDetail } from '@/entities/vacancy/model/useVacancyDetail';
import { useVacancyList } from '@/entities/vacancy/model/useVacancyList';
import { activeTags, isTagActive } from '@/entities/vacancy/model/vacancyTags';
import type { VacancyTag } from '@/entities/vacancy/model/vacancyTags';

export interface VacanciesMarketViewModel {
  desiredJobs: DesiredJobView[];
  isDesiredJobsLoading: boolean;
  desiredJobsError: Error | null;
  activeJobId: string | null;
  selectJob: (jobId: string) => void;
  retryDesiredJobs: () => void;
  vacancies: VacancyPreview[];
  total: number;
  isListLoading: boolean;
  isLoadingMore: boolean;
  listError: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  retryList: () => void;
  selectedId: string | null;
  selectVacancy: (id: string) => void;
  vacancy: Vacancy | null;
  isDetailLoading: boolean;
  detailError: Error | null;
  retryDetail: () => void;
  filters: VacancyFilters;
  appliedFilters: VacancyTag[];
  hasFilters: boolean;
  toggleTag: (tag: VacancyTag) => void;
  setPostedRange: (postedFrom: string, postedTo: string) => void;
  clearFilters: () => void;
}

/** `yyyy-MM-dd` from a date input to the contract's `date-time`. */
const toIsoStart = (date: string): string => `${date}T00:00:00.000Z`;
const toIsoEnd = (date: string): string => `${date}T23:59:59.999Z`;

/**
 * View model of the Vacancies Market page: it owns the desired-jobs context,
 * the filters, the list query, the selection and the detail query
 * (rules 2.3, 3.1-3.2).
 */
export const useVacanciesMarketPage = (): VacanciesMarketViewModel => {
  const desiredJobsQuery = useDesiredJobs();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const activeJobId = selectedJobId ?? desiredJobsQuery.data?.at(0)?.jobId ?? null;

  const [filterState, setFilterState] = useState<{ jobId: string | null; filters: VacancyFilters }>(
    { jobId: null, filters: {} }
  );

  // Filters reset when the desired job changes: derived, not stored (3.1).
  const filters = filterState.jobId === activeJobId ? filterState.filters : {};
  const setFilters = (next: VacancyFilters): void =>
    setFilterState({ jobId: activeJobId, filters: next });

  const listQuery = useVacancyList(activeJobId ?? undefined, filters);
  const vacancies = useMemo(
    () => listQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [listQuery.data]
  );

  const [selection, setSelection] = useState<{ jobId: string | null; vacancyId: string | null }>({
    jobId: null,
    vacancyId: null,
  });

  // Selection resets when the desired job changes: derived, not stored (3.1).
  const selectedId = selection.jobId === activeJobId ? selection.vacancyId : null;
  const activeId = selectedId ?? vacancies.at(0)?.id ?? null;

  const detailQuery = useVacancyDetail(activeId ?? undefined);

  const toggleTag = (tag: VacancyTag): void => {
    const next: VacancyFilters = { ...filters };
    const keys = Object.keys(tag.patch) as (keyof VacancyFilters)[];

    if (isTagActive(tag, filters)) {
      for (const key of keys) delete next[key];
    } else {
      Object.assign(next, tag.patch);
    }

    setFilters(next);
  };

  const setPostedRange = (postedFrom: string, postedTo: string): void => {
    const next: VacancyFilters = { ...filters };

    if (postedFrom) next.posted_from = toIsoStart(postedFrom);
    else delete next.posted_from;

    if (postedTo) next.posted_to = toIsoEnd(postedTo);
    else delete next.posted_to;

    setFilters(next);
  };

  const appliedFilters = activeTags(filters);

  return {
    desiredJobs: desiredJobsQuery.data ?? [],
    isDesiredJobsLoading: desiredJobsQuery.isLoading,
    desiredJobsError: desiredJobsQuery.error,
    activeJobId,
    selectJob: (jobId: string) => setSelectedJobId(jobId),
    retryDesiredJobs: () => void desiredJobsQuery.refetch(),
    vacancies,
    total: listQuery.data?.pages[0]?.meta.total ?? 0,
    isListLoading: listQuery.isLoading,
    isLoadingMore: listQuery.isFetchingNextPage,
    listError: listQuery.error,
    hasMore: Boolean(listQuery.hasNextPage),
    loadMore: () => void listQuery.fetchNextPage(),
    retryList: () => void listQuery.refetch(),
    selectedId: activeId,
    selectVacancy: (id: string) => setSelection({ jobId: activeJobId, vacancyId: id }),
    vacancy: detailQuery.data ?? null,
    isDetailLoading: detailQuery.isLoading,
    detailError: detailQuery.error,
    retryDetail: () => void detailQuery.refetch(),
    filters,
    appliedFilters,
    hasFilters: appliedFilters.length > 0 || Boolean(filters.posted_from || filters.posted_to),
    toggleTag,
    setPostedRange,
    clearFilters: () => setFilters({}),
  };
};
