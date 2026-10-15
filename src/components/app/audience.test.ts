import { getAudience } from './audience';

describe('getAudience', () => {
  it.each(['MANAGER', 'OWNER', 'ADMIN', 'FINANCIAL'])('treats %s as staff', (role) => {
    expect(getAudience(role)).toBe('staff');
  });

  it('treats residents, unknown roles and no session as citizens', () => {
    expect(getAudience('RESIDENT')).toBe('citizen');
    expect(getAudience('SOMETHING_NEW')).toBe('citizen');
    expect(getAudience(undefined)).toBe('citizen');
  });
});
