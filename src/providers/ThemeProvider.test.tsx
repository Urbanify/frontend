import { render } from '@testing-library/react';
import { useTheme } from 'next-themes';

import { ThemeProvider } from './ThemeProvider';

// Mock `next-themes` to verify behavior
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>,
}));

describe('ThemeProvider', () => {
  it('renders the children correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <p>Hello, world!</p>
      </ThemeProvider>,
    );

    // Verify that the children are rendered inside the ThemeProvider
    expect(getByText('Hello, world!')).toBeInTheDocument();
  });

  it('passes props to NextThemesProvider', () => {
    const { getByTestId } = render(
      <ThemeProvider attribute="class">
        <p>Testing props</p>
      </ThemeProvider>,
    );

    // Check if the ThemeProvider renders correctly with the passed props
    const themeProvider = getByTestId('theme-provider');

    expect(themeProvider).toBeInTheDocument();
  });

  it('allows theme management through next-themes', () => {
    (useTheme as any).mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    const { getByText } = render(
      <ThemeProvider>
        <p>Theme Test</p>
      </ThemeProvider>,
    );

    expect(getByText('Theme Test')).toBeInTheDocument();

    const themeHook = useTheme();

    expect(themeHook.theme).toBe('light');
  });
});
