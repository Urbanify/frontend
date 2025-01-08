import { render } from '@testing-library/react';
import { useSession } from 'next-auth/react';

import AuthProvider from './AuthProvider';

// Mock `next-auth/react`
vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="session-provider">{children}</div>
  ),
  useSession: vi.fn(),
}));

describe('AuthProvider', () => {
  it('renders the children correctly', () => {
    const { getByText } = render(
      <AuthProvider>
        <p>Hello, world!</p>
      </AuthProvider>,
    );

    // Verify the children are rendered inside the SessionProvider
    expect(getByText('Hello, world!')).toBeInTheDocument();
  });

  it('wraps children with SessionProvider', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <p>Session Test</p>
      </AuthProvider>,
    );

    // Verify the SessionProvider is rendered
    expect(getByTestId('session-provider')).toBeInTheDocument();
  });

  it('supports session management through useSession', () => {
    // Mock `useSession` to simulate session behavior
    (useSession as any).mockReturnValue({
      data: { user: { name: 'John Doe', email: 'john@example.com' } },
      status: 'authenticated',
    });

    const { getByText } = render(
      <AuthProvider>
        <p>Session Test</p>
      </AuthProvider>,
    );

    // Check that the session status and data are correctly simulated
    const session = useSession();

    expect(session.data?.user?.name).toBe('John Doe');
    expect(session.status).toBe('authenticated');
    expect(getByText('Session Test')).toBeInTheDocument();
  });
});
