'use client';

import { useTranslations } from 'next-intl';
import type { ReactElement } from 'react';
import { Button } from './Button';

interface ErrorFallbackProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

/** User-facing error state with an optional retry action (ui 6.5). */
export const ErrorFallback = ({
  title,
  message,
  onRetry,
  retryLabel,
}: ErrorFallbackProps): ReactElement => {
  const t = useTranslations('Errors');

  return (
    <div role="alert" className="py-8 text-center">
      <p className="mb-1 text-lg font-semibold text-ink">{title ?? t('fallbackTitle')}</p>
      <p className="mb-4 text-ink-muted">{message}</p>
      {onRetry ? <Button onClick={onRetry}>{retryLabel ?? t('retry')}</Button> : null}
    </div>
  );
};
