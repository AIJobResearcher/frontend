import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner, ErrorFallback } from '@/components/common';

describe('Spinner Component', () => {
  it('should render spinner with default size', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('svg');
    expect(spinner).toBeDefined();
  });

  it('should render spinner with label', () => {
    render(<Spinner label="Loading..." />);
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('should render different sizes', () => {
    const { container: smContainer } = render(<Spinner size="sm" />);
    expect(smContainer.querySelector('.w-6')).toBeDefined();

    const { container: lgContainer } = render(<Spinner size="lg" />);
    expect(lgContainer.querySelector('.w-16')).toBeDefined();
  });
});

describe('ErrorFallback Component', () => {
  it('should render error message', () => {
    render(<ErrorFallback message="Test error" onRetry={() => {}} />);
    expect(screen.getByText('Test error')).toBeDefined();
  });

  it('should render retry button', () => {
    render(<ErrorFallback message="Test error" onRetry={() => {}} />);
    const button = screen.getByText('Try Again');
    expect(button).toBeDefined();
  });

  it('should call onRetry when button is clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorFallback message="Test error" onRetry={onRetry} />);
    const button = screen.getByText('Try Again');
    button.click();
    expect(onRetry).toHaveBeenCalled();
  });
});
