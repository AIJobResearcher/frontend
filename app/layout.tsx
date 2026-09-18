import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import type { ReactElement, ReactNode } from 'react';
import { Providers } from './providers';
import './globals.css';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('Metadata');

  return {
    title: {
      default: t('title'),
      template: `%s | ${t('title')}`,
    },
    description: t('description'),
  };
};

const RootLayout = async ({ children }: { children: ReactNode }): Promise<ReactElement> => {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
