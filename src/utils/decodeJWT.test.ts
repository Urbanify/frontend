import { parseJwt } from './decodeJWT';

describe('parseJwt', () => {
  const validToken = (() => {
    const payload = JSON.stringify({ exp: 1712304000, iat: 1712200000, user: { role: 'admin' } });
    // eslint-disable-next-line node/prefer-global/buffer
    const base64Payload = Buffer.from(payload).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    return `header.${base64Payload}.signature`;
  })();

  const invalidBase64Token = 'header.invalidPayload.signature';
  const malformedToken = 'malformedToken';

  it('should parse a valid JWT token', () => {
    const result = parseJwt(validToken);

    expect(result).toEqual({
      exp: 1712304000,
      iat: 1712200000,
      user: { role: 'admin' },
    });
  });

  it('should return null for undefined token', () => {
    const result = parseJwt(undefined);

    expect(result).toBeNull();
  });

  it('should return null for null token', () => {
    const result = parseJwt(null as unknown as string);

    expect(result).toBeNull();
  });

  it('should throw an error for invalid base64 payload', () => {
    expect(() => parseJwt(invalidBase64Token)).toThrow();
  });

  it('should throw an error for malformed token', () => {
    expect(() => parseJwt(malformedToken)).toThrow();
  });

  it('should decode and parse tokens with user roles', () => {
    const tokenWithRole = (() => {
      const payload = JSON.stringify({ exp: 1712304000, iat: 1712200000, user: { role: 'user' } });
      // eslint-disable-next-line node/prefer-global/buffer
      const base64Payload = Buffer.from(payload).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
      return `header.${base64Payload}.signature`;
    })();

    const result = parseJwt(tokenWithRole);

    expect(result).toEqual({
      exp: 1712304000,
      iat: 1712200000,
      user: { role: 'user' },
    });
  });
});
