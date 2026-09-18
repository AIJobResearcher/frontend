/**
 * Correlation-ID sent on every backend call
 * (docs/ui/vacancies-market.md 4.3, docs/technical-requirements.md 4).
 */
export const createCorrelationId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `cid-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};
