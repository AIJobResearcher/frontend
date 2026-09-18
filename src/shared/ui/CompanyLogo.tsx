import type { ReactElement } from 'react';

type LogoSize = 'sm' | 'md' | 'lg';
type LogoShape = 'square' | 'circle';

interface CompanyLogoProps {
  /** Employer title or person name; its initials stand in for a missing image (ui 7.3). */
  name?: string | null;
  size?: LogoSize;
  shape?: LogoShape;
  className?: string;
}

const SIZE_CLASSES: Record<LogoSize, string> = {
  sm: 'h-12 w-12 text-base',
  md: 'h-14 w-14 text-lg',
  lg: 'h-16 w-16 text-xl',
};

const SHAPE_CLASSES: Record<LogoShape, string> = {
  square: 'rounded-field',
  circle: 'rounded-full',
};

/** Deterministic placeholder tones, so one employer keeps one colour. */
const TONES = ['#0a66c2', '#057642', '#b24020', '#5f3dc4', '#915907', '#3d3d3d'] as const;

const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');

const toneOf = (name: string): string => {
  let hash = 0;

  for (const char of name) {
    hash = (hash * 31 + (char.codePointAt(0) ?? 0)) % TONES.length;
  }

  return TONES[hash];
};

/**
 * Initials mark of the design language: an employer logo or a person avatar.
 * The image itself is not rendered yet because `images.remotePatterns` is still
 * open (next.config.ts TODO 2.6), so initials stand in until the host is known.
 */
export const CompanyLogo = ({
  name,
  size = 'md',
  shape = 'square',
  className = '',
}: CompanyLogoProps): ReactElement | null => {
  const label = name?.trim();

  if (!label) return null;

  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: toneOf(label) }}
      className={`grid flex-none place-items-center font-bold text-white ${SIZE_CLASSES[size]} ${SHAPE_CLASSES[shape]} ${className}`}
    >
      {initialsOf(label)}
    </span>
  );
};
