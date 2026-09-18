import 'server-only';

import { getRequestConfig } from 'next-intl/server';

/**
 * English-only setup for now: the UI ships string keys so further locales can
 * be added later (ADR-019 Localisation).
 */
export default getRequestConfig(async () => ({
  locale: 'en',
  messages: (await import('../../../messages/en.json')).default,
}));
