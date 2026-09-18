import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { ReactElement } from 'react';
import { VacanciesMarketPage } from '@/features/vacancies-market';
import { Header } from '../_components/Header';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('Header');

  return { title: t('vacanciesMarket') };
};

const VacanciesMarketRoute = async (): Promise<ReactElement> => (
  <>
    <Header />
    <VacanciesMarketPage />
  </>
);

export default VacanciesMarketRoute;
