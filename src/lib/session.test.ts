import { isTokenValid } from './session';

const makeToken = (payload: object) => {
  // eslint-disable-next-line node/prefer-global/buffer
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `header.${body}.signature`;
};

describe('isTokenValid', () => {
  it('accepts a token whose exp is in the future', () => {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60;

    expect(isTokenValid(makeToken({ exp }))).toBe(true);
  });

  it('rejects a token whose exp is in the past', () => {
    const exp = Math.floor(Date.now() / 1000) - 1;

    expect(isTokenValid(makeToken({ exp }))).toBe(false);
  });

  it('rejects a token without an exp claim', () => {
    expect(isTokenValid(makeToken({ user: { id: '1' } }))).toBe(false);
  });

  it('rejects missing or malformed tokens', () => {
    expect(isTokenValid(undefined)).toBe(false);
    expect(isTokenValid('')).toBe(false);
    expect(isTokenValid('not-a-jwt')).toBe(false);
  });
});
