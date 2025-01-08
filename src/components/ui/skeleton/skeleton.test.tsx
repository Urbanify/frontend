import { render, screen } from '@testing-library/react';
import React from 'react';

import { Skeleton } from './skeleton';

describe('Components -> Skeleton', () => {
  it('renders without crashing', () => {
    render(<Skeleton data-testid="skeleton-el" />);
    const skeleton = screen.getByTestId('skeleton-el');

    expect(skeleton).toBeInTheDocument();
  });

  it('applies the default classes', () => {
    render(<Skeleton data-testid="skeleton-el" />);
    const skeleton = screen.getByTestId('skeleton-el');

    expect(skeleton).toHaveClass('animate-pulse rounded-md bg-muted');
  });

  it('applies additional className', () => {
    // eslint-disable-next-line tailwindcss/no-custom-classname
    render(<Skeleton data-testid="skeleton-el"className="custom-class" />);
    const skeleton = screen.getByTestId('skeleton-el');

    expect(skeleton).toHaveClass('custom-class');
  });

  it('applies inline styles correctly', () => {
    render(<Skeleton data-testid="skeleton-el" style={{ width: '100px', height: '20px' }} />);
    const skeleton = screen.getByTestId('skeleton-el');

    expect(skeleton).toHaveStyle({ width: '100px', height: '20px' });
  });

  it('renders with custom props', () => {
    render(<Skeleton data-testid="custom-skeleton" />);
    const skeleton = screen.getByTestId('custom-skeleton');

    expect(skeleton).toBeInTheDocument();
  });
});
