/**
 * Format salary range for display
 */
export const formatSalary = (
  minSalary: number | null | undefined,
  maxSalary: number | null | undefined,
  currency: string = 'USD'
): string => {
  if (!minSalary && !maxSalary) {
    return 'Salary not specified';
  }

  const currencySymbol = currency === 'USD' ? '$' : '€';

  if (minSalary && maxSalary) {
    return `${currencySymbol}${minSalary.toLocaleString()} - ${currencySymbol}${maxSalary.toLocaleString()}/mo`;
  }

  if (minSalary) {
    return `from ${currencySymbol}${minSalary.toLocaleString()}/mo`;
  }

  return `up to ${currencySymbol}${maxSalary!.toLocaleString()}/mo`;
};
