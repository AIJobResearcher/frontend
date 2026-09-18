import createClient from 'openapi-fetch';
import type { Client } from 'openapi-fetch';
import { VACANCIES_MARKET_API_URL } from '@/shared/config/env';
import { createCorrelationId } from './correlation-id';
import type { paths as VacanciesMarketPaths } from './generated/vacancies-market';

/** Creates a typed client that stamps every request with a Correlation-ID. */
const createServiceClient = <Paths extends object>(baseUrl: string): Client<Paths> => {
  const client = createClient<Paths>({
    baseUrl,
    // Resolved on every call so the network layer stays stubbable (rule 8.4).
    fetch: (request) => globalThis.fetch(request),
  });

  client.use({
    onRequest({ request }) {
      request.headers.set('Correlation-ID', createCorrelationId());
      return request;
    },
  });

  return client;
};

/** Vacancies Market client; called directly, no BFF (ADR-019). */
export const vacanciesMarketClient =
  createServiceClient<VacanciesMarketPaths>(VACANCIES_MARKET_API_URL);
