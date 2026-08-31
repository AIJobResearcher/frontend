import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from '@/components/layout';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Header Component', () => {
  it('should render header with title', () => {
    render(<Header />, { wrapper: createWrapper() });
    expect(screen.getByText('🤖 AIJobResearcher')).toBeDefined();
  });

  it('should render navigation menu', () => {
    render(<Header />, { wrapper: createWrapper() });
    expect(screen.getByText('Jobs')).toBeDefined();
    expect(screen.getByText('Applications')).toBeDefined();
    expect(screen.getByText('Learning')).toBeDefined();
    expect(screen.getByText('Profile')).toBeDefined();
  });

  it('should have correct styles', () => {
    const { container } = render(<Header />, { wrapper: createWrapper() });
    const header = container.querySelector('header');
    expect(header?.className).toContain('bg-white');
    expect(header?.className).toContain('border-b');
  });
});
