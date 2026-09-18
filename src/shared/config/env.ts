/**
 * Build-time configuration. Next.js inlines `NEXT_PUBLIC_*` variables into the
 * client bundle; the dev fallback matches the documented compose setup until
 * the real URL is provided (migration plan 10.7).
 */
const DEFAULT_API_URL = 'http://localhost:8001/api/v1';

/** Vacancies Market base URL (`docs/api/vacancies-market/openapi.yaml`). */
export const VACANCIES_MARKET_API_URL =
  process.env.NEXT_PUBLIC_VACANCIES_MARKET_API_URL ?? DEFAULT_API_URL;
