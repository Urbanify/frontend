import { fetcher } from '@/services/api';

import { loadCities } from './loadCities';

import type { City } from '@/types/City';

vi.mock('@/services/api', () => ({
  fetcher: vi.fn(),
}));

describe('loadCities', () => {
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const mockCities: City[] = [
    {
      id: '1',
      name: 'City 1',
      latitude: '-12312',
      longitude: '-12312',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      featureFlags: [],
    },
    {
      id: '2',
      name: 'City 2',
      latitude: '-12312',
      longitude: '-12312',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      featureFlags: [],
    },
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return an array of cities when the API call is successful', async () => {
    (fetcher as any).mockResolvedValue({
      ok: true,
      json: async () => mockCities,
    });

    const result = await loadCities();

    expect(fetcher).toHaveBeenCalledWith('/cities', {
      method: 'GET',
      next: {
        tags: [
          'list-cities',
        ],
      },
    });
    expect(result).toEqual(mockCities);
  });

  it('should return an empty array if the API call is successful but returns no data', async () => {
    (fetcher as any).mockResolvedValue({
      ok: true,
      json: async () => null,
    });

    const result = await loadCities();

    expect(fetcher).toHaveBeenCalledWith('/cities', {
      method: 'GET',
      next: {
        tags: [
          'list-cities',
        ],
      },
    });
    expect(result).toEqual([]);
  });

  it('should return an empty array if the API call fails', async () => {
    (fetcher as any).mockResolvedValue({
      ok: false,
    });

    const result = await loadCities();

    expect(fetcher).toHaveBeenCalledWith('/cities', {
      method: 'GET',
      next: {
        tags: [
          'list-cities',
        ],
      },
    });
    expect(result).toEqual([]);
  });
});
