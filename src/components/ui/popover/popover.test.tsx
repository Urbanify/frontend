import { fireEvent, render, screen } from '@testing-library/react';

import { Popover, PopoverContent, PopoverTrigger } from './popover';

describe('Components -> Popover', () => {
  it('should render the popover properly', () => {
    render(
      <Popover>
        <PopoverTrigger>
          <span data-testid="popover-trigger">Open Popover</span>
        </PopoverTrigger>
        <PopoverContent data-testid="popover-content">Popover content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByTestId('popover-trigger');

    expect(trigger).toBeInTheDocument();

    fireEvent.click(trigger); // Simulate opening the popover
    const popoverContent = screen.getByTestId('popover-content');

    expect(popoverContent).toBeInTheDocument();
    expect(popoverContent).toHaveTextContent('Popover content');
  });

  it('renders the popover on the correct side when clicked', () => {
    render(
      <Popover>
        <PopoverTrigger>
          <span data-testid="popover-trigger">Open Popover</span>
        </PopoverTrigger>
        <PopoverContent align="start"data-testid="popover-content">Popover content aligned to the start</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByTestId('popover-trigger');
    fireEvent.click(trigger);

    const popoverContent = screen.getByTestId('popover-content');

    expect(popoverContent).toBeInTheDocument();
    expect(popoverContent).toHaveTextContent('Popover content aligned to the start');
  });

  it('should not show popover content when closed', () => {
    render(
      <Popover>
        <PopoverTrigger>
          <span data-testid="popover-trigger">Open Popover</span>
        </PopoverTrigger>
        <PopoverContent data-testid="popover-content">Popover content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByTestId('popover-trigger');
    const popoverContent = screen.queryByTestId('popover-content');

    expect(popoverContent).not.toBeInTheDocument();

    fireEvent.click(trigger); // Open the popover

    expect(screen.getByTestId('popover-content')).toBeInTheDocument();

    fireEvent.click(trigger); // Close the popover

    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
  });

  it('should respect the alignment property', () => {
    render(
      <Popover>
        <PopoverTrigger>
          <span data-testid="popover-trigger">Open Popover</span>
        </PopoverTrigger>
        <PopoverContent align="center"data-testid="popover-content">Centered popover content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByTestId('popover-trigger');
    fireEvent.click(trigger);

    const popoverContent = screen.getByTestId('popover-content');

    expect(popoverContent).toBeInTheDocument();
    expect(popoverContent).toHaveTextContent('Centered popover content');
  });

  it('should trigger popover content with side offset', () => {
    render(
      <Popover>
        <PopoverTrigger>
          <span data-testid="popover-trigger">Open Popover</span>
        </PopoverTrigger>
        <PopoverContent sideOffset={8} data-testid="popover-content">Popover with side offset</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByTestId('popover-trigger');
    fireEvent.click(trigger);

    const popoverContent = screen.getByTestId('popover-content');

    expect(popoverContent).toBeInTheDocument();
    expect(popoverContent).toHaveTextContent('Popover with side offset');
  });

  it('should handle multiple popovers with different alignments', () => {
    render(
      <div className="flex gap-3">
        <Popover>
          <PopoverTrigger>
            <span data-testid="popover-trigger-start">Open Left Popover</span>
          </PopoverTrigger>
          <PopoverContent align="start"data-testid="popover-content-start">Left aligned popover</PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger>
            <span data-testid="popover-trigger-center">Open Center Popover</span>
          </PopoverTrigger>
          <PopoverContent align="center"data-testid="popover-content-center">Centered popover</PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger>
            <span data-testid="popover-trigger-end">Open Right Popover</span>
          </PopoverTrigger>
          <PopoverContent align="end"data-testid="popover-content-end">Right aligned popover</PopoverContent>
        </Popover>
      </div>,
    );

    const leftTrigger = screen.getByTestId('popover-trigger-start');
    const centerTrigger = screen.getByTestId('popover-trigger-center');
    const rightTrigger = screen.getByTestId('popover-trigger-end');

    fireEvent.click(leftTrigger);

    expect(screen.getByTestId('popover-content-start')).toBeInTheDocument();

    fireEvent.click(centerTrigger);

    expect(screen.getByTestId('popover-content-center')).toBeInTheDocument();

    fireEvent.click(rightTrigger);

    expect(screen.getByTestId('popover-content-end')).toBeInTheDocument();
  });
});
