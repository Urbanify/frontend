import { assignableRoles } from './role-options';

describe('assignableRoles', () => {
  it('lets the owner pick any city role, but not demote another owner', () => {
    expect(assignableRoles('OWNER', 'RESIDENT')).toEqual(['OWNER', 'MANAGER', 'FINANCIAL']);
    expect(assignableRoles('OWNER', 'OWNER')).toEqual([]);
  });

  it('lets the manager move only residents to manager and managers back to resident', () => {
    expect(assignableRoles('MANAGER', 'RESIDENT')).toEqual(['MANAGER']);
    expect(assignableRoles('MANAGER', 'MANAGER')).toEqual(['RESIDENT']);
    expect(assignableRoles('MANAGER', 'OWNER')).toEqual([]);
  });

  it('never offers admin, and never touches admin users', () => {
    expect(assignableRoles('ADMIN', 'OWNER')).not.toContain('ADMIN');
    expect(assignableRoles('OWNER', 'ADMIN')).toEqual([]);
  });

  it('never repeats the current role', () => {
    expect(assignableRoles('ADMIN', 'MANAGER')).not.toContain('MANAGER');
  });

  it('gives residents and unknown viewers no options', () => {
    expect(assignableRoles('RESIDENT', 'RESIDENT')).toEqual([]);
    expect(assignableRoles(undefined, 'RESIDENT')).toEqual([]);
  });
});
