import type { ReactElement, ReactNode } from 'react';

interface DetailSectionProps {
  title: string;
  children: ReactNode;
}

/** Titled block inside the vacancy details (ui 3.4). */
export const DetailSection = ({ title, children }: DetailSectionProps): ReactElement => (
  <section className="mt-6 border-t border-line pt-5">
    <h3 className="mb-3 text-base font-semibold text-ink">{title}</h3>
    {children}
  </section>
);
