import { getTranslations } from 'next-intl/server';
import type { ReactElement } from 'react';
import { Spinner } from '@/shared/ui';

const Loading = async (): Promise<ReactElement> => {
  const t = await getTranslations('Vacancies');

  return (
    <div className="shell py-12">
      <Spinner label={t('loading')} />
    </div>
  );
};

export default Loading;
