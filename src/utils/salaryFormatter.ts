/**
 * Format salary range
 */
export const formatSalary = (min?: number, max?: number): string => {
  if (!min && !max) return 'Not specified';
  if (min && !max) return `$${min}K+`;
  if (!min && max) return `Up to $${max}K`;
  return `$${min}K - $${max}K`;
};
