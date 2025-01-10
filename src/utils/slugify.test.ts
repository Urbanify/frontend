import { slugify, unslugify } from './slugify';

describe('slugify', () => {
  it('should convert a string to slug format', () => {
    expect(slugify('Hello World')).toBe('hello-world');
    expect(slugify('Hello   World')).toBe('hello-world');
    expect(slugify('Hello, World!')).toBe('hello-world');
    expect(slugify('Olá Mundo')).toBe('ola-mundo');
    expect(slugify('123 Hello')).toBe('123-hello');
  });

  it('should return the same string if it is already in slug format', () => {
    expect(slugify('hello-world')).toBe('hello-world');
    expect(slugify('123-hello')).toBe('123-hello');
  });

  it('should handle numbers and strings', () => {
    expect(slugify('Hello', 123)).toBe('hello-123');
    expect(slugify(123, 'Hello')).toBe('123-hello');
  });
});

describe('unslugify', () => {
  it('should convert a slug to a normal string', () => {
    expect(unslugify('hello-world')).toBe('Hello World');
    expect(unslugify('123-hello')).toBe('123 Hello');
  });
});
