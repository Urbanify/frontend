import { render, screen } from '@testing-library/react';

import {
  Command,
} from './command';

describe('Components -> Command', () => {
  it('should render the Command properly', () => {
    render(<Command data-testid="command">Command Content</Command>);

    const command = screen.getByTestId('command');

    expect(command).toBeInTheDocument();
    expect(command).toHaveClass('flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground');
  });

  it('should render children inside the Command', () => {
    render(
      <Command>
        <p data-testid="child">This is a child</p>
      </Command>,
    );

    const child = screen.getByTestId('child');

    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent('This is a child');
  });

  it('should accept custom className', () => {
    // eslint-disable-next-line tailwindcss/no-custom-classname
    render(<Command data-testid="command" className="custom-class">Command Content</Command>);

    const command = screen.getByTestId('command');

    expect(command).toHaveClass('custom-class');
  });
});
