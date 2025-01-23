export const formatQueryParams = (filters?: Record<string, any>): string => {
  if (!filters) {
    return '';
  }

  const queryParams = Object.entries(filters)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return queryParams ? `?${queryParams}` : '';
};
