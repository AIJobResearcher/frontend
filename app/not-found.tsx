import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { ReactElement } from 'react';

const NotFound = async (): Promise<ReactElement> => {
  const t = await getTranslations('Errors');

  return (
    <main className="shell py-16 text-center">
      <h1 className="text-2xl font-semibold text-ink">{t('notFoundTitle')}</h1>
      <Link href="/vacancies-market" className="mt-4 inline-block text-brand">
        {t('backToVacancies')}
      </Link>
    </main>
  );
};

export default NotFound;
