import type { ReactElement } from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label: string;
}

const SIZE_CLASSES = {
  sm: 'h-6 w-6',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
} as const;

/** Loading indicator with an accessible, motion-safe status role. */
export const Spinner = ({ size = 'md', label }: SpinnerProps): ReactElement => (
  <output className="flex flex-col items-center justify-center">
    <svg
      className={`${SIZE_CLASSES[size]} animate-spin text-brand motion-reduce:animate-none`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <p className="mt-4 text-sm text-ink-muted">{label}</p>
  </output>
);
