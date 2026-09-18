import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'outline' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-brand text-white hover:bg-brand-hover',
  outline: 'border-brand bg-transparent text-brand hover:bg-brand-soft',
  ghost: 'border-line-strong bg-transparent text-ink-muted hover:bg-canvas-hover',
};

/** Pill action button of the design language (ui 2.7). */
export const Button = ({
  variant = 'primary',
  type = 'button',
  className = '',
  children,
  ...rest
}: ButtonProps): ReactElement => (
  <button
    type={type}
    className={`inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] px-5 py-2 text-[15px] leading-tight font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASSES[variant]} ${className}`}
    {...rest}
  >
    {children}
  </button>
);
