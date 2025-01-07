import { render, screen } from '@testing-library/react';
import React from 'react';

import { Input } from './input';

describe('Components -> Input', () => {
  it('should render the input properly', () => {
    render(<Input data-testid="input-el" />);

    const input = screen.getByTestId('input-el');

    expect(input).toBeInTheDocument();
  });

  it('should apply the given className', () => {
    // eslint-disable-next-line tailwindcss/no-custom-classname
    render(<Input data-testid="input-el" className="custom-class" />);

    const input = screen.getByTestId('input-el');

    expect(input).toHaveClass('custom-class');
  });

  it('should render with the correct type', () => {
    render(<Input data-testid="input-el" type="password" />);

    const input = screen.getByTestId('input-el');

    expect(input).toHaveAttribute('type', 'password');
  });

  it('should apply additional props to the input element', () => {
    render(<Input data-testid="input-el" placeholder="Enter text" />);

    const input = screen.getByTestId('input-el');

    expect(input).toHaveAttribute('placeholder', 'Enter text');
  });
});
