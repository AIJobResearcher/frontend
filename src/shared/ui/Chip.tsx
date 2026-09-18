import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';

type ChipVariant = 'solid' | 'outline';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ChipVariant;
  isActive?: boolean;
  children: ReactNode;
}

const BASE_CLASSES =
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13.5px] font-semibold transition';

const SOLID_CLASSES = {
  active: 'border-brand bg-brand text-white hover:bg-brand-hover',
  idle: 'border-line-strong bg-surface text-ink hover:bg-canvas-hover',
} as const;

const OUTLINE_CLASSES = {
  active: 'border-brand bg-brand-soft text-brand',
  idle: 'border-line-strong bg-surface text-ink-muted hover:bg-canvas-hover',
} as const;

/** Filter or context pill; the active one is always distinguishable by more than colour. */
export const Chip = ({
  variant = 'solid',
  isActive = false,
  type = 'button',
  className = '',
  children,
  ...rest
}: ChipProps): ReactElement => {
  const state = isActive ? 'active' : 'idle';
  const variantClasses = variant === 'outline' ? OUTLINE_CLASSES[state] : SOLID_CLASSES[state];

  return (
    <button type={type} className={`${BASE_CLASSES} ${variantClasses} ${className}`} {...rest}>
      {children}
    </button>
  );
};
