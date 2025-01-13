import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { Textarea } from './textarea';

describe('Components -> Textarea', () => {
  it('should render the textarea properly', () => {
    render(<Textarea data-testid="textarea-el" />);

    const textarea = screen.getByTestId('textarea-el');

    expect(textarea).toBeInTheDocument();
  });

  it('should apply the given className', () => {
    // eslint-disable-next-line tailwindcss/no-custom-classname
    render(<Textarea data-testid="textarea-el" className="custom-class" />);

    const textarea = screen.getByTestId('textarea-el');

    expect(textarea).toHaveClass('custom-class');
  });

  it('should apply additional props to the textarea element', () => {
    render(<Textarea data-testid="textarea-el" placeholder="Enter text here" />);

    const textarea = screen.getByTestId('textarea-el');

    expect(textarea).toHaveAttribute('placeholder', 'Enter text here');
  });

  it('should handle value changes', () => {
    const handleChange = vi.fn();
    render(<Textarea data-testid="textarea-el" onChange={handleChange} />);

    const textarea = screen.getByTestId('textarea-el');
    fireEvent.change(textarea, { target: { value: 'New text' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(textarea).toHaveValue('New text');
  });

  it('should render as disabled when the disabled prop is provided', () => {
    render(<Textarea data-testid="textarea-el" disabled />);

    const textarea = screen.getByTestId('textarea-el');

    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
  });

  it('should render with the correct default styles', () => {
    render(<Textarea data-testid="textarea-el" />);

    const textarea = screen.getByTestId('textarea-el');

    expect(textarea).toHaveClass(
      'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    );
  });
});
