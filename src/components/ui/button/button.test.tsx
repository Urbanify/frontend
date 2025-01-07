import { render, screen } from '@testing-library/react';

import { Button } from './button';

describe('Components -> Button', () => {
  it('should render the button properly', () => {
    render(<Button data-testid="button-el">Anything</Button>);

    const button = screen.getByTestId('button-el');

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Anything');
  });

  it('renders as a button by default', () => {
    const { container } = render(<Button>Click me</Button>);

    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('renders as a Slot when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test" data-testid="slot-child">Click me</a>
      </Button>,
    );

    const slotChild = screen.getByTestId('slot-child');

    expect(slotChild).toBeInTheDocument();
    expect(slotChild.tagName).toBe('A'); // Verify that the Slot renders an anchor tag
  });

  it('shows spinner when isLoading is true', () => {
    render(<Button isLoading>Click me</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('img', { hidden: true })).toHaveClass('size-4 animate-spin');
    expect(screen.queryByText('Click me')).not.toBeInTheDocument();
  });

  it('shows children when isLoading is false', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button')).toBeEnabled();
    expect(screen.getByText('Click me')).toBeInTheDocument();
    expect(screen.queryByRole('svg')).not.toBeInTheDocument();
  });
});
