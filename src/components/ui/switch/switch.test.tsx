import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { Switch } from './switch';

describe('Components -> Switch', () => {
  it('renders correctly', () => {
    render(<Switch />);
    const switchElement = screen.getByRole('switch');

    expect(switchElement).toBeInTheDocument();
  });

  it('renders with the correct class names', () => {
    // eslint-disable-next-line tailwindcss/no-custom-classname
    render(<Switch className="custom-class" />);
    const switchElement = screen.getByRole('switch');

    expect(switchElement).toHaveClass('custom-class');
  });

  it('is toggleable by default', async () => {
    render(<Switch />);
    const switchElement = screen.getByRole('switch');

    // Verify initial state (unchecked)
    expect(switchElement).not.toHaveAttribute('data-state', 'checked');

    // Toggle to checked
    fireEvent.click(switchElement);

    expect(switchElement).toHaveAttribute('data-state', 'checked');

    // Toggle back to unchecked
    fireEvent.click(switchElement);

    expect(switchElement).not.toHaveAttribute('data-state', 'checked');
  });

  it('is controlled when using `checked` and `onCheckedChange` props', async () => {
    const handleCheckedChange = vi.fn();
    render(<Switch checked onCheckedChange={handleCheckedChange} />);
    const switchElement = screen.getByRole('switch');

    // Verify controlled checked state
    expect(switchElement).toHaveAttribute('data-state', 'checked');

    // Try to toggle the switch (it should not change state because it's controlled)
    fireEvent.click(switchElement);

    expect(handleCheckedChange).toHaveBeenCalledTimes(1);
    expect(switchElement).toHaveAttribute('data-state', 'checked');
  });

  it('is disabled when the `disabled` prop is set', async () => {
    render(<Switch disabled />);
    const switchElement = screen.getByRole('switch');

    // Verify disabled attribute
    expect(switchElement).toBeDisabled();
    expect(switchElement).toHaveClass('disabled:cursor-not-allowed');

    // Try to toggle (should not toggle)
    fireEvent.click(switchElement);

    expect(switchElement).not.toHaveAttribute('data-state', 'checked');
  });

  it('supports defaultChecked', () => {
    render(<Switch defaultChecked />);
    const switchElement = screen.getByRole('switch');

    // Verify initial state (checked)
    expect(switchElement).toHaveAttribute('data-state', 'checked');
  });
});
