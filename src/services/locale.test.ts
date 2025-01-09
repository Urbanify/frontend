import { cookies } from 'next/headers';

import { AppConfig, type Locale } from '@/utils/AppConfig';

import { getUserLocale, setUserLocale } from './locale';

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

describe('Locale Functions', () => {
  const mockCookies = {
    get: vi.fn(),
    set: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
    (cookies as any).mockReturnValue(mockCookies);
  });

  describe('getUserLocale', () => {
    it('should return the locale from the cookie if it exists', async () => {
      const mockLocale = 'fr';
      mockCookies.get.mockReturnValueOnce({ value: mockLocale });

      const locale = await getUserLocale();

      expect(cookies).toHaveBeenCalledTimes(1);
      expect(mockCookies.get).toHaveBeenCalledWith('NEXT_LOCALE');
      expect(locale).toBe(mockLocale);
    });

    it('should return the default locale if no cookie is set', async () => {
      mockCookies.get.mockReturnValueOnce(undefined);

      const locale = await getUserLocale();

      expect(cookies).toHaveBeenCalledTimes(1);
      expect(mockCookies.get).toHaveBeenCalledWith('NEXT_LOCALE');
      expect(locale).toBe(AppConfig.defaultLocale);
    });
  });

  describe('setUserLocale', () => {
    it('should set the locale cookie with the provided value', async () => {
      const newLocale: Locale = 'es';

      await setUserLocale(newLocale);

      expect(cookies).toHaveBeenCalledTimes(1);
      expect(mockCookies.set).toHaveBeenCalledWith('NEXT_LOCALE', newLocale);
    });

    it('should handle calls even if the cookies API changes', async () => {
      const newLocale: Locale = 'es';

      await setUserLocale(newLocale);

      expect(cookies).toHaveBeenCalledTimes(1);
      expect(mockCookies.set).toHaveBeenCalledWith('NEXT_LOCALE', newLocale);
    });
  });
});
