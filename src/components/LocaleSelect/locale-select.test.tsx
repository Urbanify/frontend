import { render, screen } from '@testing-library/react';

import LocaleSwitcher from './index';

vitest.mock('next-intl', () => ({
  useLocale: vitest.fn().mockReturnValue('en'),
  useTranslations: vitest.fn().mockReturnValue((key: string) => key),
}));

vitest.mock('@/utils/AppConfig', () => ({
  AppConfig: {
    locales: ['en', 'es'],
  },
}));

vitest.mock('next/headers', () => ({
  cookies: vitest.fn(async () => ({
    get: vitest.fn().mockReturnValue({ value: 'en' }),
    set: vitest.fn(),
  })),
}));

describe('Components -> LocaleSwitcher', () => {
  it('should render the LocaleSwitcher properly', () => {
    render(<LocaleSwitcher />);

    const selectTrigger = screen.getByText('label');

    expect(selectTrigger).toBeInTheDocument();
  });

  it('should display the correct label', () => {
    render(<LocaleSwitcher />);

    const label = screen.getByText('label');

    expect(label).toBeInTheDocument();
  });
});
