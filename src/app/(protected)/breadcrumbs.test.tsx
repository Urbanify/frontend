import { render, screen } from '@testing-library/react';

import { useBreadcrumbs } from '@/contexts/breacrumbs/useBreadcrumbs';

import Breadcrumbs from './breadcrumbs';

vi.mock('@/contexts/breacrumbs/useBreadcrumbs', () => ({
  useBreadcrumbs: vi.fn(),
}));

describe('Breadcrumbs Component', () => {
  const mockBreadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Details', href: null },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    (useBreadcrumbs as any).mockReturnValue({ breadcrumbs: mockBreadcrumbs });
  });

  it('renders the correct number of breadcrumb items', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<Breadcrumbs />);
    const breadcrumbItems = screen.getAllByRole('listitem');

    expect(breadcrumbItems).toHaveLength(mockBreadcrumbs.length);
  });

  it('renders BreadcrumbLink for items with href', () => {
    render(<Breadcrumbs />);
    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(3); // Only the first two items have href
    expect(links[0]).toHaveAttribute('href', '/');
    expect(links[1]).toHaveAttribute('href', '/products');
    expect(links[2]).not.toHaveAttribute('href');
  });

  it('renders BreadcrumbPage for items without href', () => {
    render(<Breadcrumbs />);

    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('applies the correct class for hidden breadcrumb items', () => {
    render(<Breadcrumbs />);
    const hiddenItems = screen.getAllByRole('listitem').filter(item =>
      item.classList.contains('hidden'),
    );

    expect(hiddenItems).toHaveLength(mockBreadcrumbs.length - 1); // All except the first
  });
});
