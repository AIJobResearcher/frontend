import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactElement, ReactNode } from 'react';
import messages from '../../../messages/en.json';

const TestProviders = ({ children }: { children: ReactNode }): ReactElement => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NextIntlClientProvider>
  );
};

/** Renders a component with the query client and intl provider it expects. */
export const renderWithProviders = (ui: ReactElement): RenderResult =>
  render(ui, { wrapper: TestProviders });
