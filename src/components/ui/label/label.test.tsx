import { render, screen } from '@testing-library/react';

import { Label } from './label';

describe('Components -> Label', () => {
  it('should render the label properly', () => {
    render(<Label data-testid="label-el">Label Content</Label>);

    const label = screen.getByTestId('label-el');

    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Label Content');
  });

  it('should render with additional className', () => {
    // eslint-disable-next-line tailwindcss/no-custom-classname
    render(<Label data-testid="label-el" className="custom-class">Label Content</Label>);

    const label = screen.getByTestId('label-el');

    expect(label).toHaveClass('custom-class');
  });

  it('should link to the correct input using htmlFor', () => {
    render(
      <div>
        <Label htmlFor="test-input" data-testid="label-el">Label for Input</Label>
        <input id="test-input" data-testid="input-el" />
      </div>,
    );

    const label = screen.getByTestId('label-el');
    const input = screen.getByTestId('input-el');

    expect(label).toHaveAttribute('for', 'test-input');
    expect(input).toBeInTheDocument();
  });

  it('should render disabled styles when peer-disabled is applied', () => {
    render(
      // eslint-disable-next-line tailwindcss/no-custom-classname
      <div className="peer-disabled">
        <Label data-testid="label-el" className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Disabled Label
        </Label>
      </div>,
    );

    const label = screen.getByTestId('label-el');

    expect(label).toHaveClass('peer-disabled:cursor-not-allowed');
    expect(label).toHaveClass('peer-disabled:opacity-70');
  });
});
