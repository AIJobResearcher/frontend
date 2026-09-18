/**
 * Build-time configuration. Next.js inlines `NEXT_PUBLIC_*` variables into the
 * client bundle; the dev fallback matches the documented compose setup until
 * the real URLs are provided (migration plan 10.7).
 */
const DEFAULT_API_URL = 'http://localhost:8001/api/v1';

/** An unset or empty variable falls back to the documented default. */
const readUrl = (value: string | undefined, fallback: string): string =>
  value && value.trim() !== '' ? value : fallback;

/** Vacancies Market base URL (`docs/api/vacancies-market/openapi.yaml`). */
export const VACANCIES_MARKET_API_URL = readUrl(
  process.env.NEXT_PUBLIC_VACANCIES_MARKET_API_URL,
  DEFAULT_API_URL
);

/** ResearcherCrm base URL; the desired-jobs bar calls `GET /jobs` there. */
export const RESEARCHER_CRM_API_URL = readUrl(
  process.env.NEXT_PUBLIC_RESEARCHER_CRM_API_URL,
  DEFAULT_API_URL
);
