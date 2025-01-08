import { render, screen } from '@testing-library/react';
import React from 'react';

import { Separator } from './separator';

describe('Components -> Separator', () => {
  it('renders without crashing', () => {
    render(<Separator data-testid="separator-el" />);
    const separator = screen.getByTestId('separator-el');

    expect(separator).toBeInTheDocument();
  });

  it('applies the default horizontal orientation', () => {
    render(<Separator data-testid="separator-el" />);
    const separator = screen.getByTestId('separator-el');

    expect(separator).toHaveClass('h-[1px] w-full');
  });

  it('renders with vertical orientation when specified', () => {
    render(<Separator data-testid="separator-el" orientation="vertical" />);
    const separator = screen.getByTestId('separator-el');

    expect(separator).toHaveClass('h-full w-[1px]');
  });

  it('applies additional className', () => {
    // eslint-disable-next-line tailwindcss/no-custom-classname
    render(<Separator data-testid="separator-el" className="custom-class" />);
    const separator = screen.getByTestId('separator-el');

    expect(separator).toHaveClass('custom-class');
  });

  it('renders with custom props', () => {
    render(<Separator data-testid="custom-separator" />);
    const separator = screen.getByTestId('custom-separator');

    expect(separator).toBeInTheDocument();
  });
});
