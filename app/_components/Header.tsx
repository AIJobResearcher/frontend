import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { ReactElement } from 'react';

/** Application header; server-rendered, the desired-jobs bar belongs to the page. */
export const Header = async (): Promise<ReactElement> => {
  const t = await getTranslations('Header');

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface">
      <div className="shell flex h-[52px] items-center gap-2">
        <Link
          href="/"
          aria-label={t('home')}
          className="flex flex-none items-center gap-2 no-underline"
        >
          <span
            aria-hidden="true"
            className="grid h-[34px] w-[34px] place-items-center rounded-field bg-brand text-lg font-bold text-white"
          >
            AI
          </span>
          <span className="hidden text-[15px] font-bold text-ink sm:block">AIJobResearcher</span>
        </Link>
        <nav aria-label={t('navLabel')} className="ml-auto">
          <ul className="flex h-[52px]">
            <li>
              <Link
                href="/vacancies-market"
                aria-current="page"
                className="relative flex h-[52px] min-w-[76px] flex-col items-center justify-center gap-0.5 px-2 text-ink no-underline hover:no-underline"
              >
                <svg
                  className="h-[22px] w-[22px]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17 6V5a3 3 0 00-3-3h-4a3 3 0 00-3 3v1H2v4a3 3 0 003 3h14a3 3 0 003-3V6zM9 5a1 1 0 011-1h4a1 1 0 011 1v1H9zm13 8.6A5 5 0 0119 14H5a5 5 0 01-3-.4V17a3 3 0 003 3h14a3 3 0 003-3z" />
                </svg>
                <span className="text-xs">{t('vacanciesMarket')}</span>
                <span aria-hidden="true" className="absolute inset-x-1.5 bottom-0 h-0.5 bg-ink" />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
