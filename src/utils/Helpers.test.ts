import { getBaseUrl } from './Helpers';

describe('Helpers', () => {
  describe('getBaseUrl function', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      vi.resetModules();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should return NEXT_PUBLIC_APP_URL if defined', () => {
      process.env.NEXT_PUBLIC_APP_URL = 'https://custom-app-url.com';

      expect(getBaseUrl()).toBe('https://custom-app-url.com');
    });

    it('should return production URL for production environment', () => {
      process.env.VERCEL_ENV = 'production';
      process.env.VERCEL_PROJECT_PRODUCTION_URL = 'production-url.vercel.app';

      expect(getBaseUrl()).toBe('https://production-url.vercel.app');
    });

    it('should return VERCEL_URL if defined in other environments', () => {
      process.env.VERCEL_URL = 'staging-url.vercel.app';

      expect(getBaseUrl()).toBe('https://staging-url.vercel.app');
    });

    it('should fall back to localhost if no environment variables are defined', () => {
      delete process.env.NEXT_PUBLIC_APP_URL;
      delete process.env.VERCEL_ENV;
      delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
      delete process.env.VERCEL_URL;

      expect(getBaseUrl()).toBe('http://localhost:3000');
    });
  });
});
