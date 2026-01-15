import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';

import CityStatusBadge from './city-status-badge';

// Mock `useTranslations` from `next-intl`
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

describe('CityStatusBadge', () => {
  const mockTranslations: { [key: string]: string } = {
    active: 'Active',
    inactive: 'inactive',
  };

  beforeEach(() => {
    // Mock implementation of `useTranslations`
    (useTranslations as any).mockImplementation(() => (key: string) => mockTranslations[key]);
  });

  it('renders correctly for ACTIVE status', () => {
    render(<CityStatusBadge status="ACTIVE" />);

    const badge = screen.getByText(String(mockTranslations.active));

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-accent text-accent-foreground');
  });

  it('renders correctly for Disabled status', () => {
    render(<CityStatusBadge status="DISABLED" />);

    const badge = screen.getByText(String(mockTranslations.inactive));

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-muted text-muted-foreground');
  });

  it('throws an error for unsupported status', () => {
    // Mock a console error to suppress React warnings in test output
    const originalConsoleError = console.error;
    console.error = vi.fn();

    expect(() => render(<CityStatusBadge status={'UNKNOWN' as any} />)).toThrow();

    console.error = originalConsoleError;
  });
});
