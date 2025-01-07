import { render, screen } from '@testing-library/react';

import { Badge } from './badge';

describe('Components -> Badge', () => {
  it('should render the badge properly', () => {
    render(<Badge data-testid="badge-el">Badge Content</Badge>);

    const badge = screen.getByTestId('badge-el');

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Badge Content');
  });

  it('applies the correct default variant class', () => {
    const { container } = render(<Badge>Default Badge</Badge>);

    expect(container.firstChild).toHaveClass('bg-primary text-primary-foreground');
  });

  it('applies the correct class for a specific variant', () => {
    render(<Badge variant="success" data-testid="badge-el">Success Badge</Badge>);

    const badge = screen.getByTestId('badge-el');

    expect(badge).toHaveClass('bg-green-100 text-green-800');
  });

  it('should accept additional class names', () => {
    render(
      // eslint-disable-next-line tailwindcss/no-custom-classname
      <Badge variant="info" className="custom-class" data-testid="badge-el">
        Info Badge
      </Badge>,
    );

    const badge = screen.getByTestId('badge-el');

    expect(badge).toHaveClass('custom-class');
    expect(badge).toHaveClass('bg-blue-100 text-blue-800');
  });
});
