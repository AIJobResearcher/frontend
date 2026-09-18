import type { ReactElement, ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  className?: string;
}

/** White surface of the two-pane layout (ui 2.5). */
export const Panel = ({ children, className = '' }: PanelProps): ReactElement => (
  <section className={`rounded-card bg-surface shadow-panel ${className}`}>{children}</section>
);
