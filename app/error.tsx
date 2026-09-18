'use client';

import { useTranslations } from 'next-intl';
import type { ReactElement } from 'react';
import { ErrorFallback } from '@/shared/ui';

interface RouteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Route-level error boundary with retry (rule 6.2). */
const RouteError = ({ error, reset }: RouteErrorProps): ReactElement => {
  const t = useTranslations('Errors');

  return (
    <main className="shell py-16">
      <ErrorFallback title={t('pageTitle')} message={error.message} onRetry={reset} />
    </main>
  );
};

export default RouteError;
