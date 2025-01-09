import { render } from '@testing-library/react';
import React from 'react';

import { useBreadcrumbs } from '@/contexts/breacrumbs/useBreadcrumbs';

import type { BreadcrumbConfig } from './breadcrumb-setter';
import BreadcrumbSetter from './breadcrumb-setter';

// Mock the useBreadcrumbs hook
vi.mock('@/contexts/breacrumbs/useBreadcrumbs', () => ({
  useBreadcrumbs: vi.fn(),
}));

describe('BreadcrumbSetter', () => {
  it('should call setBreadcrumbs with the provided breadcrumbs', () => {
    const setBreadcrumbsMock = vi.fn();
    (useBreadcrumbs as any).mockReturnValue({
      setBreadcrumbs: setBreadcrumbsMock,
    });

    const breadcrumbs: BreadcrumbConfig[] = [
      { label: 'Home', href: '/' },
      { label: 'Dashboard', href: '/dashboard' },
    ];

    render(<BreadcrumbSetter breadcrumbs={breadcrumbs} />);

    // Check if setBreadcrumbs was called with the correct breadcrumbs
    expect(setBreadcrumbsMock).toHaveBeenCalledWith(breadcrumbs);
  });

  it('should not render anything to the DOM', () => {
    (useBreadcrumbs as any).mockReturnValue({
      setBreadcrumbs: vi.fn(),
    });

    const breadcrumbs: BreadcrumbConfig[] = [
      { label: 'Home', href: '/' },
      { label: 'Dashboard', href: '/dashboard' },
    ];

    const { container } = render(<BreadcrumbSetter breadcrumbs={breadcrumbs} />);

    // Ensure the container is empty
    expect(container).toBeEmptyDOMElement();
  });

  it('should update breadcrumbs when props change', () => {
    const setBreadcrumbsMock = vi.fn();
    (useBreadcrumbs as any).mockReturnValue({
      setBreadcrumbs: setBreadcrumbsMock,
    });

    const initialBreadcrumbs: BreadcrumbConfig[] = [
      { label: 'Home', href: '/' },
    ];
    const updatedBreadcrumbs: BreadcrumbConfig[] = [
      { label: 'Home', href: '/' },
      { label: 'Settings', href: '/settings' },
    ];

    const { rerender } = render(
      <BreadcrumbSetter breadcrumbs={initialBreadcrumbs} />,
    );

    // Check if setBreadcrumbs was called with the initial breadcrumbs
    expect(setBreadcrumbsMock).toHaveBeenCalledWith(initialBreadcrumbs);

    rerender(<BreadcrumbSetter breadcrumbs={updatedBreadcrumbs} />);

    // Check if setBreadcrumbs was called with the updated breadcrumbs
    expect(setBreadcrumbsMock).toHaveBeenCalledWith(updatedBreadcrumbs);
  });
});
