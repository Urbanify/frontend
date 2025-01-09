'use strict';

import { redirect } from 'next/navigation';

import { redirectTo } from './redirectTo';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('redirectTo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it('deve chamar a função redirect com o caminho correto', async () => {
    const path = '/test-path';

    await redirectTo(path);

    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith(path);
  });

  it('não deve chamar o redirect com um caminho vazio', async () => {
    const path = '';

    await redirectTo(path);

    expect(redirect).toHaveBeenCalledTimes(0);
  });

  it('deve lidar com valores nulos ou indefinidos', async () => {
    await redirectTo(null as unknown as string);
    await redirectTo(undefined as unknown as string);

    expect(redirect).toHaveBeenCalledTimes(0);
  });
});
