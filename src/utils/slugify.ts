export const slugify = (...args: (string | number)[]): string => {
  const value = args.join(' ');

  // check if the value is already in slug format
  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    return value;
  }

  return value
    .normalize('NFD') // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036F]/g, '') // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, '-'); // separator
};

export const unslugify = (value: string) => {
  return value.replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};
