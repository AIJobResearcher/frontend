/**
 * Salary label from the contract values; the OpenAPI descriptions document the
 * amounts in USD, so no currency is carried in the payload.
 */
export const formatSalaryRange = (
  min: number | null | undefined,
  max: number | null | undefined
): string | null => {
  const hasMin = min !== null && min !== undefined;
  const hasMax = max !== null && max !== undefined;

  if (!hasMin && !hasMax) return null;
  if (hasMin && hasMax) return `$${min} - $${max}`;
  if (hasMin) return `$${min}+`;

  return `Up to $${max}`;
};
