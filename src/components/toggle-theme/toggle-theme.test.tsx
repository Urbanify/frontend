import { fireEvent, render, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button/button';

import { ToggleTheme } from './toggle-theme';

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

vi.mock('@/components/ui/sidebar/sidebar', () => ({
  SidebarMenuButton: ({ children, onClick }: any) => (
    <Button onClick={onClick}>{children}</Button>
  ),
}));

describe('ToggleTheme Component', () => {
  it('renders Sun icon and toggles to dark theme when clicked', () => {
    (useTheme as any).mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<ToggleTheme />);

    expect(screen.getByRole('button')).toHaveTextContent('Toggle theme');
    expect(screen.getByRole('button')).toContainElement(screen.getByTestId('sun-icon'));

    fireEvent.click(screen.getByRole('button'));

    expect(useTheme().setTheme).toHaveBeenCalledWith('dark');
  });

  it('renders Moon icon and toggles to light theme when clicked', () => {
    (useTheme as any).mockReturnValue({
      theme: 'dark',
      setTheme: vi.fn(),
    });

    render(<ToggleTheme />);

    expect(screen.getByRole('button')).toHaveTextContent('Toggle theme');
    expect(screen.getByRole('button')).toContainElement(screen.getByTestId('moon-icon'));

    fireEvent.click(screen.getByRole('button'));

    expect(useTheme().setTheme).toHaveBeenCalledWith('light');
  });
});
