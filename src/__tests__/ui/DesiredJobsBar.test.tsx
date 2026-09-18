import { screen } from '@testing-library/react';
import { DesiredJobsBar } from '@/entities/desired-job/ui/DesiredJobsBar';
import { renderWithProviders } from '@/shared/test-utils/renderWithProviders';

const jobs = [
  { id: 'j1', jobId: 'job-1', title: 'Frontend Developer' },
  { id: 'j2', jobId: 'job-2', title: 'React Engineer' },
];

describe('DesiredJobsBar', () => {
  it('renders every desired job and highlights the active one', () => {
    renderWithProviders(<DesiredJobsBar jobs={jobs} activeJobId="job-2" onSelectJob={jest.fn()} />);

    expect(screen.getByRole('navigation', { name: 'Desired jobs' })).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Frontend Developer' }).getAttribute('aria-current')
    ).toBeNull();
    expect(
      screen.getByRole('button', { name: 'React Engineer' }).getAttribute('aria-current')
    ).toBe('true');
  });

  it('reports the selected job', () => {
    const onSelectJob = jest.fn();
    renderWithProviders(
      <DesiredJobsBar jobs={jobs} activeJobId="job-1" onSelectJob={onSelectJob} />
    );

    screen.getByRole('button', { name: 'React Engineer' }).click();

    expect(onSelectJob).toHaveBeenCalledWith('job-2');
  });

  it('renders nothing without desired jobs', () => {
    const { container } = renderWithProviders(
      <DesiredJobsBar jobs={[]} activeJobId={null} onSelectJob={jest.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });
});
